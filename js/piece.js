
import { updateBoard, boardCheck } from "./board.js";
import { isValidMove } from "./controls.js";

export const Direction = Object.freeze({
    DOWN: "down",
    LEFT: "left",
    RIGHT: "right",
    ROTATE: "rotate",
});

let onLock = () => { };
export const setOnLock = (fn) => {
    onLock = fn;
};

const pieceTypes = {
    I: { shape: [[1, 1, 1, 1]] },
    O: { shape: [[1, 1], [1, 1]] },
    T: { shape: [[0, 1, 0], [1, 1, 1]] },
    S: { shape: [[0, 1, 1], [1, 1, 0]] },
    Z: { shape: [[1, 1, 0], [0, 1, 1]] },
    J: { shape: [[1, 0, 0], [1, 1, 1]] },
    L: { shape: [[0, 0, 1], [1, 1, 1]] }
};

export class Piece {
    constructor(type, row, col) {
        this.type = type;
        this.shape = pieceTypes[type].shape.map(row => [...row]);
        this.row = row;
        this.col = col;
    }

    removePiece(board, piece) {
        for (let row = 0; row < piece.shape.length; row++) {
            for (let col = 0; col < piece.shape[row].length; col++) {
                if (piece.shape[row][col] === 1) {
                    board[piece.row + row][piece.col + col] = 0;
                }
            }
        }
    }

    rotate(board, game) {
        const rows = this.shape.length;
        const cols = this.shape[0].length;
        const rotated = [];
        const restoreShape = this.shape;

        this.removePiece(board, this);

        for (let col = cols - 1; col >= 0; col--) {
            const newRow = [];
            for (let row = 0; row < rows; row++) {
                newRow.push(this.shape[row][col]);
            }

            rotated.push(newRow);
        }
        this.shape = rotated
        if (!isValidMove(this, Direction.ROTATE, board)) {
            console.log("Not valid rotaion");
            this.shape = restoreShape;
            placePiece(this, board);
            return false;
        }

        movePiece(this.row, this.col, this, board, game);
        return true;
    }

    moveDown(board, game) {
        if (!isValidMove(this, Direction.DOWN, board)) {
            this.block(board, game);
            return false;
        }
        this.removePiece(board, this);
        this.row++;
        movePiece(this.row, this.col, this, board, game);
        return true;
    }

    moveLeft(board, game) {
        if (!isValidMove(this, Direction.LEFT, board,)) {
            return false;
        }
        this.removePiece(board, this);
        this.col--;
        movePiece(this.row, this.col, this, board, game);
        return true;

    }

    moveRight(board, game) {
        if (!isValidMove(this, Direction.RIGHT, board)) {
            return false;
        }
        this.removePiece(board, this);
        this.col++;
        movePiece(this.row, this.col, this, board, game);
        return true;
    }

    block(board, game) {
        for (let r = 0; r < this.shape.length; r++) {
            for (let c = 0; c < this.shape[r].length; c++) {

                const boardRow = this.row + r;
                const boardCol = this.col + c;

                if (board[boardRow][boardCol] === 1) {
                    board[boardRow][boardCol] = 2;
                }
            }
        }

        updateBoard(board, game);
        const lines = boardCheck(board, game);

        onLock(lines);
    }
}

export function movePiece(newRow, newCol, piece, board, game) {
    for (let row = 0; row < piece.shape.length; row++) {
        for (let col = 0; col < piece.shape[row].length; col++) {



            if (piece.shape[row][col] === 1) {
                if (row == 8 && col == 6) {
                    console.log(`${piece.shape[row][col]}`)
                }
                board[newRow + row][newCol + col] = 1;
            }
        }
    }


    updateBoard(board, game);
}



export function placePiece(piece, board) {
    for (let row = 0; row < piece.shape.length; row++) {
        for (let col = 0; col < piece.shape[row].length; col++) {
            if (piece.shape[row][col] === 1) {
                board[piece.row + row][piece.col + col] = 1;
            }
        }
    }
}

export function pieceFactory() {
    let bag = [];

    function nextType() {
        if (bag.length === 0) {
            bag = Object.keys(pieceTypes);
            // Fisher-Yates shuffle
            for (let i = bag.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [bag[i], bag[j]] = [bag[j], bag[i]];
            }
        }
        return bag.pop();
    }

    return function createRandomPiece(boardCols = 10) {
        const type = nextType();
        const width = pieceTypes[type].shape[0].length;
        const startCol = Math.floor((boardCols - width) / 2);

        return new Piece(type, 0, startCol);
    };
}