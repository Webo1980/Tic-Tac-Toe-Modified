function Square(props) {
  //console.log("Square Keys: "+props.squerKey);
  return (
    <button className="square" id={props.squareID} key={props.squerKey} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        squareID={"square-"+i}
        squerKey={i}
      />
    );
  }
  // My solution for problem 3. Rewrite Board to use two loops to make the squares instead of hardcoding them.
  render() {
    var rows = [];
    let y = 0;
    let rowsCount = this.props.rowsCount;
    for (var i = 0; i < rowsCount; i++) {
      rows.push(<div className="board-row" key={"div-"+i.toString()} />);  {/* render one div every 3 loops iterations*/}
      for (var x = 0; x < rowsCount; x++) {
        rows.push(this.renderSquare((y*i+x)));  {/*  render  the squares with ids from 0->8 */}
      }
      y=x; {/*  save x value for the next outer loop iteration */}
    }
    return <div>{rows}</div>;
  }
  /*render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  
  }*/
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    
    // listen to form submition
    this.state = {rowsCount: ''};
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    
    this.state = {
      history: [
        {
          squares: Array((this.state.rowsCount=='')? 9 : Math.pow(this.state.rowsCount, 2)).fill(null)  // create a square of mutliple the user input
        }
      ],
      stepNumber: 0,
      xIsNext: true,
      //rows: this.state.value,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const winnerData=calculateWinner(squares, this.state.rowsCount);

    if (winnerData || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }
  
  resetSquareStyle(){
    var elements = document.getElementsByClassName("square");
    for(var i = 0; i < elements.length; i++){
		  elements[i].style.color = "black";
	  }  
  }
  
  resetStatusStyle(){
    var statusElement = document.getElementById("gameStatus");
		statusElement.style.color = "black";
    statusElement.style.fontWeight = "normal";
  }
  
  jumpTo(step) {
    // My solution for problem 5. When someone wins, highlight the three squares that caused the win.
    // Here I reset back all squares to black, if there were a winner
    this.resetSquareStyle();
    //// reset back the game status div to default
    this.resetStatusStyle();
    
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  
  handleChange(event) {
    this.setState({rowsCount: event.target.value });
    //this.setState({renderChild: false});
    
     this.setState({   
      renderChild: false,
       // when the user needs to render a new game, reset all values to default as following.
       stepNumber: 0,
      xIsNext: 'X',
      history: [
        {
          squares: Array(Math.pow(this.state.rowsCount, 2)).fill(null)  // create a square of mutliple the user input
        }
      ],
    });
    // in case the game was drawn or there was a winner set the font status to default
    this.resetSquareStyle();
    this.resetStatusStyle();
    //ReactDOM.unmountComponentAtNode(document.getElementsByClassName("game-board"));
  }

  handleSubmit(event) {
    //alert('A name was submitted: ' + this.state.value);
    event.preventDefault();
  }
  
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares, this.state.rowsCount);
    const moves = history.map((step, move) => {
       ///////////////// My Solution for problem 1. Display the location for each move in the format (col, row) in the move history list  
      const xoLocations = step.squares.flatMap((item, i) => (item === 'X' || item === 'O') ? i : []);  // find all x,o locations
      const columnRows =xoLocations.map((index, location) => {  // map through location to show it as (col,row)
        const realIndex = index +1
        const column =(realIndex%this.state.rowsCount == 0)? this.state.rowsCount : (realIndex%this.state.rowsCount);  // find column
        const row =((realIndex-column)/this.state.value+1 == this.state.rowsCount)? this.state.rowsCount: ((realIndex-column)/this.state.rowsCount+1) ;
        const position = "("+column+","+row+")"; 
          return position;
       });  // end of solution
      const desc = move ?
        'Go to move #' + move +' (column,row): '+  columnRows:
        'Go to game start';
      return (
        <li key={move}>
            {/* <! –– My Solution for problem 2.Bold the currently selected item in the move list ––> */}
            <button style={ (this.state.stepNumber==move)? {fontWeight:'bold'} : {}} onClick={()=> this.jumpTo(move)}>{desc}</button> 
        </li>
      );
    });

    let status;
    if (winner) {
      // My solution for problem 5. When someone wins, highlight the squares that caused the win.
      const winnerSquares = winner.winnerLines.map(winSquare => {
        var element = document.getElementById("square-"+winSquare);
        element.style.color = 'red' ;
      });  
      var statusElement = document.getElementById("gameStatus");
		  statusElement.style.color = "red";
      statusElement.style.fontWeight = "bold";
      status = "Winner: " + winner.winner;
    }
    else if(this.state.stepNumber >= Math.pow(this.state.rowsCount, 2)){ // My solution for problem 6.When no one wins, display a message about the result being a draw.
      status = "Draw!";
      var statusElement = document.getElementById("gameStatus");
		  statusElement.style.color = "red";
      statusElement.style.fontWeight = "bold";
    } 
    else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }
  
    return (
      <div className="game">
        
        <label>
          Number of Rows:
          <input type="text" size="2" value={(isNaN(this.state.rowsCount))? 3: this.state.rowsCount} onChange={this.handleChange} />
        </label>
        <br/>
        <div className="game-board"  ref="gameBoard">
          <Board
            rowsCount={this.state.rowsCount}
            squares={current.squares}
            onClick={i => this.handleClick(i)} 
          />
        </div>
        <div className="game-info">
          <div id="gameStatus">{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function getWinCellsArrays(rows) {
  let rowsGrid = [];
  let diagonal = [];
  let reversedDiagonal = [];
  let columnsGrid = [];
  let finalGrid = [];
  let rowsCount = 0;
  let columnsCount = 0;
  
  // get win rows
  for (let i = 0; i < rows; i++) {
    rowsGrid[i] = [];
    for (let j = 0; j < rows; j++) {
      rowsGrid[i][j] = rowsCount;
      rowsCount++;
    }
  }
    
  // get win diagonal cells
  diagonal = rowsGrid.map((row, index, self) => row[index]);
  // get win reversed diagonal cells
  reversedDiagonal = rowsGrid.map((row, index, self) => row[self.length - 1 - index]);
  
  // get win columns
  for (let x = 0; x < rows; x++) {
    columnsCount = x;
    columnsGrid[x] = [];
    for (let y = 0; y < rows; y++) {
      columnsGrid[x][y] = columnsCount;
      columnsCount += parseInt(rows);  /// for some reasone React treats rows  as string!
    }
  }
  
  finalGrid.push(...rowsGrid);
  finalGrid.push(diagonal);
  finalGrid.push(reversedDiagonal);
  finalGrid.push(...columnsGrid);
 
  //console.table(finalGrid);
  return finalGrid;
}

function isUniform(lines, squares){  // match the squares with the win lines to get the winner
    var first=squares[lines[0]];
    for (var i = 0; i < lines.length; i++) {
        while(first!==squares[lines[i]]){
            return false;
        }
    }
    return true;
}

function calculateWinner(squares, rowsCount) {
  let winnerData = {}; 
  /*const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
  ];*/
  const lines = getWinCellsArrays(rowsCount); // get dynamic win cells based on the users' preferences
  //console.table(lines);
  for (let i = 0; i < lines.length; i++) {
    //const [a, b, c] = lines[i];
    if(squares[lines[i][0]] && isUniform(lines[i],squares)){
    //if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        winnerData ={  // My solution for problem 5. When someone wins, highlight the three squares that caused the win.
                      //winner: squares[i],
                      //winner: lines[i][0],
                      winner: squares[lines[i][0]],
                      winnerLines: lines[i]
                    };
      //return squares[a];
      return winnerData;
    }
  }
  return null;
}
