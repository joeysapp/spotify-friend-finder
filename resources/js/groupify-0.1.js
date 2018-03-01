// It would be cool if we could have the page dynamically update
// upon addition/deletion. We'll see if that's possible
var prev = null;

function onUserInput(queryTerm) {

	// abort previous request, if any
	if (prev !== null) {
		// prev.abort();
	}

	// store the current promise in case we need to abort it
	// prev = spotifyApi.searchTracks(queryTerm, {limit: 5});
	// prev.then(function(data) {
	// 	// clean the promise so it doesn't call abort
	// 	prev = null;

	// 	console.log(data);

	// 	// ...render list of search results...

	// 	}, function(err) {
	// 		console.error(err);
	// 	});

	var username = $('#inputtext').val();
	prev = spotifyApi.getUserPlaylists(username, {limit: 5}).then(function(data){
		console.log("data:", data.body);
	}, function(err){
		console.log(err);
	});
	

}

function addName(e){
		var username = $('#inputtext').val();

		// This creates a unique ID of <div id='user1...n'>
		var unique_id = "user"+($('#placed_users').children().length+1);
		var tmp_div = $("<div id="+unique_id+" class='placed_user'>"+username+"</div>");
		var tmp_btn = $("<input type='button' value='x'>");
		
		$(tmp_btn).click(function(){
			$(tmp_btn).remove();
			$(tmp_div).remove();
		})

		$(tmp_div).prepend(tmp_btn);
		$('#placed_users').append(tmp_div);
}

// Would be good to find out when this is called on the js stack
$(document).ready(function() {
	// Handling clicking of our button
	$('#gobutton').click(function(e){
		addName(e);
		onUserInput(e);
	});

	// Handling pressing enter in the text field
	$('#inputtext').on('keypress', function(e){
		if (e.which === 13){
			addName(e);
			onUserInput(e);
		}
	});
});
