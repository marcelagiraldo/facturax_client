import React from "react";
import { render } from "@testing-library/react-native";
import CardInfo from "../CardInfo";

describe("CardInfo", () => {
  it("muestra texto y cantidad correctamente", () => {
    const { getByText } = render(
      <CardInfo color="#123456" text="Ganancias" amount="$1500" />
    );
    expect(getByText("Ganancias")).toBeTruthy();
    expect(getByText("$1500")).toBeTruthy();
  });

  it("no renderiza ningún icono si no se proporciona ni iconComponent ni iconImage", () => {
    const { getByText, queryByRole } = render(
      <CardInfo color="#123456" text="Sin Icono" amount="$0" />
    );
    expect(getByText("Sin Icono")).toBeTruthy();
    expect(queryByRole("image")).toBeNull();
  });
});
