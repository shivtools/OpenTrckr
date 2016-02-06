var PeriodicTask = require('periodic-task');
var Twit = require('twit');

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
		var CartoDB = require('cartodb');

		var client = new CartoDB({
			user: "shivtoolsidass",
			api_key: "e99e7f7567924034203f0858825d265c652e24c1"
		});

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

  var delay = 1000*60*10; //query every 10minutes milliseconds
  var task = new PeriodicTask(delay, function () {
      var T = new Twit({
      consumer_key: "6dOR1JKhr5BarNhGbNA3TG5Bt",
      consumer_secret: "jC4w7f9O8LsCFEcckFa8zcELFJWsT5TSo7pfrQIl6eM1tltS3R",
      access_token: "695975838752337920-4ZLvDgFSflFZsZCJful6KqrN88FxLW5",
      access_token_secret: "2PyicFNjrImeyk85ymx2mEGmRxuHQt6AAcFD9uYghfIaU"
    });
    T.post('statuses/update', { status: "Sample tweet"}, function(err, data, response) {
      if (err) {
        //req.flash('errors', {msg: 'Your tweet was not posted, please try again!'});
      }
      //req.flash('success', { msg: 'Tweet has been posted.'});
      console.log("Success");
      //return res.redirect('/');
    });
  });

  task.run();

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