export type Error = {
  code: string;
  message: string;
};

const ERRORS: { [key: string]: Error } = {
  FETCH: {
    code: 'FETCH',
    message:
      'Something went wrong when fetching the station data. Refresh to try again',
  },
  LOCATION: {
    code: 'LOCATION',
    message:
      'Cannot get location, have you accepted permissions or do you have them enabled in your device?. Refresh to try again',
  },
  CLOSEST: {
    code: 'CLOSEST',
    message: 'Cannot get the closest station. Refresh to try again',
  },
};

export default ERRORS;
