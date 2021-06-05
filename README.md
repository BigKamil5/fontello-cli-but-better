# fontello-cli-but-better

### Installation
```sh
$ npm install -g fontello-cli-but-better
```

### What for
This package is a younger brother of [fontello-cli](https://github.com/paulyoung/fontello-cli).
It was created to overcome problems which fontello-cli delivers. Main one was the inability to save config.json file with command line to whatever folder we choose.

### How to use
There are two commands available
```sh
$ fontello-cli-but-better open --session ./assets --config ./assets/config.json

Where:
* --session - path where temp session file will be created, if it already exists, will be used to retrieve last session
* --config - path to fontello config file 
```

```sh
$ fontello-cli-but-better install --session ./assets --config ./assets/config.json --css ./assets/css --font ./assets/font

Where:
* --session - path where temp session file will be created, if it already exists, will be used to retrieve last session
* --config - path to fontello config file 
* --css - path to folder where fontello css files will be saved 
* --font - path to folder where fontello font files will be saved 
```

Base case scenario will be:
1. Get your config file from fontello.
2. Place it whatever you want in your project
3. Create new fontello session with `fontello-cli-but-better open (provide options)`
4. Change/add/rename/delete your icons, hit save
5. Save session with `fontello-cli-but-better install (provide options)`