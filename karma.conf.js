// Karma configuration
// Generated on Tue Nov 18 2014 06:28:34 GMT+0100 (CET)

module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',


        // frameworks to use
        // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
        frameworks: ['jasmine'],


        // list of files / patterns to load in the browser
        files: [
            'https://ajax.googleapis.com/ajax/libs/angularjs/1.3.0/angular.js',
            'https://ajax.googleapis.com/ajax/libs/angularjs/1.3.0/angular-route.js',
            'https://ajax.googleapis.com/ajax/libs/angularjs/1.3.0/angular-mocks.js',
            'https://cdnjs.cloudflare.com/ajax/libs/underscore.js/1.7.0/underscore.js',
            'https://cdnjs.cloudflare.com/ajax/libs/angular-ui-bootstrap/0.12.0/ui-bootstrap-tpls.min.js',
            'static/libs/ngStorage/ngStorage.min.js',
            'static/js/app.js',
            'static/js/controllers/*.js',
            'static/js/services/*.js',
            'static/js/tests/**/*.js'
        ],


        // list of files to exclude
        exclude: [
        ],


        // preprocess matching files before serving them to the browser
        // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
        preprocessors: {
        },


        // test results reporter to use
        // possible values: 'dots', 'progress'
        // available reporters: https://npmjs.org/browse/keyword/karma-reporter
        reporters: ['progress'],


        // web server port
        port: 9876,


        // enable / disable colors in the output (reporters and logs)
        colors: true,


        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_INFO,


        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,


        // start these browsers
        // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
        browsers: ['Chrome'],


        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: false
    });
};
