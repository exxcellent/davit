import React from "react";
import "./Carv2.css";
import { FormattedMessage } from "react-intl";
import { MetaComponentModelController } from "../components/MetaComponentModel/Presentation/MetaComponentModelController";
import { ThemeProvider } from "styled-components";
import { GlobalTheme } from "../style/theme/GlobalTheme";

export function Carv2() {
  return (
    <div className="Carv2">
      <ThemeProvider theme={GlobalTheme}>
        <FormattedMessage id="language"></FormattedMessage>
        <MetaComponentModelController />
      </ThemeProvider>
    </div>
  );
}
