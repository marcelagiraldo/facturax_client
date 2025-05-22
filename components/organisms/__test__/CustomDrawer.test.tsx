import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import CustomDrawer from '../CustomDrawer';
import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'expo-router';

// Usamos una función falsa para navigation que se pasa por props
const navigationMock = {
  closeDrawer: jest.fn(),
};

jest.mock("expo-router", () => ({
  useRouter: jest.fn(),
}));

jest.mock("../../../context/AuthContext.tsx", () => ({
  useAuth: jest.fn(),
}));

describe("CustomDrawer", () => {
  const mockReplace = jest.fn();
  const mockCloseDrawer = jest.fn();
  const mockOnLogout = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ replace: mockReplace });
    (useAuth as jest.Mock).mockReturnValue({ onLogout: mockOnLogout });
  });

  const mockProps = {
    navigation: {
      closeDrawer: mockCloseDrawer,
    },
  };

  it("renderiza todos los elementos del menú", () => {
    const { getByText } = render(<CustomDrawer {...mockProps} />);
    expect(getByText("Inicio")).toBeTruthy();
    expect(getByText("Facturas")).toBeTruthy();
    expect(getByText("Clientes")).toBeTruthy();
    expect(getByText("Productos")).toBeTruthy();
  });

  it("cierra el drawer al pulsar el botón de cerrar", () => {
    const { getByRole } = render(<CustomDrawer {...mockProps} />);
    const closeButton = getByRole("button"); // Primer botón del drawer
    fireEvent.press(closeButton);
    expect(mockCloseDrawer).toHaveBeenCalled();
  });

  it("navega a /principal/home al pulsar en Inicio", () => {
    const { getByText } = render(<CustomDrawer {...mockProps} />);
    fireEvent.press(getByText("Inicio"));
    expect(mockReplace).toHaveBeenCalledWith("/principal/home");
  });

  it("ejecuta onLogout y redirige al login", async () => {
    mockOnLogout.mockResolvedValueOnce(true);
    const { getByRole } = render(<CustomDrawer {...mockProps} />);
    const logoutButton = getByRole("button", { name: "" }); // Si no tiene texto, hay que acceder por orden
    fireEvent.press(logoutButton);
    expect(mockOnLogout).toHaveBeenCalled();
  });
});