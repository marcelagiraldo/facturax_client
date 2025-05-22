import React from "react";
import { render } from "@testing-library/react-native";
import HeaderSection from "../HeaderSection";

test("renderiza HeaderSection correctamente", () => {
  const { getByTestId } = render(<HeaderSection />);
  
  // Verificamos que el componente HeaderSection se renderiza correctamente
  expect(getByTestId("header-section")).toBeTruthy();
});


test("renderiza LogoImage dentro de HeaderSection", () => {
  const { getByTestId } = render(<HeaderSection />);
  
  // Verificamos si el logo está presente dentro de HeaderSection
  expect(getByTestId("logo-image")).toBeTruthy();
});
