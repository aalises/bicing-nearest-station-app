import * as React from 'react';
import NearestStationCard from '..';
import { render } from 'react-native-testing-library';
import { StationsFixture } from '../../../constants/__fixtures__';

jest.useFakeTimers();

describe('NearestStationCard', () => {
  it('Renders the Loader correctly', () => {
    const { getAllByA11yLabel } = render(
      <NearestStationCard closestStation={null} isLoading={true} />,
    );
    expect(getAllByA11yLabel('Loader')).toBeDefined();
  });
  it('Renders the information correctly', () => {
    const stationInfo = StationsFixture.valid[0];
    const { getByText } = render(
      <NearestStationCard closestStation={stationInfo} isLoading={false} />,
    );
    expect(getByText(stationInfo.name)).toBeDefined();
  });

  it('Correctly parses the distance to Km', () => {
    const stationsInfo = StationsFixture.valid;

    //The second one has distance set to 1700m so will be parsed to km
    const { getByText, rerender } = render(
      <NearestStationCard closestStation={stationsInfo[0]} isLoading={false} />,
    );
    expect(getByText('94 m')).toBeDefined();

    rerender(
      <NearestStationCard closestStation={stationsInfo[1]} isLoading={false} />,
    );
    expect(getByText('1.7 km')).toBeDefined();

    const stationWithNoDistance = StationsFixture.invalid[0];
    rerender(
      <NearestStationCard
        closestStation={stationWithNoDistance}
        isLoading={false}
      />,
    );
    expect(getByText('- m')).toBeDefined();
  });
});
