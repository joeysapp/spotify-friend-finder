# joeysapp.github.io
Personal website used for learning new stuff.

# projects
React + Spotify OAuth

# Build
````browserify public/bundle.js -t [ babelify --presets [ es2015 react ] ] | uglifyjs -c -m > public/ugly-bundle.js
```