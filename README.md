#Phonegap + React mobile application

old home pet-project

released in [Google Play](https://play.google.com/store/apps/details?id=com.maullerz.gowcraft.calculator_light)

on web - [gowtools.club](http://gowtools.club)

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
