import { setCachedData, getCachedData, isDataCachedValid, TTL } from '../cache';
import { AsyncStorage } from 'react-native';

describe('setCachedData', () => {
  const mockSetItemAndExpectData = async (mockedFunction, data) => {
    jest.spyOn(AsyncStorage, 'setItem').mockImplementation(mockedFunction);
    expect(await setCachedData(null)).toMatchObject(data);
  };

  it('Correctly sets success based on write cache operation result', async () => {
    mockSetItemAndExpectData(
      async () => {
        return new Promise(resolve => {
          resolve(null);
        });
      },
      {
        success: true,
        data: null,
      },
    );
    mockSetItemAndExpectData(
      () => {
        throw new Error();
      },
      {
        success: false,
        data: null,
      },
    );
  });
});
describe('getCachedData', () => {
  const validData = {
    stationInfoData: {
      data: 'Valid',
    },
  };

  const mockGetItemAndExpectData = async (mockedFunction, data) => {
    jest.spyOn(AsyncStorage, 'getItem').mockImplementation(mockedFunction);
    expect(await getCachedData()).toMatchObject(data);
  };

  it('Correctly gets and parses data based on get cache operation result', async () => {
    mockGetItemAndExpectData(
      async () => {
        return new Promise(resolve => {
          resolve(JSON.stringify(validData));
        });
      },
      {
        success: true,
        data: {
          data: 'Valid',
        },
      },
    );
    mockGetItemAndExpectData(
      async () => {
        return new Promise(resolve => {
          resolve('NonValidJSON');
        });
      },
      {
        success: false,
        data: null,
      },
    );
    mockGetItemAndExpectData(
      () => {
        throw new Error();
      },
      {
        success: false,
        data: null,
      },
    );
  });
});

describe('isDataCachedValid', () => {
  const mockDataCachedValidAndExpectData = async (mockedFunction, data) => {
    jest.spyOn(AsyncStorage, 'getItem').mockImplementation(mockedFunction);
    expect(await isDataCachedValid()).toMatchObject(data);
  };

  it('Returns false if the data does not exist or an error was thrown on get cache', async () => {
    mockDataCachedValidAndExpectData(async () => {
      return new Promise(resolve => {
        resolve('NonValidJSON');
      });
    }, false);
    mockDataCachedValidAndExpectData(async () => {
      return new Promise(resolve => {
        resolve(JSON.stringify({ stationInfoData: null }));
      });
    }, false);
  });
  it('Correcly validates existing data from the cache based on TTL', async () => {
    mockDataCachedValidAndExpectData(async () => {
      return new Promise(resolve => {
        resolve(
          JSON.stringify({
            stationInfoData: {
              last_updated: Math.floor(Date.now() / 1000) - TTL * 2,
            },
          }),
        );
      });
    }, false);
    mockDataCachedValidAndExpectData(async () => {
      return new Promise(resolve => {
        resolve(
          JSON.stringify({
            stationInfoData: {
              last_updated: Math.floor(Date.now() / 1000) - TTL / 2,
            },
          }),
        );
      });
    }, true);
  });
});
