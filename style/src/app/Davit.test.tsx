import { render, screen } from "@testing-library/react";
import React from "react";
import { Provider } from "react-redux";
import { Davit } from "./Davit";
import { store } from "./store";

test("Davit basic UI test", () => {
    render(
        <Provider store={store}>
            <Davit />
        </Provider>
    );

    screen.debug();
});
