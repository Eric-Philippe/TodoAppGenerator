# 🐳 TodoApp Generator - Configuration Docker

Cette configuration Docker vous permet de déployer l'ensemble de l'application TodoApp Generator avec tous ses services.

## 🏗️ Architecture

L'application est composée de :

- **Frontend** : React + Vite + Nginx (port 3000)
- **API Gateway** : Node.js + Express (port 5000)
- **Public API** : Node.js + Express (port 5050)
- **Private API** : Node.js + Express (port 5555)
- **PostgreSQL** : Base de données (port 5432)
- **PgAdmin** : Interface d'administration DB (port 8080)

## 🚀 Démarrage rapide

### Installation complète

```bash
make install
```

### Développement

```bash
# Démarrer l'environnement de développement
make dev-up

# Voir les logs
make dev-logs

# Arrêter
make dev-down
```

### Production

```bash
# Démarrer l'environnement de production
make prod-up

# Voir les logs
make prod-logs

# Arrêter
make prod-down
```

## 🛠️ Commandes utiles

```bash
# Afficher l'aide
make help

# Voir le statut des conteneurs
make status

# Redémarrer un service spécifique
make restart-frontend
make restart-api
make restart-db

# Nettoyer
make clean

# Sauvegarde de la base de données
make db-backup

# Restaurer la base de données
make db-restore FILE=backup.sql
```

## 🔗 URLs d'accès

### Développement

- **Frontend** : http://localhost:3000
- **API Gateway** : http://localhost:5000
- **Public API** : http://localhost:5050
- **Private API** : http://localhost:5555
- **PgAdmin** : http://localhost:8080

### Production

- **Application** : http://localhost:3000
- **API** : http://localhost:5000
- **PgAdmin** : http://localhost:8080

## 🗄️ Base de données

### Informations de connexion

- **Host** : `postgres` (depuis les containers) ou `localhost` (depuis l'hôte)
- **Port** : `5432`
- **Database** : `todoapp` (prod) / `todoapp_dev` (dev)
- **Username** : `todouser`
- **Password** : `todopassword`

### PgAdmin

- **URL** : http://localhost:8080
- **Email** : admin@todoapp.com
- **Password** : admin123

### Utilisateurs de test

- **Admin** : admin@todoapp.com / password
- **User** : user@todoapp.com / password

## 📁 Structure des fichiers

```
TodoAppGenerator/
├── docker-compose.yml          # Production
├── docker-compose.dev.yml      # Développement
├── Makefile                    # Commandes simplifiées
├── .dockerignore              # Fichiers à ignorer
├── database/
│   └── init/
│       └── 01-init.sql        # Script d'initialisation DB
├── frontend/
│   ├── Dockerfile             # Production
│   ├── Dockerfile.dev         # Développement
│   └── nginx.conf             # Configuration Nginx
├── api-gateway/
│   ├── Dockerfile
│   └── Dockerfile.dev
├── public-api/
│   ├── Dockerfile
│   └── Dockerfile.dev
└── private-api/
    ├── Dockerfile
    └── Dockerfile.dev
```

## 🔧 Configuration

### Variables d'environnement

Vous pouvez personnaliser la configuration en créant un fichier `.env` :

```env
# Base de données
POSTGRES_DB=todoapp
POSTGRES_USER=todouser
POSTGRES_PASSWORD=todopassword

# Ports
FRONTEND_PORT=3000
API_GATEWAY_PORT=5000
PUBLIC_API_PORT=5050
PRIVATE_API_PORT=5555
POSTGRES_PORT=5432
PGADMIN_PORT=8080

# PgAdmin
PGADMIN_EMAIL=admin@todoapp.com
PGADMIN_PASSWORD=admin123
```

### Personnalisation des ports

Pour changer les ports, modifiez les fichiers `docker-compose.yml` ou utilisez des variables d'environnement.

## 🐛 Debug

### Logs en temps réel

```bash
# Tous les services
make logs

# Service spécifique
docker-compose logs -f frontend
docker-compose logs -f api-gateway
```

### Accès aux conteneurs

```bash
# Shell dans un conteneur
docker exec -it todo-frontend sh
docker exec -it todo-api-gateway sh
docker exec -it todo-postgres psql -U todouser -d todoapp
```

### Health checks

Les services incluent des health checks automatiques. Vérifiez avec :

```bash
docker ps
```

## 🚨 Résolution de problèmes

### Ports déjà utilisés

Si un port est déjà utilisé, modifiez-le dans le docker-compose.yml correspondant.

### Base de données corrompue

```bash
make db-reset
```

### Problèmes de build

```bash
make clean
make rebuild
```

### Permissions (Linux/Mac)

```bash
sudo chown -R $USER:$USER .
```

## 📦 Mise en production

### Optimisations recommandées

1. **Utilisez des secrets Docker** pour les mots de passe
2. **Configurez un reverse proxy** (Traefik, Nginx)
3. **Activez HTTPS** avec Let's Encrypt
4. **Configurez la sauvegarde automatique** de la base
5. **Surveillez les logs** avec un système centralisé

### Docker Swarm / Kubernetes

Les fichiers Docker Compose peuvent être adaptés pour :

- Docker Swarm (`docker stack deploy`)
- Kubernetes (avec kompose)

## 📝 Notes

- Les volumes de données persistent entre les redémarrages
- Le hot-reload est activé en mode développement
- Les ports de debug Node.js sont exposés en développement
- PgAdmin est inclus pour faciliter l'administration de la base

## 🤝 Contribution

Pour contribuer :

1. Forkez le projet
2. Créez une branche feature
3. Testez avec `make dev-up`
4. Soumettez une pull request

## 📄 Licence

MIT License - voir le fichier LICENSE pour plus de détails.
