export var GameMode;
(function (GameMode) {
    GameMode[GameMode["SinglePlayer"] = 0] = "SinglePlayer";
    GameMode[GameMode["Multiplayer"] = 1] = "Multiplayer";
})(GameMode || (GameMode = {}));
export var GameStatus;
(function (GameStatus) {
    GameStatus[GameStatus["InProgress"] = 0] = "InProgress";
    GameStatus[GameStatus["Draw"] = 1] = "Draw";
    GameStatus[GameStatus["MaxWin"] = 2] = "MaxWin";
    GameStatus[GameStatus["MinWin"] = 3] = "MinWin";
})(GameStatus || (GameStatus = {}));
export var Player;
(function (Player) {
    Player["None"] = " ";
    Player["Max"] = "X";
    Player["Min"] = "O";
})(Player || (Player = {}));
export class TicTacToe {
    constructor(gameMode, isMaxTurn) {
        this.gameMode = gameMode;
        this.isMaxTurn = isMaxTurn;
        this.board = [
            Player.None, Player.None, Player.None,
            Player.None, Player.None, Player.None,
            Player.None, Player.None, Player.None
        ];
    }
    play(square) {
        // Return if the selected square is not empty.
        if (this.board[square] != Player.None) {
            return;
        }
        // Make player's move on the board.
        this.board[square] = (this.isMaxTurn) ? Player.Max : Player.Min;
        this.isMaxTurn = !this.isMaxTurn; // Change turn.
        if (this.getGameStatus(this.board) != GameStatus.InProgress) {
            return;
        }
        if (this.gameMode == GameMode.SinglePlayer) {
            this.counterPlay();
        }
    }
    counterPlay() {
        var boardTemp = [];
        var isMaxTurnTemp = this.isMaxTurn;
        var bestPlaySquare = -1;
        var depth;
        // var depth = this.getDepth(this.board);
        var bestPossibleScore;
        // var bestPossibleScore = (this.isMaxTurn) ? depth : -depth;
        var bestScore;
        var score = 0;
        var alpha = -Infinity; // The minimum score the Maximizer is granted to have.
        var beta = Infinity; // The maximum score the Minimizer is granted to have.
        this.board.forEach((square) => boardTemp.push(square));
        depth = this.getDepth(boardTemp);
        bestPossibleScore = (isMaxTurnTemp) ? depth : -depth;
        bestScore = -bestPossibleScore;
        for (var i = 0; i < boardTemp.length; i++) {
            if (boardTemp[i] == Player.None) {
                boardTemp[i] = Player.Min;
                if (this.getGameStatus(boardTemp) != GameStatus.InProgress) {
                    bestPlaySquare = i;
                    break;
                }
                isMaxTurnTemp = !isMaxTurnTemp; // Change turn;
                score = this.minimax(boardTemp, isMaxTurnTemp, depth - 1, alpha, beta);
                boardTemp[i] = Player.None; // Restore original value of the square.
                isMaxTurnTemp = !isMaxTurnTemp; // Change turn;
                if ((isMaxTurnTemp && score > bestScore) ||
                    (!isMaxTurnTemp && score < bestScore)) {
                    bestScore = score;
                    bestPlaySquare = i;
                    if (bestScore == bestPossibleScore) {
                        break;
                    }
                }
            }
        }
        // Make the best move in the current board.
        this.board[bestPlaySquare] = (this.isMaxTurn) ? Player.Max : Player.Min;
        this.isMaxTurn = !this.isMaxTurn; // Change turn.
    }
    minimax(board, isMaxTurn, depth, alpha, beta) {
        var bestPossibleScore = (isMaxTurn) ? depth : -depth;
        var bestScore = -bestPossibleScore;
        var score = 0;
        var gameStatus;
        for (var i = 0; i < board.length; i++) {
            if (board[i] == Player.None) {
                board[i] = (isMaxTurn) ? Player.Max : Player.Min;
                gameStatus = this.getGameStatus(board);
                if (gameStatus != GameStatus.InProgress) {
                    if (gameStatus == GameStatus.Draw) {
                        bestScore = 0;
                    }
                    else if (gameStatus == GameStatus.MaxWin ||
                        gameStatus == GameStatus.MinWin) {
                        bestScore = bestPossibleScore;
                    }
                    board[i] = Player.None; // Restore original value of the square.
                    break;
                }
                isMaxTurn = !isMaxTurn; // Change turn.
                score = this.minimax(board, isMaxTurn, depth - 1, alpha, beta);
                isMaxTurn = !isMaxTurn; // Change turn.
                board[i] = Player.None; // Restore original value of the square.
                // AlphaBeta pruning.
                if (isMaxTurn) {
                    bestScore = Math.max(bestScore, score);
                    alpha = bestScore;
                    if (bestScore > beta) {
                        // Beta is minimizer's best current score, if maximizer's
                        // best score is greater than beta there is no point in
                        // continuing with the simulation because minimizer
                        // is aiming to get the lowest possible score and maximizer's
                        // best score will only go higher.
                        break;
                    }
                }
                else {
                    bestScore = Math.min(bestScore, score);
                    beta = bestScore;
                    if (bestScore < alpha) {
                        // Alpha is maximizer's best current score, if minimizer's
                        // best score is lower than alpha there is no point in
                        // continuing with the simulation because maximizer
                        // is aiming to get the highest possible score and minimizer's
                        // best score will only go lower.
                        break;
                    }
                }
            }
        }
        return bestScore;
    }
    getDepth(board) {
        var depth = 0;
        board.forEach((square) => {
            if (square == Player.None) {
                depth++;
            }
        });
        return depth;
    }
    getGameStatus(board) {
        // Check the rows of the board.
        for (var i = 0; i < 9; i += 3) {
            if (board[i] == board[i + 1] && board[i] == board[i + 2] && board[i] != ' ') {
                return (board[i] == Player.Max) ? GameStatus.MaxWin : GameStatus.MinWin;
            }
        }
        // Check the columns of the board.
        for (var i = 0; i < 3; i++) {
            if (board[i] == board[i + 3] && board[i] == board[i + 6] && board[i] != ' ') {
                return (board[i] == Player.Max) ? GameStatus.MaxWin : GameStatus.MinWin;
            }
        }
        // Check diagonal starting from the top left corner.
        if (board[0] == board[4] && board[0] == board[8] && board[0] != ' ') {
            return (board[0] == Player.Max) ? GameStatus.MaxWin : GameStatus.MinWin;
        }
        // Check diagonal starting from the top right corner.
        if (board[2] == board[4] && board[2] == board[6] && board[2] != ' ') {
            return (board[2] == Player.Max) ? GameStatus.MaxWin : GameStatus.MinWin;
        }
        // Check if the board is full of tiles.
        for (var i = 0; i < 9; i++) {
            if (board[i] == ' ') {
                return GameStatus.InProgress;
            }
        }
        // If none of the above conditions are met it's a draw.
        return GameStatus.Draw;
    }
}
