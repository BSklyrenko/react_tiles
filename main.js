import $ from 'jquery';
import React from 'react';
import ReactDOM from 'react-dom';

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
	
	used.splice(0, used.length);


	while(tiles.length < tilesAmount) {
		index = Math.round(Math.random() * (colorsIndexes.length - 1));

		if($.inArray(index, used) === -1) {
			colorsIndexes[index].used++;

			tiles.push({commonColor: '#4d4f53', 
						tileColor: colors[colorsIndexes[index].color],
						tileId: index
			});
			//console.log(colorsIndexes[index].color)

			if(colorsIndexes[index].used == 2) {
				used.push(index);
			}
		}
	}
	
	return tiles.map((t, i) => Object.assign({keyId: i}, t));
}


class Tile extends React.Component {
	constructor() {
		super();
		this.state = { clicked: false }
	}
	render() {
		return (
			<div 
				className="tile"
				style={{backgroundColor: this.props.tile.tileColor}}
			></div>
		);

	}
}

class App extends React.Component {
	constructor() {
		super();
	}
	render() {
		let { tiles, width } = this.props;
		return(
			<div className="gameField"
				style={{width: (50 * width) + 'px'}}>
				{tiles.map(t => <Tile key={t.keyId} tile={t}/>)}
			</div>
		);
	}
}

ReactDOM.render(<App width={4} tiles={getTiles(4)}/>, document.getElementById('root'));
