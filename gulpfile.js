"use strict";

const gulp = require("gulp");
const typescript = require("typescript");
const buildTools = require("demurgos-web-build-tools");

// Project-wide webpackOptions
const projectOptions = Object.assign(
  {},
  buildTools.config.DEFAULT_PROJECT_OPTIONS,
  {
    root: __dirname
  }
);

// `server` target: Angular universal server
// This will look better with ES7 object spread:
// const serverTarget = {...buildTools.config.ANGULAR_SERVER_TARGET, name: "foo", scripts: ["bar/*.ts"]}
const serverTarget = Object.assign(
  {},
  buildTools.config.ANGULAR_SERVER_TARGET,
  {
    typescript: {
      compilerOptions: {
        skipLibCheck: true,
        lib: ["es6", "dom"]
      },
      typescript: typescript,
      tsconfigJson: ["server/tsconfig.json", "app/tsconfig.json", "lib/tsconfig.json"]
    }
  }
);
// TODO: materialize

// `client` target: Angular universal client
const clientTarget = Object.assign(
  {},
  buildTools.config.ANGULAR_CLIENT_TARGET,
  {
    typescript: {
      compilerOptions: {
        skipLibCheck: true,
        lib: ["es6", "dom"]
      },
      typescript: typescript,
      tsconfigJson: ["client/tsconfig.json"]
    }
  }
);

// `test` target
const testTarget = {
  name: "test",
  targetDir: "test",
  scripts: ["test/**/*.ts", "lib/**/*.ts", "server/**/*.ts", "app/**/*.ts"],
  typeRoots: ["custom-typings", "../typings/globals", "../typings/modules", "../node_modules/@types"],
  typescript: {
    strict: true,
    compilerOptions: {
      skipLibCheck: true,
      target: "es2015"
    },
    typescript: typescript,
    tsconfigJson: ["test/tsconfig.json"]
  },
  copy: [
    {
      name: "test-resources",
      files: ["test/*/**/*.html", "test/*/**/*.json"]
    }
  ]
};

buildTools.projectTasks.registerAll(gulp, projectOptions);
buildTools.targetGenerators.node.generateTarget(gulp, projectOptions, serverTarget);
buildTools.targetGenerators.webpack.generateTarget(gulp, projectOptions, clientTarget);
buildTools.targetGenerators.test.generateTarget(gulp, projectOptions, testTarget);

gulp.task("all:tsconfig.json", gulp.parallel("client:tsconfig.json", "server:tsconfig.json", "test:tsconfig.json"));
gulp.task("all:build", gulp.parallel("client:build", "server:build"));
gulp.task("all:watch", gulp.series("all:build", gulp.parallel("client:watch", "server:watch")));
gulp.task("all:clean", gulp.parallel("client:clean", "server:clean"));
gulp.task("client:clean-build", gulp.series("client:clean", "client:build"));
gulp.task("server:clean-build", gulp.series("server:clean", "server:build"));
gulp.task("all:clean-build", gulp.series("all:clean", "all:build"));
