import { PathLayer, ColumnLayer, IconLayer, PolygonLayer, ScatterplotLayer } from '@deck.gl/layers/typed';
import { PathStyleExtension } from '@deck.gl/extensions/typed';
import { getUtmCoordinates, mgrsToLatLon } from 'utils/coordinateUtils';

interface ColumnLayerObject {
  coordinates: [number, number];
  radius: number;
  altitude: number;
  grid_type: boolean;
  utm_coordinates: string;
  color?: [number, number, number, number];
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
    getFillColor: (d) => d.color || [255, 0, 0, 255 * 0.3],
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

function flattenGpxData(gpxDatas: any[], firstAltitude: number) {
  return gpxDatas.flatMap(d =>
    d.geometry.coordinates.map((coordinate: [number, number, number]) => ({
      ...d,
      geometry: {
        ...d.geometry,
        coordinates: [coordinate[0], coordinate[1], coordinate[2] - firstAltitude],
      },
    }))
  );
}

export function createScatterplotLayer( gpxDatas: any[], setHoverInfo: any, altitudeFlg = false ) {
  const firstAltitude = altitudeFlg ? gpxDatas[0].geometry.coordinates[0][2] : 0;
  const flattenedGpxDatas = flattenGpxData(gpxDatas, firstAltitude);
  const scatterplotLayer = new ScatterplotLayer({
    id: 'scatterplot-layer',
    data: flattenedGpxDatas,
    pickable: true,
    opacity: 0.8,
    stroked: true,
    filled: true,
    radiusMinPixels: 1,
    radiusMaxPixels: 100,
    lineWidthMinPixels: 1,
    getPosition: (d: any) => d.geometry.coordinates,
    getRadius: 2,
    getColor: (d: any) => altitudeToColor(d.geometry.coordinates[2] * 3.28084),
    onHover: (info: any) => handleHover(info, setHoverInfo)
  });

  return scatterplotLayer;
}

function handleHover(info: any, setHoverInfo: any) {
  const {object, x, y} = info;
  if (object) {
    const coordinate = object.geometry.coordinates;
    setHoverInfo({coordinate, x, y});
  } else {
    setHoverInfo(null);
  }
}

// gpx track
export function createPathLayer(gpxDatas: any[], altitudeFlg = false) {
  const firstAltitude = altitudeFlg ? gpxDatas[0].geometry.coordinates[0][2] : 0;
  const pathLayer = new PathLayer({
    id: 'path-layer',
    data: gpxDatas,
    getPath: (d: any) => 
      d.geometry.coordinates.map((coordinate: any) => {
        // 高度のずれを修正する
        return [coordinate[0], coordinate[1], coordinate[2] - firstAltitude];
      }),
    getColor: (d: any) =>
      d.geometry.coordinates.map((coordinate: any) =>
        altitudeToColor(coordinate[2] * 3.28084), // meters to feet
      ),
    getWidth: 10,
    extensions: [new PathStyleExtension({ dash: true })],
    getDashArray: (d: any) => [0, 0]
  });

  return pathLayer;
}

interface iconLayerObject {
  coordinates: [number, number];
}

export function createIconLayer(data: iconLayerObject) {
  const iconLayer = new IconLayer({
    id: 'icon-layer',
    data: [data],
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
    if (data.pz_type === 0 || data.pz_type === 4) {
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

interface TaskObject {
  id: number;
  flight_id: number;
  task_num: number;
  task_type_id: number;
  description: string;
  logger_marker: string;
  marker_color: string | null;
  marker_drop: string | null;
  mma: string | null;
  rule: string;
  scoring_area: string;
  scoring_period: string;
}

export function getMmaNumber(str: string): number | null {
  const re = /(\d+)[ｍm]/;
  const match = str.match(re);
  if (match !== null) {
    return Number(match[1]);
  } else {
    return null;
  }
}

// タスクデータのlayers作成関数
export function createTaskLayers(utm_zone: string, tasks: TaskObject[]) {
  const layers: any[] = [];
  tasks.forEach((task: TaskObject) => {
    // INFO: task_type_idがJDG(2)/HWZ(3)/FIN(4)/GBM(8)/CRT(9)のときのみ対応する
    if ([2,3,4,8,9].includes(task.task_type_id)) {
      // iconLayer
      const utm_coordinates = getUtmCoordinates(task.description);
      if (utm_coordinates.length === 1) {
        const wgs_coordinates = mgrsToLatLon(`${utm_zone}${utm_coordinates[0]}`);
        const task_icon_layer = createIconLayer({ coordinates: wgs_coordinates });
        layers.push(task_icon_layer);
        // columnLayer
        if (task.mma !== null) {
          const mma = getMmaNumber(task.mma);
          if (mma !== null) {
            const columnLayer: ColumnLayerObject = {
              coordinates: wgs_coordinates,
              radius: mma,
              altitude: 10,
              grid_type: true,
              utm_coordinates: utm_coordinates[0] as string,
              color: [0, 0, 255, 255*0.3]
            }
            const task_column_layer = createColumnLayer(columnLayer);
    
            layers.push(task_column_layer);
          }
        }
      } else if (utm_coordinates.length > 1) {
        const wgs_coordinates: [number, number][] = [];
        // const task_icon_layers = [];
        utm_coordinates.map(utm_coordinate => {
          const wgs_coordinate = mgrsToLatLon(`${utm_zone}${utm_coordinate}`);
          wgs_coordinates.push(wgs_coordinate);
          const task_icon_layer = createIconLayer({ coordinates: wgs_coordinate });
          layers.push(task_icon_layer);
          // columnLayer
          // if (task.mma === null) {
          //   // 複数のmmaを取得して、wgs_coordinatesの要素と合わせて使う
          //   const mmas = getMmaNumbers(task.description);
          //   if (mmas.length > 0) {
          //     const columnLayer: ColumnLayerObject = {
          //       coordinates: wgs_coordinates,
          //       radius: mma,
          //       altitude: 10,
          //       grid_type: true,
          //       utm_coordinates: utm_coordinates[0] as string,
          //       color: [0, 0, 255, 255*0.3]
          //     }
          //     const task_column_layer = createColumnLayer(columnLayer);
      
          //     layers.push(task_column_layer);
          //   }
          // }
        });
      }
    }
  })

  return layers;
}
