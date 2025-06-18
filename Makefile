# Makefile pour TodoApp Generator
# Simplifie les commandes Docker Compose

.PHONY: help build up down logs clean dev-up dev-down dev-logs prod-up prod-down status

# Commandes par défaut
help: ## Affiche l'aide
	@echo "🐳 TodoApp Generator - Commandes disponibles"
	@echo "============================================="
	@echo ""
	@echo "📦 DÉVELOPPEMENT:"
	@grep -E '^dev-[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "🚀 PRODUCTION:"
	@grep -E '^prod-[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "📊 MONITORING:"
	@grep -E '^monitoring-[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "🗄️  BASE DE DONNÉES:"
	@grep -E '^[a-zA-Z_-]*db[a-zA-Z_-]*:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "🔧 MAINTENANCE:"
	@grep -E '^(clean|status|install|update|rebuild|monitor):.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'
	@echo ""
	@echo "💡 Exemples:"
	@echo "  make dev-up          # Démarrage développement complet"
	@echo "  make prod-build      # Construction des images de production"
	@echo "  make prod-up         # Démarrage production complet"
	@echo "  make monitoring-up   # Démarrage des services de monitoring"
	@echo "  make status          # Vérifier l'état des conteneurs"

# Environnement de développement
dev-build: ## Build les images Docker pour le développement
	docker compose -f docker-compose.dev.yml build

dev-up: ## Démarre l'environnement de développement
	docker compose -f docker-compose.dev.yml up -d
	@echo "🚀 Environnement de développement démarré!"
	@echo "Frontend: http://localhost:3000"
	@echo "API Gateway: http://localhost:5000"
	@echo "Public API: http://localhost:5050"
	@echo "Private API: http://localhost:5555"
	@echo "PgAdmin: http://localhost:8080"

dev-down: ## Arrête l'environnement de développement
	docker compose -f docker-compose.dev.yml down

dev-logs: ## Affiche les logs de développement
	docker compose -f docker-compose.dev.yml logs -f

dev-restart: ## Redémarre l'environnement de développement
	docker compose -f docker-compose.dev.yml restart

# Environnement de production modulaire
prod-build: ## Build les images Docker pour la production
	@echo "🔨 Construction des images de production..."
	cd production && docker compose -f docker-compose.databases.yml build
	cd production && docker compose -f docker-compose.private-api.yml build
	cd production && docker compose -f docker-compose.public-api.yml build
	cd production && docker compose -f docker-compose.gateway.yml build
	cd production && docker compose -f docker-compose.frontend.yml build
	@echo "✅ Images de production construites!"

prod-up: ## Démarre l'environnement de production complet
	@echo "🚀 Démarrage de l'environnement de production..."
	cd production && docker compose -f docker-compose.yml up -d
	cd production && docker compose -f docker-compose.databases.yml up -d
	@echo "⏳ Attente de l'initialisation des bases de données (30s)..."
	sleep 30
	cd production && docker compose -f docker-compose.private-api.yml up -d
	cd production && docker compose -f docker-compose.public-api.yml up -d
	cd production && docker compose -f docker-compose.gateway.yml up -d
	cd production && docker compose -f docker-compose.frontend.yml up -d
	@echo "✅ Environnement de production démarré!"
	@echo "Application: http://localhost:3000"
	@echo "API Gateway: http://localhost:5000"
	@echo "Public API: http://localhost:5050"
	@echo "Private API: http://localhost:5555"

prod-down: ## Arrête l'environnement de production
	@echo "🛑 Arrêt de l'environnement de production..."
	cd production && docker compose -f docker-compose.frontend.yml down
	cd production && docker compose -f docker-compose.gateway.yml down
	cd production && docker compose -f docker-compose.public-api.yml down
	cd production && docker compose -f docker-compose.private-api.yml down
	cd production && docker compose -f docker-compose.databases.yml down
	cd production && docker compose -f docker-compose.yml down
	@echo "✅ Environnement de production arrêté!"

