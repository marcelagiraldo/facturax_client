import React from "react";
import { render } from "@testing-library/react-native";
import LogoImage from "../LogoImage";

test("renderiza correctamente el componente LogoImage", () => {
  const { getByTestId } = render(<LogoImage />);
  const image = getByTestId("logo-image");
  expect(image).toBeTruthy();
});
