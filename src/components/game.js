import React, {component} from 'react';

function Square(props) {
    return (
        <button 
            className="square" 
            onClick={props.onClick}
        >
            {props.value}
        </button>
    ); 
}

class Row extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(4).fill(null),
            last: props.last,
            editable: props.editable,
        };
    }

    // Assign values to the squares in Row
    handleClick(i) {
        const squares = this.state.squares.slice();
        const value = this.getColor();

        squares[i] = value;
        this.setState({squares: squares});
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
                            this.props.onClick() ; 
                            window.localStorage.setItem('lastEntry', this.state.squares) ;  
                            console.log(window.localStorage.getItem('lastEntry'))
                        }
                    }
                >
                    Confirm
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
            }]
        }
    }

    handleClick(i) {
        const history = this.state.history;
        const current = history[history.length - 1]; // normaal history.length - 1
        const squares = current.squares.slice();
        this.setState({
            history: history.concat([{
                squares: squares,
            }])
        })
    }

    render() {
        const history = this.state.history;
        const current = history[history.length - 1];
        const winner = calculateWinner(current.squares);
        const currentAttempt = history.length - 1;
        console.log(currentAttempt);
        let status;
        if (winner) {
            status = 'Congratulations, you have won the game in ' + history.length + ' attempts'
        } else {
            status = 'Play until your colors match the solution'
        }
        const title = 'MASTERMIND';   
        var rowsWin;

        if (winner) {
            rowsWin = history.length - 1;
        } else {
            rowsWin = history.length;
        }

        var rows = []; 

        for (var i = 0; i < history.length; i++) {
            if (currentAttempt == i && !winner) {
                rows.push(
                    <Row 
                        key={i} 
                        value={i} 
                        last={true} 
                        onClick={() => this.handleClick(i)}
                        editable={true}/>)
            } else {
                rows.push(
                    <Row 
                        key={i} 
                        value={i} 
                        last={false} 
                        onClick={() => this.handleClick(i)}
                        editable={false}
                    />
                )
            }
        }

        return (
            <div>
                <div className="status">{title}</div>
                <div className="status">{status}</div>
                <div>
                    {rows}
                </div>
            </div>
        );
    }
}

class ColorSquare extends React.Component {
    render () {
        return (
            <button className="colorSquare" onClick={() => {
                window.localStorage.setItem('color', this.props.value)
                console.log(this.props.value)}}>
                {this.props.value}
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
        let rows = [];
        if (!this.state.squares.includes(null)) {
            rows.push(
                <button 
                    onClick={() => 
                        {
                            this.props.onClick() ; 
                            window.localStorage.setItem('correct', this.state.squares) ; 
                            console.log(window.localStorage.getItem('correct'))
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
                {rows}
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
            
            <div className="game-info">
                <div>{/* status */}</div>
                <ol>{/* TODO */}</ol>
            </div>
            <div className="game-colors">
                <ColorMenu onClick={() => this.handleClick(2)}/>
            </div>
        </div>
        );
    }
}

function calculateWinner(squares) {
    let correct = window.localStorage.getItem('correct');
    let attempt = window.localStorage.getItem('lastEntry');
    return JSON.stringify(correct) == JSON.stringify(attempt);
}

export default Game;