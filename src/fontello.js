const fs = require('fs');
const path = require('path');
const open = require('open');
const needle = require('needle');
const unzip = require('unzipper');

class Fontello {
    static HOST = 'https://fontello.com';
    static FONTELLO_SESSION_FILENAME = 'fontello-session';

    static getSession({configPath, sessionPath}) {
        return new Promise((resolve, reject) => {
            const requestOptions = {multipart: true};

            if (fs.existsSync(path.join(sessionPath, Fontello.FONTELLO_SESSION_FILENAME))) {
                const stats = fs.statSync(sessionPath);
                const fileModificationTimeDiff = Math.abs(new Date().getTime() - stats.mtime.getTime());

                if (fileModificationTimeDiff < (1000 * 3600 * 24)) {
                    console.log('Using saved fontello session');
                    const sessionId = fs.readFileSync(path.join(sessionPath, Fontello.FONTELLO_SESSION_FILENAME));
                    return resolve(sessionId);
                }
            }
            console.log('Creating new fontello session');

            const data = {
                config: {
                    file: configPath,
                    content_type: 'application/json'
                }
            };
            needle.post(Fontello.HOST, data, requestOptions, (error, response, body) => {
                if (error) {
                    reject(error);
                }

                if (response.statusCode === 200) {
                    fs.writeFile(path.join(sessionPath, Fontello.FONTELLO_SESSION_FILENAME), body, (error) => {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Session was saved');
                        }
                    });
                    return resolve(body);
                }
            });
        });
    }

    static open({configPath, sessionPath}) {
        Fontello.getSession({configPath, sessionPath}).then((sessionId) => {
            const sessionUrl = `${Fontello.HOST}/${sessionId}`;
            open(sessionUrl);
        });
    }

    static install({configPath, sessionPath, cssDirPath, fontDirPath}) {
        Fontello.getSession({configPath, sessionPath}).then((sessionId) => {
            const requestOptions = {follow: 10};
            const sessionUrl = `${Fontello.HOST}/${sessionId}/get`;

            const zipFileStream = needle.get(sessionUrl, requestOptions, (error) => {
                if (error) {
                    throw error;
                }
            });

            zipFileStream.pipe(unzip.Parse()).on('entry', (entry) => {
                const {path: pathName, type, autodrain} = entry;

                if (type === 'File') {
                    const dirName = path.dirname(pathName).match(/\/([^\\/]*)$/);
                    const fileName = path.basename(pathName);
                    if (dirName && dirName.length && dirName[1]) {
                        if (dirName[1] === 'css') {
                            const cssPath = path.join(cssDirPath, fileName);
                            entry.pipe(fs.createWriteStream(cssPath));
                        }

                        if (dirName[1] === 'font') {
                            const fontPath = path.join(fontDirPath, fileName);
                            entry.pipe(fs.createWriteStream(fontPath));
                        }
                    } else if (fileName === 'config.json') {
                        entry.pipe(fs.createWriteStream(configPath));
                    } else {
                        autodrain();
                    }
                }
            }).on('finish', () => {
                console.log('Install complete.');
            });
        });
    }
}

module.exports = Fontello;
