// Types pour les configurations du générateur de TodoApp

export interface ProjectConfig {
  // Configuration Backend
  backendLang: BackendLanguage;
  architecture: Architecture;
  database: Database;

  // Configuration Frontend
  frontendType: FrontendType;
  frontendFramework: FrontendFramework;
  styling: StylingFramework;

  // Configuration Projet
  projectName: string;
  includeAuth: boolean;
  includeTests: boolean;
  includeDocker: boolean;
  includeCI: boolean;
  includeAPI: boolean;
}

export type BackendLanguage =
  | "node"
  | "python"
  | "java"
  | "csharp"
  | "go"
  | "php";
export type Architecture =
  | "mvc"
  | "clean"
  | "hexagonal"
  | "layered"
  | "microservices";
export type Database = "sqlite" | "postgresql" | "mysql" | "mongodb" | "redis";
export type FrontendType = "mvp" | "spa" | "ssr";
export type FrontendFramework =
  | "react"
  | "vue"
  | "angular"
  | "svelte"
  | "nextjs"
  | "nuxt";
export type StylingFramework =
  | "tailwind"
  | "bootstrap"
  | "material"
  | "chakra"
  | "css";

export interface GeneratedProject {
  techStack: TechStackInfo;
  fileStructure: FileStructure;
  instructions: DeploymentInstructions;
}

export interface TechStackInfo {
  backend: {
    language: string;
    framework: string;
    architecture: string;
  };
  frontend: {
    type: string;
    framework: string;
    styling: string;
  };
  database: {
    type: string;
    name: string;
  };
  features: string[];
}

export interface FileStructure {
  name: string;
  type: "file" | "folder";
  children?: FileStructure[];
  content?: string;
}

export interface DeploymentInstructions {
  setup: string[];
  development: string[];
  production: string[];
  docker?: string[];
  testing?: string[];
}

export interface FormSection {
  title: string;
  fields: FormField[];
}

export interface FormField {
  id: string;
  label: string;
  type: "select" | "text" | "checkbox";
  options?: { value: string; label: string }[];
  defaultValue?: string | boolean;
  required?: boolean;
}
