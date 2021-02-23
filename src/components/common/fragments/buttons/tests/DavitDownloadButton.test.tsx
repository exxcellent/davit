import "@testing-library/jest-dom/extend-expect";
import { render } from "@testing-library/react";
import React from "react";
import { DavitDownloadButton } from "../DavitDownloadButton";

test("Test download button", () => {
    render(<DavitDownloadButton onClick={() => {}} />);
});
