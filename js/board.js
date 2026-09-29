export const ROWS = 20;
export const COLS = 10;


export const createBoard  = (game)  => {
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
   for(let col =0 ; col<COLS; col++){
        board[8][col]=2;
    }
    board[8][5]=0;
    updateBoard(board, game);
}

export const updateBoard = (board, game) => {
    for (let row = 0; row < ROWS; row++) {
        for (let col = 0; col < COLS; col++) {
            const cell = game.getElementsByClassName(`${row}-${col}`)[0];
            if (cell) {
                cell.style.backgroundColor = board[row][col] === 1 ? "red" : board[row][col] === 2 ? "gray" : "black";
            }
        }
    }
}


export const nextElement = (next = document.getElementById("next-piece")) => {
    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
            const cell = document.createElement("div");
            cell.classList.add("next-cell");
            next.appendChild(cell);
        }
    }
}