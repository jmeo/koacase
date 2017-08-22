/**
 * Created by jmeo on 2017/7/18.
 */

module.exports = function (grunt) {

    /**
     * 加载所有grunt 初始化任务
     * repalce grunt.loadNpmTasks
     */
    require('load-grunt-tasks')(grunt);

    /**
     *显示任务执行消耗的时间
     */
    require("time-grunt")(grunt);

    //构建目录
    var buildDir = 'build';
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean:{
            build:{
                files:[
                    {src:buildDir}
                ]
            }
        },
        copy:{
            main:{
                files:[{
                    expand : true,
                    cwd : '.',
                    src : ['**'],
                    dest : buildDir
                }]
            }
        },
        auto_install:{
            npm_bower:{
                options:{
                    cwd : buildDir,
                    stderr : true,
                    stdout : true,
                    npm : '--production -d',
                    bower : true,
                    failOnError : false
                }
            }
        },
        babel: {
            options: {
                sourceMap: false,
                presets: ['babel-preset-es2015']

            },
            dist: {
                files: [{
                    expand:true,
                    cwd : buildDir, //js目录下
                    src : ['app/assets/**/*.js'], //所有js文件
                    dest : buildDir  //输出到此目录下
                }]
            }
        },
        uglify:{
            options:{
                mangle:false
            },
            target:{
                files: [{
                    expand: true,
                    cwd: buildDir,
                    src: ['app/assets/**/*.js'],
                    dest: buildDir
                }]
            }
        },
        zip:{
            build:{
                cwd : buildDir,
                src : buildDir+'/**',
                dest : 'repository/file.zip'
            }
        }
    });

    //TODO 注册服务 default
    grunt.registerTask('default',['copy:main','babel:dist','uglify:target']);
    grunt.registerTask('package',['clean','copy','auto_install','babel','uglify','zip:build']);
};