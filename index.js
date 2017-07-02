
//cdnjs.cloudflare.com/ajax/libs/react/0.14.7/react.js
//cdnjs.cloudflare.com/ajax/libs/react/0.14.7/react-dom.js
// + babel

// FCC: Build the Game of Life
// User Story: When I first arrive at the game, it will randomly generate a board and start playing.
// User Story: I can start and stop the board.
// User Story: I can set up the board.
// User Story: I can clear the board.
// User Story: When I press start, the game will play out.
// User Story: Each time the board changes, I can see how many generations have gone by.

var Cell = React.createClass({
  getInitialState: function() {
    return { shade: 'none' }
  },
  // set the initial state based on props
  componentWillMount: function() {
    if (this.props.element === '.') {
      this.setState({ shade: 'dead' })
    }
    else if (this.props.element === 'a') {
      this.setState({ shade: 'immature' })
    }
    else if (this.props.element === '@') {
      this.setState({ shade: 'mature' })
    }   
  },
  
  // update the state based on prop changes
  componentWillReceiveProps: function(nextElement) {
   // console.log(nextElement);
    if (nextElement.element === '.')
      this.setState({ shade: 'dead' });
    else if (nextElement.element === 'a')
      this.setState({ shade: 'immature' });
    else if (nextElement.element === '@')
      this.setState({ shade: 'mature' });
    
  },
  
  render: function() {
    return <div id={this.state.shade} className={'cell cell--' + this.state.shade} onClick={this.props.onClick}></div>;
  }
});

