import getLocationAsync, { getLocationPermissions } from '../location';
import * as ExpoPermissions from 'expo-permissions';
import * as ExpoLocations from 'expo-location';
import ERRORS from '../../constants/errors';

describe('getLocationPermissions', () => {
  it('Correctly gets the location permissions', async () => {
    jest.spyOn(ExpoPermissions, 'askAsync').mockImplementation(async () => {
      return new Promise(resolve => {
        resolve({
          status: 'denied' as ExpoPermissions.PermissionStatus,
          expires: null,
          permissions: null,
        });
      });
    });
    expect(await getLocationPermissions()).toBe(false);

    jest.spyOn(ExpoPermissions, 'askAsync').mockImplementation(async () => {
      return new Promise(resolve => {
        resolve({
          status: 'granted' as ExpoPermissions.PermissionStatus,
          expires: null,
          permissions: null,
        });
      });
    });
    expect(await getLocationPermissions()).toBe(true);
  });
});

describe('getLocationAsync', () => {
  const testLocation = {
    coords: {
      latitude: -34.873849,
      longitude: -56.329384,
      altitude: null,
      accuracy: null,
      speed: null,
      heading: null,
    },
    timestamp: 393939,
  };
  const mockImplementations = async (
    hasServicesEnabled: boolean,
    hasPermissionsEnabled: boolean,
  ) => {
    jest
      .spyOn(ExpoLocations, 'hasServicesEnabledAsync')
      .mockImplementation(async () => {
        return new Promise(resolve => {
          resolve(hasServicesEnabled);
        });
      });

    jest
      .spyOn(ExpoLocations, 'getCurrentPositionAsync')
      .mockImplementation(async () => {
        return new Promise(resolve => {
          resolve(testLocation);
        });
      });
    jest.spyOn(ExpoPermissions, 'askAsync').mockImplementation(async () => {
      return new Promise(resolve => {
        resolve({
          status: hasPermissionsEnabled
            ? ('granted' as ExpoPermissions.PermissionStatus)
            : ('denied' as ExpoPermissions.PermissionStatus),
          expires: null,
          permissions: null,
        });
      });
    });
  };
  it('Returns an error if the user is not authenticated or does not have the permissions enabled', async () => {
    mockImplementations(false, false);
    expect(await getLocationAsync()).toMatchObject(ERRORS.LOCATION);
    mockImplementations(true, false);
    expect(await getLocationAsync()).toMatchObject(ERRORS.LOCATION);
  });

  it('Returns the location if the user is authenticated and has permissions enabled', async () => {
    mockImplementations(true, true);
    expect(await getLocationAsync()).toMatchObject(testLocation);
  });
});
