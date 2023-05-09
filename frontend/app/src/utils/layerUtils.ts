import { PathLayer, ColumnLayer, IconLayer, PolygonLayer } from '@deck.gl/layers/typed';
import { PathStyleExtension } from '@deck.gl/extensions/typed';

interface ColumnLayerObject {
  coordinates: [number, number];
  radius: number;
  altitude: number;
  grid_type: boolean;
  utm_coordinates: string;
}

interface PzObject {
  id: number;
  area_id: number;
  name: string;
  pz_type: number;
  data: ColumnLayerObject | PolygonLayerObject;
}

interface PolygonLayerObject {
  contour: [number, number][];
  altitude: number;
  color: [number, number, number, number];
}

// cylinder object
export function createColumnLayer(data: ColumnLayerObject) {
  return new ColumnLayer({
    id: 'column-layer',
    data: [data],
    getPosition: (d) => d.coordinates,
    getFillColor: [255, 0, 0, 255 * 0.3],
    radius: data.radius,
    // change altitude to meters from feet
    getElevation: (d) => d.altitude / 3.28084,
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

// 多角形PZ
export function createPolygonLayer(data: PolygonLayerObject) {
  const polygonLayer = new PolygonLayer({
    id: 'polygon-layer',
    data: [data],
    pickable: true,
    stroked: true,
    filled: true,
    wireframe: true,
    lineWidthMinPixels: 1,
    getPolygon: d => d.contour,
    extruded: true,
    // change meters from feets
    getElevation: (d) => d.altitude / 3.28084,
    getFillColor: d => d.color,
    getLineColor: d => d.color,
    getLineWidth: 1
  });

  return polygonLayer;
}

// PZのlayers作成関数
export function createPzLayers(datas: PzObject[]) {
  const layers: any[] = [];
  datas.forEach((data: PzObject) => {
    let layer;
    if (data.pz_type === 0) {
      layer = createColumnLayer(data.data as ColumnLayerObject);
    } else if (data.pz_type === 1 || data.pz_type === 2) {
      layer = createPolygonLayer(data.data as PolygonLayerObject);
    } else if (data.pz_type === 3) {
      layer = createPolygonLayer(data.data as PolygonLayerObject);
    }
    layers.push(layer);
  })

  return layers;
}
