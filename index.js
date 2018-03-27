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
			components: comp,
			fontcolor: 'white',
			bgcolor: intToRGB(hashCode(res))
		};

		(function getAllVisitors() {
			var all_keys = firebase.database().ref('visitors_seen/').once('value').then(function(snapshot){
				snapshot.forEach(child => {
					var snapshot_res = child.val();
					var text = String(snapshot_res.result).substring(0,16)+'..';
					var fontcolor = snapshot_res.fontcolor;
					var bgcolor = snapshot_res.bgcolor;
					console.log('text:'+text.result);
					$('#visitors').append('<div id=\''+String(child.val().result)+'\' class=\'visitor\' style=\'background-color:'+bgcolor+'; color:'+fontcolor+';\'>'+text+'</div');
				});
			});
		})();

		(function writeToDB(obj) {
			console.log('writing client key to db..');
			var new_key = firebase.database().ref('visitors_seen').push().key;
			var updates = {};
			updates[res] = obj;
			console.log('client key written to db!');
			return firebase.database().ref('visitors_seen/').update(updates);
		})(new_obj);

	}));
});

function hashCode(str) { // java String#hashCode
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
       hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
} 

function intToRGB(i){
    var c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();

    return "00000".substring(0, 6 - c.length) + c;
}



