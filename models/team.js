/**
 * Author: Farhoud Cheraghi <haynzz@googlemail.com>
 * Date: 2013/03/27
 */
mongoose = require('mongoose');

ParticipantSchema	= require('./participant')(mongoose);

 module.exports = function (mongoose) {
 	var Schema = mongoose.Schema;

	var Team = new Schema({
		players		: [ ParticipantSchema ]
	});
	Team.model = mongoose.model('Team', Team);

	return Team;
}