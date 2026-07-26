export interface Rgb {
  r: number,
  g: number,
  b: number,
}

export interface Hsl {
  h: number,
  s: number,
  l: number,
}

export type TailwindColorObject = Record<number, string>;

export type TailwindColorPalette = Record<string, string | TailwindColorObject | null>;
