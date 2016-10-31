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
        this.click = this.click.bind(this);
    }

    componentWillMount() {
        this.setState({tiles: this.props.tiles})
    }

    click(node) {
      let { tilekey, isclicked } = node.target.dataset;
      isclicked = isclicked == "true" ? true : false;

      if(!isclicked && !roundInProgress) {
        let tiles = this.state.tiles;

        this.setState({tiles: tiles.map(t => t.tileKey != tilekey ? t :
                              Object.assign({}, t, {isClicked: true}))});

        if(roundIterationCount) {
            currentTile = tilekey;
            roundIterationCount = false;
        } else {
            roundInProgress = true;
            setTimeout(() => {
                if(tiles[currentTile].tileId == tiles[tilekey].tileId) {
                    this.setState({tiles: tiles.map(t => t.tileId != tiles[tilekey].tileId ? t :
                                          Object.assign({}, t, {hide: true}))});
                } else {
                    this.setState({tiles: tiles.map(t => (t.tileKey == tilekey || t.tileKey == currentTile) ?
                                          Object.assign({}, t, {isClicked: false}) : t)});
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
                           onClick={this.click}
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
