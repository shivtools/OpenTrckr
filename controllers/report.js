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
			console.log("connected to cartoDB");
			var sql = "SELECT cartodb_id from zika ORDER BY cartodb_id DESC LIMIT 1";
			client.query(sql, function (err, data) {
				var id = 0;
				if(data.total_rows != 0){
					id = data.rows[0].cartodb_id+1;
				}
				if(err == null){
					var sql = "INSERT INTO zika (cartodb_id, lat, lng, dengue, malaria, zika, water, username) VALUES ('"+id+"', '"+lat+"', '"+lng+"', '"+dengue+"', '"+malaria+"', '"+zika+"', '"+water+"', '"+req.user._id+"')";
					client.query(sql, function (err, data) {
					});
				}
			});
		});
		client.connect();
  }
};
