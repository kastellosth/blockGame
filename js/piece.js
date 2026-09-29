
import { updateBoard, ROWS, COLS } from "./board.js";
import { isValidMove } from "./controls.js";
export const Direction = Object.freeze({
    DOWN: "down",
    LEFT: "left",
    RIGHT: "right",
    ROTATE: "rotate",
});

export class Piece {
    constructor(shape, row, col) {
        this.shape = shape;
        this.row = row;
        this.col = col;
        this.type ;
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
        this.removePiece(board, this);
        for (let col = cols - 1; col >= 0; col--) {
            const newRow = [];

            for (let row = 0; row < rows; row++) {
                newRow.push(this.shape[row][col]);
            }

            rotated.push(newRow);
        }

        this.shape = rotated
        
        movePiece(this.row, this.col, this, board, game);
    }

    moveDown(board, game) {
        if (!isValidMove(this, Direction.DOWN, board)) {
            this.block(board, game);
            return false;
        }
        this.removePiece(board, this);
        this.row++;
        movePiece(this.row, this.col, this, board, game);
    }

    moveLeft(board, game) {
        if (!isValidMove(this, Direction.LEFT, board,)) {
            return false;
        }
        this.removePiece(board, this);
        this.col--;
        movePiece(this.row, this.col, this, board, game);

    }

    moveRight(board, game) {
        if (!isValidMove(this, Direction.RIGHT, board)) {
            return false;
        }
        this.removePiece(board, this);
        this.col++;
        movePiece(this.row, this.col, this, board, game);

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
 function pieceFactory(params) {
    
    
}

