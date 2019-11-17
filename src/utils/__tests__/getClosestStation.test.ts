import getClosestStation from '../getClosestStation';
import { StationInfo } from '../../services/fetchStationsData';
import ERRORS from '../../constants/errors';
import {
  LocationsFixture,
  StationsFixture,
} from '../../constants/__fixtures__';
describe('getClosestStation', () => {
  it('Correctly gets the closest station from a given location', () => {
    const stationsInfo = {
      data: {
        stations: StationsFixture.valid,
      },
    };
    expect(
      (getClosestStation(
        stationsInfo,
        LocationsFixture.PlazaIndependenciaMontevideo,
      ) as StationInfo).name,
    ).toBe('Centro de Fotografia de Montevideo');
    expect(
      (getClosestStation(
        stationsInfo,
        LocationsFixture.BeihaiParkBeijing,
      ) as StationInfo).name,
    ).toBe('National Art Museum of China');
  });

  it('Returns an error when it could not find the closest station', () => {
    const invalidStationsInfo = {
      data: {
        stations: StationsFixture.invalid,
      },
    };
    expect(
      getClosestStation(
        invalidStationsInfo,
        LocationsFixture.BeihaiParkBeijing,
      ),
    ).toMatchObject(ERRORS.CLOSEST);
  });
  expect(getClosestStation(null, null)).toMatchObject(ERRORS.CLOSEST);
});
