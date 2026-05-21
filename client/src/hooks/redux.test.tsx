import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { useEffect } from "react";
import { describe, expect, it } from "vitest";

import { useAppDispatch, useAppSelector } from "./redux";
import { createAppStore } from "../store";

function HookConsumer() {
  const dispatch = useAppDispatch();
  const queries = useAppSelector((state) => Object.keys(state.applicationsApi.queries).length);

  useEffect(() => {
    dispatch({ type: "test/noop" });
  }, [dispatch]);

  return <div>Queries: {queries}</div>;
}

describe("redux hooks", () => {
  it("provides typed dispatch and selector hooks", () => {
    render(
      <Provider store={createAppStore()}>
        <HookConsumer />
      </Provider>
    );

    expect(screen.getByText("Queries: 0")).toBeInTheDocument();
  });
});
