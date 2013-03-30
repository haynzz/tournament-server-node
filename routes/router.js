module.exports = function (app, models) {

    app.get('/api', function (req, res) {
        res.send('App is running');
    });

    require('./tournaments.js')(app, models);
    require('./participants.js')(app, models);
};