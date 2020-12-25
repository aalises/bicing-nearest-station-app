import ERRORS, { Error } from '../constants/errors';
import {
  getCachedData,
  setCachedData,
  isDataCachedValid,
} from '../services/cache';
import { Modes } from '../components/ModeSelector';

export interface StationInfoAPIResponse {
  last_updated: number;
  ttl: number;
  data: {
    stations: Array<{
      address: string;
      capacity: number;
      lat: number;
      lon: number;
      altitude: number;
      name: string;
      nearby_distance: number;
      physical_configuration: 'MECHANICBIKESTATION' | 'ELECTRICBIKESTATION';
      post_code: string;
      station_id: number;
    }>;
  };
}

interface StationStatusAPIResponse {
  last_updated: number;
  ttl: number;
  data: {
    stations: Array<{
      station_id: number;
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
      status: 'IN_SERVICE' | 'CLOSED';
    }>;
  };
}

export interface StationsInfo {
  data: {
    stations: Array<StationInfo>;
  };
}

export interface StationInfo {
  id: number;
  name: string;
  capacity: number;
  distance?: number;
  latitude: number;
  longitude: number;
  numBikesAvailable: number;
  numDocksAvailable: number;
  numBikesAvailableTypes: {
    ebike: number;
    mechanical: number;
  };
}

const fetchStationsData = async (
  mode?: Modes,
): Promise<StationsInfo | Error> => {
  try {
    let stationInfoData: StationInfoAPIResponse = null;
    const isDataCacheValid = await isDataCachedValid();
    //Set the info data from the cache if it's valid or fetch it otherwise
    if (isDataCacheValid) {
      const { data } = await getCachedData();
      stationInfoData = data;
    } else {
      const stationInfoResponse = await fetch(
        'https://api.bsmsa.eu/ext/api/bsm/gbfs/v2/en/station_information',
      );

      stationInfoData = await stationInfoResponse.json();
      await setCachedData(JSON.stringify({ stationInfoData }));
    }

    if (!stationInfoData) return ERRORS.FETCH;

    const stationStatusResponse = await fetch(
      'https://api.bsmsa.eu/ext/api/bsm/gbfs/v2/en/station_status',
    );
    const stationStatusData: StationStatusAPIResponse = await stationStatusResponse.json();

    if (!stationStatusData) return ERRORS.FETCH;

    return sanitizeStationsData(stationInfoData, stationStatusData, mode);
  } catch (error) {
    return ERRORS.FETCH;
  }
};

//Filters out the stations that do not have bikes or do not have available
//spaces based on the mode (return or rent)
export const filterByMode = (
  stationsInfo: StationInfo[],
  mode: Modes,
): StationInfo[] => {
  if (mode === 'RENT') {
    return stationsInfo.filter(
      ({ numBikesAvailable }) => numBikesAvailable !== 0,
    );
  }

  return stationsInfo.filter(
    ({ numDocksAvailable }) => numDocksAvailable !== 0,
  );
};

export const sanitizeStationsData = (
  stationInfoData: StationInfoAPIResponse,
  stationStatusData: StationStatusAPIResponse,
  mode?: Modes,
): StationsInfo => {
  if (!(stationInfoData && stationStatusData)) return null;

  const sanitizedStationInfo = stationInfoData?.data?.stations?.map(
    station => ({
      capacity: station?.capacity,
      id: station?.station_id,
      name: station?.name,
      latitude: station?.lat,
      longitude: station?.lon,
    }),
  );

  const sanitizedStationStatus = stationStatusData?.data?.stations?.map(
    station => ({
      id: station?.station_id,
      numBikesAvailable: station?.num_bikes_available,
      numDocksAvailable: station?.num_docks_available,
      numBikesAvailableTypes: {
        ebike: station?.num_bikes_available_types?.ebike,
        mechanical: station?.num_bikes_available_types?.mechanical,
      },
      status: station?.status,
    }),
  );
  const sanitizedStations = sanitizedStationInfo
    .map(station => ({
      ...sanitizedStationStatus.find(({ id }) => id === station?.id),
      ...station,
    }))
    .filter(({ status }) => status === 'IN_SERVICE');

  return {
    data: {
      stations: filterByMode(sanitizedStations, mode ?? 'RENT'),
    },
  };
};

export default fetchStationsData;
