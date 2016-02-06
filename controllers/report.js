/**
 * GET /contact
 * Contact form page.
 */
exports.getReport = function(req, res) {
  res.render('report', {
    title: 'Report'
  });
};

/**
 * POST /contact
 * Send a contact form via Nodemailer.
 */
exports.postReport = function(req, res) {
  req.assert('name', 'Name cannot be blank').notEmpty();
  req.assert('email', 'Email is not valid').isEmail();
  req.assert('message', 'Message cannot be blank').notEmpty();

  var errors = req.validationErrors();

  if (errors) {
    req.flash('errors', errors);
    return res.redirect('/contact');
  }

  var from = req.body.email;
  var name = req.body.name;
  var body = req.body.message;
  var to = 'your@email.com';
  var subject = 'Contact Form | Hackathon Starter';
};
