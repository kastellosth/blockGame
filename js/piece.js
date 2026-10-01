
import { updateBoard, findFullRows } from "./board.js";
import { canPlace, isValidMove } from "./controls.js";
import { EMPTY, FALLING, LOCKED} from "./constants.js";

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

const rotateShape = (shape) =>
    shape[0].map((_, c) => shape.map((row) => row[c])).reverse();

export class Piece {
    constructor(type, row, col) {
        this.type = type;
        this.shape = pieceTypes[type].shape.map(row => [...row]);
        this.row = row;
        this.col = col;
    }

    removePiece(board, this) {
        for (let row = 0; row < this.shape.length; row++) {
            for (let col = 0; col < this.shape[row].length; col++) {
                if (this.shape[row][col] === 1) {
                    board[this.row + row][this.col + col] = EMPTY;
                }
            }
        }
    }

    rotate(board, game, isRunning) {
        if (!isRunning) return false;
       
        const rotated = rotateShape(this.shape);
        this.removePiece(board, this);
        if (!canPlace(rotated, this.row, this.col, board)) {
            placePiece(this, board);
            return false;
        }
        this.shape = rotated;
        movePiece(this.row, this.col, this, board, game);
        return true;
    }

    moveDown(board, game, isRunning) {
        if (!isRunning) return false;
        if (!canPlace(this.shape, this.row + 1, this.col, board)) {
            this.block(board, game);
            return false;
        }
        this.removePiece(board, this);
        this.row++;
        movePiece(this.row, this.col, this, board, game);
        return true;
    }

    moveLeft(board, game, isRunning) {
        if (!isRunning || !canPlace(this.shape, this.row, this.col - 1, board)) {
            return false;
        }
        this.removePiece(board, this);
        this.col--;
        movePiece(this.row, this.col, this, board, game);
        return true;

    }

    moveRight(board, game, isRunning) {
        if (!isRunning || !canPlace(this.shape, this.row, this.col + 1, board)) {
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

                if (board[boardRow][boardCol] === FALLING) {
                    board[boardRow][boardCol] = LOCKED;
                }
            }
        }

        updateBoard(board, game);
        onLock(findFullRows(board));
    }
}

export function movePiece(newRow, newCol, piece, board, game) {
    for (let row = 0; row < piece.shape.length; row++) {
        for (let col = 0; col < piece.shape[row].length; col++) {
            if (piece.shape[row][col] === 1) {
                board[newRow + row][newCol + col] = FALLING;
            }
        }
    }
    updateBoard(board, game);
}



export function placePiece(piece, board) {
    for (let row = 0; row < piece.shape.length; row++) {
        for (let col = 0; col < piece.shape[row].length; col++) {
            if (piece.shape[row][col] === 1) {
                board[piece.row + row][piece.col + col] = FALLING;
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


