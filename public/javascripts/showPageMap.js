mapboxgl.accessToken = mapToken
const map = new mapboxgl.Map({
  container: 'map',
  style: 'mapbox://styles/mapbox/streets-v11',
  center: geometry,
  zoom: 15.5,
  pitch: 45
})

function rotateCamera(timestamp) {
  // clamp the rotation between 0 -360 degrees
  // Divide timestamp by 100 to slow rotation to ~10 degrees / sec
  map.rotateTo((timestamp / 100) % 360, { duration: 0 });
  // Request the next frame of the animation.
  requestAnimationFrame(rotateCamera);
}

const nav = new mapboxgl.NavigationControl({
  visualizePitch: true
})

map.on('load', () => {
  // Start the animation.
  rotateCamera(0);

  // Add 3d buildings and remove label layers to enhance the map
  const layers = map.getStyle().layers
  for (const layer of layers) {
    if (layer.type === 'symbol' && layer.layout['text-field']) {
      // remove text labels
      map.removeLayer(layer.id)
    }
  }

  map.addLayer({
    'id': '3d-buildings',
    'source': 'composite',
    'source-layer': 'building',
    'filter': ['==', 'extrude', 'true'],
    'type': 'fill-extrusion',
    'minzoom': 15,
    'paint': {
      'fill-extrusion-color': '#aaa',

      // use an 'interpolate' expression to add a smooth transition effect to the
      // buildings as the user zooms in
      'fill-extrusion-height': [
        'interpolate',
        ['linear'],
        ['zoom'],
        15,
        0,
        15.05,
        ['get', 'height']
      ],
      'fill-extrusion-base': [
        'interpolate',
        ['linear'],
        ['zoom'],
        15,
        0,
        15.05,
        ['get', 'min_height']
      ],
      'fill-extrusion-opacity': 0.6
    }
  })
})

new mapboxgl.Marker()
  .setLngLat(geometry)
  .setPopup(
    new mapboxgl.Popup({ offset: 25 })
      .setHTML(
        `<h3>${title}</h3>`
      )
  )
  .addTo(map)