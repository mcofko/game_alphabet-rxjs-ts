import { Scene, Point2D, State } from './types';
import { END_THRESHOLD, GAME_WIDTH } from './constants';

export const COLS = 30;
export const ROWS = 30;
export const GAP_SIZE = 1;
export const CELL_SIZE = 10;
export const CANVAS_WIDTH = COLS * (CELL_SIZE + GAP_SIZE);
export const CANVAS_HEIGHT = ROWS * (CELL_SIZE + GAP_SIZE);


// *******************************************************

export const renderGame = (state: State) => (
  (document.body.innerHTML = `Score: ${state.score}, Level: ${state.level} <br/>`),
  state.letters.forEach(
    l =>
      (document.body.innerHTML += '&nbsp'.repeat(l.yPos) + l.letter + '<br/>')
  ),
  (document.body.innerHTML +=
    '<br/>'.repeat(END_THRESHOLD - (state.letters.length - 1)) +
    '-'.repeat(GAME_WIDTH))
);
export const renderGameOverLite = () => (document.body.innerHTML += '<br/>GAME OVER!');
export const noop = () => {};

// *******************************************************




export function createCanvasElement() {
  const canvas = document.createElement('canvas');
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  return canvas;
}

export function renderScene(ctx: CanvasRenderingContext2D, scene: Scene) {
  renderBackground(ctx);
  renderScore(ctx, scene.score);
}

export function renderScore(ctx: CanvasRenderingContext2D, score: number) {
  let textX = CANVAS_WIDTH / 2;
  let textY = CANVAS_HEIGHT / 2;

  drawText(ctx, score.toString(), textX, textY, 'rgba(0, 0, 0, 0.1)', 150);
}

export function renderGameOver(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  let textX = CANVAS_WIDTH / 2;
  let textY = CANVAS_HEIGHT / 2;

  drawText(ctx, 'GAME OVER!', textX, textY, 'black', 25);
}

export function getRandomPosition(positions: Array<Point2D> = []): Point2D {
  let position: Point2D = {
    x: getRandomNumber(0, COLS - 1),
    y: getRandomNumber(0, ROWS - 1)
  };

  if (isEmptyCell(position, positions)) {
    return position;
  }

  return getRandomPosition(positions);
}

export function checkCollision(a, b) {
  return a.x === b.x && a.y === b.y;
}

function isEmptyCell(position: Point2D, objPositions: Array<Point2D>): boolean {
  return !objPositions.some(segment => checkCollision(segment, position));
}

function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function renderBackground(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = '#EEE';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
}

function drawText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, fillStyle: string,
  fontSize: number, horizontalAlign: CanvasTextAlign = 'center', verticalAlign: CanvasTextBaseline = 'middle') {

  ctx.fillStyle = fillStyle;
  ctx.font = `bold ${fontSize}px sans-serif`;

  let textX = x;
  let textY = y;

  ctx.textAlign = horizontalAlign;
  ctx.textBaseline = verticalAlign;

  ctx.fillText(text, textX, textY);
}

function getSegmentColor(index: number) {
  return index === 0 ? 'black' : '#2196f3';
}

function wrapBounds(point: Point2D) {
  point.x = point.x >= COLS ? 0 : point.x < 0 ? COLS - 1 : point.x;
  point.y = point.y >= ROWS ? 0 : point.y < 0 ? ROWS - 1 : point.y;

  return point;
}

function paintCell(ctx: CanvasRenderingContext2D, point: Point2D, color: string) {
  const x = point.x * CELL_SIZE + (point.x * GAP_SIZE);
  const y = point.y * CELL_SIZE + (point.y * GAP_SIZE);

  ctx.fillStyle = color;
  ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
}