import { pieceFactory, placePiece } from "./js/piece.js";
import {createObstacle, createBoard, updateBoard, nextElementGrid, updateNextElement, setActiveType } from "./js/board.js";
import { setupConsole } from "./js/console.js";

const game = document.querySelector("#game");
const board = createBoard(game);
const leftButton = document.querySelector("#moveLeft");
const downButton = document.querySelector("#moveDown");
const rightButton = document.querySelector("#moveRight");
const rotate = document.querySelector("#Rotate");
const next = document.querySelector("#next-piece");
const start = document.querySelector("#Start");
const pause = document.querySelector("#Pause");


setupConsole();
nextElementGrid();

const createPiece = pieceFactory();
const boardCols = board[0].length;

let currentPiece = null;
let nextPiece = createPiece(boardCols);
let gameOver = false;
let intervalId;
let score ;


export function spawnPiece() {
    currentPiece = nextPiece;
    nextPiece = createPiece(boardCols);


    /* if (collision(currentPiece, board, null)) {
         gameOver = true;
         console.log("Game over!");
         return;
     }*/

    setActiveType(currentPiece.type);
    updateNextElement(nextPiece, next);
    placePiece(currentPiece, board);
    updateBoard(board, game);
}

console.log("Game started!");

spawnPiece();

leftButton.addEventListener("click", () => {
    currentPiece.moveLeft(board, game);
});

downButton.addEventListener("click", () => {
    currentPiece.moveDown(board, game);
});

rightButton.addEventListener("click", () => {
    currentPiece.moveRight(board, game);
});


rotate.addEventListener("click", () => {
    currentPiece.rotate(board, game);
});


start.addEventListener("click", () => {
    intervalId = setInterval(() => {
    currentPiece.moveDown(board, game);
    }, 1000);
});

pause.addEventListener("click",()=>{
    clearInterval(intervalId);
});

createObstacle(board,game);















