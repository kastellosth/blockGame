import { Direction } from "./piece.js";
import { ROWS, COLS } from "./board.js";
export function collision(piece, board, direction) {
    let newRow = piece.row;
    let newCol = piece.col;
    switch (direction) {
        case Direction.DOWN:
            newRow++;
            break;
        case Direction.LEFT:
            newCol--;
            break;
        case Direction.RIGHT:
            newCol++;
            break;
        default:
            break;
    }
    for (let row = 0; row < piece.shape.length; row++) {
        for (let col = 0; col < piece.shape[row].length; col++) {
            if (piece.shape[row][col] === 1 && board[newRow + row][newCol + col] === 2) {
                console.error("collision")
                return true;
            }
        }
    }
    return false;
}


export function isValidMove(piece, direcion, board) {
    switch (direcion) {
        case Direction.RIGHT:
            if (piece.col + piece.shape[0].length >= COLS || collision(piece, board, Direction.RIGHT)) {
                console.log(`Out of ${direcion} bounds.`)
                return false;
            }
            break;
        case Direction.LEFT:
            if (piece.col - 1 < 0 || collision(piece, board, Direction.LEFT)) {
                console.log(`Out of ${direcion} bounds.`)
                return false;
            }
            break;
        case Direction.DOWN:
            if (piece.row + piece.shape.length >= ROWS || collision(piece, board, Direction.DOWN)) {
                console.log(`Out of ${direcion} bounds.`)
                return false;
            }
            break;
        case Direction.ROTATE:
            if (
                piece.row + piece.shape.length > ROWS ||
                piece.col + piece.shape[0].length > COLS ||
                collision(piece, board, Direction.ROTATE)
            )
                return false;
            break;
        default: return true;
    }

    return true;
}
