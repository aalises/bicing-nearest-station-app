import * as React from 'react';
import OpenMapsButton from '..';
import { render, fireEvent } from 'react-native-testing-library';
import getDirections from 'react-native-google-maps-directions';
import { Modes } from '../../ModeSelector';
import {
  LocationsFixture,
  StationsFixture,
} from '../../../constants/__fixtures__';
jest.mock('react-native-google-maps-directions');

describe('OpenMapsButton', () => {
  it('Renders correctly', () => {
    const props = {
      closestStation: null,
      location: null,
      mode: null,
    };
    const { getByText, getByTestId } = render(<OpenMapsButton {...props} />);

    expect(getByTestId('OpenMapsButton_Icon')).toBeDefined();
    expect(getByText('Open in Maps')).toBeDefined();
  });
  it('Calls the onPress callback with the correct data based on mode', () => {
    const { BeihaiParkBeijing } = LocationsFixture;
    const commonProps = {
      closestStation: StationsFixture.valid[0],
      location: BeihaiParkBeijing,
    };

    const response = {
      destination: { latitude: -34.905759, longitude: -56.197307 },
      source: {
        latitude: BeihaiParkBeijing.coords.latitude,
        longitude: BeihaiParkBeijing.coords.longitude,
      },
    };

    const { getByText, rerender } = render(
      <OpenMapsButton {...{ ...commonProps, mode: 'RENT' as Modes }} />,
    );
    fireEvent.press(getByText('Open in Maps'));

    expect(getDirections).toHaveBeenCalledWith({
      ...response,
      params: [{ key: 'travelmode', value: 'walking' }],
    });

    rerender(
      <OpenMapsButton {...{ ...commonProps, mode: 'RETURN' as Modes }} />,
    );
    fireEvent.press(getByText('Open in Maps'));

    expect(getDirections).toHaveBeenCalledWith({
      ...response,
      params: [{ key: 'travelmode', value: 'bicycling' }],
    });
  });
});
