/**
 * Author: Farhoud Cheraghi <haynzz@googlemail.com>
 * Date: 2013/03/27
 */

  module.exports = function(app){

 	var RoundController = exports.controller = require('../controllers/roundController');

 	//console.log("Current namespace: " + app.currentNamespace);

 	//app.all(':id/:op?', RoundController.loadRound);
 	app.get('/', RoundController.viewRound);

 	// app.namespace('/api/tournament/:id', TournamentController.loadTournament, function() {
 	// 	//console.log("Current Namespace: " + app.namespace.currentnamespace);
 	// 	//app.post('/', TournamentController.createTournament);
 	// 	//app.all('/:id/:op?', TournamentController.loadTournament);
	 // 	app.get('/', TournamentController.viewTournament);
	 // 	app.get('/rounds', TournamentController.listAllRounds);
	 // 	app.get('/currentRound', TournamentController.getCurrentRound);

	 // 	app.namespace('/round/:id', RoundController.loadRound, function() {
 	// 		roundRouter(app);
 	// 	});
 	// });
  }