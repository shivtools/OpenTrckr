# OpenTrckr
======

**In the last year, the instances of cases of the Zika virus have exploded, and unfortunately the demographic that is the worst affected is pregnant women and their unborn children. Zika has been linked to an increase in the rate of the birth defect known as [microcephaly](http://www.cdc.gov/ncbddd/birthdefects/microcephaly.html) - a very small head and brain size.**

## Motivation:

In developing nations with large populations it is quite challenging for governments/medical authorities/non-profit organizations to deploy assistance to populations afflicted with the Zika virus. There ~~is~~ was also a lack of a database which holds information regarding occurences of the disease. OpenTrckr's motivation is to resolve this problem. 

Opentrckr provides live access to data regarding user reported instances of the disease, stagnant water bodies and location of medical camps - crucial information to both victims and organizations alike. 

## Functionality: 

With real time data visualizations rendered using the awesome CartoDB API: ![Map of CartoDB visualization](https://github.com/shivtools/HopHacks/markdown/map.png), users are able to zoom in and out and keep track of the following: 

* **Cases of Zika occurences** - thereby warning pregnant women and other vulnerable populations of where the disease is prevalent.
* **Stagnant water bodies** - that could potentially breed mosquitoes. This feature is useful for government organizations to conveniently deploy resources to spray these water bodies early and efficiently.
* **Location of medical facilities** - non-profit organizations and governmental organizations that are providing access to victims afflicted with Zika. Mitigates the effort and risk of searching for resources and thereby being exposed to mosquitoes.



## Our Stack

OpenTrckr is a Node.js/Express app that uses Jade as its templating engine. CartoDB is used for data visualizations (using PostgreSQL queries). Our geolocation data is provided by Google Maps, Tweets are tweeted using the Twitter API. Login authentications are done using the Facebook/Gmail/Instagram/Github/LinkedIn/Twitter APIs.

## Developers 

Our awesome team consists of 3 current University of Richmond undergrads, [Alexandru Pana](https://github.com/FFMMM), [Michael Dombrowski](https://github.com/md100play), [Shiv Toolsidass (Myself :) )](https://github.com/shivtools) and [Otega Owho-Ovuakporie](https://github.com/otegaoo) of Lincoln University, PA. We came to HopHacks, consumed far too much Redbull/Gatorade/junk food and coded the weekend away - a wonderful experience overall! We hope that you find OpenTrckr useful and that our app will benefit people. We plan on extending the functionality of the app in the future - more to come! 


## Citations: 

* [10 Essential Facts about the Zika virus](http://www.everydayhealth.com/news/10-essential-facts-about-zika-virus/)

## License:

Create Commons License. Feel free to fork this repo and improve upon our existing codebase - that pull request is a click (and a code review *wink*) away!

