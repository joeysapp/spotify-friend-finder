var users = [];

var GLOBAL_UUID = null;
var GLOBAL_SELF = null;

var React = require('react');
var ReactDOM = require('react-dom');

var uuidv4 = require('uuid-v4');
var _ = require('lodash');

var firebase = require('firebase');
var config = {
	apiKey: "AIzaSyCpSdQt0tWey4qV9ynPIyeAMhMTyiJaTO8",
	authDomain: "joeysappgithub.firebaseapp.com",
	databaseURL: "https://joeysappgithub.firebaseio.com",
};
firebase.initializeApp(config);

// Animals!!
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
	if (getParameterByName('client_id') !== null){
		console.log('i see that');
		document.cookie = 'spotify_uuid_0='+getParameterByName('client_id');
		GLOBAL_UUID = getParameterByName('client_id');
		console.log('set cookie to'+document.cookie);
	} else {
		GLOBAL_UUID = getCookie('spotify_uuid_0');
	}
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
			<div key={artist.name} className='spotifyArtist'>
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
		this.user = {};
		this.user = {
			username: props.username,
			avatar: props.avatar,
			recently_played: props.recently_played
		}
		this.uuid = props.uuid;
		this.key = props.uuid;
		this.top_artists = props.artists;
		this.state = {
			collapsed: !this.props.isSelf,
			isSelf: this.props.isSelf,
			isAnon: this.props.isAnon,
			firebase: true
		}
		// This binding is necessary to make `this` work in the callback
		this.changeCollapse = this.changeCollapse.bind(this);
		this.changeAnon = this.changeAnon.bind(this);
	}

	changeCollapse(e){
		this.setState(prevState => ({
			collapsed: !prevState.collapsed,
		}));
	}

	changeAnon(e){
		var anonStatus;
		if (this.state.firebase){
			this.setState(prevState => ({
				isAnon: !prevState.isAnon,
				firebase: false
			}));
			anonStatus = !this.state.isAnon;
			// 10 second cooldown to write to firebase DB
			setTimeout(function(){
				var firebaseRef = firebase.database().ref('users/').child(this.props.uuid);
				firebaseRef.once('value', function(snapshot){
					var tmp = snapshot.val();
					if (tmp.anon_status === null){
						firebaseRef.push({	anon_status: anonStatus	});
					} else {
						firebaseRef.update({ anon_status: anonStatus	});
					}
				});
				this.setState({ firebase: true });
			}.bind(this), 1000);
		} else {
			e.preventDefault();
			e.stopPropagation();
			alert('You are on a cooldown');
		}
	}

	render() {
		var last_played;
		var href;

		if (typeof this.user.recently_played !== 'undefined' && 'items' in this.user.recently_played){
			var track = this.user.recently_played.items[0].track;
			last_played = track.name + ' - ' + track.artists[0].name;
			href = track.external_urls.spotify;
		}
		var col = this.props.color;
		var divStyle = {
			background: '#'+col
		};
		var animal_type_url = "public/icons/"+this.props.type+".png";
		var username = !this.state.isAnon ? (<div className='spotifyUsername'> {this.user.username}</div>
) : <div className='spotifyUsername'>Anonymous {this.props.type}</div>
		var avatar = !this.state.isAnon ? (<img className='spotifyAvatar' src={this.props.avatar} style={divStyle} alt={this.user.username} />) : (<img className='spotifyAvatar' src={animal_type_url} style={divStyle}/>);
		var selfOrStats = !this.state.isSelf ? (<button style={divStyle} className='spotifyStatsButton' onClick={this.changeCollapse}>Top Artists</button>) : (
										<div className='spotifyUserOptionsContainer'>
								<div className='spotifyUserOption'>
									Anonymous: <input name='toggleAnon' type='checkbox' checked={this.state.isAnon} onChange={this.changeAnon} />
								</div>
							</div>);
		var topArtists = !this.state.collapsed ? <TopArtists artists={this.top_artists} /> : '';
		return (
			<div className='spotifyUser'>
				<div className='spotifyHeader'>
					{avatar}
					<div className='spotifyUserContent' style={{display:'inline-block'}}>
						{username}
						<div className='spotifyLastPlayed'>
							Recently Played: <a href={href}>{last_played}</a>
						</div>
						{selfOrStats}
				</div>
				</div>
				<div className='spotifyStatistics'>
						{topArtists}
				</div>
			</div>
		)
	}
}

