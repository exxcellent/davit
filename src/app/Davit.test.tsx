import {render, screen} from "@testing-library/react";
import {Davit} from "./Davit";
import React from "react";
import {store} from "./store";
import {Provider} from "react-redux";

test("Davit basic UI test", () => {
    render(
        <Provider store={store}>
            <Davit/>
        </Provider>
    );

    screen.debug();
});