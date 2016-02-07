var CartoDB = require('cartodb');

exports.getReport = function(req, res) {
  res.render('report', {
    title: 'Report a Problem'
  });
};

exports.postReport = function(req, res) {
	var zika = req.body.Zika;
	var med = req.body.med;
	var water = req.body.water;
	var lat = req.body.lat;
	var lng = req.body.lon;

	if(zika == undefined){
		zika = 0;
	}
	else{
		zika = 1;
	}
	if(water == undefined){
		water = 0;
	}
	else{
		water = 1;
	}
	if(med == undefined){
		med = 0;
	}
	else{
		med = 1;
	}

	if(med + water + zika < 1){
		req.flash('errors', {msg: 'Failure! You must select at least 1 problem.' });
		return res.redirect('/');
	}

	if(lat == undefined || lng == undefined || lat == "" || lng == ""){
		console.log("NO LAT/LNG");
		req.flash('errors', {msg: 'Failure! Coordinates are incorrect.' });
		return res.redirect('/');
	}
	else{
		var client = new CartoDB({
		  user: "shivtoolsidass",
		  api_key: "e99e7f7567924034203f0858825d265c652e24c1"
		});

		client.on("connect", function() {
			client.query("SELECT lat, lng, timestamp from zika WHERE username='"+req.user._id+"' ORDER BY timestamp DESC", function(err, data){
				if(data.total_rows > 0){
					for(var i=0; i<data.total_rows; i++){
						if(distance(lat, lng, data.rows[i].lat, data.rows[i].lng) < 2 && Math.floor(Date.now() / 1000)-data.rows[i].timestamp < (60*60*24)){
							req.flash('errors', {msg: 'Failure! You have submitted something too close to another submission.' });
							return res.redirect('/');
						}
					}
				}
				client.query("SELECT cartodb_id from zika ORDER BY cartodb_id DESC LIMIT 1", function(err1, data1) {
					var id = 0;
					if(data1.total_rows != 0){
						id = data1.rows[0].cartodb_id+1;
					}
					client.query("SELECT CDB_LatLng("+lat+", "+lng+")", function(err2, data2){
						var latlng = data2.rows[0].cdb_latlng;
						var sql = "INSERT INTO zika (cartodb_id, the_geom, lat, lng, zika, water, username, timestamp, medical) VALUES ('"+id+"', '"+latlng+"','"+lat+"', '"+lng+"', '"+zika+"', '"+water+"', '"+req.user._id+"', "+Math.floor(Date.now() / 1000)+", '"+med+"')";
						client.query(sql, function (err3, data3) {
							console.log(data3);
							if(err3 == null){
								req.flash('success', { msg: 'Success! Thank you for your submission.' });
								return res.redirect('/');
							}
							console.log(err3);
						});
					});
				});
			});
		});
		client.connect();
	}
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
}


function deg2rad(deg) {
  return deg * (Math.PI/180)
}