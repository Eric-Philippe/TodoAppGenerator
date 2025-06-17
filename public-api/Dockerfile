# Public API Dockerfile
FROM node:20-alpine

WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm ci --only=production

# Créer un utilisateur non-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Copier le code source
COPY . .

# Changer les permissions avant le build
RUN chown -R nodejs:nodejs /app

# Passer à l'utilisateur nodejs
USER nodejs

# Build de l'application TypeScript
RUN npm run build

# Exposer le port
EXPOSE 5050

# Commande de démarrage
CMD ["npm", "start"]
