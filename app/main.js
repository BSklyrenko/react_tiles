import ee from 'event-emitter';
import React from 'react';
import ReactDOM from 'react-dom';
import { colors, getTiles } from './getTiles'
window.emitter = ee();

let roundIterationCount = true;          // global variables
let roundInProgress = false;
let currentTile;


// React components definition

class App extends React.Component {
    constructor() {
        super();
        this.state = {tiles: 0}
    }

    componentWillMount() {
        this.setState({tiles: this.props.tiles})
    }

    click(node) {
      let { tilekey, isclicked } = node.target.dataset;
      isclicked = isclicked == "true" ? true : false; 

      if(!isclicked && !roundInProgress) {
        roundInspect(this, node.target.dataset.tilekey);
      }
    }

    render() {
        let { tiles, width } = this.props;
        return (
            <div className="gameField" style={{width: (50 * width) + 'px'}}>
                {this.state.tiles.map((t, i) => {
                    return (
                      <div className="tile available"
                           style={{
                              backgroundColor: t.isClicked ? colors[t.tileId] : '#444',
                              visibility: t.hide ? 'hidden' : 'visible'
                           }}
                           onClick={this.click.bind(this)}
                           data-tilekey={t.tileKey}
                           data-isclicked={t.isClicked}
                           key={i}>
                      </div>
                    );
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
