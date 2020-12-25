import { AsyncStorage } from 'react-native';
import { StationInfoAPIResponse } from '../services/fetchStationsData';

export const TTL = 600;
const CACHE_KEY = 'station_data';

interface CacheOperationResponse {
  success: boolean;
  data: StationInfoAPIResponse;
}

export const setCachedData = async (
  stationInfo: string,
): Promise<CacheOperationResponse> => {
  try {
    await AsyncStorage.setItem(CACHE_KEY, stationInfo);
    return { success: true, data: null };
  } catch (error) {
    return { success: false, data: null };
  }
};

export const getCachedData = async (): Promise<CacheOperationResponse> => {
  try {
    const cachedData = await AsyncStorage.getItem(CACHE_KEY);
    return { success: true, data: JSON.parse(cachedData).stationInfoData };
  } catch (error) {
    return { success: false, data: null };
  }
};

export const isDataCachedValid = async (): Promise<boolean> => {
  //The data is valid if there has been less than 10min between the last updated and the current timestamp
  const { success, data } = await getCachedData();
  if (!success || !data) return false;

  const currentTimestampInSeconds = Math.floor(Date.now() / 1000);
  return currentTimestampInSeconds - data.last_updated < TTL;
};
