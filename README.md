# Hummingbird minimal web client
###Minimal Hummingbird client that makes it easier to keep track of your anime

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

This app is intended to be used as a standalone chrome or desktop app since it uses cross origin requests
to the Hummingbird API. However, I haven't published this app to the chrome store yet so to install, clone the repository with git:

    git clone https://github.com/DarinM223/hummingbird-react-client

Then go into chrome and under settings->extensions check Developer mode and select Load unpacked extension... and select the hummingbird-react-client folder created from cloning. Then go to the URL chrome://apps and the app should be in there.

TODO
----
* Add import/export for set anime air dates and other preferences not in Hummingbird so you can move your settings to other computers
* Update list offline so that it updates once you get an internet connection
