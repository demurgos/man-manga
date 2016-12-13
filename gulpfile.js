"use strict";

const path = require("path");
const gulp = require("gulp");
const typescript = require("typescript");
const webpack = require("webpack");
const buildTools = require("demurgos-web-build-tools");

const root = __dirname;

const projectOptions = buildTools.config.DEFAULT_PROJECT_OPTIONS;

buildTools.projectTasks.registerAll(gulp, {project: projectOptions, tslintOptions: {}, install: {}});

const serverTarget = {
  type: "node",
  baseDir: "server",
  scripts: ["server/**/*.ts", "app/**/*.ts", "lib/**/*.ts"],
  typeRoots: ["./custom-typings", "../typings/globals", "../typings/modules", "../node_modules/@types"],
  mainModule: "server/main",
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
  assetsDir: "app",
  scripts: ["client/**/*.ts", "app/**/*.ts"],
  typeRoots: ["custom-typings", "../typings/globals", "../typings/modules", "../node_modules/@types"],
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

// Prevent client:build:assets:static
gulp.task("client:build:assets:static", function(done) {done()});

// Override default copy
gulp.task("client:build:copy:assets", ["client:build:assets"], function() {
  return gulp
    .src(
      [
        path.join(root, "build/client.tmp/app", "**/*.html"),
        path.join(root, "build/client.tmp/app", "**/*.css"),
      ],
      {base: path.join(root, "build/client.tmp/app")}
    )
    .pipe(gulp.dest(path.join(root, "build/client")));
});
gulp.task("client:build:copy:static", ["client:build:assets"], function() {
  return gulp
    .src(
      [
        path.join(root, "src/static", "**/*")
      ],
      {base: path.join(root, "src/static")}
    )
    .pipe(gulp.dest(path.join(root, "build/client")));
});

gulp.task("client:build:copy:materialize", function() {
    return gulp
    .src(
      [
        path.join(root, "node_modules/materialize-css/bin/materialize.css")
      ],
      {base: path.join(root, "node_modules/materialize-css/bin")}
    )
    .pipe(gulp.dest(path.join(root, "build/client")));
});

gulp.task("client:build:copy", ["client:build:copy:assets", "client:build:copy:static", "client:build:copy:materialize"], function() {});

// Override default copy
gulp.task("server:build:copy", ["client:build:assets"], function() {
  return gulp
    .src(
      [
        path.join(root, "build/client.tmp/app", "**/*.html"),
        path.join(root, "build/client.tmp/app", "**/*.css"),
      ],
      {base: path.join(root, "build/client.tmp/app")}
    )
    .pipe(gulp.dest(path.join(root, "build/server/app")));
});

gulp.task("server:_clean-build", ["server:clean"], () => {
  // Task server:clean is done now
});
gulp.task("server:clean-build", ["server:_clean-build", "server:build"]);

gulp.task("client:_clean-build", ["client:clean"], () => {
  // Task client:clean is done now
});
gulp.task("client:clean-build", ["client:_clean-build", "client:build"]);

