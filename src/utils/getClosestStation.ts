import { StationsInfo, StationInfo } from '../services/fetchStationsData';
import { LocationData } from 'expo-location';
import getDistance from 'geolib/es/getDistance';
import ERRORS, { Error } from './constants/errors';

type ClosestStationID = {
  id: number;
  distance: number;
};
const getClosestStation = (
  stations: StationsInfo,
  location: LocationData,
): StationInfo | Error => {
  const { id, distance }: ClosestStationID = stations.data.stations.reduce(
    (closestStationInfo, station) => {
      const stationCoords = {
        latitude: station.latitude,
        longitude: station.longitude,
      };
      const locationCoords = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };

      const distance = getDistance(locationCoords, stationCoords);
      if (
        closestStationInfo.distance === null ||
        distance < Number(closestStationInfo.distance)
      ) {
        return { id: station.id, distance };
      }

      return closestStationInfo;
    },
    {
      id: null,
      distance: null,
    },
  );

  if (!id) return ERRORS.CLOSEST;

  const closestStation = {
    ...stations.data.stations.find(station => station.id === id),
    distance,
  };

  return closestStation;
};

export default getClosestStation;
