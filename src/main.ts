import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { animationFrame } from 'rxjs/scheduler/animationFrame';

import { interval } from 'rxjs/observable/interval';
import { fromEvent } from 'rxjs/observable/fromEvent';
import { combineLatest } from 'rxjs/observable/combineLatest';
import { of } from 'rxjs/observable/of';

import {
  map,
  filter,
  scan,
  startWith,
  distinctUntilChanged,
  share,
  withLatestFrom,
  tap,
  skip,
  takeWhile,
  take,
  switchMap,
  first
} from 'rxjs/operators';

import { PartialObserver, Observer } from 'rxjs/Observer';
import { createCanvasElement, renderGame, noop, renderGameOverLite } from './canvas';
import { Letters, State } from './types';
import { randomLetter, createLettersObj, isGameOver, getTresholdLevel, generateStateObj } from './utils';
import { GAME_WIDTH, SPEED_ADJUST, LVL_CHANGE_THRESHOLD, APPLE_COUNT, POINTS_PER_APPLE, END_THRESHOLD } from './constants';

/**
 * Create canvas element and append it to the page
 */
let canvas = createCanvasElement();
let ctx: CanvasRenderingContext2D = canvas.getContext('2d') as CanvasRenderingContext2D;
document.body.appendChild(canvas);


let intervalSubject$: BehaviorSubject<number> = new BehaviorSubject(1800);

const letters$: Observable<Letters> = intervalSubject$.pipe(
  switchMap(i =>
    interval(i).pipe(
      // tap(value => console.log('Interval: ' + i)),
      scan<number, Letters> ( (lettersObj: Letters, value: number) => ({
          intrvl: i,
          ltrs: [
            {
              letter: randomLetter(),
              yPos: Math.floor(Math.random() * GAME_WIDTH)
            },
            ...lettersObj.ltrs
          ]
        }),
        createLettersObj()
      ),
    )
  ),
  share()
);

let key$: Observable<string> = fromEvent(document, 'keyup').pipe(
  startWith({key: ' '}),
  map((keyEvent: KeyboardEvent) => keyEvent.key),
  withLatestFrom(letters$, (v1: string, v2: Letters) => ({key: v1, letters: v2})),
  filter(({key, letters}) =>  (letters.ltrs[letters.ltrs.length - 1] && letters.ltrs[letters.ltrs.length - 1].letter === key) ),
  map(({key, letters}) => { letters.ltrs.pop();  return key; })
);

let score$: Observable<number> = key$.pipe(
  map((_) => POINTS_PER_APPLE),
  startWith(0),
  scan((score, value) => score += value, 0),
);

let game$ = combineLatest(letters$, score$).pipe(
  scan<[Letters, number], State>((state, [letters, score]) => {
    state.score = score;

    state.score > 0 && state.score === state.lvlThreshold
      ? ((letters.ltrs = []),
        (state.level = state.level + 1),
        intervalSubject$.next(letters.intrvl - SPEED_ADJUST))
      : noop;

    return { score: state.score, letters: letters.ltrs, level: state.level, lvlThreshold: getTresholdLevel(state.level) };
  }, generateStateObj()),
  takeWhile((state: State) => !isGameOver(state.letters))
);

game$.subscribe(renderGame, noop, renderGameOverLite );