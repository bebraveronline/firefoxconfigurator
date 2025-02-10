export interface Category {
  id: 'privacy' | 'security' | 'performance';
  title: string;
  description: string;
  icon: string;
}

export interface Setting {
  id: string;
  category: Category['id'][];
  title: string;
  description: string;
  default: any;
  type: 'boolean' | 'string' | 'number';
  advanced?: boolean;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  helpText?: string;
}

export interface Configuration {
  categories: Category['id'][];
  settings: Record<string, any>;
  timestamp: string;
  version: string;
}