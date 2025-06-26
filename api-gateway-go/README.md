# API Gateway Go Version

Nouvelle version de l'API Gateway écrite en Go utilisant le framework Gin.

## Caractéristiques

- **Performance améliorée** : Go offre de meilleures performances que Node.js
- **Rate limiting** : Limitation du taux de requêtes par IP
- **Logging structuré** : Logs détaillés pour le monitoring
- **CORS** : Gestion des CORS intégrée
- **Proxy intelligent** : Routage basé sur les patterns d'URL
- **Health checks** : Endpoint de santé pour le monitoring
- **Configuration environnement** : Support des variables d'environnement

## Structure du projet

```
api-gateway-go/
├── main.go                 # Point d'entrée principal
├── go.mod                  # Dépendances Go
├── config/
│   └── config.go          # Configuration de l'application
├── models/
│   └── route.go           # Modèles de données
├── routes/
│   └── routes.go          # Configuration des routes
├── proxy/
│   └── proxy.go           # Logique du proxy
├── middleware/
│   ├── logging.go         # Middleware de logging
│   └── ratelimit.go       # Middleware de rate limiting
└── README.md
```

## Installation et utilisation

### Prérequis

- Go 1.21 ou supérieur

### Installation

```bash
cd api-gateway-go
go mod tidy
```

### Développement

```bash
go run main.go
```

### Production

```bash
go build -o api-gateway
./api-gateway
```

## Configuration

Variables d'environnement supportées :

- `PORT` : Port d'écoute (défaut: 5000)
- `PUBLIC_API_URL` : URL de l'API publique (défaut: http://localhost:5050)
- `PRIVATE_API_URL` : URL de l'API privée (défaut: http://localhost:5555)
- `ENVIRONMENT` : Environnement (development/production)
- `LOG_LEVEL` : Niveau de log (défaut: info)
- `RATE_LIMIT_MAX` : Nombre max de requêtes par fenêtre (défaut: 100)
- `RATE_LIMIT_WINDOW` : Fenêtre de rate limiting en secondes (défaut: 60)

## Endpoints

- `GET /` : Information sur l'API Gateway
- `GET /health` : Health check
- `ALL /public/*` : Proxy vers l'API publique
- `ALL /private/*` : Proxy vers l'API privée
- `GET /public/api-docs` : Documentation API publique
- `GET /private/api-docs` : Documentation API privée

## Fonctionnalités avancées

### Rate Limiting

- Limitation par IP client
- Fenêtre glissante configurable
- Headers de réponse informatifs

### Proxy intelligent

- Tri des routes par longueur pour éviter les conflits
- Support des filtres de chemin (regex)
- Réécriture d'URL
- Forwarding des headers

### Monitoring

- Logs structurés avec timestamps
- Métriques de performance
- Health checks
- Headers de rate limiting

## Docker

Le projet peut être facilement dockerisé :

```dockerfile
FROM golang:1.21-alpine AS builder
WORKDIR /app
COPY go.mod go.sum ./
RUN go mod download
COPY . .
RUN go build -o api-gateway

FROM alpine:latest
RUN apk --no-cache add ca-certificates
WORKDIR /root/
COPY --from=builder /app/api-gateway .
EXPOSE 5000
CMD ["./api-gateway"]
```
