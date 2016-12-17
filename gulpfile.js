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

// Angular universal server target
// This will look better with ES7 object spread:
// const serverTarget = {...buildTools.config.ANGULAR_SERVER_TARGET, name: "foo", scripts: ["bar/*.ts"]}
const serverTarget = Object.assign(
  {},
  buildTools.config.ANGULAR_SERVER_TARGET,
  {
    typescriptOptions: {
      skipLibCheck: true,
      typescript: typescript,
      lib: ["es6", "dom"]
    }
  }
);

// Angular universal client target
const clientTarget = Object.assign(
  {},
  buildTools.config.ANGULAR_CLIENT_TARGET,
  {
    typescriptOptions: {
      skipLibCheck: true,
      typescript: typescript,
      lib: ["es6", "dom"]
    }
  }
);

buildTools.projectTasks.registerAll(gulp, projectOptions);
buildTools.targetGenerators.node.generateTarget(gulp, projectOptions, serverTarget);
buildTools.targetGenerators.angular.generateTarget(gulp, projectOptions, clientTarget);

// complete:build
const moveClientToServerStatic = buildTools.taskGenerators.copy.generateTask(gulp, {
  from: "build/client",
  files: ["main.js"],
  to: "build/server/static"
});
moveClientToServerStatic.displayName = "_clientToServerStatic";
gulp.task("complete:build", gulp.series(gulp.parallel("client:build", "server:build"), moveClientToServerStatic));
