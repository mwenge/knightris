const tips = [
      "To Start: Click a square on the bottom row to place the tile there." ,
      "You can place the tile on incorrect guesses to overwrite them." ,
      "Remember the value for incorrectly placed tiles - it will help you figure out the next word." ,
      "The objective is to get as many green rows as possible." ,
];
function* getNext(array) {
    for (let i = 0; i < array.length; i++) {
      yield array[i];
    }
    return;
}

export const wordrisTips = getNext(tips);

export const scoreComments = [
  [ //0
    "Commiserations, you are a Niall."
  ],
  [ // 1
    "Commiserations, you are still a Niall."
  ],
  [ // 2
    "Commiserations, you are still a Niall."
  ],
  [ // 3
    "Commiserations, you are still a Niall."
  ],
  [ // 4
    "Mmm, half-way there."
  ],
  [ // 5
    "OK, you are no longer a Niall."
  ],
  [ // 6
    "OK, you are not a Niall but still not a Robert."
  ],
  [ // 7
    "So close, you are nearly a Robert."
  ],
  [ // 8
    "Congratulations, you are a Robert."
  ],
];
