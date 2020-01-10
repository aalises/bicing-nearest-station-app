import parseDistance from '../parseDistance';

describe('parseDistance', () => {
  it('Correctly parses the distance in meters', () => {
    expect(parseDistance(100)).toEqual('100 m');
  });
  it('Correctly parses the distance in kilometers', () => {
    expect(parseDistance(1430)).toEqual('1.4 km');
  });
  it('Returns the unknown placeholder when there is no valid distance', () => {
    expect(parseDistance(undefined)).toEqual('- m');
  });
});
