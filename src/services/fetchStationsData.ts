import ERRORS, { Error } from '../utils/constants/errors';

type StationInfoAPIResponse = {
  last_updated: number;
  ttl: number;
  data: {
    stations: Array<{
      address: string;
      altitude: number;
      capacity: number;
      lat: number;
      lon: number;
      name: string;
      nearby_distance: number;
      physical_configuration: 'MECHANICBIKESTATION' | 'ELECTRICBIKESTATION';
      post_code: string;
      station_id: number;
    }>;
  };
};

type StationStatusAPIResponse = {
  last_updated: number;
  ttl: number;
  data: {
    stations: Array<{
      is_charging_station: boolean;
      is_installed: 1 | 0;
      is_renting: 1 | 0;
      is_returning: 1 | 0;
      last_reported: number;
      num_bikes_available: number;
      num_bikes_available_types: {
        ebike: number;
        mechanical: number;
      };
      num_docks_available: number;
      station_id: number;
      status: 'IN_SERVICE' | 'CLOSED';
    }>;
  };
};

export type StationsInfo = {
  timestamp: number;
  data: {
    stations: Array<StationInfo>;
  };
};

export type StationInfo = {
  id: number;
  name: string;
  capacity: number;
  distance?: number;
  latitude: number;
  longitude: number;
  numBikesAvailable: number;
};

const fetchStationsData = async (): Promise<StationsInfo | Error> => {
  try {
    const stationInfoResponse = await fetch(
      'https://api.bsmsa.eu/ext/api/bsm/gbfs/v2/en/station_information',
    );
    const stationInfoData: StationInfoAPIResponse = await stationInfoResponse.json();

    const stationStatusResponse = await fetch(
      'https://api.bsmsa.eu/ext/api/bsm/gbfs/v2/en/station_status',
    );
    const stationStatusData: StationStatusAPIResponse = await stationStatusResponse.json();

    if (!(stationInfoData && stationStatusData)) return ERRORS.FETCH;

    return sanitizeStationsData(stationInfoData, stationStatusData);
  } catch (error) {
    return ERRORS.FETCH;
  }
};

const sanitizeStationsData = (
  stationInfoData: StationInfoAPIResponse,
  stationStatusData: StationStatusAPIResponse,
): StationsInfo => {
  const sanitizedStationInfo = stationInfoData.data.stations.map(station => ({
    capacity: station.capacity,
    id: station.station_id,
    name: station.name,
    latitude: station.lat,
    longitude: station.lon,
  }));

  const sanitizedStationStatus = stationStatusData.data.stations.map(
    station => ({
      id: station.station_id,
      numBikesAvailable: station.num_bikes_available,
      status: station.status,
    }),
  );

  const sanitizedStations = sanitizedStationInfo
    .map(station => ({
      ...sanitizedStationStatus.find(({ id }) => id === station.id),
      ...station,
    }))
    .filter(({ status }) => status === 'IN_SERVICE');

  return {
    timestamp: new Date().getTime(),
    data: {
      stations: sanitizedStations,
    },
  };
};

export default fetchStationsData;
