#Phonegap + React mobile application

Old home pet-project. React/Phonegap/React-Bootstrap/Gulp/Webpack

[on Google Play](https://play.google.com/store/apps/details?id=com.maullerz.gowcraft.calculator_light)

[on App Store](https://itunes.apple.com/us/app/craft-calculator-for-gow-light/id1070978843?ls=1&mt=8)

How to
===========

* Install Phonegap
```
$ sudo npm install phonegap -g
```

* clone this repo
```
$ git clone https://github.com/maullerz/gowtools.git
```

* Set it up
```
$  npm install
$  gulp create
$  gulp build-app
```

* Run it
```
$ gulp serve
```

* Point your [Phonegap Developer App](https://github.com/phonegap/phonegap-app-developer) to the suggested URL

That's it!

* While developing:
```
$ gulp serve
$ gulp (on another tab)
```


this will rebuild the app automatically every time you edit the source code

Build configurations are located in
```
./build.configs.js
src/config.xml
```

inspired by https://github.com/kjda/ReactJs-Phonegap
