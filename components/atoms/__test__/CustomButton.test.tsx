import React from "react";
import { render,fireEvent } from "@testing-library/react-native";
import CustomButton from "../CustomButton"

test("renderiza correctamente con el título dado", () => {
  const { getByText } = render(<CustomButton title="Presionar" onPress={() => {}} />);
  expect(getByText("Presionar")).toBeTruthy();
});

test("llama a onPress al presionar el botón", () => {
  const mockOnPress = jest.fn();
  const { getByText } = render(<CustomButton title="Click me" onPress={mockOnPress} />);

  fireEvent.press(getByText("Click me"));

  expect(mockOnPress).toHaveBeenCalledTimes(1);
});