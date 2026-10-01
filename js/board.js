export const ROWS = 20;
export const COLS = 10;
export const FLASH_MS = 350; // keep CSS in sync: set from game.js
const TYPES = ["I", "O", "T", "S", "Z", "J", "L"];

let activeType = "T"; // fallback 

export const setActiveType = (type) => {
    activeType = type;
};


export const createBoard = (game) => {
    const board = [];
    for (let row = 0; row < ROWS; row++) {
        board[row] = [];
        for (let col = 0; col < COLS; col++) {
            board[row][col] = 0;
        }

    }

    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const cell = document.createElement("div");
            cell.classList.add(`${row}-${col}`);
            game.appendChild(cell);
        }
    }
    return board;
};
export const createObstacle = (board, game) => {
    for (let col = 0; col < COLS; col++) {
        board[8][col] = 2;
    }
    board[8][5] = 0;
    updateBoard(board, game);
}

export const updateBoard = (board, game) => {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const cell = game.getElementsByClassName(`${row}-${col}`)[0];
            if (!cell) continue;

            cell.style.backgroundColor = "";
            cell.classList.remove("filled", "locked", "clearing", ...TYPES);

            const value = board[row][col];
            if (value === 1) {
                cell.classList.add("filled", activeType);
            } else if (value === 2) {
                cell.classList.add("filled", "locked");
            }
        }
    }
}


export function updateNextElement(piece, game) {
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            const cell = game.getElementsByClassName(`next-${row}-${col}`)[0];
            if (!cell) continue;

            const filled =
                row < piece.shape.length &&
                col < piece.shape[row].length &&
                piece.shape[row][col] === 1;

            cell.style.backgroundColor = "";               // clear any old inline color
            cell.classList.remove("filled", ...TYPES);     // reset previous piece

            if (filled) {
                cell.classList.add("filled", piece.type);  // e.g. "filled T"
            }
        }
    }
}

export const nextElementGrid = (next = document.getElementById("next-piece")) => {
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            const cell = document.createElement("div");
            cell.classList.add(`next-${row}-${col}`);
            next.appendChild(cell);
        }
    }
}



export const findFullRows = (board) =>
    board.reduce((rows, line, i) => (line.every((cell) => cell === 2) ? [...rows, i] : rows), []);

// Adds the "clearing" class so the CSS animation plays on those rows
export const flashRows = (rows, game) => {
    for (const row of rows) {
        for (let col = 0; col < COLS; col++) {
            const cell = game.getElementsByClassName(`${row}-${col}`)[0];
            if (cell) cell.classList.add("clearing");
        }
    }
};

export const removeRows = (board, rows, game) => {
    [...rows].sort((a, b) => b - a).forEach((row) => {
        board.splice(row, 1);
        board.unshift(new Array(COLS).fill(0));
    });
    updateBoard(board, game);
};