var PeriodicTask = require('periodic-task');
var Twit = require('twit');
var clustering = require('density-clustering');

var CartoDB = require('cartodb');

var client = new CartoDB({
  user: "shivtoolsidass",
  api_key: "e99e7f7567924034203f0858825d265c652e24c1"
});

var mySet = {}; //holds the number of unqiue clusters


exports.getReport = function(req, res) {
  res.render('report', {
    title: 'Report a Problem'
  });
};

exports.postReport = function(req, res) {
  var zika = req.body.Zika;
  var malaria = req.body.Malaria;
  var dengue = req.body.Dengue;
  var water = req.body.water;
  var lat = req.body.lat;
  var lng = req.body.lon;
  
  if(zika == undefined){
	  zika = 0;
  }
  else{
	  zika = 1;
  }
  if(malaria == undefined){
	  malaria = 0;
  }
  else{
	  malaria = 1;
  }
  if(water == undefined){
	  water = 0;
  }
  else{
	  water = 1;
  }
  if(dengue == undefined){
	  dengue = 0;
  }
  else{
	  dengue = 1;
  }
  
  if(dengue + water + malaria + zika < 1){
	  req.flash('errors', {msg: 'Failure! You must select at least 1 problem.' });
	return res.redirect('/');
  }
  
  if(lat == undefined || lng == undefined || lat == "" || lng == ""){
	  console.log("NO LAT/LNG");
  }
  else{
	client.on("connect", function () {
		client.query("SELECT * from zika WHERE username='"+req.user._id+"'", function(err, data){
			if(data.total_rows > 0){
				for(var i=0; i<data.total_rows; i++){
					if(distance(lat, lng, data.rows[i].lat, data.rows[i].lng) < 2 && Math.floor(Date.now() / 1000)-data.rows[i].timestamp < (60*60*24)){
						req.flash('errors', {msg: 'Failure! You have submitted something too close to another submission.' });
						return res.redirect('/');
					}
				}
			}
			var sql = "SELECT cartodb_id from zika ORDER BY cartodb_id DESC LIMIT 1";
			client.query(sql, function (err, data) {
			var id = 0;
			if(data.total_rows != 0){
				id = data.rows[0].cartodb_id+1;
			}
			if(err == null){
				client.query("SELECT CDB_LatLng("+lat+", "+lng+")", function(err, data){
					var latlng = data.rows[0].cdb_latlng;
					var sql = "INSERT INTO zika (cartodb_id, the_geom, lat, lng, dengue, malaria, zika, water, username, timestamp) VALUES ('"+id+"', '"+latlng+"','"+lat+"', '"+lng+"', '"+dengue+"', '"+malaria+"', '"+zika+"', '"+water+"', '"+req.user._id+"', "+Math.floor(Date.now() / 1000)+")";
					client.query(sql, function (err, data) {
						console.log(err);
						console.log(data);
						if(err == null){
							req.flash('success', { msg: 'Success! Thank you for your submission.' });
							return res.redirect('/');
						}
					});
				});
				}
			});
		});
	});
	client.connect();
  }
};

//periodically run function to check if there are enough victims in an area.
//if yes, then tweet government with this information

function query(){

    var coordinates = [];

         client.on("connect", function(){
          //connect to server, get all coordinates, and find main clusters of coordinates so that they can be tweeted.
            client.query("SELECT * FROM zika", function(err, data){
            if(err){
              //reject("Rejected");
            }
            data.rows.forEach(function(entry){
              coordinates.push([entry.lat, entry.lng]);
            });
            
            //cluster algorithm (dbscan)
            var dbscan = new clustering.DBSCAN();
            // parameters: 0.001 - neighborhood radius, 2 - number of points in neighborhood to form a cluster 
            var clusters = dbscan.run(coordinates, 0.1, 2);

            var averageClusters = [];
            var actualValues = [];

            //add each cluster to an array
            clusters.forEach(function(cluster){
              cluster.forEach(function(indexes){
                actualValues.push(coordinates[indexes]);
              })
              averageClusters.push(coordinatesAvg(actualValues));
              actualValues = [];
            });

            averageClusters.forEach(function(pair){
				console.log("here is my set: " + mySet);
				if(mySet[pair] != true){
					mySet[pair] = true; // put cluster in set
					//console.log(" this check works");
					sendTweet("There is a problemo here " + pair, "@ZikaFind");
				}
            });            //at the end of these loops, average clusters will hold data on main cluster positions 
            //generated using cluster algorithm
            console.log(averageClusters);
         });
      });

      client.connect();
}

//algorithm to calculate average of coordinates in an array
function coordinatesAvg(arr){
        var x = 0;
        var y = 0;
        var z = 0;

        arr.forEach(function(geoCoordinate){
            var latitude = geoCoordinate[0] * Math.PI / 180;
            var longitude = geoCoordinate[1] * Math.PI / 180;

            x += Math.cos(latitude) * Math.cos(longitude);
            y += Math.cos(latitude) * Math.sin(longitude);
            z += Math.sin(latitude);
        });

        var total = arr.length;

        x = x / total;
        y = y / total;
        z = z / total;

        var centralLongitude = Math.atan2(y, x);
        var centralSquareRoot = Math.sqrt(x * x + y * y);
        var centralLatitude = Math.atan2(z, centralSquareRoot);

        return [centralLatitude * 180 / Math.PI, centralLongitude * 180 / Math.PI];
}

query();


//console.log(clusters, dbscan.noise);

//sendTweet method that runs every 10 minutes using a periodic task
//will tweet to a government agency given the tweet and the associated twitter handle
  
function sendTweet(tweet, twitterHandle){

    console.log("Tweet received by sendTweet " + tweet);

    var delay = 1000*60*10; //query every 10 minutes
    var task = new PeriodicTask(delay, function () {
        var T = new Twit({
        consumer_key: "6dOR1JKhr5BarNhGbNA3TG5Bt",
        consumer_secret: "jC4w7f9O8LsCFEcckFa8zcELFJWsT5TSo7pfrQIl6eM1tltS3R",
        access_token: "695975838752337920-4ZLvDgFSflFZsZCJful6KqrN88FxLW5",
        access_token_secret: "2PyicFNjrImeyk85ymx2mEGmRxuHQt6AAcFD9uYghfIaU"
      });
      T.post('statuses/update', { status: tweet + " " + twitterHandle}, function(err, data, response) {
        if (err) {
          //req.flash('errors', {msg: 'Your tweet was not posted, please try again!'});
          console.log(err);
        }
        //req.flash('success', { msg: 'Tweet has been posted.'});
        console.log("Success");
        //return res.redirect('/');
      });
    });

  task.run(); //THIS MUST BE COMMENTED OUT
}


function distance(lat1, lon1, lat2, lon2) {
	var R = 6371; // Radius of the earth in km
	var dLat = deg2rad(lat2-lat1);  // deg2rad below
	var dLon = deg2rad(lon2-lon1); 
	var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2); 
	var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
	var d = R * c; // Distance in km
	var miles = d * .621371;
	return miles;
};


function deg2rad(deg) {
  return deg * (Math.PI/180)
};