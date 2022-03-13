import React, {component} from 'react';

function Square(props) {
    var colors = ['blue', 'green', 'yellow', 'purple', 'white', 'pink', 'red', 'orange'];
    var color = props.value == null ? 'white' : colors[props.value]
    var squareStyle = {
        backgroundColor: color,
    }
    return (
        <button 
            className="square" 
            onClick={props.onClick}
            style={squareStyle}
        >
            {/* {props.value} */}
        </button>
    ); 
}

class Row extends React.Component {
    // Row blijft constructor behouden door specifieke states eigen aan de row
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(4).fill(null),
            last: props.last,
            editable: props.editable,
            colors: props.colors,
            positions: props.positions,
        };
    }

    // Assign values to the squares in Row. Allows only unique values.
    handleClick(i) {
        const squares = this.state.squares.slice();
        const value = this.getColor();

        if (!squares.includes(value)) {
            squares[i] = value;
            this.setState({squares: squares});
        }
    }

    // Get the selected color from ColorMenu
    getColor() {
        const value = window.localStorage.getItem('color');
        window.localStorage.removeItem('color');
        return (value);
    }

    // Render the row --> editable or non-editable, depending on if it is the current move
    renderSquare(i) {
        if (this.props.editable) {
            return (
                <Square 
                    value={this.state.squares[i]}
                    onClick={() => this.handleClick(i)}
                />
            );
        } else {
            return (
                <Square value={this.state.squares[i]}/>
            );
        }
    }

    render() {
        let rows = [];

        if (this.props.last && !this.state.squares.includes(null)) {
            rows.push(
                <button 
                    onClick={
                        () => {
                            window.localStorage.setItem('lastEntry', JSON.stringify(this.state.squares)) ;
                            this.props.onClick()
                        }
                    }
                >
                    Confirm
                </button>
            );
        } else if(!this.props.editable) {
            rows.push(
                <button>
                    C: {this.props.colors} P: {this.props.positions}
                </button>
            );
        }
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                    {this.renderSquare(3)}
                    {rows}
                </div>
            </div>
        )
    }
      
}
  
class Board extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(12).fill(null),
            }],
            positions: [],
            colors: []
        }
    }

    handleClick(i) {
        const history = this.state.history;
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        
        const results = calculateWinner();
        const positions = this.state.positions;
        const colors = this.state.colors;


        setTimeout(() => {
            this.setState({
                history: history.concat([{
                    squares: squares
                }]),
                positions: positions.concat(results.positions),
                colors: colors.concat(results.colors)
            });
        }, 300);
        
    }

    render() {
        const history = this.state.history;
        const current = history[history.length - 1];
        const results = calculateWinner(current.squares);
        const currentAttempt = history.length - 1;
        let status;

        if(results.winner) {
            status = 'Congratulations, you have won the game in ' + currentAttempt + ' attempt'
        } else {
            status = 'Play until your colors match the solution'
        }
        const title = 'MASTERMIND';   

        var rows = []; 

        for (var i = 0; i < history.length; i++) {
            if(currentAttempt == i && currentAttempt == 12) {
                rows.push(<p>You have been defeated!</p>)
            } else if (currentAttempt == i && !results.winner) {
                rows.push(
                    <Row 
                        key={i} 
                        value={i} 
                        last={true} 
                        onClick={() => this.handleClick(i)}
                        editable={true}/>)
            } else if(currentAttempt == i && results.winner) {
                rows.push(<p>Congratulations!</p>);
            } else {
                rows.push(
                    <Row 
                        key={i} 
                        value={i} 
                        last={false} 
                        onClick={() => this.handleClick(i)}
                        editable={false}
                        colors={this.state.colors[i]}
                        positions={this.state.positions[i]}
                    />
                )
            }
        }

        return (
            <div>
                <div key={0} className="status">{title}</div>
                <div key={1} className="status">{status}</div>
                <div key={2}>
                    {rows}
                </div>
            </div>
        );
    }
}

class ColorSquare extends React.Component {
    render () {
        var colors = ['blue', 'green', 'yellow', 'purple', 'white', 'pink', 'red', 'orange'];
        var color = this.props.value == null ? 'white' : colors[this.props.value]
        var squareStyle = {
            backgroundColor: color,
        }
        return (
            <button className="colorSquare" onClick={() => {
                window.localStorage.setItem('color', this.props.value)
                }}
                style={squareStyle}>
            </button>
        );
    }
    
}

class ColorMenu extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
    renderSquare(i) {
        return <ColorSquare value={i}/>
    }
    render() {
        return(
            <div>
                <br/>
                <div className="colors">Choose a color:</div>
                <div className="color-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                    {this.renderSquare(3)}
                </div>
                <div className="color-row">
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                </div>
                <button onClick={() => this.props.onClick()}>Start a new game</button>
            </div>
        )
    }
}

class SelectionRow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(4).fill(null),
        };
    }

    getColor() {
        const value = window.localStorage.getItem('color');
        window.localStorage.removeItem('color');
        return (value);
    }

    handleClick(i) {
        const squares = this.state.squares.slice();
        const value = this.getColor();

        if (!squares.includes(value)) {
            squares[i] = value;
            this.setState({squares: squares});
        }
    }

    renderSquare(i) {
        return (
            <Square 
                value={this.state.squares[i]}
                onClick={() => this.handleClick(i)}
            />
        );
    }

    render() {
        const title = "MASTERMIND"
        const status = "Choose a colour combination"
        let button = [];
        if (!this.state.squares.includes(null)) {
            button.push(
                <button 
                    onClick={() => 
                        {
                            this.props.onClick() ; 
                            window.localStorage.setItem('correct', JSON.stringify(this.state.squares)); 
                        }
                    }
                >
                    Confirm
                </button>
            )
        }
        return(
            <div>
                <div className="status">{title}</div>
                <div className="status">{status}</div>
                {this.renderSquare(0)}
                {this.renderSquare(1)}
                {this.renderSquare(2)}
                {this.renderSquare(3)}
                {button}
            </div>
        )
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectColours: true,
        }
    }
    handleClick(i) {
        if (i == 1) {
            this.setState({selectColours: false});
        } else {
            this.setState({selectColours: true})
            window.localStorage.clear();
        }
    }



    render() {
        return (
        <div className="game">

            {
                this.state.selectColours && 
                <div className="selection">
                    <SelectionRow onClick={() => this.handleClick(1)}/>
                </div>
            }
            {
                !this.state.selectColours &&
                <div className="game-board">
                    <Board />
                </div>
            }
            <div className="game-colors">
                <ColorMenu onClick={() => this.handleClick(2)}/>
            </div>
        </div>
        );
    }
}

function calculateWinner(squares) {
    let correct = JSON.parse(window.localStorage.getItem('correct'));
    let attempt = JSON.parse(window.localStorage.getItem('lastEntry'));
    let winner = JSON.stringify(correct) == JSON.stringify(attempt) ? true : false;
    let colors = 0;
    let positions = 0;
    if (attempt !== null) {
        for (var i = 0; i < 4; i++) {
            if (correct[i] == attempt[i]) {
                positions++;
            }
            if (correct.includes(attempt[i])) {
                colors++;
            }
        }
    }
    
    var calculation = {
        colors: colors,
        positions: positions,
        winner: winner,
    }
    return calculation;
}

export default Game;