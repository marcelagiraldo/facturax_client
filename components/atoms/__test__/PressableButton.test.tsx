import React from "react";
import { render } from "@testing-library/react-native";
import { PressableButton } from "../PressableButon";
import { Text } from "react-native";
import { fireEvent } from "@testing-library/react-native";

test("renderiza el contenido correctamente", () => {
  const { getByText } = render(
    <PressableButton style={{}}>
      <Text>Presionar</Text>
    </PressableButton>
  );
  expect(getByText("Presionar")).toBeTruthy();
});

test("ejecuta onPress al presionar", () => {
  const mockFn = jest.fn();
  const { getByText } = render(
    <PressableButton onPress={mockFn} style={{}}>
      <Text>Botón</Text>
    </PressableButton>
  );

  fireEvent.press(getByText("Botón"));
  expect(mockFn).toHaveBeenCalledTimes(1);
});
