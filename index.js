var $ = require('jquery');
// var cookie = require('cookie');
const uuidv4 = require('uuid/v4');
var emoji = require('node-emoji');
var rn = require('random-name');

// var so = require('stringify-object');
// var moment = require('moment-timezone');
var firebase = require('firebase');
var config = {
  apiKey: "AIzaSyCEqXgSFuRFp0Gb9cGfozy6qBIJz563G4k",
  authDomain: "joeysappgithub.firebaseapp.com",
  databaseURL: "https://joeysappgithub.firebaseio.com",
};

firebase.initializeApp(config);
var db = firebase.database();

class Animal {
	constructor(uuid, name, cookies){
		this.uuid = uuid;
		this.type = intToAvailableAnimals(hashCode(uuid));
		this.bgcolor = intToRGB(hashCode(uuid));
		this.name = name;
		this.cookies = cookies;
	}

	getDiv() {

		var tmp = '<div id=\''+this.uuid+'\' class=\'animal\' style=\'margin:0.5vmin; border: 4px solid black;\'>';
		var stats = '<div class=\'animal stats\'>';
		var name = '<div class=\'animal stats name\'>'+this.name+'</div>';
		var type = '<div class=\'animal stats type\'>the '+this.type+'</div>';
		var weight = (this.cookies + 4)+' lbs'
		var food = '<div class=\'animal stats food\'>'+weight+'</div>';
		var portrait = '<div class=\'animal portrait\'style=\'background-image: url(\"static/icons/'+this.type+'.png\"); background-color:'+this.bgcolor+'\'></div>';
		console.log('getDiv');
		return tmp+stats+name+type+food+'</div>'+portrait+'</div>';
	}
}

var uuid;
var animal;
var animal_dict = {};
var dled = false;

function placeFeed() {
	$('.feed').show();
}

setInterval(placeFeed, 5000);


$(document).ready(() => {

	// First, populate all animals!
	// getAllAnimals((res) => {
	// 	console.log('got all da animals');
	// 	console.log(res);

	// });
	// confirmAndDisplayAnimals();

	$('.feed').click(e => {
		console.log('you fed ur pet a 🍪');
		$('.feed').hide();
		animal_dict[uuid].cookies += 1;
		var new_poundage = animal_dict[uuid].cookies+4+' lbs';
		$('#self.animal .stats .food').text(new_poundage);
		$('#'+uuid+'.animal .stats .food').text(new_poundage);
		writeAnAnimal(animal_dict[uuid], uuid);
	});
	// var fingerprint = require('browser-fingerprint')();
	if (!document.cookie.includes('uuidv4')){
		console.log('Creating new animal');
		uuid = uuidv4();
		document.cookie = 'uuidv4='+uuid;
		// new user. create uuid
		// create animal!!
		var name = rn.first();
		while (name.length > 7){
			name = rn.first();
		}
		var prounoun = 'the';
		animal = new Animal(uuid, name, 0);
		animal_dict[uuid] = animal;
		writeAnAnimal(animal, uuid);
	} else {
		// bring up their animal and highlight it on the grid
		uuid = getCookie('uuidv4');
	}
	getAllAnimals();
	confirmAndDisplayAnimals();
});

function confirmAndDisplayAnimals(){
	if (typeof animal_dict['blob'] !== 'undefined'){
		// woo finally got dem
		for (var key in animal_dict){
			if (key == 'blob'){ continue; }
			var tmp_animal = new Animal(key, animal_dict[key].name, animal_dict[key].cookies);
			if (key == uuid){
				console.log('this is u');
				$('#self.animal .stats .name').html(tmp_animal.name);
				$('#self.animal .stats .type').html('the '+tmp_animal.type);
				$('#self.animal .stats .food').html(tmp_animal.cookies+4+' lbs');
				$('#self.animal .portrait').css('background-color', tmp_animal.bgcolor);
				$('#self.animal .portrait').css('background-image', 'url("static/icons/'+tmp_animal.type+'.png"');
			}
			$('#animals').append(tmp_animal.getDiv());
		}
	} else {
		setTimeout(confirmAndDisplayAnimals, 250);
	}
}


function hashCode(str) { // java String#hashCode
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
       hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
} 

function intToAvailableAnimals(i, callback){
	var animal_list = ['Alligator', 'Anteater', 'Armadillo', 'Auroch', 'Axolotl', 'Badger', 'Bat', 'Beaver', 'Buffalo', 'Camel', 'Capybara', 'Chameleon', 'Cheetah', 'Chinchilla', 'Chipmunk', 'Chupacabra', 'Cormorant', 'Coyote', 'Crow', 'Dingo', 'Dinosaur', 'Dolphin', 'Duck', 'Elephant', 'Ferret', 'Fox', 'Frog', 'Giraffe', 'Gopher', 'Grizzly', 'Hedgehog', 'Hippo', 'Hyena', 'Ibex', 'Ifrit', 'Iguana', 'Jackal', 'Kangaroo', 'Koala', 'Kraken', 'Lemur', 'Leopard', 'Liger', 'Llama', 'Manatee', 'Mink', 'Monkey', 'Moose', 'Narwhal', 'Orangutan', 'Otter', 'Panda', 'Penguin', 'Platypus', 'Pumpkin', 'Python', 'Quagga', 'Rabbit', 'Raccoon', 'Rhino', 'Sheep', 'Shrew', 'Squirrel', 'Tiger', 'Turtle', 'Walrus', 'Wolf', 'Wolverine', 'Wombat'];
	var idx = Math.abs(i % animal_list.length);
	return animal_list[idx];
}

function intToRGB(i){
    var c = (i & 0x00FFFFFF)
        .toString(16)
        .toUpperCase();
    return "00000".substring(0, 6 - c.length) + c;
}

function getAllAnimals(){
	var all_keys = firebase.database().ref('animals/').once('value').then(function(snapshot){
		snapshot.forEach(child => {
			var snapshot_result = child.val();
			var tmp_uuid = snapshot_result.uuid;
			animal_dict[tmp_uuid] = snapshot_result;
			animal_dict['blob'] = '1';
			// console.log(snapshot_result);
			// ^ this is now the animal!
			// console.log('getAllAnimals()-> this.animal_dict:');
		});
	});
}

function writeAnAnimal(obj, key) {
	var new_key = firebase.database().ref('animals/').push().key;
	var updates = {};
	updates[key] = obj;
	return firebase.database().ref('animals/').update(updates);

}

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}
