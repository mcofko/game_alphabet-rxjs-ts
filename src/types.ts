export interface Point2D {
  x: number;
  y: number;
}

export interface Scene {
  snake: Array<Point2D>;
  apples: Array<Point2D>;
  score: number;
}

export interface Letter {
  letter: String;
  yPos: number;
}

export interface Letters {
  ltrs: Letter[];
  intrvl: number;
}

export interface State {
  score: number;
  letters: Letter[];
  level: number;
}