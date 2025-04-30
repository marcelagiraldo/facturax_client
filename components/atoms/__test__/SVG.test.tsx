import React from 'react';
import { render } from '@testing-library/react-native';
import SvgTop from '../SvgTop';

test('se renderiza correctamente SvgTop', () => {
  const { getByTestId } = render(<SvgTop />);
  expect(getByTestId('svg-top-container')).toBeTruthy();
});

test('contiene una elipse dentro del SVG', () => {
    const { UNSAFE_queryByType } = render(<SvgTop />);
    const EllipseComponent = UNSAFE_queryByType(require('react-native-svg').Ellipse);
    expect(EllipseComponent).toBeTruthy();
  });
