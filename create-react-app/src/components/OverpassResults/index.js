import React from 'react';
import overpassService from '../../services/overpass';

import Map from '../Map';

import './style.css';

class OverpassResults extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            data: []
        }
    }
    
    componentWillMount() {
        overpassService.getOverpassData()
            .then((data) => {
                this.setState({data: JSON.stringify(data)})
            });
    }

    render() {
        console.log(this.state);
        return (
        <div className="OverpassResults">
            <div className="results">{ JSON.stringify(this.state.data) }</div>
            {
            this.state.loading === false &&
            <Map id="map-overpass" geojson={this.state.data} />
            }
        </div>
        );
    }
}

export default OverpassResults;
