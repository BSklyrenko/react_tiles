import $ from 'jquery';
import ee from 'event-emitter';
import React from 'react';
import ReactDOM from 'react-dom';
window.emitter = ee();

var roundIterationCount = 0;
var roundInProgress = false;
var currentTile;

var colors = ['#2ad2c9', '#d0e100', '#384d54', '#3fc380', '#000066',
              '#02a388', '#2c001e', '#ffd400', '#ff8700', '#646464',
              '#6f1ab1', '#76b900', '#5b9a68', '#334858', '#decba5',
              '#026466', '#ff5454', '#282828', '#685bc7', '#25aff4'];



function getTiles(n) {
	var tilesAmount = n * n;
	var colorsIndexes = [];
	var used = [];
	var tiles = [];
	var index;

	while(colorsIndexes.length < tilesAmount / 2) {
		index = Math.round(Math.random() * (colors.length - 1));

		if($.inArray(index, used) === -1) {
			colorsIndexes.push({color: index, used: 0});
			used.push(index);
		}
	}

	while(tiles.length < tilesAmount) {
		index = Math.round(Math.random() * (colorsIndexes.length - 1));

    if(colorsIndexes[index].used < 2) {
      tiles.push({ tileId: index, isClicked: false, hide: false });
      colorsIndexes[index].used++;
    }
	}
	return tiles.map((t, i) => Object.assign({tileKey: i}, t));
}



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

    window.emitter.on('tileInspect', function(key) {
      if(roundIterationCount == 0) {
        currentTile = key;
        roundIterationCount++;

        self.setState({tiles: self.state.tiles.map(t => {
          if(t.tileKey != key) return t;
          return Object.assign({}, t, {isClicked: true});
        })});
      } else {

        self.setState({tiles: self.state.tiles.map(t => {
          if(t.tileKey != key) return t;
          return Object.assign({}, t, {isClicked: true});
        })});


        if(self.state.tiles[currentTile].tileId == self.state.tiles[key].tileId) {

          var tileId = self.state.tiles[key].tileId;

          self.setState({tiles: self.state.tiles.map(t => {
            if(t.tileId != tileId) return t;
            return Object.assign({}, t, {hide: true});
          })});
          roundIterationCount == 0
        } else {
          roundInProgress = true;
          setTimeout(function() {
            self.setState({tiles: self.state.tiles.map(t => {
              if(t.tileKey == key || t.tileKey == currentTile) {
                return Object.assign({}, t, {isClicked: false});
              } else {
                return t;
              }
            })});
            roundInProgress = false;
          }, 1000);
          roundIterationCount = 0;
        }
      }

    })
  }
	render() {
		let { tiles, width } = this.props;
		return(
			<div className="gameField" style={{width: (50 * width) + 'px'}}>
				{this.state.tiles.map(t => {
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

ReactDOM.render(<App
                width={4}
                tiles={getTiles(4)}/>,
document.getElementById('root'));
