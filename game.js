import { pieceFactory, placePiece, setOnLock } from "./js/piece.js";
import { createBoard, updateBoard, nextElementGrid, updateNextElement, setActiveType } from "./js/board.js";
import { collision, scorePoints } from "./js/controls.js";
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
const scoreBoard = document.querySelector("#score");
const levelBoard = document.querySelector("#level"); 
const linesBoard = document.querySelector("#lines"); 

setupConsole();
nextElementGrid();

const createPiece = pieceFactory();
const boardCols = board[0].length;

let currentPiece = null;
let nextPiece = createPiece(boardCols);
let gameOver = false;
let intervalId = null;
let score = 0;
let lines = 0;
let level = 1;

const dropDelay = () => Math.max(100, 1000 - (level - 1) * 100);

function updateScoreboard() {
    if (scoreBoard) scoreBoard.textContent = score;
    if (levelBoard) levelBoard.textContent = level;
    if (linesBoard) linesBoard.textContent = lines;
}

function stopLoop() {
    clearInterval(intervalId);
    intervalId = null;
}

function startLoop() {
    stopLoop();
    intervalId = setInterval(() => {
        if (!gameOver) currentPiece.moveDown(board, game);
    }, dropDelay());
}

function spawnPiece() {
    currentPiece = nextPiece;
    nextPiece = createPiece(boardCols);

    if (collision(currentPiece, board, null)) {
        gameOver = true;
        stopLoop();
        console.log("Game over!");
        return;
    }

    setActiveType(currentPiece.type);
    updateNextElement(nextPiece, next);
    placePiece(currentPiece, board);
    updateBoard(board, game);
}

function resetGame() {
    for (const row of board) row.fill(0);
    score = 0;
    lines = 0;
    level = 1;
    gameOver = false;
    updateScoreboard();
    nextPiece = createPiece(boardCols);
    spawnPiece();
}

setOnLock((cleared) => {
    if (cleared > 0) {
        score += scorePoints(cleared, level);
        lines += cleared;

        const newLevel = Math.floor(lines / 10) + 1;
        if (newLevel !== level) {
            level = newLevel;
            if (intervalId !== null) startLoop(); 
        }
        updateScoreboard();
    }
    spawnPiece();
});

console.log("Game started!");
updateScoreboard();
spawnPiece();

leftButton.addEventListener("click", () => {
    if (!gameOver) currentPiece.moveLeft(board, game);
});

downButton.addEventListener("click", () => {
    if (gameOver) return;
    if (currentPiece.moveDown(board, game)) {
        score += 1; // soft drop bonus
        updateScoreboard();
    }
});

rightButton.addEventListener("click", () => {
    if (!gameOver) currentPiece.moveRight(board, game);
});

rotate.addEventListener("click", () => {
    if (!gameOver) currentPiece.rotate(board, game);
});

start.addEventListener("click", () => {
    if (gameOver) resetGame();
    startLoop();
});

pause.addEventListener("click", stopLoop);