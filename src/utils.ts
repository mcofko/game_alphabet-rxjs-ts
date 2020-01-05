import { Letters, Letter, State } from './types';
import { END_THRESHOLD, LVL_CHANGE_THRESHOLD } from './constants';

export let randomLetter = () => {
    return String.fromCharCode(
      Math.random() * ('z'.charCodeAt(0) - 'a'.charCodeAt(0)) + 'a'.charCodeAt(0));
  };

  export function createLettersObj(): Letters {
    return {
       ltrs: [], intrvl: 0
    };
  }

  export function isGameOver(letters: Letter[]): boolean {
    return letters.length - 1 > END_THRESHOLD;
  }

  export function getTresholdLevel(level: number): number {
    return level * LVL_CHANGE_THRESHOLD;
  }

  export function generateStateObj(): State {
    return { score: 0, letters: [], level: 1, lvlThreshold: getTresholdLevel(1) };
  }