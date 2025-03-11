
// Tetris constants
export const BOARD_WIDTH = 10;
export const BOARD_HEIGHT = 20;
export const BLOCK_SIZE = 24;

// Tetromino shapes
export const TETROMINOES = [
  {
    shape: [
      [1, 1],
      [1, 1]
    ],
    color: "#FF8A48"
  },
  {
    shape: [
      [0, 2, 0],
      [2, 2, 2]
    ],
    color: "#FC68B3"
  },
  {
    shape: [
      [0, 3, 3],
      [3, 3, 0]
    ],
    color: "#3DFDFF"
  },
  {
    shape: [
      [4, 4, 0],
      [0, 4, 4]
    ],
    color: "#F5DF4D"
  },
  {
    shape: [
      [5, 5, 5, 5]
    ],
    color: "#D5D5F1"
  },
  {
    shape: [
      [0, 0, 6],
      [6, 6, 6]
    ],
    color: "#2AC20E"
  },
  {
    shape: [
      [7, 0, 0],
      [7, 7, 7]
    ],
    color: "#6B7FD7"
  }
];

// Mindful prompts that appear as player plays
export const MINDFUL_PROMPTS = [
  "Notice your breathing - is it fast or slow?",
  "How do your shoulders feel right now?",
  "Pay attention to the colors as they fall",
  "Can you feel your feet on the floor?",
  "Take a deep breath between moves",
  "Notice any thoughts without judging them",
  "Bring awareness to how your hands feel",
  "Are you holding tension anywhere?",
  "Stay present with each piece as it falls",
  "Observe any feelings of frustration without reacting",
  "Feel the weight of your body in your chair",
  "Notice the sounds around you",
  "Are you rushing? Try slowing down",
  "Bring gentle awareness to your jaw - is it tense?",
  "Remember, it's just a game - enjoy the process"
];
