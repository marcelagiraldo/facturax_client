import React from 'react';
import { render } from '@testing-library/react-native';
import { ButtonText } from '../ButtonText';

describe('ButtonText', () => {
  it('renderiza correctamente el texto', () => {
    const { getByText } = render(<ButtonText color="light">Hola</ButtonText>);
    expect(getByText('Hola')).toBeTruthy();
  });

  it('aplica el estilo de texto claro cuando color="light"', () => {
    const { getByText } = render(<ButtonText color="light">Claro</ButtonText>);
    const text = getByText('Claro');
    expect(text.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ fontWeight: 'bold', fontSize: 20 }),
        expect.objectContaining({ color: '#ffffff' }),
      ])
    );
  });

  it('aplica el estilo de texto oscuro cuando color="dark"', () => {
    const { getByText } = render(<ButtonText color="dark">Oscuro</ButtonText>);
    const text = getByText('Oscuro');
    expect(text.props.style).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ fontWeight: 'bold', fontSize: 20 }),
        expect.objectContaining({ color: '#000000' }),
      ])
    );
  });
});
