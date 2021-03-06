import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'

function Square (props) {
  return (
    <button className='square' onClick={props.onClick}>
      {props.value}
    </button>
  )
}

class Board extends React.Component {

  renderSquare (i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => {
          this.props.onClick(i)
        }}
      />
    )
  }

  render () {
    return (
      <div>
        <div className="status">{this.props.status}</div>
        {
          Array(3).fill(null).map((v, x) => (
            <div className="board-row" key={x}>
              {
                Array(3).fill(null).map((v, y) => (this.renderSquare(3 * x + y)))
              }
            </div>
          ))
        }
      </div>
    )
  }
}

class Game extends React.Component {

  constructor (props) {
    super(props)
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      xIsNext: true,
      stepNumber: 0,
      sortMethod: true, // true：升序， false：降序
      isEnd: false
    }
  }

  handleClick (i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice()
    if (calculateWinner(squares) || squares[i]) return
    squares[i] = this.state.xIsNext ? 'X' : 'O'
    this.setState({
      history: history.concat([{
        squares: squares,
        clickIndex: i
      }])
    })
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length
    })
  }

  jumpTo (step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    })
  }

  changeSortMethod () {
    this.setState({
      sortMethod: !this.state.sortMethod
    })
  }

  render () {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    const winner = calculateWinner(current.squares)
    const moves = history.map((step, move) => {
      let x = parseInt(step.clickIndex / 3) + 1
      let y = step.clickIndex % 3 + 1
      const desc = move ?
        'Go to move (' + x + ', ' + y + ')':
        'Go to game start;'
      return (
        <li key={move}>
          <button style={move === this.state.stepNumber ? {fontWeight: 'bold'} : {}} onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      )
    })
    let status
    if (winner) {
      status = 'Winner: ' + winner.winValue
      for (let i of winner.winPoint) {
        document.getElementsByClassName('square')[i].style = "background: lightblue; color: #fff;";
      }
    } else {
      if (this.state.history.length > 9) {
        status = 'No player win! It ends in a draw!';
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O')
      }
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <button onClick={() => this.changeSortMethod()}>{this.state.sortMethod ? '降序' : '升序'}</button>
          <ol>{this.state.sortMethod ? moves : moves.reverse()}</ol>
        </div>
      </div>
    )
  }
}

function calculateWinner (squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ]
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i]
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return {
        winValue: squares[a],
        winPoint: lines[i]
      }
    }
  }
  return null
}

ReactDOM.render(
  <Game/>,
  document.getElementById('root')
)

