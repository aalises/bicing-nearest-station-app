import {
  getCurrentPositionAsync,
  LocationData,
  hasServicesEnabledAsync,
} from 'expo-location';
import { LOCATION, askAsync } from 'expo-permissions';
import ERRORS, { Error } from '../constants/errors';

const getLocationPermissions = async (): Promise<boolean> => {
  const { status } = await askAsync(LOCATION);
  return status === 'granted';
};

const getLocationAsync = async (): Promise<LocationData | Error> => {
  const authenticated = await getLocationPermissions();
  const hasLocationEnabled = await hasServicesEnabledAsync();

  if (!authenticated || !hasLocationEnabled) return ERRORS.LOCATION;

  const currentLocation = await getCurrentPositionAsync({});
  return currentLocation;
};

export default getLocationAsync;
