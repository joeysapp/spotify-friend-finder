// java String#hashCode
function hashCode(str) {
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
	var c = (i & 0x00FFFFFF).toString(16).toUpperCase();
	return "00000".substring(0, 6 - c.length) + c;
}

function getAnimalObject(uuid){
	var uuid_hash = hashCode(uuid);
	return {
		type: intToAvailableAnimals(uuid_hash),
		color: intToRGB(uuid_hash)
	};
}


var uuids = ['1d09fa20-8a7c-4b78-909e-3a260f32dd5b', '27513b14-f13b-43c5-9fe4-008aad49d4af', '448500d1-8c0d-47b9-bf1a-8decbd936570', '5bb67d73-945a-4997-a91d-568217a12735', '60e60b92-2092-4abc-9f1a-b70e790e4c37', '679e5ebf-0a91-4b98-8c36-24e4eb7bc498', '68da88a3-28f3-4660-9596-44abdfde8c8f', '768c746f-49be-4d6a-b7ed-d3531d4a64c8', 'a11676c8-a843-4716-801f-f3ffe22ea724'];

uuids.map(obj => {
	console.log(getAnimalObject(obj));
})




