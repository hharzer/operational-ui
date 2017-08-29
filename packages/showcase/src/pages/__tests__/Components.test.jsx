import React from "react"
import { render } from "enzyme"
import { BrowserRouter as Router } from "react-router-dom"

import ComponentsPage from "../Components"

describe("ComponentsPage", () => {
  it("Should render correctly", () => {
    expect(
      render(
        <Router>
          <ComponentsPage />
        </Router>
      )
    ).toMatchSnapshot()
  })
})