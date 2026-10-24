export type CategoryCode =
  | 'am'
  | 'ae'
  | 'tm'
  | 'pm'
  | 'md'
  | 'nm'
  | 'hg'
  | 'ng'
  | 'ln'
  | 'ac';

export interface CategoryInfo {
  label: string;
  color: string;
}

export interface ElementData {
  z: number;      // Atomic number
  s: string;      // Symbol
  n: string;      // Name
  cat: CategoryCode; // Category code
  r: number;      // Row in periodic table (1-10)
  c: number;      // Column in periodic table (1-18)
  i: string;      // Emoji icon
  u: string;      // Everyday real-world use
}

export type ViewMode = 'table' | 'browse';
