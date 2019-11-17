import * as React from 'react';
import ModeSelector from '..';
import { render, fireEvent } from 'react-native-testing-library';
import { modes } from '../../ModeSelector';

describe('OpenMapsButton', () => {
  it('Renders correctly', () => {
    const { getByText } = render(<ModeSelector onChangeMode={jest.fn()} />);
    modes.forEach(({ label }) => {
      expect(getByText(label)).toBeDefined();
    });
  });
  it('Correctly changes mode', () => {
    const onChangeMode = jest.fn();
    const { getByText } = render(<ModeSelector onChangeMode={onChangeMode} />);

    modes.forEach(({ label, key }) => {
      const clickableElement = getByText(label);
      fireEvent.press(clickableElement);
      expect(onChangeMode).toHaveBeenCalledWith(key);
    });
  });
});