var Board = React.createClass({
  randomizeBoard: function(board) {
    //fill half the board with live cells
    var numberOfCells = this.height * this.width;
    var x, y;
    for (var a = 0; a < numberOfCells/2; a++) {
      x = Math.floor(Math.random() * this.width);
      y = Math.floor(Math.random() * this.height);
      board[y][x] = '@';
    }
    return board;
  },
  
  initializeBoard: function(boardSize) {
    var board = [];
    
    if(boardSize === 'debug') {
      this.height = 10,
      this.width = 10
    }
    
    else if(boardSize === 'small') {
      this.height = 30,
      this.width = 50
    }
    else if(boardSize === 'medium') {
      this.height = 40,
      this.width = 60
    }
    else if(boardSize === 'large') {
      this.height = 50,
      this.width = 75
    }
    
    for (let h = 0; h < this.height; h++) {
      board[h] = [];
      for (let w = 0; w < this.width; w++) {
        board[h][w] = '.';
      }   
    }
    return board;
  },
  
  getInitialState: function() {
    return {
    //  initialize: true
      count: 0,
      //state: 'running'
      intervalState: 'play',
   //   boardSize: 'medium',
      board: this.randomizeBoard(this.initializeBoard('medium')),
      boardSpeed: 'regular'
    }
  },
  
  getNextState: function() {   
    this.setState({ board: this.computeNextBoard(this.state.board),
                    count: this.state.count + 1
                  });
    
  },
  
  computeNextBoard: function(board) {
    var nextBoard = [];
    // for each cell, count the number of neighboring live cells
    for (let h = 0; h < this.height; h++) {
      nextBoard[h] = [];
      for (let w = 0; w < this.width; w++) {
        nextBoard[h][w] = this.computeNextCell(h, w, board);
      }
    }
    return nextBoard;
  },
  
  computeNextCell: function(y, x, board) {
    var lifeCounter = 0;
    var col, row;
    
    for (let xpos = -1; xpos <= 1; xpos++) {
      for (let ypos = -1; ypos <= 1; ypos++) {
        col = x + xpos;
        row = y + ypos;      
        
        if (col < 0) {
          col = this.width - 1;
        }
        if (row < 0) {
          row = this.height - 1;
        }
        if (col === this.width) {
          col = 0;
        }
        if (row === this.height) {
          row = 0;
        }
        
        // don't count self
        if (col === x && row === y)
          continue;
        
        if (board[row][col] === '@' || board[row][col] === 'a') {
          ++lifeCounter;
        }
      }
    }
    
    if (lifeCounter < 2 || lifeCounter > 3) {
      return '.';
    }
    else if (lifeCounter === 3) {
      if (board[y][x] === '.')
        return 'a';
      if (board[y][x] === 'a')
        return '@';
      if (board[y][x] === '@')
        return '@';
    }
    else if (lifeCounter === 2) {
      if (board[y][x] === 'a')
        return '@';
      if (board[y][x] === '@')
        return '@';
      if (board[y][x] === '.')
        return '.';
    }
    else return '.';
  },
  
  componentDidMount: function() {
    var self = this;
    var interval, speed = !function() { return self.state.boardSpeed }();
    var speedNumber = 1;
    
    var stop = false;
    var frameCount = 0;
    var fps, fpsInterval, startTime, now, then, elapsed;
    
    function startAnimating(fps) {
      fpsInterval = 1000/fps;
      then = Date.now();
      startTime = then;
      processStates();
    }
    
    
    /*
    var processStates = function() {      
      if (speed !== self.state.boardSpeed) {
        speed = !function() { return self.state.boardSpeed }();
        clearInterval(interval);
        if (self.state.boardSpeed === 'fast')
          speedNumber = 25;
        else if (self.state.boardSpeed === 'regular')
          speedNumber = 100;
        else if (self.state.boardSpeed === 'slow')
          speedNumber = 400;
        interval = setInterval(processStates, speedNumber);
      }
      if (self.state.intervalState === 'play')
        self.getNextState();
    }; 
    
    interval = setInterval(processStates, self.state.boardSpeed);
    */
    
    var processStates = function() {
      
      if (speed !== self.state.boardSpeed) {
        speed = !function() { return self.state.boardSpeed }();
      
        if (self.state.boardSpeed === 'fast')
          speedNumber = 60;
        else if (self.state.boardSpeed === 'regular')
          speedNumber = 10;
        else if (self.state.boardSpeed === 'slow')
          speedNumber = 5;

        fpsInterval = 1000/speedNumber;
      }
      
      
      requestAnimationFrame(processStates);
      
      
      now = Date.now();
      elapsed = now - then;
      
      if (elapsed > fpsInterval) {
        then = now - (elapsed % fpsInterval);
        
        if (self.state.intervalState === 'play')
          self.getNextState();
        
      }
    }

    startAnimating(speedNumber);
    
  },
  
  componentWillReceiveProps: function(nextState) {
    
    if (this.props.random !== nextState.random) {
      this.setState({ count: 0,
                      intervalState: 'play',
                      board: this.randomizeBoard(this.initializeBoard(nextState.size))
                    })
    }
    
    if (this.props.state !== nextState.state) {
      this.setState({ intervalState: nextState.state });
      if (nextState.state === 'clear') {
        this.setState({ count: 0,
                        intervalState: 'pause',
                        board: this.initializeBoard(nextState.size)
                      })
      }
    }
      
    if (this.props.size !== nextState.size) {
      this.setState({ count: 0,
                    //  boardSize: nextState.size,
                      intervalState: 'pause',
                      board: this.initializeBoard(nextState.size)
                    });
      
    }
    
    if (this.state.boardSpeed !== nextState.speed) {
      this.setState({ boardSpeed: nextState.speed });     
    }
  },
  
  handleClick: function(event, y, x) {
    if (event.target.id === 'dead') {
      this.state.board[y][x] = 'a';
      this.setState({ board: this.state.board });
    }
      
    else if (event.target.id === 'immature' || event.target.id === 'mature') {
      this.state.board[y][x] = '.';
      this.setState({ board: this.state.board});
    }
      
  },
  
  render: function() {
    var self = this;
    
    return (
      <div className='board'>
        <div className='display'><div className='display--name'>Gen:</div><div className='display--count'>{this.state.count}</div></div>
        <div className='grid'>
          {this.state.board.map(function(y, yindex) {
            return <div className='row' key={yindex}>{y.map(function(x, xindex) {
                return <Cell element={x} key={xindex} onClick={
                    // the following the same as: e => self.handleClick(e, yindex, xindex)
                    function(e) {
                      return self.handleClick(e, yindex, xindex);
                    }              
                  } />
              })}</div>;
          })}
        </div>
      </div>
    );
  }
});

