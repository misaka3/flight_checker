import { PathLayer, ColumnLayer, IconLayer } from '@deck.gl/layers/typed';
import { PathStyleExtension } from '@deck.gl/extensions/typed';

interface PzObject {
  coordinates: [number, number];
  radius: number;
  altitude: number;
}

// cylinder object
export function createColumnLayer(pz: PzObject) {
  return new ColumnLayer({
    id: `column-layer-${pz.coordinates}`,
    data: [pz],
    getPosition: (d: PzObject) => d.coordinates,
    getFillColor: [255, 0, 0, 255 * 0.5],
    radius: pz.radius,
    // change altitude to meters from feet
    getElevation: (d: PzObject) => d.altitude / 3.28084,
    pickable: true,
  });
}

export function altitudeToColor(altitude: number): [number, number, number] {
  // min, max altitude feet
  const minAltitude = 0;
  const maxAltitude = 4000;

  const t = (altitude - minAltitude) / (maxAltitude - minAltitude);
  const r = t * 255;
  const g = 0;
  const b = (1 - t) * 255;

  return [r, g, b];
}

// gpx track
export function createPathLayer(gpxDatas: any[]) {
  const pathLayer = new PathLayer({
    id: 'path-layer',
    data: gpxDatas,
    getPath: (d: any) => d.geometry.coordinates,
    getColor: (d: any) =>
      d.geometry.coordinates.map((coordinate: any) =>
        altitudeToColor(coordinate[2] * 3.28084), // meters to feet
      ),
    getWidth: 20,
    extensions: [new PathStyleExtension({ dash: true })],
    getDashArray: (d: any) => [0, 0],
  });

  return pathLayer;
}

interface iconLayerProps {
  coordinates: [number, number];
}

export function createIconLayer({ coordinates }: iconLayerProps) {
  const data = [{ coordinates: coordinates }];
  const iconLayer = new IconLayer({
    id: 'icon-layer',
    data,
    pickable: true,
    iconAtlas: 'https://raw.githubusercontent.com/visgl/deck.gl-data/master/website/icon-atlas.png',
    iconMapping: { marker: { x: 0, y: 0, width: 128, height: 128, mask: true } },
    getIcon: d => 'marker',
  
    sizeScale: 15,
    sizeMinPixels: 30,
    sizeMaxPixels: 30,
    getPosition: d => d.coordinates,
    getSize: d => 5,
    getColor: [0, 140, 0]
  });

  return iconLayer;
}

