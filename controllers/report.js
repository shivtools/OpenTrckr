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
};
