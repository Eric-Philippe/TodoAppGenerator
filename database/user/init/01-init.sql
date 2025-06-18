-- Script d'initialisation de la base de données TodoApp
-- Ce script sera exécuté automatiquement lors du premier démarrage de PostgreSQL

-- Création des extensions utiles
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Création de la table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Fonction pour mettre à jour automatiquement updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insertion de données de test
INSERT INTO users (email, username, password_hash, first_name, last_name, is_verified) VALUES
('admin@todoapp.com', 'admin', '$2b$10$rOzPqZzGGNu9VhZgLcZZK.QqRtGzFKlGJ0Np8XKNH1JUkc5kW7K.S', 'Admin', 'User', true),
('user@todoapp.com', 'testuser', '$2b$10$rOzPqZzGGNu9VhZgLcZZK.QqRtGzFKlGJ0Np8XKNH1JUkc5kW7K.S', 'Test', 'User', true)
ON CONFLICT (email) DO NOTHING;

-- Affichage des informations de connexion
\echo 'Base de données TodoApp initialisée avec succès!'
\echo 'Utilisateurs de test créés:'
\echo '  - admin@todoapp.com / password: password'
\echo '  - user@todoapp.com / password: password'
\echo ''
\echo 'Connexion à la base:'
\echo '  - Host: postgres (depuis les containers) ou localhost (depuis l''hôte)'
\echo '  - Port: 5432'
\echo '  - Database: todoapp'
\echo '  - Username: todouser'
\echo '  - Password: todopassword'