class UsersContainer extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			self: this.props.self,
			users: [],
			authenticated: this.props.authenticated,
			hasLoaded: false,
			sortingMethod: 'artists'
		};
		this.handleSort = this.handleSort.bind(this);
	}

	componentDidMount() {
		this.firebaseRef = firebase.database().ref('users');
		this.firebaseCallback = this.firebaseRef.on('value', (user_list) => {
			var tmp_users = [];
			user_list.forEach(user_snapshot => {
				var user = user_snapshot.val();
				var uuid = user.uuid;

				var anon_status = (typeof user.anon_status === 'undefined') ? true : user.anon_status;
				var username = user.user_info.display_name || user.user_info.id;
				// 'Anonymously link statistics!'
				var animal_type = intToAvailableAnimals(hashCode(uuid));
				var avatar = user.user_info.images ? user.user_info.images[0].url : 'public/avatars/empty.png';
				var color = intToRGB(hashCode(uuid));

				// Normal stuff. Toggle this via state perhaps? (button press!@!!!#12341234235)
				// var avatar = user.user_info.images ? user.user_info.images[0].url : 'public/avatars/empty.png';
				var artists = user.artists;
				var recently_played = user['recently-played'];
				// console.log('User with uuid logged on: ' + uuid);
				if (uuid !== GLOBAL_UUID){
					var tmp_user = <SpotifyUser isAnon={anon_status} isSelf={false} uuid={uuid} username={username} color={color} type={animal_type} avatar={avatar} artists={artists} recently_played={recently_played}/>;
					// Otherwise we add duplicates. find fix cause this 
					// disables the live nature of the app
					// if (this.state.users === []){
						tmp_users.push(tmp_user);
					// }
				} else {

					this.setState({
						authenticated: true,
						self: <SpotifyUser isAnon={anon_status}isSelf={true} uuid={uuid} username={username} color={color} type={animal_type} avatar={avatar} artists={artists} recently_played={recently_played}/>}
					);
					
				}

			});
			this.setState({ users: tmp_users });
			this.setState({ hasLoaded: true });
		});	
	}

	componentWillUnmount(){
		this.firebaseRef.off('value', this.firebaseCallback);
	}

	handleSort(e){
		var sa = [];
		this.state.self.props.artists.items.map(artist => {
			sa.push(artist.id);
		});
		var tmp2 = _.sortBy(this.state.users, [function(o) {
			var sim_count = 0;
			o.props.artists.items.map(artist => {
				if (sa.includes(artist.id)){
					sim_count++;
				}
			});
			console.log(sim_count);
			return -sim_count;
		}]);
		this.setState({
			sortingMethod: e.target.value,
			users: tmp2,
		});

	}

	render(){
		if (this.state.users != null){
			var listOfUsers = this.state.users.map((user) => 
				<div key={user.props.uuid}>{user}</div>
			);
		} else {
			var listOfUsers = [];
		}
		var tmp = <div className='spotifySelfContainer'>{this.state.self}</div>
		var authButton;
        if (this.state.authenticated === true){
			authButton = <div className='spotifyContainer' style={{ display: 'flex' }}>
							<div className='authenticateRefreshButton'>
								<a href='http://50.24.61.224:8000/login' style={{ display: 'hidden'}}> Refresh Spotify Statistics</a>
							</div>
							{tmp}
							<div className='spotifyCompareButtons'>
								<form>
									<label>
									Sort similar users by:
									<div className='select-container'>	
										<select value={this.state.sortingMethod} onChange={this.handleSort}>
											<option value='artists'>Artists1</option>
											<option value='artists'>Artists2</option>
										</select>
									</div>
									</label>
								</form>
							</div>
						</div>
		} else {
			authButton = <div className='authenticateButton'>
				<a href='http://50.24.61.224:8000/login' style={{ display: 'hidden'}}> Link Spotify Statistics</a>
			</div>
		}
			return (
			<div key={uuidv4()}>
				{authButton}
				<div className='spotifyUsersContainer' style={{ flexWrap: 'wrap'}}>{listOfUsers}</div>
			</div>
		);
	}
}

var mount = document.querySelector('#spotifyUsers');
var user_container = <UsersContainer self={null} authenticated={false}/>
ReactDOM.render(user_container, mount)