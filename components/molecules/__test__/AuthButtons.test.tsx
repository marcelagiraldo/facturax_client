import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import AuthButtons from "../AuthButtons";
import { router } from "expo-router";

// Mock de router.push
jest.mock("expo-router", () => ({
  router: {
    push: jest.fn(),
  },
}));

describe("AuthButtons", () => {
  it("renderiza los dos botones correctamente", () => {
    const { getByText } = render(<AuthButtons />);

    expect(getByText("Iniciar Sesión")).toBeTruthy();
    expect(getByText("Registrarse")).toBeTruthy();
  });

  it("navega a /login cuando se presiona 'Iniciar Sesión'", () => {
    const { getByText } = render(<AuthButtons />);
    fireEvent.press(getByText("Iniciar Sesión"));
    expect(router.push).toHaveBeenCalledWith("/login");
  });

  it("navega a /register cuando se presiona 'Registrarse'", () => {
    const { getByText } = render(<AuthButtons />);
    fireEvent.press(getByText("Registrarse"));
    expect(router.push).toHaveBeenCalledWith("/register");
  });
});
