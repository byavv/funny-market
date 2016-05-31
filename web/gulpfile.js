var gulp = require('gulp'),
    $ = require('gulp-load-plugins')(),
    webpack = require('webpack'),
    path = require('path'),
    ts = require('gulp-typescript'),
    runSequence = require('run-sequence'),
    chalk = require('chalk'),
    nodemon = require('gulp-nodemon'),
    rx = require("rxjs");

var config = require("./webpack.config")();

gulp.task("set_test", () => {
    process.env.NODE_ENV = 'test';
})
gulp.task("compile:tests", (done) => {
    webpack(config.test_server).run(onWebpackCompleted(done));
});
gulp.task('test:server', ["set_test", "compile:tests"], () => {
    var mochaError;
    gulp.src(['./test/**/*.spec.js'], { read: false })
        .pipe($.mocha({
            reporter: 'spec'
        }))
        .on('error', (err) => {
            mochaError = err;
        })
        .on('end', () => {
            if (mochaError) {
                $.util.log($.util.colors.bgRed('ERROR:'), $.util.colors.red(mochaError.message));
                process.exit(1);
            }
            $.util.log($.util.colors.white.bgGreen.bold('INFO:'), 'Mocha completed');
            process.exit();
        });
});
gulp.task("test", ['test:client'], (done) => {
    runSequence(['test:server'], done)
});
gulp.task("test:client", (done) => {
    startClientTests(true, done);
});
gulp.task("test:client:watch", (done) => {
    startClientTests(false, done);
});
gulp.task('clean', (done) => {
    require('rimraf')('./build', done);
});
gulp.task("build:server", (done) => {
    webpack(config.server).run(onWebpackCompleted(done));
});
gulp.task("build:client", (done) => {
    webpack(config.client).run(onWebpackCompleted(done));
});
gulp.task("build:vendors", ["clean"], (done) => {
    webpack(config.vendors).run(onWebpackCompleted(done));
});
gulp.task("build", ["build:vendors"], (done) => {
    runSequence(['build:server', 'build:client'], done);
});
gulp.task('default', () => {
    var nodemonRef;
    rx.Observable.create((observer) => {
        webpack(config.client).watch(500, onWebpackCompleted((err) => {
            if (err) observer.error(err);
            observer.next();
        }));
        webpack(config.server).watch(500, onWebpackCompleted((err) => {
            if (err) observer.error(err);
            observer.next();
        }));
    })
        .skip(1)
        .subscribe(() => {
            nodemonRef
                ? nodemonRef.restart()
                : nodemonRef = nodemon({
                    script: path.join(__dirname, 'build/server/server.js'),
                });
        })
});

function startClientTests(single, done) {
    single = single || false;
    var Server = require("karma").Server;
    var server = new Server({
        configFile: __dirname + "/karma.conf.js",
        singleRun: single,
        autoWatch: !single
    }, (res) => {
        if (res === 1) {
            $.util.log($.util.colors.white.bgRed.bold("KARMA FAIL!"));
        } else {
            $.util.log($.util.colors.white.bgGreen.bold('INFO:'), 'Karma completed');
        }
        done();
    });
    server.start();
}
function onWebpackCompleted(done) {
    return (err, stats) => {
        if (err) {
            $.util.log($.util.colors.bgRed('ERROR:'), $.util.colors.red(err));
        } else {
            var stat = stats.toString({ chunks: false, colors: true });
            console.log(stat + '\n');
        }
        if (done) {
            done(err);
        }
    }
}
