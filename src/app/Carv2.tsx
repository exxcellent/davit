import React from "react";
import "./Carv2.css";
import { FormattedMessage } from "react-intl";
import { MetaComponentModelController } from "../components/MetaComponentModel/Presentation/MetaComponentModelController";
import { ThemeProvider } from "styled-components";
import { GlobalTheme } from "../style/theme/GlobalTheme";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fab } from "@fortawesome/free-brands-svg-icons";
import { faPlusSquare, faEllipsisH } from "@fortawesome/free-solid-svg-icons";

library.add(fab, faPlusSquare, faEllipsisH);

export function Carv2() {
  return (
    <div className="Carv2">
      <ThemeProvider theme={GlobalTheme}>
        <label>Sprache: </label>
        <FormattedMessage id="language"></FormattedMessage>
        <MetaComponentModelController />
      </ThemeProvider>
    </div>
  );
}
