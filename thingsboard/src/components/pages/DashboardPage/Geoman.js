import { useEffect, useRef } from 'react';
import L from 'leaflet';
import { FeatureGroup } from 'react-leaflet';
import { GeomanControls } from 'react-leaflet-geoman-v2';
function Geoman({ geoJSON, setGeoJSON }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current?.getLayers().length === 0 && geoJSON) {
      L.geoJSON(geoJSON).eachLayer((layer) => {
        if (layer instanceof L.Polyline || layer instanceof L.Polygon || layer instanceof L.Marker) {
          if (layer?.feature?.properties.radius && ref.current) {
            new L.Circle(layer.feature.geometry.coordinates.slice().reverse(), {
              radius: layer.feature?.properties.radius,
            }).addTo(ref.current);
          } else {
            ref.current?.addLayer(layer);
          }
        }
      });
    }
  }, [geoJSON]);

  const handleChange = () => {
    const newGeo = {
      type: 'FeatureCollection',
      features: [],
    };
    const layers = ref.current?.getLayers();
    if (layers) {
      layers.forEach((layer) => {
        if (layer instanceof L.Circle || layer instanceof L.CircleMarker) {
          const { lat, lng } = layer.getLatLng();
          newGeo.features.push({
            type: 'Feature',
            properties: {
              radius: layer.getRadius(),
            },
            geometry: {
              type: 'Point',
              coordinates: [lng, lat],
            },
          });
        } else if (
          layer instanceof L.Marker ||
          layer instanceof L.Polygon ||
          layer instanceof L.Rectangle ||
          layer instanceof L.Polyline
        ) {
          newGeo.features.push(layer.toGeoJSON());
        }
      });
    }
    setGeoJSON(newGeo);
  };
  return (
    <FeatureGroup ref={ref}>
      <GeomanControls
        options={{
          position: 'topleft',
          drawText: false,
        }}
        globalOptions={{
          continueDrawing: true,
          editable: false,
        }}
        // onMount={() => L.PM.setOptIn(true)}
        // onUnmount={() => L.PM.setOptIn(false)}
        eventDebugFn={console.log}
        onCreate={handleChange}
        onChange={handleChange}
        onUpdate={handleChange}
        onEdit={handleChange}
        onMapRemove={handleChange}
        onMapCut={handleChange}
        onDragEnd={handleChange}
        onMarkerDragEnd={handleChange}
      />
    </FeatureGroup>
  );
}

export default Geoman;
