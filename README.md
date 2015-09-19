# Hachidori

![Main Image](http://i.imgur.com/9cCbHLf.png?1)

Features
--------

* One global searchbar that not only searches through your library but also finds other anime that matches your search
* Quickly add new anime from the search results in one click
* Anime is ordered by air day, so the anime that airs today will be at the top of the list
* The weekly air day for an anime is guessed based on the air date of the first aired episode but there can be mistakes, in that case you can change it yourself and it will save your change in local storage and automatically update your list
* Editing the episodes textbar and setting/changing the rating will update the library item in Hummingbird
* Tabbar that filters anime on status

Installing
----------

This app can be used as both a standalone chrome or desktop app or a web app. Right now the chrome app doesn't know how to connect to the public node.js server so only the web app is able to be run. First clone the github repository here: 

    git clone https://github.com/DarinM223/hummingbird-react-client

Then install all of the dependencies:

    npm install

Then if you want to run the server in development mode (client and server reload when you change something) run:

    npm start

And if you want to build the React code for production, run:

    npm run build

Dependencies
------------

* node.js
* bower
* mocha
* eslint
* webpack
* redis

Contributing
------------

Contributions are always welcome! Make sure that any changes you make are accompanied with unit tests and there are no test or linter errors. 
Also make sure that you are following the same style as the rest of the code.
To check for linting errors run:

    eslint .

To check the tests run:

    mocha

TODO
----
* Add import/export for set anime air dates and other preferences not in Hummingbird so you can move your settings to other computers
* Update list offline so that it updates once you get an internet connection
