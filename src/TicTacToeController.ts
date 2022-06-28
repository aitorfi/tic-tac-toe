import { TicTacToe, GameMode, Player, GameStatus } from "./TicTacToe.js";

const THEMES = [
    ['#fff4a3', '#000'],
    ['#96d4d4', '#000'],
    ['#d9eee1', '#000'],
    ['#ffc0c7', '#000']
];

var singlePlayerBtn: HTMLButtonElement;
var multiplayerBtn: HTMLButtonElement;
var restartGameBtn: HTMLButtonElement;
var resetScoreboardBtn: HTMLButtonElement;
var gameOverMessage: HTMLHeadingElement;
var scoreboardElement: HTMLDivElement;
var board: HTMLCanvasElement;
var boardContext: CanvasRenderingContext2D;
var currentGameMode: GameMode;
var scoreboard: Array<number>;
var leftScore: HTMLSpanElement;
var rightScore: HTMLSpanElement;
var ticTacToe: TicTacToe;
var isGameOver: boolean;
var currentThemeIndex: number;
var gameOverMessage: HTMLHeadingElement;

window.onload = () => {
    singlePlayerBtn = document.getElementById("single-player-btn") as HTMLButtonElement;
    multiplayerBtn = document.getElementById("multiplayer-btn") as HTMLButtonElement;
    restartGameBtn = document.getElementById("restart-game-btn") as HTMLButtonElement;
    resetScoreboardBtn = document.getElementById("reset-scoreboard-btn") as HTMLButtonElement;
    gameOverMessage = document.getElementById("game-over-message") as HTMLHeadingElement;
    board = document.getElementById("board") as HTMLCanvasElement;
    leftScore = document.getElementById("left-score") as HTMLSpanElement;
    rightScore = document.getElementById("right-score") as HTMLSpanElement;
    scoreboardElement = document.getElementById("scoreboard") as HTMLDivElement;
    gameOverMessage = document.getElementById('game-over-message') as HTMLHeadingElement;

    boardContext = board.getContext('2d') as CanvasRenderingContext2D;
    currentGameMode = GameMode.SinglePlayer;
    scoreboard = [0, 0];

    leftScore.innerHTML = Player.Max + "&nbsp;&nbsp;&nbsp;&nbsp;" + String(scoreboard[0]).padStart(2, '0');
    rightScore.innerHTML = String(scoreboard[1]).padStart(2, '0') + "&nbsp;&nbsp;&nbsp;&nbsp;" + Player.Min;

    setEventHandlers();
    initGame();
    setRandomTheme();
}

function setEventHandlers(): void {
    restartGameBtn.onclick = initGame;
    resetScoreboardBtn.onclick = () => {
        initGame();
        resetScoreboard();
    }

    singlePlayerBtn.onclick = () => { changeGameMode(GameMode.SinglePlayer); }
    multiplayerBtn.onclick = () => { changeGameMode(GameMode.Multiplayer); }

    board.addEventListener('mousedown', (e) => {
        play(resolveClickedSquare(board, e));
    });
}

function initGame(): void {
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

function drawLine(fromX: number, fromY: number, toX: number, toY: number): void {
    boardContext.beginPath();
    boardContext.moveTo(fromX, fromY);
    boardContext.lineTo(toX, toY);
    boardContext.stroke();
}

function resetScoreboard(): void {
    scoreboard = [0, 0];

    leftScore.innerHTML = Player.Max + "&nbsp;&nbsp;&nbsp;&nbsp;" + String(scoreboard[0]).padStart(2, '0');
    rightScore.innerHTML = String(scoreboard[1]).padStart(2, '0') + "&nbsp;&nbsp;&nbsp;&nbsp;" + Player.Min;

    leftScore.style.fontSize = "32px";
    rightScore.style.fontSize = "32px";
}

function changeGameMode(gameMode: GameMode): void {
    if (gameMode == GameMode.SinglePlayer) {
        singlePlayerBtn.style.borderBottomColor = THEMES[currentThemeIndex][0];
        multiplayerBtn.style.borderBottomColor = "transparent";
    } else if (gameMode == GameMode.Multiplayer) {
        singlePlayerBtn.style.borderBottomColor = "transparent";
        multiplayerBtn.style.borderBottomColor = THEMES[currentThemeIndex][0];
    }

    currentGameMode = gameMode;
    
    initGame();
    resetScoreboard();
}

function resolveClickedSquare(board: HTMLCanvasElement, event: MouseEvent): number {
    var rect: DOMRect;
    var x: number;
    var y: number;

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

function play(square: number): void {
    if (!isGameOver) {
        ticTacToe.play(square);
        updateBoard();
        handleGameStatus(ticTacToe.getGameStatus(ticTacToe.board));
    }
}

function updateBoard(): void {
    ticTacToe.board.forEach((square, i) => {
        if (square == Player.Max) {
            drawXInSquare(i);
        } else if (square == Player.Min) {
            drawOInSquare(i);
        }
    });
}

function drawXInSquare(square: number): void {
    var coord = squareToUpperLeftCoordinate(square);
    var squareWidth = board.width / 3;
    var margin = 15;

    boardContext.lineWidth = 3;

    drawLine(
        coord[0] + margin, // From X
        coord[1] + margin, // From Y
        coord[0] + squareWidth - margin, // To X
        coord[1] + squareWidth - margin // To Y
    );

    drawLine(
        coord[0] + squareWidth - margin, // From X
        coord[1] + margin, // From Y
        coord[0] + margin, // To X
        coord[1] + squareWidth - margin // To Y
    );
}

function drawOInSquare(square: number): void {
    var coord = squareToUpperLeftCoordinate(square);
    var halfSquareWidth = board.width / 6;
    var margin = 15;

    boardContext.lineWidth = 3;

    boardContext.beginPath();

    boardContext.arc(
        coord[0] + halfSquareWidth, // Center X
        coord[1] + halfSquareWidth, // Center Y
        halfSquareWidth - margin, // Radius
        0, // Start angle
        2 * Math.PI // End angle
    );

    boardContext.stroke();
}

function squareToUpperLeftCoordinate(square: number): Array<number> {
    var x = (square % 3) * Math.floor(board.width / 3);
    var y = Math.floor(square / 3) * Math.floor(board.height / 3);

    return [x, y];
}

function handleGameStatus(gameStatus: GameStatus): void {
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

function setRandomTheme(): void {
    var randomThemeIndex = Math.floor(Math.random() * THEMES.length);

    restartGameBtn.style.backgroundColor = THEMES[randomThemeIndex][0];
    restartGameBtn.style.color = THEMES[randomThemeIndex][1];
    scoreboardElement.style.backgroundColor = THEMES[randomThemeIndex][0];
    scoreboardElement.style.color = THEMES[randomThemeIndex][1];

    if (currentGameMode == GameMode.SinglePlayer) {
        singlePlayerBtn.style.borderBottomColor = THEMES[randomThemeIndex][0];
    } else {
        multiplayerBtn.style.borderBottomColor = THEMES[randomThemeIndex][0];
    }

    currentThemeIndex = randomThemeIndex;
}
