export interface Category {
  id: 'privacy' | 'security' | 'performance' | 'misc';
  title: string;
  description: string;
  icon: string;
}

export interface SelectOption {
  value: number;
  label: string;
}

export interface Setting {
  id: string;
  category: Category['id'][];
  title: string;
  description: string;
  default: any;
  type: 'boolean' | 'string' | 'number' | 'select';
  advanced?: boolean;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  helpText?: string;
  options?: SelectOption[];
}

export interface Configuration {
  categories: Category['id'][];
  settings: Record<string, any>;
  timestamp: string;
  version: string;
}