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
    // constructor(props) {
    //     super(props);
    //     this.state = {
    //         squares: Array(4).fill(null),
    //     };
    // }

    handleClick(i) {
        const squares = this.state.squares.slice();
        const value = this.getColor();

        squares[i] = value;
        this.setState({squares: squares});
    }

    handleConfirm(i) {
        window.localStorage.setItem('correct', this.state.squares.slice());
    }

    getColor() {
        const value = window.localStorage.getItem('color');
        window.localStorage.removeItem('color');
        return (value);
    }

    // VOOR STATE LIFT
    // renderSquare(i) {
    //     return (
    //         <Square 
    //             value={this.state.squares[i]}
    //             onClick={() => this.handleClick(i)}
    //         />);
    // }

    renderSquare(i) {
        return (
            <Square 
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />);
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                    {this.renderSquare(3)}
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

    renderRow(i) {
        return <Row value={i}/>;
    }

    render() {
        const title = 'MASTERMIND';    

        return (
            <div>
                <div className="status">{title}</div>
                <div>
                    {this.renderRow(0)}
                    <br/>
                    <button onClick={() => this.props.onClick()}>Confirm</button>
                    {/* {this.renderRow(1)}
                    {this.renderRow(2)}
                    {this.renderRow(3)}
                    {this.renderRow(4)}
                    {this.renderRow(5)}
                    {this.renderRow(6)}
                    {this.renderRow(7)}
                    {this.renderRow(8)}
                    {this.renderRow(9)}
                    {this.renderRow(10)}
                    {this.renderRow(11)} */}
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

        squares[i] = value;
        this.setState({squares: squares});
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
        return(
            <div>
                {this.renderSquare(0)}
                {this.renderSquare(1)}
                {this.renderSquare(2)}
                {this.renderSquare(3)}
                <br/>
                <button onClick={() => {this.props.onClick() ; window.localStorage.setItem('correct', this.state.squares) ; console.log(window.localStorage.getItem('correct'))}}>Confirm selection</button>
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
            // window.localStorage.setItem('')
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
    const lines = []
}

export default Game;