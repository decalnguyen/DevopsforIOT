import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, FeatureGroup, useMap } from 'react-leaflet';
import { EditControl } from 'react-leaflet-draw';
import { SearchControl, OpenStreetMapProvider, GeoSearchControl } from 'leaflet-geosearch';
const Search = (props) => {
  const map = useMap(); // access to leaflet map
  const { provider } = props;

  useEffect(() => {
    const searchControl = new GeoSearchControl({
      provider,
      style: 'bar',
    });

    map.addControl(searchControl); // this is how you add a control in vanilla leaflet
    return () => map.removeControl(searchControl);
  }, [props, map, provider]);

  return null; // don't want anything to show up from this comp
};

export default Search;
