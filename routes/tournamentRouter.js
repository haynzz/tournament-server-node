/**
 * Author: Farhoud Cheraghi <haynzz@googlemail.com>
 * Date: 2013/03/27
 */

 module.exports = function(app){

 	var roundRouter = require('./roundRouter');

 	var TournamentController = require('../controllers/tournamentController');
 	var RoundController = require('../controllers/roundController');

 	app.get('/api/tournaments', TournamentController.listAllTournaments);

 	
 	app.post('api/tournament', TournamentController.createTournament);

 	
 	app.namespace('/api/tournament/:id', TournamentController.loadTournament, function() {
 		//console.log("Current Namespace: " + app.namespace.currentnamespace);
 		//app.post('/', TournamentController.createTournament);
 		//app.all('/:id/:op?', TournamentController.loadTournament);
	 	app.get('/', TournamentController.viewTournament);

	 	app.put('/start', TournamentController.startTournament);
	 	app.put('/clearRounds', TournamentController.clearRounds);

	 	app.get('/rounds', TournamentController.listAllRounds);
	 	app.get('/currentRound', TournamentController.getCurrentRound);

	 	app.namespace('/round/:id', RoundController.loadRound, function() {
 			roundRouter(app);
 		});
 	});

 	//var roundRouter = require('./roundRouter')(app);
 	// app.namespace('/api/tournament/:id/round', function() {
 	// 	require('./roundRouter')(app);
 	// });


 	//require('./roundRouter')(app);
 }