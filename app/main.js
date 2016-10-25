import ee from 'event-emitter';
import React from 'react';
import ReactDOM from 'react-dom';
import { colors, getTiles } from './getTiles'
window.emitter = ee();

let roundIterationCount = 0;
let roundInProgress = false;
let currentTile;

class Tile extends React.Component {
	constructor() {
		super();
    this.inspect = this.inspect.bind(this)
	}
  inspect() {
    if(roundIterationCount < 2
        && !this.props.tile.isClicked
        && !this.props.tile.hide
        && !roundInProgress) {
          window.emitter.emit('tileInspect', this.props.tile.tileKey)
    }
  }
	render() {
    let { tile, color, hide } = this.props;
		return (
			<div className="tile available"
				   style={{backgroundColor: color, visibility: hide ? 'hidden' : 'visible'}}
           onClick={this.inspect}
           >
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
    window.emitter.on('tileInspect', function(key){
      roundInspect(self, key);
    });
  }
	render() {
		let { tiles, width } = this.props;
		return(
			<div className="gameField" style={{width: (50 * width) + 'px'}}>
				{this.state.tiles.map((t, i) => {
          return <Tile
            key={t.tileKey}
            tile={t}
            color={t.isClicked ? colors[t.tileId] : '#444'}
            hide={t.hide}
          />
        })}
			</div>
		);
	}
}

ReactDOM.render(<App width={4} tiles={getTiles(4)}/>, document.getElementById('root'));


function roundInspect(self, key) {
  let tiles = self.state.tiles;

  if(roundIterationCount == 0) {
    currentTile = key;
    roundIterationCount++;
    self.setState({tiles: getTilesClicked(tiles, key)});

  } else {
    roundIterationCount++;
    self.setState({tiles: getTilesClicked(tiles, key)});

    if(tiles[currentTile].tileId == tiles[key].tileId) {
      let tileId = tiles[key].tileId;
      roundInProgress = true;

      setTimeout(function() {
        self.setState({tiles: getTilesHide(tiles, tileId)});
        roundInProgress = false;
        roundIterationCount = 0;
      }, 1000);

    } else {
      roundInProgress = true;
      setTimeout(function() {
        self.setState({tiles: getFalseTiles(tiles, key, currentTile)});
        roundInProgress = false;
        roundIterationCount = 0;
      }, 1000);
    }
  }
}

function getTilesClicked(tiles, key) {
  return tiles.map(t => {
    if(t.tileKey != key) return t;
    return Object.assign({}, t, {isClicked: true});
  })
}

function getTilesHide(tiles, tileId) {
  return tiles.map(t => {
    if(t.tileId != tileId) return t;
    return Object.assign({}, t, {hide: true});
  })
}

function getFalseTiles(tiles, key1, key2) {
  return tiles.map(t => {
    if(t.tileKey == key1 || t.tileKey == key2) {
      return Object.assign({}, t, {isClicked: false});
    } else {
      return t;
    }
  })
}
