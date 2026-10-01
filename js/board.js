export const ROWS = 20;
export const COLS = 10;
export const FLASH_MS = 350; 

const TYPES = ["I", "O", "T", "S", "Z", "J", "L"];

let activePiece = null;
let activeType = "T"; // fallback 

export const setActivePiece = (piece) => {
    activePiece = piece;
    activeType = piece.type;
};

const fits = (shape, row, col, board) =>
    shape.every((line, r) =>
        line.every((filled, c) =>
            !filled || (row + r < ROWS && board[row + r][col + c] !== 2)
        )
    );
 
export const getGhostRow = (piece, board) => {
    let row = piece.row;
    while (fits(piece.shape, row + 1, piece.col, board)) row++;
    return row;
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


export const updateBoard = (board, game) => {
    const ghost = new Set();
    if (activePiece) {
        const ghostRow = getGhostRow(activePiece, board);
        activePiece.shape.forEach((line, r) =>
            line.forEach((filled, c) => {
                if (filled) ghost.add(`${ghostRow + r}-${activePiece.col + c}`);
            })
        );
    }
 
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const cell = game.getElementsByClassName(`${row}-${col}`)[0];
            if (!cell) continue;
 
            cell.style.backgroundColor = "";
            cell.classList.remove("filled", "locked", "clearing", "ghost", ...TYPES);
 
            const value = board[row][col];
            if (value === 1) {
                cell.classList.add("filled", activeType);
            } else if (value === 2) {
                cell.classList.add("filled", "locked");
            } else if (ghost.has(`${row}-${col}`)) {
                cell.classList.add("ghost", activeType); // only on empty cells
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

            cell.style.backgroundColor = "";               
            cell.classList.remove("filled", ...TYPES);     

            if (filled) {
                cell.classList.add("filled", piece.type);  
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

export const flashRows = (rows, game) => {
    for (const row of rows) {
        for (let col = 0; col < COLS; col++) {
            const cell = game.getElementsByClassName(`${row}-${col}`)[0];
            if (cell) cell.classList.add("clearing");
        }
    }
};

export const removeRows = (board, rows, game) => {
    const kept = board.filter((_, index) => !rows.includes(index));
    const empty = Array.from({ length: rows.length }, () => new Array(COLS).fill(0));
    board.splice(0, board.length, ...empty, ...kept);
    updateBoard(board, game);
};