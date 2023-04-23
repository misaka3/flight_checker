import * as mgrs from 'mgrs';

export function latLonToMGRS(latitude: number, longitude: number): string {
  const mgrsString = mgrs.forward([longitude, latitude]);
  return mgrsString;
}

// UTM座標をWGS84座標(緯度経度は小数点以下6桁で四捨五入)に変換する
export function mgrsToLatLon(mgrsString: string): [number, number] {
  const latLon = mgrs.toPoint(mgrsString);
  const roundedLon = parseFloat(latLon[0].toFixed(6));
  const roundedLat = parseFloat(latLon[1].toFixed(6));
  return [roundedLat, roundedLon];
}