prod-logs: ## Affiche les logs de production
	cd production && docker compose -f docker-compose.databases.yml logs -f &
	cd production && docker compose -f docker-compose.private-api.yml logs -f &
	cd production && docker compose -f docker-compose.public-api.yml logs -f &
	cd production && docker compose -f docker-compose.gateway.yml logs -f &
	cd production && docker compose -f docker-compose.frontend.yml logs -f

prod-restart: ## Redémarre l'environnement de production
	make prod-down
	make prod-up

# Commandes générales
status: ## Affiche le statut des conteneurs
	@echo "=== Conteneurs en cours d'exécution ==="
	docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
	@echo ""
	@echo "=== Réseaux Docker ==="
	docker network ls | grep todo || echo "Aucun réseau todo trouvé"
	@echo ""
	@echo "=== Volumes Docker ==="
	docker volume ls | grep todo || echo "Aucun volume todo trouvé"

logs: ## Affiche tous les logs
	docker compose logs -f

clean: ## Nettoie les conteneurs, images et volumes non utilisés
	docker compose down -v
	docker compose -f docker-compose.dev.yml down -v
	cd production && docker compose -f docker-compose.frontend.yml down -v 2>/dev/null || true
	cd production && docker compose -f docker-compose.gateway.yml down -v 2>/dev/null || true
	cd production && docker compose -f docker-compose.public-api.yml down -v 2>/dev/null || true
	cd production && docker compose -f docker-compose.private-api.yml down -v 2>/dev/null || true
	cd production && docker compose -f docker-compose.databases.yml down -v 2>/dev/null || true
	cd production && docker compose -f docker-compose.monitoring.yml down -v 2>/dev/null || true
	cd production && docker compose -f docker-compose.yml down -v 2>/dev/null || true
	docker system prune -f
	docker volume prune -f

clean-all: ## Nettoie complètement (ATTENTION: supprime tout)
	docker compose down -v --rmi all
	docker compose -f docker-compose.dev.yml down -v --rmi all
	cd production && docker compose -f docker-compose.frontend.yml down -v --rmi all 2>/dev/null || true
	cd production && docker compose -f docker-compose.gateway.yml down -v --rmi all 2>/dev/null || true
	cd production && docker compose -f docker-compose.public-api.yml down -v --rmi all 2>/dev/null || true
	cd production && docker compose -f docker-compose.private-api.yml down -v --rmi all 2>/dev/null || true
	cd production && docker compose -f docker-compose.databases.yml down -v --rmi all 2>/dev/null || true
	cd production && docker compose -f docker-compose.monitoring.yml down -v --rmi all 2>/dev/null || true
	cd production && docker compose -f docker-compose.yml down -v --rmi all 2>/dev/null || true
	docker system prune -af
	docker volume prune -f

# Services individuels en production
prod-db-up: ## Démarre uniquement les bases de données
	cd production && docker compose -f docker-compose.yml up -d
	cd production && docker compose -f docker-compose.databases.yml up -d
	@echo "✅ Bases de données de production démarrées!"

prod-db-down: ## Arrête uniquement les bases de données
	cd production && docker compose -f docker-compose.databases.yml down
	@echo "✅ Bases de données de production arrêtées!"

prod-api-up: ## Démarre uniquement les APIs
	cd production && docker compose -f docker-compose.private-api.yml up -d
	cd production && docker compose -f docker-compose.public-api.yml up -d
	cd production && docker compose -f docker-compose.gateway.yml up -d
	@echo "✅ APIs de production démarrées!"

prod-api-down: ## Arrête uniquement les APIs
	cd production && docker compose -f docker-compose.gateway.yml down
	cd production && docker compose -f docker-compose.public-api.yml down
	cd production && docker compose -f docker-compose.private-api.yml down
	@echo "✅ APIs de production arrêtées!"

