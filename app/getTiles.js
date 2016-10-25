import $ from 'jquery';

let colors = ['#2ad2c9', '#d0e100', '#384d54', '#3fc380', '#000066',
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

export {colors, getTiles}
