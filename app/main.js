import ee from 'event-emitter';
import React from 'react';
import ReactDOM from 'react-dom';
import { colors, getTiles } from './getTiles'
window.emitter = ee();

let roundIterationCount = true;          // global variables
let roundInProgress = false;
let currentTile;


// React components definition

class Tile extends React.Component {
    constructor() {
        super();
        this.inspect = this.inspect.bind(this)
    }

    inspect() {
        if (!this.props.tile.isClicked && !roundInProgress) {
            window.emitter.emit('tileInspect', this.props.tile.tileKey)
        }
    }

    render() {
        let { hide, isClicked, tileId } = this.props.tile;
        return (
            <div className="tile available"
                 style={{
             backgroundColor: isClicked ? colors[tileId] : '#444',
             visibility: hide ? 'hidden' : 'visible'
           }}
                 onClick={this.inspect}>
            </div>
        );
    }
}

class App extends React.Component {
    constructor() {
        super();
        this.state = {tiles: 0}
    }

    componentWillMount() {
        this.setState({tiles: this.props.tiles})
    }

    componentDidMount() {
        let self = this;
        window.emitter.on('tileInspect', function (key) {
            roundInspect(self, key);
        });
    }

    render() {
        let { tiles, width } = this.props;
        return (
            <div className="gameField" style={{width: (50 * width) + 'px'}}>
                {this.state.tiles.map((t, i) => {
                    return <Tile key={i} tile={t}/>
                })}
            </div>
        );
    }
}

ReactDOM.render(<App width={4} tiles={getTiles(4)}/>, document.getElementById('root'));


// Round inspect functions

function roundInspect(self, key) {
    let tiles = self.state.tiles;

    if (roundIterationCount) {
        currentTile = key;
        roundIterationCount = false;
        self.setState({tiles: getTilesClicked(tiles, key)});

    } else {
        roundInProgress = true;
        self.setState({tiles: getTilesClicked(tiles, key)});

        if (tiles[currentTile].tileId == tiles[key].tileId) {
            setTimeout(function () {
                self.setState({tiles: getTilesHide(tiles, tiles[key].tileId)});
                roundInProgress = false;
            }, 1000);
        } else {
            setTimeout(function () {
                self.setState({tiles: getFalseTiles(tiles, key, currentTile)});
                roundInProgress = false;
            }, 1000);
        }

        roundIterationCount = true;
    }
}

function getTilesClicked(tiles, key) {
    return tiles.map(t => {
        if (t.tileKey != key) return t;
        return Object.assign({}, t, {isClicked: true});
    })
}

function getTilesHide(tiles, tileId) {
    return tiles.map(t => {
        if (t.tileId != tileId) return t;
        return Object.assign({}, t, {hide: true});
    })
}

function getFalseTiles(tiles, key1, key2) {
    return tiles.map(t => {
        if (t.tileKey == key1 || t.tileKey == key2) {
            return Object.assign({}, t, {isClicked: false});
        } else {
            return t;
        }
    })
}
