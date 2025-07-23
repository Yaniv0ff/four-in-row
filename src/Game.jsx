import React from "react";

class Game extends React.Component {
    state = {
        rows: 6,
        cols: 7,
        board: [],
        currentPlayer: 1,
        winner: null,
        colors: ["RED", "BLUE", "YELLOW", "GREEN"],
        player1Color: "",
        player2Color: "",
        player1Score: 0,
        player2Score: 0,
    }

    componentDidMount() {
        const board = [];
        for (let i = 0; i < this.state.rows; i++) {
            const row = [];
            for (let j = 0; j < this.state.cols; j++) {
                row.push("");
            }
            board.push(row);
        }
        this.setState({board});
    }

    handleClick = (columnIndex) => {
        if (this.state.winner || !this.state.player1Color || !this.state.player2Color) return;

        const board = this.state.board.map(row => row.slice());
        for (let i = this.state.rows - 1; i >= 0; i--) {
            if (board[i][columnIndex] === "") {
                const color = this.state.currentPlayer === 1 ? this.state.player1Color : this.state.player2Color;
                board[i][columnIndex] = color;

                const didWin = this.checkWin(board, color);

                const newState = {
                    board,
                    currentPlayer: didWin ? this.state.currentPlayer : (this.state.currentPlayer === 1 ? 2 : 1),
                    winner: didWin ? color : null
                };
                if (didWin) {
                    const points = this.scoreCount(board, color);
                    if (this.state.currentPlayer === 1) {
                        newState.player1Score = this.state.player1Score + points;
                    } else {
                        newState.player2Score = this.state.player2Score + points;
                    }
                }
                this.setState(newState);
                return;
            }
        }
    }

    checkWin = (board, color) => {
        const rows = this.state.rows;
        const cols = this.state.cols;
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (
                    this.checkDirection(board, row, col, 0, 1, color) ||
                    this.checkDirection(board, row, col, 1, 0, color) ||
                    this.checkDirection(board, row, col, 1, 1, color) ||
                    this.checkDirection(board, row, col, 1, -1, color)
                ) {
                    return true;
                }
            }
        }
        return false;
    }

    checkDirection = (board, row, col, rowDir, colDir, color) => {
        for (let i = 0; i < 4; i++) {
            const r = row + i * rowDir;
            const c = col + i * colDir;
            if (
                r < 0 || r >= this.state.rows ||
                c < 0 || c >= this.state.cols ||
                board[r][c] !== color
            ) {
                return false;
            }
        }
        return true;
    }

    renderColorOptions = (playerNum) => {
        const usedColor = playerNum === 1 ? this.state.player2Color : this.state.player1Color;
        return (
            <select
                value={playerNum === 1 ? this.state.player1Color : this.state.player2Color}
                onChange={(event) => {
                    const selectedColor = event.target.value;
                    if (playerNum === 1) {
                        this.setState({ player1Color: selectedColor });
                    } else {
                        this.setState({ player2Color: selectedColor });
                    }
                }}>
                <option value="">Select Color</option>
                {
                    this.state.colors.map(color => (
                        <option
                            value={color}
                            disabled={usedColor === color}
                            style={{color: color.toLowerCase()}}>
                            {color}
                        </option>
                    ))
                }
            </select>
        )
    }

    scoreCount = (board, color) => {
        let count = 0;
        for (let row of board) {
            for (let cell of row) {
                if (cell === color) {
                    count++;
                }
            }
        }
        return count;
    }


    render() {
        return (
            <div style={{ textAlign: "center", background: "gray", padding: 20 }}>
                <h1>4 In A Row Game!</h1>

                <div style={{
                    border: "2px dashed darkblue",
                    padding: "10px",
                    margin: "10px",
                    width: "95%",
                    backgroundColor: "lightgray",
                    color: "black",
                    fontWeight: "bold"
                }}>
                     <u>Latest Patch Notes :D</u><br/>
                    1. Each player can choose a color out of 4 colors (but not the same one)<br/>
                    2. At the end of the game, the Scoreboard will show the Winner's tablet count!
                </div>

                { this.state.player1Color != "" && this.state.player2Color != "" && // conditional rendering
                    <div>
                         <h3>Current Score</h3>
                          {
                          this.state.player1Color && this.state.player2Color &&
                          <div>
                              <span style={{ color: this.state.player1Color.toLowerCase(), marginRight: 10 }}>
                                   Player 1: ({this.state.player1Color}): {this.state.player1Score}
                             </span>
                             <span style={{ color: this.state.player2Color.toLowerCase() }}>
                                 Player 2: ({this.state.player2Color}): {this.state.player2Score}
                              </span>
                        </div>
                          }
                    </div> //end of conditional render
                }

                {
                    (!this.state.player1Color || !this.state.player2Color) &&
                    <div>
                        <h3>Pls Choose a Color</h3>
                        <div>
                            Player 1: {this.renderColorOptions(1)}
                        </div>
                        <div>
                            Player 2: {this.renderColorOptions(2)}
                        </div>
                    </div>
                }

                {
                    this.state.player1Color && this.state.player2Color && !this.state.winner &&
                    <h2 style={{ margin: "auto" }}>
                        Now its: {
                        <span style={{ color: this.state.currentPlayer === 1 ? this.state.player1Color.toLowerCase() : this.state.player2Color.toLowerCase() }}>
                            {this.state.currentPlayer === 1 ? this.state.player1Color : this.state.player2Color}
                        </span>
                                 } Turn!
                    </h2>
                }

                {
                    this.state.winner &&
                    <h2 style={{ color: this.state.winner.toLowerCase() }}>
                        Player {this.state.winner} WON !!!
                    </h2>
                }

                <div style={{
                    display: "grid",
                    gridTemplateColumns: `repeat(${this.state.cols}, 60px)`,
                    gap: 5,
                    justifyContent: "center",
                    marginTop: 20
                }}>
                    {
                        this.state.board.map((row, rowIndex) =>
                            row.map((cell, columnIndex) => (
                                <div key={`${rowIndex}-${columnIndex}`}
                                     onClick={() => this.handleClick(columnIndex)}
                                     style={{
                                         width: 60,
                                         height: 60,
                                         borderRadius: "5px",
                                         backgroundColor: "lightgray",
                                         display: "flex",
                                         alignItems: "center",
                                         justifyContent: "center",
                                         fontSize: 14,
                                         border: "1px solid black",
                                         color: cell.toLowerCase(),
                                         cursor: "pointer"
                                     }}>
                                    {cell}
                                </div>
                            ))
                        )
                    }
                </div>
            </div>
        )
    }
}

export default Game;
