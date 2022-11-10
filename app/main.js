import { todaysPuzzle, updateProgress, boardNumber } from './tiles.js';
import { wordrisTips, scoreComments } from './tips.js';
import { POSSIBLE_MOVES } from './moves.js';

const MAX_ROWS = 8;
const MAX_COLS = 6;

function calculateScore() {
  let score = 0;
  const finalBoard = todays.puzzle
    .map((e,i) => e.map((l,j) => {
      if (todays.puzzle[i][j] == todays.solution[i][j]) {
        score++;
        return '🟩';
      }
      return '🟥';
    }))
    .reverse()
    .map(e => e.join(''))
    .join('\n');
  return {
    score: score + todays.guesses,
    guesses: finalBoard
  }
}

function showScore() {
  let playerScore = calculateScore();
  // Make the scoreboard a child of the grid so it positions nicely. FIXME: A hack.
  let container = resultcontainer.parentElement.removeChild(resultcontainer);
  grid.appendChild(container);
  container.style.display = 'block';

  // Blur the grid.
  Array.from(document.getElementsByClassName("cell"))
    .forEach(c => c.style.filter = "blur(0.9px)");

  // Display the score and populate the share button.
  score.textContent = `Score: ${playerScore.score}`;
  comment.textContent = scoreComments[parseInt(playerScore.score, 10)];
  share.onclick = ()=> {
    navigator.clipboard.writeText(
`Knightris ${boardNumber()} ${playerScore.score}\n
${playerScore.guesses}\n 
https://mwenge.github.io/knightris`
    );
    copied.className = "copied visible";
    document.body.offsetTop;
    setTimeout(()=> {
      copied.className = "copied hidden";
    }, 1000);
  }; 
}

function checkProgress() {
  updateProgress(todays);
  if (todays.guesses <= 0) {
    showScore();
  }
  if (JSON.stringify(todays.puzzle) == JSON.stringify(todays.solution)) {
    showScore();
  }
}


let startPiece = {r:-1,c:-1};

function updateColor(r,c) {
  let e = document.querySelector(`[row="${r}"][column="${c}"]`)
  // Update the tile's color.
  if (todays.puzzle[r][c] == todays.solution[r][c]) {
    e.style.backgroundColor = 'green';
  } else {
    e.style.backgroundColor = 'red';
  }
  e.style.opacity = '1';
}

function resetTileColors() {
  for (let r = 0; r < todays.puzzle.length; r++) {
    for (let c = 0; c < todays.puzzle[r].length; c++) {
      updateColor(r,c);
    }
  }
}

function legalMove(r,c,r1,c1) {
  let rm = Math.abs(r - r1);
  let cm = Math.abs(c - c1);
  if (cm == 1 && rm == 2) return true;
  if (cm == 2 && rm == 1) return true;
  return false;
}

function showPossibleMoves(r,c) {
  for (let r = 0; r < todays.puzzle.length; r++) {
    for (let c = 0; c < todays.puzzle[r].length; c++) {
      let e = document.querySelector(`[row="${r}"][column="${c}"]`);
      e.style.opacity = '0.5';
    }
  }
  let e = document.querySelector(`[row="${r}"][column="${c}"]`);
  e.style.opacity = '1';
  for (const mv of POSSIBLE_MOVES) {
    let m = mv[0];
    let e = document.querySelector(`[row="${r+m.y}"][column="${c+m.x}"]`)
    if (!e) {
      continue;
    }
    e.style.opacity = '1';
  }
}

// Place the piece in the position selected by the player.
function makeMove(e) {
  let r = parseInt(e.target.getAttribute('row'));
  let c = parseInt(e.target.getAttribute('column'));
  let r1 = startPiece.r;
  let c1 = startPiece.c;

  function reset() {
    startPiece = {r:-1,c:-1};
    resetTileColors();
  }
  function updateScore() {
    todays.guesses--;
    current.textContent = todays.guesses;
    checkProgress();
  }
  // We've clicked on the same tile, so reset to allow choosing
  // another starting point.
  if (r == r1 && c == c1) {
    reset();
    tip.textContent = wordrisTips.next().value;
    return;
  }
  // No tile is currently selected, so set this as a starting point.
  if (startPiece.r == -1) {
    startPiece = {r:r,c:c};
    e.target.style.backgroundColor = 'black';
    showPossibleMoves(r,c);
    return;
  }
  // If it's not a legal move, reset.
  if (!legalMove(r,c,r1,c1)) {
    reset();
    tip.textContent = "Not a legal move!";
    return;
  }
  // If it's a wrong move, reset.
  if (todays.puzzle[r][c] != todays.solution[r1][c1]
      && todays.puzzle[r1][c1] != todays.solution[r][c]) {
    reset();
    updateScore();
    tip.textContent = "Wrong Guess!";
    return;
  }

  // It's a legal move, so implement it.
  let cp = document.querySelector(`[row="${r}"][column="${c}"]`)
  let sp = document.querySelector(`[row="${r1}"][column="${c1}"]`)
  let cpv = cp.textContent;
  let spv = sp.textContent;
  cp.textContent = spv;
  sp.textContent = cpv;
  todays.puzzle[r][c] = spv;
  todays.puzzle[r1][c1] = cpv;
  reset();
  updateScore();
  tip.textContent = wordrisTips.next().value;
}


// Tile the board.
let todays = await todaysPuzzle(MAX_ROWS);
console.log({todays});

// Set up the board from bottom to top.
grid.innerHTML = '';
grid.style.setProperty('grid-template-columns', 'repeat(' + MAX_COLS + ', 1fr)');
grid.style.setProperty('grid-template-rows', 'repeat(' + MAX_ROWS + ', 1fr)');
for (let r = todays.puzzle.length - 1; r >= 0; r--) {
  for (let c = 0; c < todays.puzzle[r].length; c++) {
    let d = document.createElement("div"); 
    d.className = "cell";
    d.setAttribute("row", r);
    d.setAttribute("column", c);
    grid.appendChild(d);
    d.onclick = makeMove;
    d.textContent = todays.puzzle[r][c];

    // Update the tile's color.
    if (todays.puzzle[r][c] == todays.solution[r][c]) {
      d.style.backgroundColor = 'green';
    } else {
      d.style.backgroundColor = 'red';
    }
  }
}
current.textContent = todays.guesses;
tip.textContent = wordrisTips.next().value;
if (todays.guesses <= 0) {
  showScore();
}

