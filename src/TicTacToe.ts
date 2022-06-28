export enum GameMode {
    SinglePlayer,
    Multiplayer
}

export enum GameStatus {
    InProgress,
    Draw,
    MaxWin,
    MinWin
}

export enum Player {
    None = ' ',
    Max = 'X',
    Min = 'O'
}

export class TicTacToe {
    public gameMode: GameMode;
    public isMaxTurn: boolean;
    public board: Array<Player>;

    constructor(gameMode: GameMode, isMaxTurn: boolean) {
        this.gameMode = gameMode;
        this.isMaxTurn = isMaxTurn;
        this.board = [
            Player.None, Player.None, Player.None,
            Player.None, Player.None, Player.None,
            Player.None, Player.None, Player.None
        ];
    }

    public play(square: number): void {
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

    private counterPlay(): void {
        var boardTemp: Array<Player> = [];
        var isMaxTurnTemp = this.isMaxTurn;
        var bestPlaySquare = -1;
        var depth: number;
        // var depth = this.getDepth(this.board);
        var bestPossibleScore: number;
        // var bestPossibleScore = (this.isMaxTurn) ? depth : -depth;
        var bestScore: number;
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

    private minimax(board: Array<Player>, isMaxTurn: boolean, depth: number, alpha: number, beta: number): number {
        var bestPossibleScore = (isMaxTurn) ? depth : -depth;
        var bestScore = -bestPossibleScore;
        var score = 0;
        var gameStatus: GameStatus;

        for (var i = 0; i < board.length; i++) {
            if (board[i] == Player.None) {
                board[i] = (isMaxTurn) ? Player.Max : Player.Min;

                gameStatus = this.getGameStatus(board);

                if (gameStatus != GameStatus.InProgress) {
                    if (gameStatus == GameStatus.Draw) {
                        bestScore = 0;
                    } else if (gameStatus == GameStatus.MaxWin ||
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
                } else {
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

    public getDepth(board: Array<Player>): number {
        var depth = 0;

        board.forEach((square: Player) => {
            if (square == Player.None) {
                depth++;
            }
        });
        
        return depth;
    }

    public getGameStatus(board: Array<Player>): GameStatus {
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
