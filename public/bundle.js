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

firebase.database().ref('users').on('value', function(user_list) {
	user_list.forEach(user_snapshot => {
		var user = user_snapshot.val();
		var uuid = user.uuid;
		var username = user.user_info.id;
		var avatar = user.user_info.images[0].url;
		var tmp_user = <SpotifyUser uuid={uuid} username={username} avatar={avatar}/>;
		users.push(tmp_user);
		user_container = <UsersContainer users={users}/>
		ReactDOM.render(user_container, mount);

	});
});

$(document).ready(() => {
	console.log('document.ready()');

	$(document).click(() => {
		console.log(user_container);
		mount = document.querySelector('#spotifyUsers');

		console.log(user_container);
		ReactDOM.render(user_container, mount);
	});
});



class SpotifyUser extends React.Component {
	constructor(props){
		super();
		this.user = {
			username: props.username,
			avatar: props.avatar
		}
		this.uuid = props.uuid;
		this.key = props.uuid;
		this.top_artists = ['a'];
	}

	render() {

		return (
			<div className='spotifyUser'>
				<div className='spotifyHeader'>
					<img className='spotifyAvatar' src={this.user.avatar} alt={this.user.username} />
					<div className='spotifyUsername'>{this.user.username}</div>
				</div>
				<div className='spotifyStatistics'>
					<div style={{overflow: 'auto'}} className='spotifyTopArtists'>
						Top Artists
					</div>
				</div>
			</div>
		)
	}
}
class UsersContainer extends React.Component {
	constructor(props){
		super(props);
		this.state = {users: props.users}
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
				<a href='http://50.24.61.224:8000/login'> Link Spotify Statistics</a>
			</div>
			<div className='spotifyUsersContainer' style={{ flexWrap: 'wrap'}}>{listOfUsers}</div>

		</div>
		);
	}
}

var mount = document.querySelector('#spotifyUsers');

var user_container = <UsersContainer users={users} />
ReactDOM.render(user_container, mount);




