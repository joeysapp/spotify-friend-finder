var users = [];

var GLOBAL_UUID = null;
var GLOBAL_SELF = null;

var React = require('react');
var ReactDOM = require('react-dom');

var uuidv4 = require('uuid-v4');

var firebase = require('firebase');
var config = {
	apiKey: "AIzaSyCpSdQt0tWey4qV9ynPIyeAMhMTyiJaTO8",
	authDomain: "joeysappgithub.firebaseapp.com",
	databaseURL: "https://joeysappgithub.firebaseio.com",
};
firebase.initializeApp(config);

firebase.database().ref('users').on('value', (user_list) => {
	user_list.forEach(user_snapshot => {
		var user = user_snapshot.val();
		var uuid = user.uuid;
		var username = user.user_info.id;
		var avatar;
		if (user.user_info.images){
			avatar = user.user_info.images[0].url;

		} else {
			avatar = 'public/avatars/empty.png';
		}
		var artists = user.artists;
		var recently_played = user['recently-played'];
		var tmp_user = <SpotifyUser uuid={uuid} username={username} avatar={avatar} artists={artists} recently_played={recently_played}/>;
		if (uuid != GLOBAL_UUID){
			users.push(tmp_user);
		} else {
			GLOBAL_SELF = tmp_user;
		}
		user_container = <UsersContainer self={GLOBAL_SELF} users={users}/>
		ReactDOM.render(user_container, mount);

	});
});

//https://stackoverflow.com/questions/901115/how-can-i-get-query-string-values-in-javascript/901144#12151322
function getParameterByName(name) {
	var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
	return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}

function getCookie(name) {
	var value = "; " + document.cookie;
	var parts = value.split("; " + name + "=");
	if (parts.length == 2) return parts.pop().split(";").shift();
}

$(document).ready(() => {
	if (document.cookie.indexOf('spotify-uuid') === -1 && getParameterByName('client_id') !== null){
		document.cookie = 'spotify_uuid='+getParameterByName('client_id');
		GLOBAL_UUID = getParameterByName('client_id')
	} else {
		GLOBAL_UUID = getCookie('spotify_uuid');

	}

	console.log('GLOBAL_UUID: '+GLOBAL_UUID);
});

class TopArtists extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			artists: props.artists.items
		};
	}

	render() {
		var artistGenres = this.state.artists.map((artist) => {
			<div className='spotifyArtistGenre'>{artist.genres}</div>
		});

		var listOfArtists = this.state.artists.map((artist) => 
			<div key={artist.name } className='spotifyArtist'>
				<img className='spotifyArtistImage' src={artist.images[0].url} alt={artist.name} />
				<a href={artist.external_urls.spotify} className='spotifyArtistName'>{artist.name}</a>
				<div className='spotifyArtistGenres'>
					{typeof artist.genres === 'undefined' ? '' : artist.genres.join(', ')};
				</div>
			</div>
		);
		return (
			<div style={{overflow: 'auto'}} className='spotifyTopArtists'>
			Top Played Artists
				{listOfArtists}	
			</div>
		)
	}

}


class SpotifyUser extends React.Component {
	constructor(props){
		super(props);
		this.user = {
			username: props.username,
			avatar: props.avatar,
			recently_played: props.recently_played
		}
		this.uuid = props.uuid;
		this.key = props.uuid;
		this.top_artists = props.artists;
	}

	render() {
		var last_played;
		var href;

		if (typeof this.user.recently_played !== 'undefined' && 'items' in this.user.recently_played){
			var track = this.user.recently_played.items[0].track;
			last_played = track.name + ' - ' + track.artists[0].name;
			href = track.external_urls.spotify;
		}

		return (
			<div className='spotifyUser'>
				<div className='spotifyHeader'>
					<img className='spotifyAvatar' src={this.user.avatar} alt={this.user.username} />
					<div className='spotifyUserContent' style={{display:'inline-block'}}>
						<div className='spotifyUsername'>{this.user.username}</div>
						<div className='spotifyLastPlayed'>
							Last Played: <a href={href}>{last_played}</a>
						</div>
					</div>
				</div>
				<div className='spotifyStatistics'>
						<TopArtists artists={this.top_artists} />
				</div>
			</div>
		)
	}
}

class UsersContainer extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			self: props.self,
			users: props.users,
			authenticated: props.authenticated
		};
	}

	componentDidMount() {

	}

	componentWillUnmount(){

	}

	update(users){
		this.setState({users: users});
	}

	render(){
		var listOfUsers = this.state.users.map((user) => 
			<div key={user.props.uuid}>{user}</div>
		);
		var authButton;
		if (this.state.authenticated === true){
			authButton = '';
		} else {
			authButton = <div className='authenticateButton'>
				<a href='http://50.24.61.224:8000/login' style={{ display: 'hidden'}}> Link Spotify Statistics</a>
			</div>
		}
		return (
		<div>
			{authButton}
			<div className='spotifySelfContainer'>{this.state.self}</div>
			<div className='spotifyUsersContainer' style={{ flexWrap: 'wrap'}}>{listOfUsers}</div>
		</div>
		);
	}
}

var mount = document.querySelector('#spotifyUsers');

var user_container = <UsersContainer self={GLOBAL_SELF} users={users} authenticated={(typeof GLOBAL_UUID !== 'undefined')}/>
ReactDOM.render(user_container, mount);




