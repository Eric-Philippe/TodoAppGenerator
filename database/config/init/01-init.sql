-- Script d'initialisation de la base de données TodoApp
-- Ce script sera exécuté automatiquement lors du premier démarrage de PostgreSQL

-- Création des extensions utiles
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Création de la table des langages disponibles
CREATE TABLE IF NOT EXISTS languages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    code VARCHAR(10) UNIQUE NOT NULL
);

-- Création de la table des architectures backend disponibles
CREATE TABLE IF NOT EXISTS backend_architectures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    code VARCHAR(10) UNIQUE NOT NULL
);

-- Création de la table contenant les bases de données disponibles
CREATE TABLE IF NOT EXISTS databases (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    code VARCHAR(10) UNIQUE NOT NULL
);

-- Création de la table des architectures frontend disponibles
CREATE TABLE IF NOT EXISTS frontend_architectures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    code VARCHAR(10) UNIQUE NOT NULL
);

-- Création de la table des frameworks frontend disponibles
CREATE TABLE IF NOT EXISTS frontend_frameworks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    code VARCHAR(10) UNIQUE NOT NULL
);

-- Création de la table des stylings frontend disponibles
CREATE TABLE IF NOT EXISTS frontend_stylings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    code VARCHAR(10) UNIQUE NOT NULL
);