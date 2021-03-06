import React from 'react';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';
import './style.css';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow
});

L.Marker.prototype.options.icon = DefaultIcon;

class Map extends React.Component {
  constructor(props) {
    super(props);
    this.markers = [];
    this.map = {};
    this.geojson = {};
  }

  removeMarkers() {
    this.markers.forEach((marker, index) => {
      marker.removeFrom(this.map);
      delete this.markers[index];
    });
  }

  displayMarkers(markers) {
    this.removeMarkers();
    markers.forEach(marker => {
      this.markers.push(
        L.marker([marker.lat, marker.lon])
          .addTo(this.map)
          .bindPopup(marker.display_name)
      );
    })

    if (markers[0]) {
      const marker = markers[0]
      this.map.setView([marker.lat, marker.lon]);
    }
  }

  displayGeoJSON(geojson) {
    if (typeof this.geojson === L.GeoJSON)
      this.geojson.removeFrom(this.map);
    this.geojson = L.geoJSON(geojson).addTo(this.map);
  }

  dispatchBBox(bbox) {
    this.props.changeBBox && this.props.changeBBox(bbox);
  }

  componentDidMount() {
    this.map = L.map(this.props.id).setView([43.604268, 1.441019], 13);

    this.map.on('zoomend moveend', () => this.dispatchBBox(this.map.getBounds()));
    this.dispatchBBox(this.map.getBounds());

    L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    !!this.props.markers && this.displayMarkers(this.props.markers);
    !!this.props.geojson && this.displayGeoJSON(this.props.geojson);
  }

  componentWillReceiveProps(nextProps) {
    const markerChanged = (this.props.markers[0] && this.props.markers[0].display_name) !== (nextProps.markers[0] && nextProps.markers[0].display_name);

    markerChanged && this.displayMarkers(nextProps.markers);
    !!this.props.geojson !== nextProps.geojson && this.displayGeoJSON(nextProps.geojson);
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    return <div id={this.props.id} />;
  }
}

export default Map;
