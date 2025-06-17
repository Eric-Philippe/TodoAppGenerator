# Makefile pour TodoApp Generator
# Simplifie les commandes Docker Compose

.PHONY: help build up down logs clean dev-up dev-down dev-logs prod-up prod-down status

# Commandes par défaut
help: ## Affiche l'aide
	@echo "Commandes disponibles:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-15s\033[0m %s\n", $$1, $$2}'

# Environnement de développement
dev-build: ## Build les images Docker pour le développement
	docker-compose -f docker-compose.dev.yml build

dev-up: ## Démarre l'environnement de développement
	docker-compose -f docker-compose.dev.yml up -d
	@echo "🚀 Environnement de développement démarré!"
	@echo "Frontend: http://localhost:3000"
	@echo "API Gateway: http://localhost:5000"
	@echo "Public API: http://localhost:5050"
	@echo "Private API: http://localhost:5555"
	@echo "PgAdmin: http://localhost:8080"

dev-down: ## Arrête l'environnement de développement
	docker-compose -f docker-compose.dev.yml down

dev-logs: ## Affiche les logs de développement
	docker-compose -f docker-compose.dev.yml logs -f

dev-restart: ## Redémarre l'environnement de développement
	docker-compose -f docker-compose.dev.yml restart

# Environnement de production
prod-build: ## Build les images Docker pour la production
	docker-compose build

prod-up: ## Démarre l'environnement de production
	docker-compose up -d
	@echo "🚀 Environnement de production démarré!"
	@echo "Application: http://localhost:3000"
	@echo "API Gateway: http://localhost:5000"
	@echo "PgAdmin: http://localhost:8080"

prod-down: ## Arrête l'environnement de production
	docker-compose down

prod-logs: ## Affiche les logs de production
	docker-compose logs -f

prod-restart: ## Redémarre l'environnement de production
	docker-compose restart

# Commandes générales
status: ## Affiche le statut des conteneurs
	@echo "=== Conteneurs en cours d'exécution ==="
	docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

logs: ## Affiche tous les logs
	docker-compose logs -f

clean: ## Nettoie les conteneurs, images et volumes non utilisés
	docker-compose down -v
	docker-compose -f docker-compose.dev.yml down -v
	docker system prune -f
	docker volume prune -f

clean-all: ## Nettoie complètement (ATTENTION: supprime tout)
	docker-compose down -v --rmi all
	docker-compose -f docker-compose.dev.yml down -v --rmi all
	docker system prune -af
	docker volume prune -f

# Base de données
db-reset: ## Remet à zéro la base de données
	docker-compose down postgres
	docker volume rm todoappgenerator_postgres_data todoappgenerator_postgres_dev_data 2>/dev/null || true
	docker-compose up -d postgres

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
	docker-compose -f docker-compose.dev.yml restart frontend-dev

restart-api: ## Redémarre toutes les APIs
	docker-compose -f docker-compose.dev.yml restart api-gateway-dev public-api-dev private-api-dev

restart-db: ## Redémarre la base de données
	docker-compose -f docker-compose.dev.yml restart postgres

# Maintenance
update: ## Met à jour les images Docker
	docker-compose pull
	docker-compose -f docker-compose.dev.yml pull

rebuild: ## Rebuild complet
	docker-compose down
	docker-compose -f docker-compose.dev.yml down
	docker-compose build --no-cache
	docker-compose -f docker-compose.dev.yml build --no-cache
