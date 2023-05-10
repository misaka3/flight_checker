import * as mgrs from 'mgrs';

export function latLonToMGRS(latitude: number, longitude: number): string {
  const mgrsString = mgrs.forward([longitude, latitude]);
  return mgrsString;
}

// UTM座標をWGS84座標(緯度経度は小数点以下10桁で四捨五入)に変換する
export function mgrsToLatLon(mgrsString: string): [number, number] {
  const latLon = mgrs.toPoint(mgrsString);
  const roundedLon = parseFloat(latLon[0].toFixed(10));
  const roundedLat = parseFloat(latLon[1].toFixed(10));
  return [roundedLon, roundedLat];
}

// mapboxにlayerを追加する際の初期表示位置取得
export function getInitialCoordinates(features: any[]): [number, number] | undefined {
  if (features.length === 0) return undefined;
  const firstFeature = features[0];
  const coordinates = firstFeature.geometry.coordinates;
  if (coordinates.length === 0) return undefined;
  return coordinates[0]; // [longitude(number), latitude(number), altitude(number)]
};

// UTMグリッドの抽出後10桁の数字(文字列)を返す関数
export function getUtmCoordinates(str: string): string[] {
  console.log("str:", str);
  const regex = /(\d{4}).+(\d{4})/g;
  const results: string[] = [];
  let result;
  while ((result = regex.exec(str)) !== null) {
    console.log("result:", result);
    const [_, firstFourDigits, secondFourDigits] = result;
    results.push(`${firstFourDigits}0${secondFourDigits}0`);
  }
  return results;
}
