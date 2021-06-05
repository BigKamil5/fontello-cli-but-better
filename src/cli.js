const fs = require('fs');
const program = require('commander');
const Fontello = require('./fontello');

const defaults = {
    configPath: './config.json',
    sessionPath: './fontello-session'
};

const isDirValid = (path) => {
    try {
        fs.statSync(path).isDirectory();
        return true;
    } catch (err) {
        return false;
    }
};

program
    .command('open')
    .option('--config [path]', 'path to fontello config. defaults to ./config.json')
    .option('--session [path]', 'path to fontello session file')
    .description('open fontello session')
    .action((options) => {
        Fontello.open({
            configPath: options.config || defaults.configPath,
            sessionPath: options.session || defaults.sessionPath
        });
    });

program
    .command('install')
    .description('save fontello session')
    .option('--config [path]', 'path to fontello config. defaults to ./config.json')
    .option('--session [path]', 'path to fontello session file')
    .option('--css [path] path to css directory')
    .option('--font [path] path to font directory')
    .action((options) => {
        if (!options.css || !options.font || !options.session || !options.config) {
            console.error('--css, --font, --session and --config options are required');
            return;
        }
        if (!isDirValid(options.css)) {
            console.error('Css directory is not valid');
            return;
        }

        if (!isDirValid(options.font)) {
            console.error('Font directory is not valid');
            return;
        }

        Fontello.install({
            configPath: options.config || defaults.configPath,
            sessionPath: options.session || defaults.sessionPath,
            cssDirPath: options.css || defaults.sessionPath,
            fontDirPath: options.font || defaults.sessionPath
        });
    });

program.parse(process.argv);
