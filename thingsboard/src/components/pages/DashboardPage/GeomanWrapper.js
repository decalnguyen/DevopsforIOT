import { useCallback, useEffect, useRef } from "react";
import { FeatureGroup, useMap } from "react-leaflet";
import { GeomanControls } from "react-leaflet-geoman-v2";
import { convertToGeoJSON, convertToTBJSON } from "../../../utils";
import L from 'leaflet'
function GeomanWrapper({geoJSON, setGeoJSON, isEditMode}) {
    const ref = useRef(null);
    const handleChange = () => {
      const newGeo = {
        type: 'FeatureCollection',
        features: [],
      }
      const layers = ref.current?.getLayers();
      console.log(layers?.length);
      if (layers?.length > 0) {
        layers.forEach((layer) => {
          if (layer instanceof L.Circle || layer instanceof L.CircleMarker) {
            const { lat, lng } = layer?.getLatLng()
            newGeo.features.push({
              type: 'Feature',
              properties: {
                radius: layer?.getRadius(),
              },
              geometry: {
                type: 'Point',
                coordinates: [lng, lat],
              },
            })
          } else if (
            layer instanceof L.Marker ||
            layer instanceof L.Polygon ||
            layer instanceof L.Rectangle ||
            layer instanceof L.Polyline
          ) {
            newGeo.features.push(layer?.toGeoJSON())
          }
        })
      }
      setGeoJSON(convertToTBJSON(newGeo));
    }

    useEffect(() => {
      console.log(geoJSON);
        const geojson = convertToGeoJSON(geoJSON);
        const layers = ref.current?.getLayers();
      // alert(layers?.length)
        layers && layers?.length > 0 && layers.forEach((layer) => ref.current.removeLayer(layer));
        console.log(geojson); 
        if (geojson) {
            // const isEmpty = geojson.features.some(value => {
            //   const coords = value?.geometry?.coordinates;
            //   return !coords 
            //   || (Array.isArray(coords) && coords.length === 0) 
            //   || Object.keys(coords).length === 0});
            // if(isEmpty) {
            //   // setGeoJSON({});
            //   return;
            // }
          L.geoJSON(geojson).eachLayer((layer) => {
            console.log(layer);
            if(!Array.isArray(layer.feature.geometry.coordinates)) return;
            if (
              layer instanceof L.Polyline ||
              layer instanceof L.Polygon ||
              layer instanceof L.Marker
            ) {
              if (layer?.feature?.properties.radius && ref.current) {
                const newLayer = new L.Circle(layer.feature.geometry.coordinates.slice().reverse(), {
                  radius: layer.feature?.properties.radius,
                });
                newLayer.on('pm:edit', handleChange);
                newLayer.addTo(ref.current);
              } else {
                layer.on('pm:edit', handleChange);
                layer.on('pm:remove', () => ref.current.removeLayer(layer));
                ref.current?.addLayer(layer)
              }
            }
          })
          console.log('line 26:',geoJSON);
        }
      }, [geoJSON])

    console.log(ref.current);
    return ( <FeatureGroup ref={ref}>
        {isEditMode && <GeomanControls 
            options={{
                position: 'bottomright',
                drawText: false,
            }}
            globalOptions={{
                continueDrawing: false,
            }}
            onCreate={handleChange}
            onEdit={handleChange}
            onLayerRemove={handleChange}
            onMapRemove={handleChange}
            onUpdate={handleChange}
        />}
    </FeatureGroup> );
}

export default GeomanWrapper;