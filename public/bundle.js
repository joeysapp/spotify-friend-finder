var users = [];

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
		var now_playing ='test';
		var tmp_user = <SpotifyUser uuid={uuid} username={username} avatar={avatar} artists={artists} now_playing={now_playing}/>;
		users.push(tmp_user);
		user_container = <UsersContainer users={users}/>
		ReactDOM.render(user_container, mount);

	});
});

$(document).ready(() => {
	console.log('document.ready()');
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
				<div className='spotifyArtistName'>{artist.name}</div>
				<div className='spotifyArtistGenres'>
					{artist.genres}
				</div>
			</div>
		);
		return (
			<div style={{overflow: 'auto'}} className='spotifyTopArtists'>
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
			now_playing: props.now_playing
		}
		this.uuid = props.uuid;
		this.key = props.uuid;
		this.top_artists = props.artists;
	}

	render() {


		var now_playing = '' || this.user.now_playing.item.name;

		return (
			<div className='spotifyUser'>
				<div className='spotifyHeader'>
					<img className='spotifyAvatar' src={this.user.avatar} alt={this.user.username} />
					<div className='spotifyUsername'>{this.user.username}</div>
					<div className='spotifyNowPlaying'>{now_playing}</div>
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
			users: props.users
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
		return (
		<div>
			<div className='authenticateButton'>
				<a href='http://50.24.61.224:8000/login' style={{ display: 'hidden'}}> Link Spotify Statistics</a>
			</div>
			<div className='spotifyUsersContainer' style={{ flexWrap: 'wrap'}}>{listOfUsers}</div>

		</div>
		);
	}
}

var mount = document.querySelector('#spotifyUsers');

var user_container = <UsersContainer users={users} />
ReactDOM.render(user_container, mount);




