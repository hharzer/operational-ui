Used as headers (top-level links) inside a `Sidenav`.

### Usage

```js
<SidenavHeader label="Chapter One"/>
```

### Usage with links

Using a `to` prop navigates automatically, and render proper anchor tags with hrefs. See `OperationalUI` docs for a one-time configuration you need to do to have pushstate navigation working out-of-the-box.

```js
<SidenavHeader label="Chapter One" to="/one" />
```