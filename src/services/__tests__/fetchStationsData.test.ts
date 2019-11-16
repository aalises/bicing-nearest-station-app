import { sanitizeStationsData } from '../fetchStationsData';

describe('sanitizeStationsData', () => {
  it('Returns null if one or more arguments are not provided', () => {
    expect(sanitizeStationsData(null, null)).toBeNull();
  });

  it('Correctly parses the data obtained from the API to the StationInfo type', () => {
    const stationInfo = {
      last_updated: 304328,
      ttl: 3223,
      data: {
        stations: [
          {
            address: 'Best Street',
            altitude: 1,
            capacity: 20,
            lat: 116.2,
            lon: 2.43,
            name: 'Best Street 23',
            nearby_distance: 10,
            physical_configuration: 'MECHANICBIKESTATION' as const,
            post_code: '08054',
            station_id: 39,
          },
        ],
      },
    };
    const stationStatus = {
      last_updated: 34344,
      ttl: 234234324,
      data: {
        stations: [
          {
            is_charging_station: true,
            is_installed: 1 as const,
            is_renting: 1 as const,
            is_returning: 1 as const,
            last_reported: 43434,
            num_bikes_available: 23,
            num_bikes_available_types: {
              ebike: 13,
              mechanical: 10,
            },
            num_docks_available: 20,
            station_id: 39,
            status: 'IN_SERVICE' as const,
          },
        ],
      },
    };
    expect(sanitizeStationsData(stationInfo, stationStatus)).toMatchObject({
      data: {
        stations: [
          {
            capacity: 20,
            id: 39,
            latitude: 116.2,
            longitude: 2.43,
            name: 'Best Street 23',
            numBikesAvailable: 23,
            status: 'IN_SERVICE',
          },
        ],
      },
    });
  });
});
