const gulp = require('gulp');
const exec = require('child_process').exec;
const htmlmin = require('gulp-htmlmin');
const argv = require('yargs').argv;
gulp.task('minify', () => {
    return gulp.src('src/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('dist'));
});
gulp.task('manifest-copy', () => {
    return gulp.src('src/manifest.json')
        .pipe(gulp.dest('dist'));
});
gulp.task('install', function (cb) {
    exec('curl -X POST -F \'displayFormTemplate=@dist/displayFormTemplate.html\' -F \'manifest=@dist/manifest.json\' -F companyId=' + ((argv.companyId) ? argv.companyId : '1') + ' ' + ((argv.protocol) ? argv.protocol : 'http') + '://' + ((argv.host) ? argv.host : 'localhost:8083') + '/thread/installPlugin', function (err, stdout, stderr) {
        console.log(stdout);
        console.log(stderr);
        cb(err);
    });
});
gulp.task('build', gulp.series('minify', 'manifest-copy'), function (done) {
    done();
});
gulp.task('dev', function (done) {
    gulp.watch('src/*.html', gulp.series('build','install'));
    gulp.watch('src/manifest.json', gulp.series('build','install'));
});
gulp.task('default', gulp.series('build', 'install'), function (done) {
    done();
});
