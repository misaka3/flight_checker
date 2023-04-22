// utils/coordinateUtils.ts
import * as mgrs from 'mgrs';

export function latLonToMGRS(latitude: number, longitude: number): string {
  // Convert the given latitude and longitude to MGRS
  const mgrsString = mgrs.forward([longitude, latitude]);
  return mgrsString;
}
