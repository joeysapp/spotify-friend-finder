# spotify-friend-finder
Full-stack Javascript web-app utilizing client-server for OAuth 2.0 calls to the Spotify Web API, as well as connecting to a deployed Firebase instance to store user-provided data. Utilizes multiple ES6 features and design patterns, as well as using React for modularity.

# projects
React + Spotify OAuth

# Build
````browserify public/bundle.js -t [ babelify --presets [ es2015 react ] ] | uglifyjs -c -m > public/ugly-bundle.js
```