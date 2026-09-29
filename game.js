import { Piece ,pieceTypes } from "./js/piece.js";
import { createBoard, updateBoard, createObstacle ,nextElement } from "./js/board.js";
import { setupConsole } from "./js/console.js";
const game = document.querySelector("#game");
const board = createBoard(game);
const leftButton = document.querySelector("#moveLeft");
const downButton = document.querySelector("#moveDown");
const rightButton = document.querySelector("#moveRight");
const rotate=document.querySelector("#Rotate");

nextElement();


setupConsole();

console.log("Game started!");
const piece1=new Piece("T", 0, 3);
leftButton.addEventListener("click", () => {
    piece1.moveLeft(board, game);
});

downButton.addEventListener("click", () => {
    piece1.moveDown(board, game);
});

rightButton.addEventListener("click", () => {
    piece1.moveRight(board, game);
});


rotate.addEventListener("click", () => {
    piece1.rotate(board, game);
});


function placePiece(piece1) {
    for (let row = 0; row < piece1.shape.length; row++) {
        for (let col = 0; col < piece1.shape[row].length; col++) {
            if (piece1.shape[row][col] === 1) {
                board[piece1.row + row][piece1.col + col] = 1;
            }
        }
    }
}
placePiece(piece1);
updateBoard(board, game);

setTimeout(() => {
    createObstacle(board, game);
}, 1000);








