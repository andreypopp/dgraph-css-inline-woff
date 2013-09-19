# dgraph-css-inline-woff

Inline WOFF fonts as base64 encoded data URIs. It can be used along with
`dgraph` and `css-pack` to bundles together CSS and font files.

    % npm install css-pack dgraph deps-sort dgraph-css-inline-woff -g
    % dgraph --transform dgraph-css-inline-woff ./styles.css \
      | deps-sort \
      | css-pack \
      > ./bundle.css
