# Twitter Emoji (Twemoji)

This branch hosts the built assets for Twemoji, and the folder structure can be summarized as follows:

| Top level     | Second | Files               | Description                                                                                | Version     |
| ------------- | ------ | ------------------- | ------------------------------------------------------------------------------------------ | ----------- |
| .             |        | \*.md, *.json, .\*  | meta data                                                                                  | 1.0, 2.2    |
| .             |        | twemoji*.js         | (Legacy) Framework js assets                                                               | 1.0         |
| 1/            |        | twemoji*.js         | (Legacy) Framework js assets                                                               | 1.0         |
| 2/            |        | twemoji*.js         | Framework js assets                                                                        | 2.2         |
| 2/            | test/  | index.html, test.js | Tests                                                                                      | 2.2         |
| 2/            | 72x72/ | `{codepoint}`.png   | large PNGs                                                                                 | 2.2         |
| 2/            | svg/   | `{codepoint}`.svg   | SVGs                                                                                       | 2.2         |
| 16x16/        |        | `{codepoint}`.png   | small PNGs                                                                                 | 1.0         |
| 36x36/        |        | `{codepoint}`.png   | medium PNGs                                                                                | 1.0         |
| 72x72/        |        | `{codepoint}`.png   | large PNGs                                                                                 | 1.0         |
| svg/          |        | `{codepoint}`.svg   | SVGs                                                                                       | 1.0         |
| v/            |        |                     | The versioned releases from 2.2 onwards                                                    | `<version>` |
| v/`<version>` |        | preview*.html       | [static image preview HTML files](https://twitter.github.io/twemoji/v/latest/preview.html) | `<version>` |
| v/`<version>` | 72x72/ | `{codepoint}`.png   | (Versioned) large PNGs                                                                     | `<version>` |
| v/`<version>` | svg/   | `{codepoint}`.svg   | (Versioned) SVGs                                                                           | `<version>` |
| v/`<version>` |        | twemoji*.js         | (Versioned) Framework js assets                                                            | `<version>` |
