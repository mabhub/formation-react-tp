import React from 'react';
import HelloWorld from './components/HelloWorld/';
import Nominatim from './components/Nominatim/';
import OverpassResults from './components/OverpassResults/';

import nominatimService from './services/nominatim';
import overpassService from './services/overpass';

import Map from './components/Map/';

import './App.css';

class App extends React.Component {
  state = {
    search: 'Toulouse',
    markers: [],
    geojson: undefined,
    loading: true,
    bbox: undefined
  };
  inputUncontrolled = {};

  componentWillMount() {
    this.getNominatimData(this.state.value);
  }
  handleChange = (e) => {
    this.setState({ value: e.target.value });
  }
  handleInput = (input) => {
    this.inputUncontrolled = input;
  }
  handleSubmitControlled = (e) => {
    e.preventDefault();
    this.getNominatimData(this.state.value);
  }
  handleSubmitUncontrolled = (e) => {
    e.preventDefault();
    this.getNominatimData(this.inputUncontrolled.value);
  }
  handleChangeBBox = (bbox) => {
    this.setState({ bbox: bbox}, this.getGeoJSONData);
  }
  getNominatimData(search) {
    nominatimService.getNominatimData(search)
      .then((markers) => this.setState({markers: markers}));
  }
  getGeoJSONData() {
    this.setState({ loading: true });
    overpassService.getOverpassData(this.state.bbox)
      .then((geojson) => {
        this.setState({
          geojson: geojson,
          loading: false
        })
      });
  }

  render() {
    return (
      <div className="App">
        <HelloWorld name="World !" />
        Nominatim
        <Nominatim
          handleSubmitControlled={this.handleSubmitControlled}
          handleSubmitUncontrolled={this.handleSubmitUncontrolled}
          handleChange={this.handleChange}
          handleInput={this.handleInput}
          inputValue={this.state.search}
          data={this.state.markers}
        />

        OverpassResults
        <OverpassResults
          geojson={this.state.geojson}
        />

        <Map
          id="map"
          markers={this.state.markers}
          geojson={this.state.geojson}
          changeBBox={this.handleChangeBBox}
        />
      </div>
    );
  }
}

export default App;
