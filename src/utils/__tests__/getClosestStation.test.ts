import getClosestStation from '../getClosestStation';
import { StationInfo } from '../../services/fetchStationsData';
import ERRORS from '../../constants/errors';

describe('getClosestStation', () => {
  it('Correctly gets the closest station from a given location', () => {
    const stationsInfo = {
      data: {
        stations: [
          {
            id: 39,
            name: 'Centro de Fotografia de Montevideo',
            capacity: 20,
            distance: 94,
            latitude: -34.905759,
            longitude: -56.197307,
            numBikesAvailable: 10,
            numDocksAvailable: 10,
          },
          {
            id: 20,
            name: 'National Art Museum of China',
            capacity: 20,
            distance: 94,
            latitude: 39.926532,
            longitude: 116.409167,
            numBikesAvailable: 10,
            numDocksAvailable: 10,
          },
        ],
      },
    };
    expect(
      (getClosestStation(stationsInfo, {
        coords: {
          latitude: -34.873849,
          longitude: -56.329384,
          altitude: null,
          accuracy: null,
          speed: null,
          heading: null,
        },
        timestamp: 393939,
      }) as StationInfo).name,
    ).toBe('Centro de Fotografia de Montevideo');
    expect(
      (getClosestStation(stationsInfo, {
        coords: {
          latitude: 39.916232,
          longitude: 116.319137,
          altitude: null,
          accuracy: null,
          speed: null,
          heading: null,
        },
        timestamp: 393939,
      }) as StationInfo).name,
    ).toBe('National Art Museum of China');
  });

  it('Returns an error when it could not find the closest station', () => {
    const invalidStationsInfo = {
      data: {
        stations: [
          {
            id: 10,
            name: 'Who knows',
            capacity: 20,
            distance: 94,
            latitude: null,
            longitude: -50.197307,
            numBikesAvailable: 10,
            numDocksAvailable: 10,
          },
          {
            id: 22,
            name: 'No information either',
            capacity: 20,
            distance: 94,
            latitude: null,
            longitude: null,
            numBikesAvailable: 10,
            numDocksAvailable: 10,
          },
        ],
      },
    };
    expect(
      getClosestStation(invalidStationsInfo, {
        coords: {
          latitude: 39.916232,
          longitude: 116.319137,
          altitude: null,
          accuracy: null,
          speed: null,
          heading: null,
        },
        timestamp: 393939,
      }),
    ).toMatchObject(ERRORS.CLOSEST);
  });
  expect(getClosestStation(null, null)).toMatchObject(ERRORS.CLOSEST);
});
