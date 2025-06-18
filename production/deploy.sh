#!/bin/bash

# Script de déploiement TodoApp Generator Production
# Facilite le déploiement et la gestion de l'environnement de production

set -e

# Couleurs pour les messages
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Fonctions utilitaires
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Vérifie si Docker et Docker Compose sont installés
check_dependencies() {
    log_info "Vérification des dépendances..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker n'est pas installé!"
        exit 1
    fi
    
    if ! command -v docker compose &> /dev/null; then
        log_error "Docker Compose n'est pas installé!"
        exit 1
    fi
    
    log_success "Dépendances OK"
}

# Vérifie la configuration
check_config() {
    log_info "Vérification de la configuration..."
    
    if [ ! -f "production/.env" ]; then
        log_warning "Fichier .env manquant, copie depuis .env.example"
        cp production/.env.example production/.env
        log_warning "⚠️  Veuillez modifier production/.env avec vos vraies valeurs!"
    fi
    
    log_success "Configuration OK"
}

# Déploie l'infrastructure complète
deploy_full() {
    log_info "🚀 Déploiement complet de l'infrastructure..."
    
    # Création des réseaux
    log_info "Création des réseaux..."
    cd production
    docker compose -f docker-compose.yml up -d
    sleep 5
    
    # Déploiement des bases de données
    log_info "Déploiement des bases de données..."
    docker compose -f docker-compose.databases.yml up -d
    
    log_info "Attente de l'initialisation des bases de données (45s)..."
    sleep 45
    
    # Déploiement des APIs
    log_info "Déploiement des APIs..."
    docker compose -f docker-compose.private-api.yml up -d
    docker compose -f docker-compose.public-api.yml up -d
    sleep 10
    
    # Déploiement de l'API Gateway
    log_info "Déploiement de l'API Gateway..."
    docker compose -f docker-compose.gateway.yml up -d
    sleep 10
    
    # Déploiement du frontend
    log_info "Déploiement du frontend..."
    docker compose -f docker-compose.frontend.yml up -d
    
    cd ..
    log_success "✅ Déploiement complet terminé!"
    show_endpoints
}

# Déploie uniquement le monitoring
deploy_monitoring() {
    log_info "🔍 Déploiement des services de monitoring..."
    
    cd production
    docker compose -f docker-compose.monitoring.yml up -d
    cd ..
    
    log_success "✅ Services de monitoring déployés!"
    echo ""
    echo "Accès aux services de monitoring:"
    echo "  📊 Prometheus: http://localhost:9090"
    echo "  📈 Grafana: http://localhost:3001 (admin/admin123)"
    echo "  🚨 AlertManager: http://localhost:9093"
    echo "  📋 cAdvisor: http://localhost:8080"
}

# Arrête tous les services
stop_all() {
    log_info "🛑 Arrêt de tous les services..."
    
    cd production
    docker compose -f docker-compose.frontend.yml down 2>/dev/null || true
    docker compose -f docker-compose.gateway.yml down 2>/dev/null || true
    docker compose -f docker-compose.public-api.yml down 2>/dev/null || true
    docker compose -f docker-compose.private-api.yml down 2>/dev/null || true
    docker compose -f docker-compose.databases.yml down 2>/dev/null || true
    docker compose -f docker-compose.monitoring.yml down 2>/dev/null || true
    docker compose -f docker-compose.yml down 2>/dev/null || true
    cd ..
    
    log_success "✅ Tous les services arrêtés!"
}

# Affiche les endpoints disponibles
show_endpoints() {
    echo ""
    echo "🌐 Services disponibles:"
    echo "  🖥️  Frontend: http://localhost:3000"
    echo "  🚪 API Gateway: http://localhost:5000"
    echo "  🔓 API Publique: http://localhost:5050"
    echo "  🔒 API Privée: http://localhost:5555"
    echo "  🗄️  PostgreSQL Config: localhost:5432"
    echo "  🗄️  PostgreSQL User: localhost:5433"
    echo "  🗄️  PostgreSQL Intern: localhost:5434"
}

# Affiche le statut des services
show_status() {
    echo "📊 Statut des services:"
    echo ""
    docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "(todo-|NAME)" || echo "Aucun service en cours d'exécution"
}

# Sauvegarde les bases de données
backup_databases() {
    log_info "💾 Sauvegarde des bases de données..."
    
    mkdir -p backups/production/$(date +%Y%m%d)
    
    if docker ps | grep -q "todo-postgres-config-prod"; then
        docker exec todo-postgres-config-prod pg_dump -U todouser todoapp_generator_config > backups/production/$(date +%Y%m%d)/config_backup_$(date +%H%M%S).sql
        log_success "Sauvegarde config terminée"
    fi
    
    if docker ps | grep -q "todo-postgres-user-prod"; then
        docker exec todo-postgres-user-prod pg_dump -U todouser todoapp_generator_user > backups/production/$(date +%Y%m%d)/user_backup_$(date +%H%M%S).sql
        log_success "Sauvegarde user terminée"
    fi
    
    if docker ps | grep -q "todo-postgres-intern-prod"; then
        docker exec todo-postgres-intern-prod pg_dump -U todouser todoapp_generator_intern > backups/production/$(date +%Y%m%d)/intern_backup_$(date +%H%M%S).sql
        log_success "Sauvegarde intern terminée"
    fi
    
    log_success "✅ Sauvegardes terminées dans backups/production/$(date +%Y%m%d)/"
}

# Affiche l'aide
show_help() {
    echo "📋 TodoApp Generator - Script de déploiement production"
    echo ""
    echo "Usage: $0 [COMMANDE]"
    echo ""
    echo "Commandes disponibles:"
    echo "  deploy        Déploie l'infrastructure complète"
    echo "  monitoring    Déploie uniquement les services de monitoring"
    echo "  stop          Arrête tous les services"
    echo "  status        Affiche le statut des services"
    echo "  backup        Sauvegarde les bases de données"
    echo "  endpoints     Affiche les endpoints disponibles"
    echo "  help          Affiche cette aide"
    echo ""
    echo "Exemples:"
    echo "  $0 deploy     # Déploiement complet"
    echo "  $0 monitoring # Déploie Prometheus, Grafana, etc."
    echo "  $0 status     # Vérifier l'état des services"
}

# Script principal
main() {
    echo "🐳 TodoApp Generator - Production Deployment"
    echo "==========================================="
    echo ""
    
    check_dependencies
    check_config
    
    case "${1:-help}" in
        deploy)
            deploy_full
            ;;
        monitoring)
            deploy_monitoring
            ;;
        stop)
            stop_all
            ;;
        status)
            show_status
            ;;
        backup)
            backup_databases
            ;;
        endpoints)
            show_endpoints
            ;;
        help|*)
            show_help
            ;;
    esac
}

# Gestion des signaux
trap 'log_error "Script interrompu"; exit 1' INT TERM

# Exécution du script principal
main "$@"
