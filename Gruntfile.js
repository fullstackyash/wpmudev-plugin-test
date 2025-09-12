module.exports = function (grunt) {
	require('load-grunt-tasks')(grunt)

	

	const copyFiles = [
        'app/**',
        'core/**',
        'languages/**',
        'assets/**',
        'wpmudev-plugin-test.php',
        'README.md',
        'composer.json',
        // Include only specific Google API services
        'vendor/autoload.php',
        'vendor/composer/**',
        'vendor/google/apiclient/**',
        'vendor/google/auth/**',
        'vendor/google/apiclient-services/autoload.php',
        'vendor/google/apiclient-services/composer.json',
        'vendor/google/apiclient-services/src/Drive/**',
        'vendor/google/apiclient-services/src/Drive.php',
        // Include required dependencies
        'vendor/firebase/**',
        'vendor/guzzlehttp/**',
        'vendor/monolog/**',
        'vendor/phpseclib/**',
        'vendor/psr/**',
        // Exclude everything else
        '!vendor/google/apiclient-services/src/*',
        '!vendor/google/apiclient-services/src/**',
        // Re-include what we need
        'vendor/google/apiclient-services/src/Drive/**',
        'vendor/google/apiclient-services/src/Drive.php',
        // Exclude dev dependencies and unnecessary files
        '!src/**',
        '!tests/**',
        '!node_modules/**',
		'!**/*.md',
        '!**/*.dist',
        '!**/*.map',
        '!**/composer.lock',
        '!**/package*.json',
        '!**/Gruntfile.js',
        '!**/webpack.config.js',
        '!**/phpcs.ruleset.xml',
        '!**/phpunit.xml*',
        '!**/.git*',
        '!**/.DS_Store',
    ]

    const excludeCopyFilesPro = copyFiles
		.slice(0)
		.concat([
			'changelog.txt',
		])

	const changelog = grunt.file.read('.changelog')

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),

		// Clean temp folders and release copies.
		clean: {
			temp: {
				src: ['**/*.tmp', '**/.afpDeleted*', '**/.DS_Store'],
				dot: true,
				filter: 'isFile',
			},
			assets: ['assets/css/**', 'assets/js/**'],
			folder_v2: ['build/**'],
		},

		checktextdomain: {
			options: {
				text_domain: 'wpmudev-plugin-test',
				keywords: [
					'__:1,2d',
					'_e:1,2d',
					'_x:1,2c,3d',
					'esc_html__:1,2d',
					'esc_html_e:1,2d',
					'esc_html_x:1,2c,3d',
					'esc_attr__:1,2d',
					'esc_attr_e:1,2d',
					'esc_attr_x:1,2c,3d',
					'_ex:1,2c,3d',
					'_n:1,2,4d',
					'_nx:1,2,4c,5d',
					'_n_noop:1,2,3d',
					'_nx_noop:1,2,3c,4d',
				],
			},
			files: {
				src: [
					'app/templates/**/*.php',
					'core/**/*.php',
					'!core/external/**', // Exclude external libs.
					'google-analytics-async.php',
				],
				expand: true,
			},
		},

		copy: {
			pro: {
				src: excludeCopyFilesPro,
				dest: 'build/<%= pkg.name %>/',
			},
		},

		compress: {
			pro: {
				options: {
					mode: 'zip',
					archive: './build/<%= pkg.name %>-<%= pkg.version %>.zip',
				},
				expand: true,
				cwd: 'build/<%= pkg.name %>/',
				src: ['**/*'],
				dest: '<%= pkg.name %>/',
			},
		},

	})

	grunt.loadNpmTasks('grunt-search')

	grunt.registerTask('version-compare', ['search'])
	grunt.registerTask('finish', function () {
		const json = grunt.file.readJSON('package.json')
		const file = './build/' + json.name + '-' + json.version + '.zip'
		grunt.log.writeln('Process finished.')

		grunt.log.writeln('----------')
	})

	grunt.registerTask('build', [
		'checktextdomain',
		'copy:pro',
		'compress:pro',
	])

	grunt.registerTask('preBuildClean', [
		'clean:temp',
		'clean:assets',
		'clean:folder_v2',
	])
}