prod-frontend-up: ## Démarre uniquement le frontend
	cd production && docker compose -f docker-compose.frontend.yml up -d
	@echo "✅ Frontend de production démarré!"

prod-frontend-down: ## Arrête uniquement le frontend
	cd production && docker compose -f docker-compose.frontend.yml down
	@echo "✅ Frontend de production arrêté!"

# Base de données de production
prod-db-reset: ## Remet à zéro les bases de données de production
	cd production && docker compose -f docker-compose.databases.yml down -v
	@echo "✅ Bases de données de production remises à zéro!"

prod-db-backup: ## Sauvegarde les bases de données de production
	@mkdir -p ./backups/production
	@echo "💾 Sauvegarde des bases de données de production..."
	docker exec todo-postgres-config-prod pg_dump -U todouser todoapp_generator_config > ./backups/production/config_backup_$(shell date +%Y%m%d_%H%M%S).sql
	docker exec todo-postgres-user-prod pg_dump -U todouser todoapp_generator_user > ./backups/production/user_backup_$(shell date +%Y%m%d_%H%M%S).sql
	docker exec todo-postgres-intern-prod pg_dump -U todouser todoapp_generator_intern > ./backups/production/intern_backup_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "✅ Sauvegardes créées dans ./backups/production/"

# Monitoring en production
monitoring-up: ## Démarre les services de monitoring
	cd production && docker compose -f docker-compose.monitoring.yml up -d
	@echo "✅ Services de monitoring démarrés!"
	@echo "Prometheus: http://localhost:9090"
	@echo "Grafana: http://localhost:3001 (admin/admin123)"
	@echo "AlertManager: http://localhost:9093"

monitoring-down: ## Arrête les services de monitoring
	cd production && docker compose -f docker-compose.monitoring.yml down
	@echo "✅ Services de monitoring arrêtés!"

monitoring-logs: ## Affiche les logs de monitoring
	cd production && docker compose -f docker-compose.monitoring.yml logs -f

db-backup: ## Sauvegarde la base de données
	@mkdir -p ./backups
	docker exec todo-postgres pg_dump -U todouser todoapp > ./backups/backup_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "Sauvegarde créée dans ./backups/"

db-restore: ## Restaure la base de données (usage: make db-restore FILE=backup.sql)
	@if [ -z "$(FILE)" ]; then echo "Usage: make db-restore FILE=backup.sql"; exit 1; fi
	docker exec -i todo-postgres psql -U todouser -d todoapp < $(FILE)

# Tests et monitoring
test: ## Lance les tests (à implémenter)
	@echo "Tests à implémenter..."

monitor: ## Affiche les ressources utilisées
	docker stats

# Installation et setup
install: ## Installation complète
	@echo "🔨 Installation de TodoApp Generator..."
	make dev-build
	make dev-up
	@echo "✅ Installation terminée!"
	@echo ""
	@echo "Accédez à votre application:"
	@echo "  Frontend: http://localhost:3000"
	@echo "  API Gateway: http://localhost:5000"
	@echo "  PgAdmin: http://localhost:8080 (admin@todoapp.com / admin123)"

# Commandes de développement rapides
restart-frontend: ## Redémarre uniquement le frontend
	docker compose -f docker-compose.dev.yml restart frontend-dev

restart-api: ## Redémarre toutes les APIs
	docker compose -f docker-compose.dev.yml restart api-gateway-dev public-api-dev private-api-dev

restart-db: ## Redémarre la base de données
	docker compose -f docker-compose.dev.yml restart postgres

# Maintenance
update: ## Met à jour les images Docker
	docker compose pull
	docker compose -f docker-compose.dev.yml pull

rebuild: ## Rebuild complet
	docker compose down
	docker compose -f docker-compose.dev.yml down
	docker compose build --no-cache
	docker compose -f docker-compose.dev.yml build --no-cache
