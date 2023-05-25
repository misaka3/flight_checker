import { ColumnLayer, IconLayer, ScatterplotLayer, SolidPolygonLayer } from '@deck.gl/layers/typed';
import { getUtmCoordinates, mgrsToLatLon } from 'utils/coordinateUtils';
import { Waypoint } from '../../types/interface';

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

interface SolidPolygonLayerObject {
  polygon: [number, number][];
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

export function altitudeToColor(altitude: number, minAltitude: number, maxAltitude: number): [number, number, number] {
  // min, max altitude feet
  const minAltitudeFt = minAltitude * 3.28084;
  const maxAltitudeFt = maxAltitude * 3.28084;

  const t = (altitude - minAltitudeFt) / (maxAltitudeFt - minAltitudeFt);
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

export function createScatterplotLayer( gpxDatas: any[], setHoverInfo: any, altitudeFlg = false, minAltitude = 0, maxAltitude = 0 ) {
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
    getColor: (d: any) => altitudeToColor(d.geometry.coordinates[2] * 3.28084, minAltitude, maxAltitude),
    onHover: (info: any) => handleHover(info, setHoverInfo, firstAltitude)
  });

  return scatterplotLayer;
}

function handleHover(info: any, setHoverInfo: any, firstAltitude: number) {
  const {object, x, y} = info;
  if (object) {
    const coordinates = object.geometry.coordinates;
    const coordinate = [coordinates[0], coordinates[1], coordinates[2] + firstAltitude];

    setHoverInfo({coordinate, x, y});
  } else {
    setHoverInfo(null);
  }
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
// export function createPolygonLayer(data: PolygonLayerObject) {
//   const polygonLayer = new PolygonLayer({
//     id: 'polygon-layer',
//     data: [data],
//     pickable: true,
//     stroked: true,
//     filled: true,
//     wireframe: true,
//     lineWidthMinPixels: 1,
//     getPolygon: d => d.contour,
//     extruded: true,
//     // change meters from feets
//     getElevation: (d) => d.altitude / 3.28084,
//     getFillColor: d => d.color,
//     getLineColor: d => d.color,
//     getLineWidth: 1
//   });

//   return polygonLayer;
// }

// 多角形PZを１つのLayerにまとめる
export function createSolidPolygonLayer(data: SolidPolygonLayerObject[]) {
  const solidPolygonLayer = new SolidPolygonLayer({
    data,
    getPolygon: (d: SolidPolygonLayerObject) => d.polygon,
    getFillColor: (d: SolidPolygonLayerObject) => d.color,
    extruded: true,
    getElevation: (d: SolidPolygonLayerObject) => d.altitude / 3.28084,
  });

  return solidPolygonLayer;
}

// PZのlayers作成関数
export function createPzLayers(datas: PzObject[]) {
  const layers: any[] = [];
  const solidPolygonLayers: any[] = [];
  datas.forEach((data: PzObject) => {
    let layer;
    if (data.pz_type === 0 || data.pz_type === 4) {
      layer = createColumnLayer(data.data as ColumnLayerObject);
      layers.push(layer);
    } else if (data.pz_type === 1 || data.pz_type === 2 || data.pz_type === 3) {
      const polygon_data = data.data as PolygonLayerObject;
      const solidPolygonLayer = {
        polygon: polygon_data.contour,
        color: polygon_data.color,
        altitude: polygon_data.altitude
      }
      solidPolygonLayers.push(solidPolygonLayer);
    }
  })
  const solidPolygonLayer = createSolidPolygonLayer(solidPolygonLayers);
  layers.push(solidPolygonLayer);

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

// INFO: レイヤーid重複を避けるための処理
export function layerIdChange(layers: any[]) {
  const new_layers = layers.map((layer, index) => {
    layer.id = `${layer.id}${index}`;
    return layer;
  });

  return new_layers;
}

export function createWptLayer( waypoints: Waypoint[] ) {
  const data = waypoints.map((waypoint: Waypoint) => {
    const coordinate = [waypoint.longitude, waypoint.latitude];
    return {
      coordinates: coordinate,
      radius: waypoint.radius,
      altitude: waypoint.altitude ? waypoint.altitude : 10,
      grid_type: false,
      utm_coordinates: null,
      color: [0, 255, 0, 255*0.3]
    }
  });
  const layers = data.map((d: any) => {
    return new ColumnLayer({
      id: 'wpt-layer',
      data: [d],
      getPosition: (d) => d.coordinates,
      getFillColor: (d) => d.color,
      radius: d.radius,
      // change altitude to meters from feet
      getElevation: (d) => d.altitude / 3.28084,
      pickable: true,
    });
  });
  return layers;
}
