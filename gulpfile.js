var $ = require('jquery');
var gulp = require('gulp');
var gutil = require('gulp-util');
var shell = require('gulp-shell');
var webpack = require('webpack');
var runSequence = require('gulp-run-sequence');
var clean = require('gulp-clean');
var replace = require('gulp-replace');
var sass = require('gulp-sass');
var concat = require('gulp-concat');

var configs = require('./build.configs.js');
var webpackConfig = require('./webpack.config.js');

var PHONEGAP_APP_DIR = configs.targetDirectory;
var PHONEGAP_DEVELOPER_APP_PORT = configs.phonegapServePort;


gulp.task(
  'serve',
  shell.task(
    ['phonegap serve --port=' + PHONEGAP_DEVELOPER_APP_PORT],
    { cwd: PHONEGAP_APP_DIR }
  )
);


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

gulp.task('default', function(){
  gulp.watch([
    './src/**/*.jsx',
    './src/**/*.js',
    './src/**/*.scss'
    ], ['build-app']);
});

gulp.task('build-app', function(callback){
  runSequence(
    'clean-build',
    'compile-sass',
    'copy-index',
    'copy-resources',
    'copy-data',
    'copy-img',
    'concat-css',
    'webpackify',
    'copy-config-xml',
    callback
  );
});

gulp.task('clean-build', function() {
  return gulp.src('./build', {read: false})
  .pipe(clean());
});

gulp.task('compile-sass', function () {
  gulp.src('./src/styles/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(gulp.dest('./build/css/'));
});

gulp.task('concat-css', function(){
  return gulp.src('./build/css/**/*.css')
    .pipe(concat('bundle.css'))
    .pipe(gulp.dest('./' + PHONEGAP_APP_DIR + '/www/css/'));
});

gulp.task('copy-index', function() {
  return gulp.src('./src/index.html')
    .pipe(gulp.dest('./' + PHONEGAP_APP_DIR + '/www/'))
});

gulp.task('copy-resources', function() {
  return gulp.src('./assets-src/res/**/*.png')
    .pipe(gulp.dest('./' + PHONEGAP_APP_DIR + '/www/res/'))
});
  
gulp.task('copy-img',
  shell.task(['ruby copy_images.rb'])
);

gulp.task('copy-data', function() {
  return gulp.src('./assets-src/data/**/*.json')
    .pipe(gulp.dest('./' + PHONEGAP_APP_DIR + '/www/'))
});


gulp.task('copy-config-xml', function() {
  return gulp.src('./src/config.xml')
    .pipe(replace(/{NAMESPACE}/g, configs.app.namespace))
    .pipe(replace(/{VERSION}/g, configs.app.version))
    .pipe(replace(/{APP_NAME}/g, configs.app.name))
    .pipe(replace(/{APP_DESCRIPTION}/g, configs.app.description))
    .pipe(replace(/{AUTHOR_WEBISTE}/g, configs.app.author.website))
    .pipe(replace(/{AUTHOR_EMAIL}/g, configs.app.author.email))
    .pipe(replace(/{AUTHOR_NAME}/g, configs.app.author.name))
    .pipe(replace(/{PLUGINS}/g, getPluginsXML()))
    .pipe(replace(/{ICONS}/g, getIconsXML()))
    .pipe(replace(/{SPLASHSCREENS}/g, getSplashscreenXML()))
    .pipe(replace(/{ACCESS_ORIGIN}/g, configs.app.accessOrigin))
    .pipe(replace(/{ORIENTATION}/g, configs.app.orientation))
    .pipe(replace(/{TARGET_DEVICE}/g, configs.app.targetDevice))
    .pipe(replace(/{EXIT_ON_SUSPEND}/g, configs.app.exitOnSuspend))
    .pipe(gulp.dest('./' + PHONEGAP_APP_DIR + '/'))
});

gulp.task('install-plugins', shell.task(getPhonegapPluginCommands(), {
  cwd: PHONEGAP_APP_DIR
}));


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
  var commands = [];
  for (var i = 0; i < configs.app.phonegapPlugins.length; i++){
    var p = configs.app.phonegapPlugins[i];
    commands.push('phonegap plugin add ' + p.installFrom);
  }
  return commands;
}

function getPluginsXML() {
  var xml = '';
  for(var i = 0; i < configs.app.phonegapPlugins.length; i++){
    var p = configs.app.phonegapPlugins[i];
    var pluginXml = '<gap:plugin name="' + p.name + '"';
    if( !!p.version ){
      pluginXml += ' version="' + p.version + '"';
    }
    pluginXml += '/>' + "\n";
    xml += pluginXml;   
  }
  return xml;
}

function getIconsXML() {
  var xml = '';
  for(var i = 0; i < configs.app.icons.length; i++){
    var e = configs.app.icons[i];
    var eXml = '<icon src="' + e.src + '"';
    if( !!e.platform ){
      eXml += ' platform="' + e.platform + '"';
    }
    if( !!e.width ){
      eXml += ' width="' + e.width + '"';
    }
    if( !!e.height ){
      eXml += ' height="' + e.height + '"';
    }
    if( !!e.density ){
      eXml += ' density="' + e.density + '"';
    }
    eXml += '/>' + "\n";
    xml += eXml;
  }
  return xml;
}

function getSplashscreenXML() {
  var xml = '';
  for(var i = 0; i < configs.app.splashscreens.length; i++){
    var e = configs.app.splashscreens[i];
    var eXml = '<gap:splash src="' + e.src + '"';
    if( !!e.platform ){
      eXml += ' gap:platform="' + e.platform + '"';
    }
    if( !!e.width ){
      eXml += ' width="' + e.width + '"';
    }
    if( !!e.height ){
      eXml += ' height="' + e.height + '"';
    }
    eXml += '/>' + "\n";
    xml += eXml;
  }
  return xml;
}
