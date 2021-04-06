exports.index = function(req, res) {
	var message = '';
	res.render('menu', {message: message})
};
