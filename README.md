# OpenTrckr

**In the last year, the instances of cases of the Zika virus have exploded, and unfortunately the demographic that is the worst affected is pregnant women and their unborn children. Zika has been linked to an increase in the rate of the birth defect known as [microcephaly](http://www.cdc.gov/ncbddd/birthdefects/microcephaly.html) - a very small head and brain size.**

## Motivation

In developing nations with large populations it is quite challenging for governments/medical authorities/non-profit organizations to deploy assistance to populations afflicted with the Zika virus. There is also a lack of a database which holds information regarding occurences of the disease. OpenTrckr's motivation is to resolve this problem. 

Opentrckr provides live access to data regarding user reported instances of the disease, stagnant water bodies and location of medical camps - crucial information to both victims and organizations alike. 

## Functionality 

With real time data visualizations rendered using the awesome CartoDB API.

![Map of CartoDB visualization](https://raw.githubusercontent.com/shivtools/HopHacks/master/markdown/map.png)

Users are able to zoom in and out and keep track of the following: 

* **Cases of Zika occurences** - thereby warning pregnant women and other vulnerable populations of where the disease is prevalent.
* **Stagnant water bodies** - that could potentially breed mosquitoes. This feature is useful for government organizations to conveniently deploy resources to spray these water bodies early and efficiently.
* **Location of medical facilities** - non-profit organizations and governmental organizations that are providing access to victims afflicted with Zika. Mitigates the effort and risk of searching for resources and thereby being exposed to mosquitoes.

OpenTrckr makes use of Google Maps' API to render a user's current coordinates. If current coordinates are not correct (which is unlikely), the user is allowed to place a crosshair wherever they'd like. Checks have been installed to make sure that a user *cannot* add more than one tag in a 24 hour period in a 2 mile radius. This check was installed to make sure that a user cannot spam the app with false tags (making our data more authentic).

![Google Maps](https://raw.githubusercontent.com/shivtools/HopHacks/master/markdown/googlemaps.png)

OpenTrckr demonstrates its ultimate usefulness with its ability to alert agencies that need to reach out to areas in need of help, but the lack of staff and comprehensive data on Zika victims prevents them from efficiently reaching victims on time. Geo-tags are present on the map in clusters, and this makes rendering a single set of coordinates (to alert an agency with) problematic. An example can of a cluster is demonstrated below.

![Cluster](https://raw.githubusercontent.com/shivtools/HopHacks/master/markdown/clusters.png)

OpenTrckr makes use of a *data clustering algorithm* known as **[Density-based spatial clustering of applications with noise (DBSCAN)](https://en.wikipedia.org/wiki/DBSCAN)** to narrow down on a single set of coordinates that best represents the cluster. A visual representation of this clustering algorithm is represented below.

![DBSCAN algorithm](https://upload.wikimedia.org/wikipedia/commons/1/1b/Kernel_Machine.png).

Based on the set of coordinates rendered by the clustering algorithm, OpenTrckr tweets this set of coordinates (latitude and logitude) to a relevant organization which can deploy help to the affected region accordingly. For now, we will only be tweeting our own Twitter Handle to prevent any undue panic! 

![Sample tweets](https://raw.githubusercontent.com/shivtools/HopHacks/master/markdown/twitter.png)


## Our Stack

OpenTrckr is a [Node.js](https://nodejs.org/en/)/[Express app](http://expressjs.com/en/guide/using-middleware.html) that uses [Jade](http://jade-lang.com/) as its templating engine. [CartoDB](https://cartodb.com/) is used for data visualizations (using PostgreSQL queries). Our geolocation data is provided by [Google Maps](https://developers.google.com/maps/), Tweets are tweeted using the Twitter API. Login authentications are done using the Facebook/Gmail/Instagram/Github/LinkedIn/Twitter APIs.

## Developers 

Our awesome team consists of 3 current University of Richmond undergrads, [Alexandru Pana](https://github.com/FFMMM), [Michael Dombrowski](https://github.com/md100play), [Shiv Toolsidass (Myself :) )](https://github.com/shivtools) and [Otega Owho-Ovuakporie](https://github.com/otegaoo) of Lincoln University, PA. We came to [HopHacks](http://hophacks.com/), consumed far too much redbull/junk food and coded the weekend away - a wonderful experience overall! We hope that you find OpenTrckr useful and that our app will benefit people. We plan on extending the functionality of the app in the future - more to come! 


## Citations

* [10 Essential Facts about the Zika virus](http://www.everydayhealth.com/news/10-essential-facts-about-zika-virus/)
* [DBSCAN algorithm visual](https://upload.wikimedia.org/wikipedia/commons/1/1b/Kernel_Machine.png)

## License:

Create Commons License. Feel free to fork this repo and improve upon our existing codebase - that pull request is a click (and a code review *wink*) away!

