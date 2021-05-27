import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import "semantic-ui-css/semantic.min.css";
import { Davit } from "./app/Davit";
import { store } from "./app/store";
import "./index.css";
import * as serviceWorker from "./serviceWorker";

ReactDOM.render(
    <Provider store={store}>
        <Davit />
    </Provider>,
    document.getElementById("root"),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
