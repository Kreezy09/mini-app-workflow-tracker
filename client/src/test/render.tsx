import type { ReactElement } from "react";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router-dom";
import { render } from "@testing-library/react";

import { createAppStore } from "../store";
import type { AppStore } from "../store";

type RenderOptions = {
  route?: string;
  store?: AppStore;
};

export function renderWithProviders(ui: ReactElement, options: RenderOptions = {}) {
  const store = options.store ?? createAppStore();

  return {
    store,
    ...render(
      <Provider store={store}>
        <MemoryRouter initialEntries={[options.route ?? "/"]}>{ui}</MemoryRouter>
      </Provider>
    )
  };
}
