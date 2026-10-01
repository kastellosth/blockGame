import { pieceFactory, placePiece, setOnLock } from "./js/piece.js";
import { createBoard, updateBoard, nextElementGrid, updateNextElement, setActivePiece, flashRows, removeRows, FLASH_MS } from "./js/board.js";
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
const modal = document.querySelector("#gameOverModal");
const finalScore = document.querySelector("#finalScore");
const finalLevel = document.querySelector("#finalLevel");
const finalLines = document.querySelector("#finalLines");
const playAgain = document.querySelector("#playAgain");

setupConsole();
nextElementGrid();

// One source of truth for the flash length: JS constant -> CSS variable
document.documentElement.style.setProperty("--flash-ms", `${FLASH_MS}ms`);

const createPiece = pieceFactory();
const boardCols = board[0].length;

let currentPiece = null;
let nextPiece = createPiece(boardCols);
let gameOver = false;
let clearing = false; // true while the line-clear flash is playing
let intervalId = null;
let score = 0;
let lines = 0;
let level = 1;
let isRunning = false;

const dropDelay = () => Math.max(100, 1000 - (level - 1) * 100);

function updateScoreboard() {
    if (scoreBoard) scoreBoard.textContent = score;
    if (levelBoard) levelBoard.textContent = level;
    if (linesBoard) linesBoard.textContent = lines;
}

function showGameOver() {
    finalScore.textContent = score;
    finalLevel.textContent = level;
    finalLines.textContent = lines;
    modal.hidden = false;
}

function stopLoop() {
    clearInterval(intervalId);
    intervalId = null;
    isRunning = false;
}

function startLoop() {
    stopLoop();
    isRunning = true;
    intervalId = setInterval(() => {
        if (!gameOver && !clearing) currentPiece.moveDown(board, game, isRunning);
    }, dropDelay());
}

function spawnPiece() {
    currentPiece = nextPiece;
    nextPiece = createPiece(boardCols);

    if (collision(currentPiece, board, null)) {
        gameOver = true;
        stopLoop();
        console.log("Game over!");
        showGameOver();
        return;
    }

    setActivePiece(currentPiece);
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
    clearing = false;
    modal.hidden = true;
    updateScoreboard();
    updateBoard(board, game);
    nextPiece = createPiece(boardCols);
    spawnPiece();
}

function softDrop() {
    if (gameOver || clearing) return;
    if (currentPiece.moveDown(board, game, isRunning)) {
        score += 1;
        updateScoreboard();
    }
}

function startGame() {
    if (clearing) return;
    if (gameOver) resetGame();
    startLoop();
}

// Called by piece.js when a piece locks. It receives the indexes of full rows.
setOnLock((fullRows) => {
    if (fullRows.length === 0) {
        spawnPiece();
        return;
    }

    clearing = true;
    flashRows(fullRows, game);

    setTimeout(() => {
        removeRows(board, fullRows, game);

        const cleared = fullRows.length;
        score += scorePoints(cleared, level);
        lines += cleared;

        const newLevel = Math.floor(lines / 10) + 1;
        if (newLevel !== level) {
            level = newLevel;
            if (intervalId !== null) startLoop();
        }

        clearing = false;
        updateScoreboard();
        spawnPiece();
    }, FLASH_MS);
});

updateScoreboard();
spawnPiece();

leftButton.addEventListener("click", () => {
    if (!gameOver && !clearing) currentPiece.moveLeft(board, game, isRunning);
});

downButton.addEventListener("click", softDrop);

rightButton.addEventListener("click", () => {
    if (!gameOver && !clearing) currentPiece.moveRight(board, game, isRunning);
});

rotate.addEventListener("click", () => {
    if (!gameOver && !clearing) currentPiece.rotate(board, game, isRunning);
});

start.addEventListener("click", startGame);
playAgain.addEventListener("click", startGame);
pause.addEventListener("click", stopLoop);

// don't leave buttons focused, so Space/Enter don't re-click them
document.querySelectorAll("button").forEach((btn) => {
    btn.addEventListener("click", () => btn.blur());
});

document.addEventListener("keydown", gameControls);

function gameControls(event) {
    if (clearing) return;

    switch (event.code) {
        case "KeyW":
            currentPiece.rotate(board, game, isRunning);
            break;
        case "KeyA":
            currentPiece.moveLeft(board, game, isRunning);
            break;
        case "KeyS":
            softDrop();
            break;
        case "KeyD":
            currentPiece.moveRight(board, game, isRunning);
            break;
        case "ArrowLeft":
            event.preventDefault();
            currentPiece.moveLeft(board, game, isRunning);
            break;
        case "ArrowRight":
            event.preventDefault();
            currentPiece.moveRight(board, game, isRunning);
            break;
        case "ArrowDown":
            event.preventDefault();
            softDrop();
            break;
        case "ArrowUp":
            event.preventDefault();
            currentPiece.rotate(board, game, isRunning);
            break;
        case "Space":
            event.preventDefault();
            stopLoop();
            break;
        case "Enter":
            event.preventDefault();
            startGame();
            break;
    }
}