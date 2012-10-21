var pluginFactory = function(_, anvil) {
    return anvil.plugin({
        // Name your plugin
        name: "anvil.start",
        // Activity list: "identify", "pull", "combine", "pre-process","compile", "post-process", "push", "test"
        activity: "identify",
        // Command all the things [ "-s, --somecommand", "Run this plugin for awesomesauce" ]
        commander: [
            [ "--start", "Run a scaffolder based on the config" ]
        ],
        config: {
            dirs: {
                ext: [],
                src: [],
                spec: []
            }
        },
        // Configure all the things...
        configure: function( config, command, done ) {
            if ( command.start ) {
                this.start = true;
            }
            done();
        },
        // Run all the things...
        run: function( done ) {
            if ( !this.start ) {
                return done();
            }

            anvil.scheduler.parallel( _.keys(this.config.dirs), this.createDir, function() {
                this.createFiles( done );
            }.bind( this ));
        },
        createDir: function( dir, done ) {
            anvil.fs.ensurePath( dir, function() {
                done();
            });
        },
        createFiles: function( done ) {
            _.each( this.config.dirs, function( files, dir ) {
                if ( _.isArray( files ) && files.length ) {
                    anvil.scheduler.parallel(files, function( file, copyDone ) {
                        anvil.fs.copy( file, dir + "\\" + file.split("/").pop(), function() {
                            copyDone();
                        });
                    }, function() {
                        done();
                    });
                }
                else {
                    done();
                }
            });
        }
    });
};

module.exports = pluginFactory;