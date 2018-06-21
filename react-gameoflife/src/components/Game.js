import React from 'react';
import '../styles/Game.css';

const CELL_SIZE = 20;
const WIDTH = 800;
const HEIGHT = 600;

class Cell extends React.Component {

  render() {
      const { x, y } = this.props;
      return (
          <div className="Cell" style={{
              left: `${CELL_SIZE * x + 1}px`,
              top: `${CELL_SIZE * y + 1}px`,
              width: `${CELL_SIZE - 1}px`,
              height: `${CELL_SIZE - 1}px`,
          }} />
      );
  }
}

class Game extends React.Component {
  constructor() {
    super();
    this.rows = HEIGHT / CELL_SIZE;
    this.cols = WIDTH / CELL_SIZE;
    this.board = this.makeEmptyBoard();
  }

  state = {
    cells: [],
    interval: 100,
    isRunning: false
  }

  makeEmptyBoard = () => {
    let board = [];
    for(let y=0; y < this.rows; y++) {
      board[y] = [];
      for(let x=0; x < this.cols; x++) {
        board[y][x] = false;
      }
    }
    console.log(board);
    return board;
  }

  makeCells () {
    let cells = [];
    for(let y=0; y < this.rows; y++) {
      for(let x=0; x < this.cols; x++) {
        if(this.board[y][x]){
          cells.push({x,y});
        }
      }
    }
    return cells;
  }

  getElementOffset() {
    const rect = this.boardRef.getBoundingClientRect();
    const doc = document.documentElement;

    // console.log(rect);
    // console.log(doc);
    // console.log(window.pageXOffset);
    // console.log(window.pageYOffset);
    // console.log(doc.clientLeft);
    // console.log(doc.clientTop);

    return {
      x: (rect.left + window.pageXOffset) - doc.clientLeft,
      y: (rect.top + window.pageYOffset) - doc.clientTop,
    };
  }

  handleClick = (event) => {
    console.log("In here");
    const elemOffset = this.getElementOffset();
    console.log(event.clientX);
    console.log(elemOffset.x);
    console.log(event.clientY);
    console.log(elemOffset.y);
    
    const offsetX = event.clientX - elemOffset.x;
    const offsetY = event.clientY - elemOffset.y;
    
    console.log(offsetX);
    console.log(offsetY);

    const x = Math.floor(offsetX / CELL_SIZE);
    const y = Math.floor(offsetY / CELL_SIZE);

    console.log(x);
    console.log(y);

    if (x >= 0 && x <= this.cols && y >= 0 && y <= this.rows) {
      this.board[y][x] = !this.board[y][x];
    }
    this.setState({ cells: this.makeCells() });
  }

  runGame = () => {
    this.setState({ isRunning: true });
    this.runIteration();
  }

  stopGame = () => {
    this.setState({ isRunning: false });
    if (this.timeoutHandler) {
      window.clearTimeout(this.timeoutHandler);
      this.timeoutHandler = null;
    }
  }

  handleIntervalChange = (event) => {
    this.setState({ interval: event.target.value });
  }

  runIteration() {
    console.log('running iteration');
    let newBoard = this.makeEmptyBoard();
    // TODO: Add logic for each iteration here.
    for (let y = 0; y < this.rows; y++) {
      for (let x = 0; x < this.cols; x++) {
        let neighbors = this.calculateNeighbors(this.board, x, y);
        if (this.board[y][x]) {
          if (neighbors === 2 || neighbors === 3) {
            newBoard[y][x] = true;
          } else {
            newBoard[y][x] = false;
          }
        } else {
          if (!this.board[y][x] && neighbors === 3) {
            newBoard[y][x] = true;
          }
        }
      }
    }
    this.board = newBoard;
    this.setState({ cells: this.makeCells() });
    this.timeoutHandler = window.setTimeout(() => {
      this.runIteration();
    }, this.state.interval);
  }

  calculateNeighbors(board, x, y) {
    let neighbors = 0;
    const dirs = [[-1, -1], [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1]];
    for (let i = 0; i < dirs.length; i++) {
        const dir = dirs[i];
        let y1 = y + dir[0];
        let x1 = x + dir[1];

        if (x1 >= 0 && x1 < this.cols && y1 >= 0 && y1 < this.rows && board[y1][x1]) {
            neighbors++;
        }
    }

    return neighbors;
}

  render() {
    return (
      <div>
        <div className="Board"
          style={{ width: WIDTH, height: HEIGHT,backgroundSize: `${CELL_SIZE}px ${CELL_SIZE}px` }}
          onClick = {this.handleClick}
          ref = {(n) => {this.boardRef = n;}}>
          {this.state.cells && this.state.cells.map(cell => (
            <Cell x={cell.x} y={cell.y}
                key={`${cell.x},${cell.y}`}/>
          ))}
        </div>
        <div className="controls">
          Update every <input value={this.state.interval}
              onChange={this.handleIntervalChange} /> msec
          {this.state.isRunning ?
            <button className="button"
              onClick={this.stopGame}>Stop</button> :
            <button className="button"
              onClick={this.runGame}>Run</button>
          }
        </div>
      </div>
    );
  }
}

export default Game;