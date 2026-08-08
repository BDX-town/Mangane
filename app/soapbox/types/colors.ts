export type Rgb = { r: number, g: number, b: number };
export type Hsl = { h: number, s: number, l: number };

export type TailwindColorObject = {
  [key: number]: string;
};

export type TailwindColorPalette = {
  [key: string]: TailwindColorObject | string,
}
