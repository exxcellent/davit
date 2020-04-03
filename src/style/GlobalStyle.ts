import { createGlobalStyle } from "styled-components";
import { GlobalTheme } from "./GlobalTheme";

export const GlobalStyle = createGlobalStyle`
body {
    background: ${() => GlobalTheme.backgroundcolor};
    color: ${() => GlobalTheme.text};
}
`;
