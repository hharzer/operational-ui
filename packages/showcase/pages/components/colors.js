import * as React from "react"
import glamorous from "glamorous"
import { Card, CardHeader, Heading2Type } from "@operational/components"
import { operational } from "@operational/theme"

import Layout from "../../components/Layout"
import Playground from "../../components/Playground"
import Table from "../../components/PropsTable"

const simpleSnippet = `
<div>
  <div style={{ width: 80, height: 80, backgroundColor: theme.colors.info }} />
</div>
`

const ColorBox = glamorous.div(
  {
    display: "inline-block",
    "& > div": {
      border: "2px solid #dadada",
      width: 40,
      height: 40
    }
  },
  ({ theme }: { theme: Theme }) => ({
    margin: `0 ${theme.spacing}px ${theme.spacing}px 0`,
    "& > p": {
      ...theme.typography.small,
      margin: 0
    }
  })
)

export default props => (
  <Layout pathname={props.url.pathname}>
    <Card>
      <p>The library provides a set of basic colors, as well as a range of grays.</p>

      {Object.keys(operational.colors).map((color, index) => (
        <ColorBox key={index}>
          <div style={{ backgroundColor: operational.colors[color] }} />
          <p>{color}</p>
        </ColorBox>
      ))}

      <Playground snippet={simpleSnippet} components={{}} scope={{ theme: operational }} />
    </Card>
  </Layout>
)
