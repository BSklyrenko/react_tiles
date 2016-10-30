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
        let tiles = this.state.tiles;
        this.setState({tiles: getTilesClicked(tiles, tilekey)});

        if(roundIterationCount) {
            currentTile = tilekey;
            roundIterationCount = false;
        } else {
            roundInProgress = true;
            setTimeout(() => {
                if(tiles[currentTile].tileId == tiles[tilekey].tileId) {
                    this.setState({tiles: getTilesHide(tiles, tiles[tilekey].tileId)});
                } else {
                    this.setState({tiles: getFalseTiles(tiles, tilekey, currentTile)});
                }
                roundInProgress = false;
                roundIterationCount = true;
            }, 1000);
        }
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
