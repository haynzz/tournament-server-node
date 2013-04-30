module.exports = function(app)
{

	require('./tournamentRouter')(app);

	app.get('/api/', function (req, res) {
        res.send('App is running');
    });
}


