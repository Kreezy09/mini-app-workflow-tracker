import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import App from "./App";
import { createAppStore } from "./store";
import { mockFetch } from "./test/fetchMock";
import { makeApplication } from "./test/mockData";

describe("App", () => {
  beforeEach(() => {
    window.history.pushState({}, "", "/");
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders the dashboard route with data from RTK Query", async () => {
    vi.stubGlobal("fetch", mockFetch([{ matcher: "/applications", body: [makeApplication()] }]));

    render(
      <Provider store={createAppStore()}>
        <App />
      </Provider>
    );

    expect(await screen.findByText("Application queue")).toBeInTheDocument();
    expect(await screen.findAllByText("Jane Applicant")).not.toHaveLength(0);
  });
});
