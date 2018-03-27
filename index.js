var uuid = require('uuid/v4');
var parser = require('ua-parser-js');
var firebase = require('firebase');
var fp = require('fingerprintjs2');
var so = require('stringify-object');

var config = {
  apiKey: "AIzaSyCEqXgSFuRFp0Gb9cGfozy6qBIJz563G4k",
  authDomain: "joeysappgithub.firebaseapp.com",
  databaseURL: "https://joeysappgithub.firebaseio.com",
};
firebase.initializeApp(config);
var db = firebase.database();

$(document).ready(() => {
	console.log(parser(window.navigator.userAgent));
	console.log(uuid());
	console.log(new fp().get((res, comp) => {

		var new_obj = {
			result: res,
			components: comp
		};

		(function getAllVisitors() {
			var all_keys = firebase.database().ref('visitors_seen/').on('value', function(snapshot){
				var key = Object.keys(snapshot.val());
				var fontcolor = 'white';
				var bgcolor = 'blue';
				$('#visitors').append('<div class=\'visitor\' style=\'background-color:'+bgcolor+'; color:'+fontcolor+';\'>'+String(key).substring(0,16)+'..</div');
			});
		})();

		(function writeToDB(obj) {
			var new_key = firebase.database().ref('visitors_seen/').push().key;
			var updates = {};
			updates[res] = obj;
			return firebase.database().ref('visitors_seen/').update(updates);
		})(new_obj);

	}));
});



