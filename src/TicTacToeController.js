import { TicTacToe, GameMode, Player, GameStatus } from "./TicTacToe.js";
const THEMES = [
    ['#fff4a3', '#000'],
    ['#96d4d4', '#000'],
    ['#d9eee1', '#000'],
    ['#ffc0c7', '#000']
];
var singlePlayerBtn;
var multiplayerBtn;
var restartGameBtn;
var resetScoreboardBtn;
var gameOverMessage;
var scoreboardElement;
var board;
var boardContext;
var currentGameMode;
var scoreboard;
var leftScore;
var rightScore;
var ticTacToe;
var isGameOver;
var currentThemeIndex;
var gameOverMessage;
window.onload = () => {
    singlePlayerBtn = document.getElementById("single-player-btn");
    multiplayerBtn = document.getElementById("multiplayer-btn");
    restartGameBtn = document.getElementById("restart-game-btn");
    resetScoreboardBtn = document.getElementById("reset-scoreboard-btn");
    gameOverMessage = document.getElementById("game-over-message");
    board = document.getElementById("board");
    leftScore = document.getElementById("left-score");
    rightScore = document.getElementById("right-score");
    scoreboardElement = document.getElementById("scoreboard");
    gameOverMessage = document.getElementById('game-over-message');
    boardContext = board.getContext('2d');
    currentGameMode = GameMode.SinglePlayer;
    scoreboard = [0, 0];
    leftScore.innerHTML = Player.Max + "&nbsp;&nbsp;&nbsp;&nbsp;" + String(scoreboard[0]).padStart(2, '0');
    rightScore.innerHTML = String(scoreboard[1]).padStart(2, '0') + "&nbsp;&nbsp;&nbsp;&nbsp;" + Player.Min;
    setEventHandlers();
    initGame();
    setRandomTheme();
};
function setEventHandlers() {
    restartGameBtn.onclick = initGame;
    resetScoreboardBtn.onclick = () => {
        initGame();
        resetScoreboard();
    };
    singlePlayerBtn.onclick = () => { changeGameMode(GameMode.SinglePlayer); };
    multiplayerBtn.onclick = () => { changeGameMode(GameMode.Multiplayer); };
    board.addEventListener('mousedown', (e) => {
        play(resolveClickedSquare(board, e));
    });
}
function initGame() {
    // Initialize new game.
    ticTacToe = new TicTacToe(currentGameMode, true);
    isGameOver = false;
    // Clear game over message while maintaining the empty space.
    gameOverMessage.innerHTML = "&nbsp;";
    // Redraw board.
    boardContext.clearRect(0, 0, board.width, board.height);
    boardContext.strokeStyle = 'black';
    boardContext.lineWidth = 4;
    drawLine(100, 0, 100, 300);
    drawLine(200, 0, 200, 300);
    drawLine(0, 100, 300, 100);
    drawLine(0, 200, 300, 200);
}
function drawLine(fromX, fromY, toX, toY) {
    boardContext.beginPath();
    boardContext.moveTo(fromX, fromY);
    boardContext.lineTo(toX, toY);
    boardContext.stroke();
}
function resetScoreboard() {
    scoreboard = [0, 0];
    leftScore.innerHTML = Player.Max + "&nbsp;&nbsp;&nbsp;&nbsp;" + String(scoreboard[0]).padStart(2, '0');
    rightScore.innerHTML = String(scoreboard[1]).padStart(2, '0') + "&nbsp;&nbsp;&nbsp;&nbsp;" + Player.Min;
    leftScore.style.fontSize = "32px";
    rightScore.style.fontSize = "32px";
}
function changeGameMode(gameMode) {
    if (gameMode == GameMode.SinglePlayer) {
        singlePlayerBtn.style.borderBottomColor = THEMES[currentThemeIndex][0];
        multiplayerBtn.style.borderBottomColor = "transparent";
    }
    else if (gameMode == GameMode.Multiplayer) {
        singlePlayerBtn.style.borderBottomColor = "transparent";
        multiplayerBtn.style.borderBottomColor = THEMES[currentThemeIndex][0];
    }
    currentGameMode = gameMode;
    initGame();
    resetScoreboard();
}
function resolveClickedSquare(board, event) {
    var rect;
    var x;
    var y;
    // Get canvas size and position relative to the viewport.
    rect = board.getBoundingClientRect();
    // Get coordinates relative to the canvas.
    x = event.clientX - rect.left;
    y = event.clientY - rect.top;
    // Get grid coordinates.
    x = Math.floor(x / (board.width / 3));
    y = Math.floor(y / (board.height / 3));
    // Return the array index corresponding
    // to the square that was clicked.
    return x + (y * 3);
}
function play(square) {
    if (!isGameOver) {
        ticTacToe.play(square);
        updateBoard();
        handleGameStatus(ticTacToe.getGameStatus(ticTacToe.board));
    }
}
function updateBoard() {
    ticTacToe.board.forEach((square, i) => {
        if (square == Player.Max) {
            drawXInSquare(i);
        }
        else if (square == Player.Min) {
            drawOInSquare(i);
        }
    });
}
function drawXInSquare(square) {
    var coord = squareToUpperLeftCoordinate(square);
    var squareWidth = board.width / 3;
    var margin = 15;
    boardContext.lineWidth = 3;
    drawLine(coord[0] + margin, // From X
    coord[1] + margin, // From Y
    coord[0] + squareWidth - margin, // To X
    coord[1] + squareWidth - margin // To Y
    );
    drawLine(coord[0] + squareWidth - margin, // From X
    coord[1] + margin, // From Y
    coord[0] + margin, // To X
    coord[1] + squareWidth - margin // To Y
    );
}
function drawOInSquare(square) {
    var coord = squareToUpperLeftCoordinate(square);
    var halfSquareWidth = board.width / 6;
    var margin = 15;
    boardContext.lineWidth = 3;
    boardContext.beginPath();
    boardContext.arc(coord[0] + halfSquareWidth, // Center X
    coord[1] + halfSquareWidth, // Center Y
    halfSquareWidth - margin, // Radius
    0, // Start angle
    2 * Math.PI // End angle
    );
    boardContext.stroke();
}
function squareToUpperLeftCoordinate(square) {
    var x = (square % 3) * Math.floor(board.width / 3);
    var y = Math.floor(square / 3) * Math.floor(board.height / 3);
    return [x, y];
}
function handleGameStatus(gameStatus) {
    if (gameStatus == GameStatus.InProgress) {
        return;
    }
    isGameOver = true;
    switch (gameStatus) {
        case GameStatus.Draw:
            gameOverMessage.innerHTML = "DRAW";
            break;
        case GameStatus.MaxWin:
            gameOverMessage.innerHTML = Player.Max + " WINS";
            scoreboard[0]++;
            leftScore.innerHTML = Player.Max + "&nbsp;&nbsp;&nbsp;&nbsp;" + String(scoreboard[0]).padStart(2, '0');
            break;
        case GameStatus.MinWin:
            gameOverMessage.innerHTML = Player.Min + " WINS";
            scoreboard[1]++;
            rightScore.innerHTML = String(scoreboard[1]).padStart(2, '0') + "&nbsp;&nbsp;&nbsp;&nbsp;" + Player.Min;
            break;
    }
    leftScore.style.fontSize = (scoreboard[0] < scoreboard[1]) ? "25px" : "32px";
    rightScore.style.fontSize = (scoreboard[1] < scoreboard[0]) ? "25px" : "32px";
}
function setRandomTheme() {
    var randomThemeIndex = Math.floor(Math.random() * THEMES.length);
    restartGameBtn.style.backgroundColor = THEMES[randomThemeIndex][0];
    restartGameBtn.style.color = THEMES[randomThemeIndex][1];
    scoreboardElement.style.backgroundColor = THEMES[randomThemeIndex][0];
    scoreboardElement.style.color = THEMES[randomThemeIndex][1];
    if (currentGameMode == GameMode.SinglePlayer) {
        singlePlayerBtn.style.borderBottomColor = THEMES[randomThemeIndex][0];
    }
    else {
        multiplayerBtn.style.borderBottomColor = THEMES[randomThemeIndex][0];
    }
    currentThemeIndex = randomThemeIndex;
}
