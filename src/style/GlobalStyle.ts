import { createGlobalStyle } from "styled-components";
import { GlobalTheme } from "./theme/GlobalTheme";

export const GlobalStyle = createGlobalStyle`
body {
    background: ${() => GlobalTheme.backgroundcolor};
    color: ${() => GlobalTheme.text};
}
`;
