import { render } from "@testing-library/react-native";
import FooterSection from "../FooterSection";

test("renderiza FooterSection con botones de autenticación", () => {
  const { getByText } = render(<FooterSection />);
  expect(getByText("Iniciar Sesión")).toBeTruthy();
  expect(getByText("Registrarse")).toBeTruthy();
});

test("FooterSection tiene el estilo centrado", () => {
  const { getByTestId } = render(<FooterSection />);
  const footer = getByTestId("footer-section"); // Asegúrate de añadir `testID="footer-section"` a tu componente FooterSection.
  expect(footer.props.style).toEqual(
    expect.objectContaining({ alignItems: "center", justifyContent: "center" })
  );
});
