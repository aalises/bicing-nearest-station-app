import * as React from 'react';
import ErrorMessage from '..';
import { render } from 'react-native-testing-library';

describe('ErrorMessage', () => {
  it('Renders messages correctly', () => {
    const { getByText, rerender } = render(
      <ErrorMessage error={{ message: null, code: null }} />,
    );

    expect(getByText('Unknown Error')).toBeDefined();

    rerender(
      <ErrorMessage error={{ message: 'Everything exploded', code: null }} />,
    );

    expect(getByText('Everything exploded')).toBeDefined();
  });
});
