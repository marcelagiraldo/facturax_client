import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import SearchBar from '../SearchBar';


describe('SearchBar', () => {
  it('renderiza con placeholder y valor inicial', () => {
    const { getByPlaceholderText } = render(
      <SearchBar search="Hola" setSearch={() => {}} placeholder="Buscar aquí" />
    );

    const input = getByPlaceholderText("Buscar aquí");
    expect(input.props.value).toBe("Hola");
  });

  it('llama a setSearch al escribir', () => {
    const mockSetSearch = jest.fn();
    const { getByPlaceholderText } = render(
      <SearchBar search="" setSearch={mockSetSearch} placeholder="Buscar" />
    );

    fireEvent.changeText(getByPlaceholderText("Buscar"), "Nuevo texto");
    expect(mockSetSearch).toHaveBeenCalledWith("Nuevo texto");
  });

  it('muestra el icono de búsqueda', () => {
    const { getByTestId } = render(
      <SearchBar search="" setSearch={() => {}} placeholder="Buscar" />
    );
    expect(getByTestId("search-icon")).toBeTruthy();
  });
});
