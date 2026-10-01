import { ROWS, COLS  ,LOCKED} from "./constants.js";

const LINE_POINTS = [0, 100, 300, 500, 800];



export const scorePoints = (lines, level) => {
    return (LINE_POINTS[lines] || 0) * level;
};


export function canPlace(shape, row, col, board) {    
    return shape.every((line,r) => {
        return line.every((cell, c) => {
            if (cell) {
                const boardRow = row + r; 
                const boardCol = col + c;
                if (boardRow < 0 || boardRow >= ROWS || boardCol < 0 || boardCol >= COLS || board[boardRow][boardCol] === LOCKED) {
                    return false;
                }
                return true;
            } return true;
            
        });
    });
    
}