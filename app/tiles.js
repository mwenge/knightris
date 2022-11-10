import { allWords } from './words-6.js';
import { POSSIBLE_MOVES } from './moves.js';

// Set today's seed
const today = new Date();
today.setHours(10, 1, 0, 0);
const seed = today.getTime();
let rng = new alea(seed);

export function boardNumber() {
  const DAYS_FACTOR = 86400000;
  const start = new Date(2022, 5, 21);
  const board = (today - start) / DAYS_FACTOR;
  return board;
}

export async function updateProgress(todays) {
  await localforage.setItem(seed, todays);
}

async function todaysProgress() {
  let p = await localforage.getItem(seed);
  return p;
}

function todaysWords(rows) {
  let words = [];
  [...Array(rows).keys()].forEach(x => {
    let n = (rng.int32() >>> 0) % allWords.length;
    words.push(allWords[n]);
  });
  return words;
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}

function getMove(todaysMoves, r, c) {
  // Get a list of shuffled tile shapes.
  let cands = shuffle(POSSIBLE_MOVES);
  // If we're at the end of a row, filter out any moves that won't fit.
  cands = cands.filter(cand => { 
    const l = todaysMoves[r].length - 1;
    const h = todaysMoves.length - 1;
    for (const co of cand) {
      if (co.x && co.x + c > l) return false;
      if (co.y && co.y + r > h) return false;
      if (co.x < 0 && co.x + c < 0) return false;
      if (co.y < 0 && co.y + r < 0) return false;
    };
    return true;
  });
  for (const cand of cands) {
    let fits = true;
    for (const co of cand) {
      if (todaysMoves[r+co.y][c+co.x]) {
        fits = false;
        break;
      }
    }
    if (fits) { 
      return cand;
    }
  }
  return null;
}

function generateBoard(words) {

  let todaysSolution = words.map(x => x.split(''));
  let todaysPuzzle = words.map(x => x.split(''));
  let todaysMoves = words.map(x => x.split(''));
  todaysMoves.forEach(r => r.fill(0));

  let moveNumber = 0;
  for (let r = 0; r < todaysMoves.length; r++) {
    for (let c = 0; c < todaysMoves[r].length; c++) {
      // Skip if already filled.
      if (todaysMoves[r][c]) {
        continue
      }
      moveNumber++;
      const move = getMove(todaysMoves, r, c);

      // No fit, so use a single letter;
      if (!move) {
        continue;
      }
      
      let mv = move[0];
      // We always fill the current tile.
      todaysMoves[r][c] = moveNumber;
      todaysMoves[r+mv.y][c+mv.x] = moveNumber;
      todaysPuzzle[r][c] = todaysSolution[r+mv.y][c+mv.x];
      todaysPuzzle[r+mv.y][c+mv.x] = todaysSolution[r][c];
    }
  }
  let minimumMoves = Math.max(...todaysMoves.flat());
  minimumMoves += parseInt(minimumMoves / 5, 10);
  return {
    solution: todaysSolution,
    puzzle: todaysPuzzle,
    moves: todaysMoves,
    guesses: minimumMoves,
  };
}

async function todaysPuzzle(rows) {
  let p = await todaysProgress();
  if (p) {
    return p;
  }
  const words = todaysWords(rows);
  const result = generateBoard(words);
  return result;
}

export { todaysPuzzle };
