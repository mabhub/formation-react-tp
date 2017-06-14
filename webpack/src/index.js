import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import osmtogeojson from 'osmtogeojson';
import './styles.css';

class HelloWorld extends React.Component {
    render() {
        return (
            <div className="HelloWorld">Hello {this.props.name}</div>
        );
    }
}

class NominatimResults extends React.Component {

    constructor() {
        super();
        this.state = {
            data: []
        }
    }
    getNominatimData() {
        return axios.get('http://nominatim.openstreetmap.org/search/toulouse?format=json')
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    componentWillMount() {
        this.getNominatimData()
            .then((data) => this.setState({data: data}));
    }

    render() {
        return (
            <ul className="NominatimResults">
                {
                    this.state.data.map((currentResult, index) => (
                        <li key={index}>{currentResult.display_name} ({currentResult.lat}, {currentResult.lon})</li>
                    ))
                }
            </ul>
        );
    }
}


class OverpassResults extends React.Component {

    constructor() {
        super();
        this.state = {
            data: []
        }
    }
    getOverpassData() {
        return axios.get('http://overpass-api.de/api/interpreter?data=[out:xml];(way[%22leisure%22=%22park%22](43.54506428956427,1.3108062744140625,43.663525432098275,1.571388244628906););out%20body;%3E;out%20skel%20qt;')
            .then(function (response) {
                return response.data;
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    getGeoJSONFromOverpass() {
        return this.getOverpassData()
            .then((data) => {
                var osmGeojson = osmtogeojson(new DOMParser().parseFromString(data, 'text/xml'));

                // osmtogeojson writes polygon coordinates in anticlockwise order, not fitting the geojson specs.
                // Polygon coordinates need therefore to be reversed
                osmGeojson.features.forEach(function(feature, index) {

                    if (feature.geometry.type === 'Polygon') {
                        var n = feature.geometry.coordinates.length;
                        feature.geometry.coordinates[0].reverse();

                        if (n > 1) {
                            for (var i = 1; i < n; i++) {
                                var reversedCoordinates = feature.geometry.coordinates[i].slice().reverse();
                                osmGeojson.features[index].geometry.coordinates[i] = reversedCoordinates;
                            }
                        }
                    }

                    if (feature.geometry.type === 'MultiPolygon') {
                        // Split it in simple polygons
                        feature.geometry.coordinates.forEach(function(coords) {
                            var n = coords.length;
                            coords[0].reverse();

                            if (n > 1) {
                                for (var i = 1; i < n; i++) {
                                    coords[i] = coords[i].slice().reverse();
                                }
                            }
                            osmGeojson.features.push(
                                {
                                    'type': 'Feature',
                                    'properties': osmGeojson.features[index].properties,
                                    'geometry': {
                                        'type': 'Polygon', 
                                        'coordinates': coords
                                    }
                                });
                        });
                    }
                });

                return osmGeojson;
            });
    }

    componentWillMount() {
        this.getGeoJSONFromOverpass()
            .then((data) => {
                this.setState({data: JSON.stringify(data)})
            });
    }

    render() {
        return (
            <div className="OverpassResults">
                { this.state.data }
            </div>
        );
    }
}

class App extends React.Component {
  render() {
    return (
      <div className="App">
          <HelloWorld name="World !" />
          NominatimResults
          <NominatimResults />
          OverpassResults
          <OverpassResults />
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('root'));
