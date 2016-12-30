# Contributing

## Environment

- _node_ 6
- **_npm_ 4**: Solves a life-cycle issue (prepare and prepublish scripts)
- _gulp-cli_
- _typings_

## Gulp tasks

This project has three targets:

- `server`: Node target, compiles all normal scripts except for `client` and `test`, generates static assets.
- `client`: Webpack target, compiles `client`, `lib` and `app` scripts and bundles templates and styles used by the application
  into `main.js` into the server's directory for static files (`build/server/static`)
- `test`: Test target, runs `spec` scripts

It also has a "virtual" target `all` that calls the tasks of both `server` and `client`.

### `all:clean-build`

Clean any previous build and compiles everything.

```shell
bulp all:clean-build
```

### `all:watch`

Build the project once and then watch source files for changes.
Triggers a build for the files that changed.

```shell
gulp all:watch
```

### `:lint`

Check TSLint rules for all Typescript files

```shell
gulp :lint
```

_Note_: Use `tslint:disable-next-line:<rule1> <rule2>` in line comments
to disable a rule for the next block.

### `test`

Build and run `test` target (mocha unit tests for the server)

```shell
gulp test
```
