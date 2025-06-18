# TodoApp Generator - Production Architecture

Cette architecture de production modulaire permet une gestion fine et une scalabilité optimale de l'application TodoApp Generator.

## 🏗️ Architecture

### Structure des services

```
production/
├── docker-compose.yml                 # Orchestrateur principal (réseaux)
├── docker-compose.databases.yml       # Bases de données PostgreSQL
├── docker-compose.private-api.yml     # API privée
├── docker-compose.public-api.yml      # API publique
├── docker-compose.gateway.yml         # API Gateway
├── docker-compose.frontend.yml        # Interface utilisateur
├── docker-compose.monitoring.yml      # Monitoring (Prometheus, Grafana)
├── deploy.sh                         # Script de déploiement
├── .env.example                      # Variables d'environnement exemple
└── configs/                          # Configurations des services
    ├── prometheus.yml
    ├── alertmanager.yml
    └── grafana/
```

### Réseaux Docker

- **todo-db-network** (172.21.0.0/24) : Communication avec les bases de données
- **todo-api-network** (172.22.0.0/24) : Communication entre APIs
- **todo-frontend-network** (172.24.0.0/24) : Communication frontend-gateway
- **todo-monitoring-network** (172.23.0.0/24) : Services de monitoring

## 🚀 Déploiement

### Prérequis

- Docker 20.10+
- Docker Compose 2.0+
- Au moins 4GB de RAM disponible
- Ports libres : 3000, 5000, 5050, 5555, 5432, 5433, 5434

### Installation rapide

```bash
# 1. Copier et configurer les variables d'environnement
cp production/.env.example production/.env
# Modifier production/.env avec vos valeurs

# 2. Déploiement complet
./production/deploy.sh deploy

# 3. Déploiement du monitoring (optionnel)
./production/deploy.sh monitoring
```

### Utilisation du Makefile

```bash
# Déploiement complet
make prod-build    # Construction des images
make prod-up       # Démarrage complet

# Services individuels
make prod-db-up       # Bases de données uniquement
make prod-api-up      # APIs uniquement
make prod-frontend-up # Frontend uniquement

# Monitoring
make monitoring-up    # Services de monitoring
make monitoring-down  # Arrêt du monitoring

# Maintenance
make prod-db-backup   # Sauvegarde des BDD
make prod-db-reset    # Reset des BDD
make status           # Statut des conteneurs
```

## 🔧 Configuration

### Variables d'environnement

Copiez `production/.env.example` vers `production/.env` et modifiez :

```env
# Sécurité (OBLIGATOIRE à changer)
POSTGRES_PASSWORD=your-super-secure-password
JWT_SECRET=your-super-secret-jwt-key
GRAFANA_PASSWORD=secure-grafana-password

# Performance
MAX_CONNECTIONS=100
RATE_LIMIT_MAX=1000

# URLs (ajustez selon votre domaine)
CORS_ORIGIN=https://yourdomain.com
API_GATEWAY_URL=https://api.yourdomain.com
```

### Bases de données

Trois instances PostgreSQL isolées :

- **postgres-config** (port 5432) : Configuration globale
- **postgres-user** (port 5433) : Données utilisateurs
- **postgres-intern** (port 5434) : Données internes

## 📊 Monitoring

### Services inclus

- **Prometheus** (9090) : Collecte de métriques
- **Grafana** (3001) : Visualisation des données
- **AlertManager** (9093) : Gestion des alertes
- **Node Exporter** (9100) : Métriques système
- **cAdvisor** (8080) : Métriques des conteneurs

### Accès par défaut

- Grafana : `admin` / `admin123` (changez dans .env)
- Prometheus : Pas d'authentification
- AlertManager : Pas d'authentification

## 🛠️ Administration

### Démarrage sélectif

```bash
# Bases de données seulement
make prod-db-up

# APIs backend seulement
make prod-api-up

# Frontend seulement (nécessite que les APIs soient démarrées)
make prod-frontend-up
```

### Logs

```bash
# Logs de production globaux
make prod-logs

# Logs du monitoring
make monitoring-logs

# Logs d'un service spécifique
cd production
docker compose -f docker-compose.databases.yml logs -f postgres-config
```

### Sauvegarde

```bash
# Sauvegarde automatique des 3 BDD
make prod-db-backup

# Ou via le script
./production/deploy.sh backup
```

### Mise à l'échelle

Pour scaler un service :

```bash
cd production
docker compose -f docker-compose.public-api.yml up -d --scale public-api=3
```

## 🔒 Sécurité

### Recommandations

1. **Changez tous les mots de passe** dans `.env`
2. **Utilisez HTTPS** en production avec un reverse proxy
3. **Limitez l'accès réseau** aux ports de monitoring
4. **Configurez la rotation des logs**
5. **Mettez en place des sauvegardes automatiques**

### Reverse Proxy

Exemple avec Nginx pour exposer uniquement le frontend et l'API Gateway :

```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
    }

    location /api/ {
        proxy_pass http://localhost:5000/;
    }
}
```

## 🆘 Dépannage

### Problèmes fréquents

1. **Port déjà utilisé** : Vérifiez avec `netstat -tlnp`
2. **Pas de connexion BDD** : Attendez l'initialisation complète (60s)
3. **Conteneurs qui redémarrent** : Vérifiez les logs avec `docker logs <container>`

### Commandes utiles

```bash
# Statut détaillé
make status

# Redémarrage complet
make prod-down && make prod-up

# Nettoyage complet
make clean-all

# Vérification des réseaux
docker network ls | grep todo
```

## 📈 Performance

### Ressources recommandées

- **Production minimale** : 2 CPU, 4GB RAM
- **Production recommandée** : 4 CPU, 8GB RAM
- **Avec monitoring** : +1 CPU, +2GB RAM

### Optimisations

1. Ajustez `MAX_CONNECTIONS` selon votre charge
2. Configurez `RATE_LIMIT_MAX` selon vos besoins
3. Utilisez des volumes SSD pour les bases de données
4. Activez la compression dans Nginx/Apache

## 🔄 Mise à jour

```bash
# 1. Sauvegarde
make prod-db-backup

# 2. Arrêt des services
make prod-down

# 3. Mise à jour du code
git pull

# 4. Reconstruction et redémarrage
make prod-build
make prod-up
```
