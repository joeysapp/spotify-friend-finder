const stringifyObject = require('stringify-object');
const d3 = require("d3");
const range = [161, 8128]

$(document).ready(() => {
	// setInterval(() => {
	// 	if (Math.random(1) < 0.995){
	// 		var char = String.fromCharCode(Math.floor(Math.random()*4096));
	// 		while (char === 'މ'){
	// 			console.log("hi");
	// 			char = String.fromCharCode(Math.floor(Math.random()*4096));
	// 		}
	// 		document.getElementById('text').insertAdjacentHTML('beforeend', char);
	// 		// $(document.body).html($(document.body).html()+'a');
	// 	} else {
	// 		document.getElementById('text').innerHTML = '';
	// 	}
	// }, 1);
	v = d3.voronoi();
	data = [];

	$(document.body).click(e => {
		console.log('you clicked at '+e.pageX+', '+e.pageY);
		data.push([e.pageX,e.pageY]);
		var dia = v(data).links();
		console.log(dia);
	});
});

$(document)