var GameOfLife = React.createClass({
  getInitialState: function() {
    return {
      state: 'play',
      size: 'medium',
      speed: 'regular',
      random: false
    }
  },
  
  handleClick: function(event) {
    if (event.target.id === 'play') {
      this.setState({ state: 'play' })
    }
    if (event.target.id === 'pause') {
      this.setState({ state: 'pause' });
    }
    if (event.target.id === 'clear') {
      this.setState({ state: 'clear' })
    }
    
    if (event.target.id === 'random') {
      this.setState({ random: !this.state.random,
                      state: 'play' })
    }
    
    if (event.target.id === 'small' && this.state.size !== 'small') {
      this.setState({ size: 'small',
                      state: 'pause' })
    }
    else if (event.target.id === 'medium' && this.state.size !== 'medium') {
      this.setState({ size: 'medium',
                      state: 'pause' });
    }
    else if (event.target.id === 'large' && this.state.size !== 'large') {
      this.setState({ size: 'large',
                      state: 'pause' })
    }
    
    if (event.target.id === 'slow') {
      this.setState({ speed: 'slow' })
    }
    else if (event.target.id === 'regular') {
      this.setState({ speed: 'regular' });
    }
    else if (event.target.id === 'fast') {
      this.setState({ speed: 'fast' })
    }   
  },
  
  highlightActives: function(element) {
    //remove all actives and assign
    
    if (element === this.state.state)
      return ' active';
    else if (element === 'pause' && this.state.state === 'clear')
      return ' active';
    else if (element === this.state.size)
      return ' active';
    else if (element === this.state.speed)
      return ' active';
    else return '';
    
  },
  
  render: function() {
    return (
      <div>
        <div className='title'><a href="//en.wikipedia.org/wiki/Conway's_Game_of_Life" className='title--link'>ReactJS Game of Life</a></div>
        <div className='setting setting--state'>
          <div className={'control control--play' + this.highlightActives('play')} id='play' onClick={this.handleClick}>Play</div>
          <div className={'control control--pause' + this.highlightActives('pause')} id='pause' onClick={this.handleClick}>Pause</div>
          <div className='control control--clear' id='clear' onClick={this.handleClick}>Clear</div>
          <div className='control control--random' id='random' onClick={this.handleClick}>Random</div>
        </div>
        
        <Board onClick={this.handleClick} state={this.state.state} size={this.state.size} speed={this.state.speed} random={this.state.random} />
        <div className='setting'>
          <div className='setting--size'>
            <div className='control control--title'>Size</div>
            <div className={'control control--small' + this.highlightActives('small')} id='small' onClick={this.handleClick}>Small</div>
            <div className={'control control--medium' + this.highlightActives('medium')} id='medium' onClick={this.handleClick}>Medium</div>
            <div className={'control control--large' + this.highlightActives('large')} id='large' onClick={this.handleClick}>Large</div>
          </div>

          <div className='setting--speed'>
            <div className='control control--title'>Speed</div>
            <div className={'control control--slow' + this.highlightActives('slow')} id='slow' onClick={this.handleClick}>Slow</div>
            <div className={'control control--regular' + this.highlightActives('regular')} id='regular' onClick={this.handleClick}>Regular</div>
            <div className={'control control--fast' + this.highlightActives('fast')} id='fast' onClick={this.handleClick}>Fast</div> 
          </div>
        </div>
      </div>
    );
  }
});

ReactDOM.render(<GameOfLife />, document.getElementById('app'));
