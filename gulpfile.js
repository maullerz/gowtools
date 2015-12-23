var gulp = require('gulp');
var babel = require("gulp-babel");
var webpack = require('webpack');

var gutil = require('gulp-util');
var shell = require('gulp-shell');
var runSequence = require('run-sequence');
var clean = require('gulp-clean');
var replace = require('gulp-replace');
var sass = require('gulp-sass');
var sprite = require('gulp-node-spritesheet');
var concatCss = require('gulp-concat-css');


var configs = require('./build.configs.js');
var webpackConfig = require('./webpack.config.js');

var PHONEGAP_APP_DIR = configs.targetDirectory;
var PHONEGAP_DEVELOPER_APP_PORT = configs.phonegapServePort;



gulp.task('default', function(callback) {
  runSequence('build-app', 'watch', callback);
});

gulp.task('watch', function(){
  gulp.watch([
    './src/**/*.jsx',
    './src/**/*.js',
    './src/styles/*.scss'
    ], ['build-app-on-watch']);
});

// PROCESS ONLY SRC WITHOUT ASSETS

gulp.task('build-app-on-watch', function(callback){
  runSequence(
    'compile-sass',
    'webpackify',
    'concat-css',
    'copy-index',
    'copy-config-xml',
    callback
  );
});

// COMPLETE BUILD

gulp.task('build-app', function(callback){
  runSequence(
    'clean-build',
    'compile-sass',
    'copy-index',
    'copy-backgrounds',
    'copy-bootstrap',
    // 'copy-resources',
    'copy-icons',
    'copy-fonts',
    'copy-spritesheet',
    'copy-data',
    'webpackify',
    'copy-config-xml',
    'concat-css',
    callback
  );
});


// SERVE

gulp.task('serve',
  shell.task(
    ['phonegap serve --port=' + PHONEGAP_DEVELOPER_APP_PORT],
    { cwd: PHONEGAP_APP_DIR }
  )
);

// PREPARE SPRITESHEET

gulp.task('spritesheet', function() {
  gulp.src('./assets-src/images/**/*.png')
    .pipe(
      sprite({
        outputCss: './src/styles/sprites.scss',
        selector: '.sprite',
        outputImage: 'spr.png'
      })
    )
    .pipe(gulp.dest('./assets-src/spritesheet/'));
});

// CREATE PHONEGAP APP

gulp.task('create', function(callback) {
  runSequence('clean-app', 'create-app', 'install-plugins', callback);
});

gulp.task('clean-app', function() {
  return gulp.src('./' + PHONEGAP_APP_DIR, { read: false })
  .pipe(clean());
})

gulp.task('create-app', shell.task([
  'phonegap create ' + PHONEGAP_APP_DIR
]));

gulp.task('install-plugins', shell.task(getPhonegapPluginCommands(), {
  cwd: PHONEGAP_APP_DIR
}));

// CLEANING

gulp.task('clean-build', function() {
  return gulp.src('./build', {read: false})
    .pipe(clean());
});

// STYLES

gulp.task('compile-sass', function () {
  gulp.src('./src/styles/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./build/css/'));
});

gulp.task('concat-css', function(){
  return gulp.src('./build/css/**/*.css')
    .pipe(concatCss('bundle.css'))
    .pipe(gulp.dest('./' + PHONEGAP_APP_DIR + '/www/css/'));
});

// ASSETS

gulp.task('copy-bootstrap', function() {
  return gulp.src('./assets-src/bootstrap/bootstrap.min.css')
    .pipe(gulp.dest('./' + PHONEGAP_APP_DIR + '/www/css/'));
});

gulp.task('copy-backgrounds', function() {
  return gulp.src('./assets-src/background/**/*.png')
    .pipe(gulp.dest('./' + PHONEGAP_APP_DIR + '/www/background/'))
});

gulp.task('copy-icons', function(callback) {
  return gulp.src('./assets-src/icons/**/*.png')
    .pipe(gulp.dest('./' + PHONEGAP_APP_DIR + '/www/icons/'));
});

gulp.task('copy-resources', function(callback) {
  return gulp.src('./assets-src/resources/**/*.png')
    .pipe(gulp.dest('./' + PHONEGAP_APP_DIR + '/www/resources/'));
});

gulp.task('copy-fonts', function(callback) {
  return gulp.src('./assets-src/fonts/**/*')
    .pipe(gulp.dest('./' + PHONEGAP_APP_DIR + '/www/fonts/'));
});

gulp.task('copy-spritesheet', function() {
  return gulp.src('./assets-src/spritesheet/**/*.png')
    .pipe(gulp.dest('./' + PHONEGAP_APP_DIR + '/www/img/'))
});

gulp.task('copy-data', function() {
  return gulp.src('./assets-src/data/**/*.json')
    .pipe(gulp.dest('./' + PHONEGAP_APP_DIR + '/www/data/'))
});

gulp.task('copy-index', function() {
  return gulp.src('./src/index.html')
    .pipe(gulp.dest('./' + PHONEGAP_APP_DIR + '/www/'))
});

// CONFIGS

gulp.task('copy-config-xml', function() {
  return gulp.src('./src/config.xml')
    // .pipe(replace(/{NAMESPACE}/g, configs.app.namespace))
    // .pipe(replace(/{VERSION}/g, configs.app.version))
    // .pipe(replace(/{APP_NAME}/g, configs.app.name))
    // .pipe(replace(/{APP_DESCRIPTION}/g, configs.app.description))
    // .pipe(replace(/{AUTHOR_WEBISTE}/g, configs.app.author.website))
    // .pipe(replace(/{AUTHOR_EMAIL}/g, configs.app.author.email))
    // .pipe(replace(/{AUTHOR_NAME}/g, configs.app.author.name))
    // .pipe(replace(/{PLUGINS}/g, getPluginsXML()))
    // .pipe(replace(/{ICONS}/g, getIconsXML()))
    // .pipe(replace(/{SPLASHSCREENS}/g, getSplashscreenXML()))
    // .pipe(replace(/{ACCESS_ORIGIN}/g, configs.app.accessOrigin))
    // .pipe(replace(/{ORIENTATION}/g, configs.app.orientation))
    // .pipe(replace(/{TARGET_DEVICE}/g, configs.app.targetDevice))
    // .pipe(replace(/{EXIT_ON_SUSPEND}/g, configs.app.exitOnSuspend))
    .pipe(gulp.dest('./' + PHONEGAP_APP_DIR + '/'))
});


gulp.task('webpackify', function(callback){ 
  webpack(webpackConfig, function(err, stats) {
    if (err) throw new gutil.PluginError("webpack", err);
    console.log("[webpack]", stats.toString({
      // output options
    }));
    callback();
  });
});


function getPhonegapPluginCommands() {
  var plugins = [
    "cordova-plugin-device",
    "cordova-plugin-console",
    "cordova-plugin-globalization",
    // "cordova-plugin-splashscreen",
    "cordova-plugin-dialogs",
    "cordova-plugin-statusbar"
  ];
  var commands = [];
  for (var i = 0; i < plugins.length; i++){
    var name = plugins[i];
    commands.push('phonegap plugin add ' + name);
  }
  return commands;
}
