var uuid = require('uuid/v4');
var parser = require('ua-parser-js');
var firebase = require('firebase');
var fp = require('fingerprintjs2');
var so = require('stringify-object');
var fs = require('fs');
var moment = require('moment-timezone');

var config = {
  apiKey: "AIzaSyCEqXgSFuRFp0Gb9cGfozy6qBIJz563G4k",
  authDomain: "joeysappgithub.firebaseapp.com",
  databaseURL: "https://joeysappgithub.firebaseio.com",
};
firebase.initializeApp(config);
var db = firebase.database();

$(document).ready(() => {
	new fp().get((res, comp) => {

		var tmp_bgcolor = intToRGB(hashCode(res));

		var time = moment().tz('America/Rainy_River').format('MMMM Do YYYY, h:mm:ss a');
		var tmp_animaltype = 'Sheep';
		try {
			tmp_animaltype = intToAvailableAnimals(hashCode(res));
		} catch (err){
		}

		var new_obj = {
			result: res,
			components: comp,
			fontcolor: 'white',
			bgcolor: tmp_bgcolor,
			animaltype: tmp_animaltype,
			timestamp: time
		};

		(function getAllVisitors() {
			var all_keys = firebase.database().ref('visitors_seen_icons/').once('value').then(function(snapshot){
				snapshot.forEach(child => {
					var snapshot_res = child.val();
					var id = String(snapshot_res.result).substring(0,8)+'';
					var text = '';
					// var text = '<p>'+snapshot_res.components[0].value+'</p>';
					var fontcolor = snapshot_res.fontcolor;
					var bgcolor = snapshot_res.bgcolor;
					if (snapshot_res.animaltype && typeof snapshot_res.animaltype !== 'undefined'){
						var animaltype = snapshot_res.animaltype;
					} 
					if (id === String(res).substring(0,8)){
						$('#self').css('background-color', bgcolor);
						$('#self').css('background-position', 'center');
						$('#self').css('background-repeat', 'no-repeat');
						$('#self').css('background-size', '60px 60px');
						$('#self').css('background-image', 'url(\'static/icons/'+animaltype+'.png\')');
					};
					$('#visitors').append('<div id=\''+id+'\' class=\'visitor\'>'+text+'</div');
					$('#'+id).css('background-color', bgcolor);
					$('#'+id).css('background-position', 'center');
					$('#'+id).css('background-repeat', 'no-repeat');
					$('#'+id).css('background-size', '60px 60px');
					$('#'+id).css('background-image', 'url(\'static/icons/'+animaltype+'.png\')');
					var tmp = '<div class=\'timestamp\'>'+snapshot_res.timestamp+'</div>';
					$('#'+id).prepend(tmp);
				});
			});
		})();

		(function writeToDB(obj) {
			var new_key = firebase.database().ref('visitors_seen_icons').push().key;
			var updates = {};
			updates[res] = obj;
			return firebase.database().ref('visitors_seen_icons/').update(updates);
		})(new_obj);



	});
});

function hashCode(str) { // java String#hashCode
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
       hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
} 

function intToAvailableAnimals(i, callback){
	var animals = ['Alligator', 'Anteater', 'Armadillo', 'Auroch', 'Axolotl', 'Badger', 'Bat', 'Beaver', 'Buffalo', 'Camel', 'Capybara', 'Chameleon', 'Cheetah', 'Chinchilla', 'Chipmunk', 'Chupacabra', 'Cormorant', 'Coyote', 'Crow', 'Dingo', 'Dinosaur', 'Dolphin', 'Duck', 'Elephant', 'Ferret', 'Fox', 'Frog', 'Giraffe', 'Gopher', 'Grizzly', 'Hedgehog', 'Hippo', 'Hyena', 'Ibex', 'Ifrit', 'Iguana', 'Jackal', 'Kangaroo', 'Koala', 'Kraken', 'Lemur', 'Leopard', 'Liger', 'Llama', 'Manatee', 'Mink', 'Monkey', 'Moose', 'Narwhal', 'Orangutan', 'Otter', 'Panda', 'Penguin', 'Platypus', 'Pumpkin', 'Python', 'Quagga', 'Rabbit', 'Raccoon', 'Rhino', 'Sheep', 'Shrew', 'Squirrel', 'Tiger', 'Turtle', 'Walrus', 'Wolf', 'Wolverine', 'Wombat'];
	var idx = Math.abs(i % animals.length);
	return animals[idx];
}

function intToRGB(i){
    var c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();
    return "00000".substring(0, 6 - c.length) + c;
}



