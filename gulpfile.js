"use strict";

const path = require("path");
const gulp = require("gulp");
const typescript = require("typescript");
const webpack = require("webpack");
const buildTools = require("demurgos-web-build-tools");

const projectOptions = buildTools.config.DEFAULT_PROJECT_OPTIONS;

buildTools.projectTasks.registerAll(gulp, {project: projectOptions, tslintOptions: {}, install: {}});

const serverTarget = {
  type: "node",
  baseDir: "server",
  scripts: ["server/**/*.ts", "app/**/*.ts", "lib/**/*.ts"],
  typeRoots: ["../typings/globals", "../typings/modules", "../node_modules/@types"],
  mainModule: "server/main"
};

buildTools.targetGenerators.node.generateTarget(
  gulp,
  "server",
  {
    project: projectOptions,
    target: serverTarget,
    tsOptions: {
      skipLibCheck: true,
      typescript: typescript,
      lib: ["es6", "dom"]
    }
  }
);

const clientTarget = {
  type: "angular",
  baseDir: "client",
  tmpDir: "client.tmp",
  assetsDir: "static",
  scripts: ["client/**/*.ts", "app/**/*.ts"],
  typeRoots: ["../typings/globals", "../typings/modules", "../node_modules/@types"],
  mainModule: "client/main"
};

buildTools.targetGenerators.angular.generateTarget(
  gulp,
  "client",
  {
    project: projectOptions,
    target: clientTarget,
    tsOptions: {
      skipLibCheck: true,
      typescript: typescript,
      lib: ["es6", "dom"]
    },
    webpack: webpack,
    webpackConfig: {}
  }
);
