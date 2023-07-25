import { MISINFO_API } from '$env/static/private';

export async function load({ fetch, params }) {
	let username = params.username.trim().toLowerCase();
	let scores_obj = {};
	let userurl = 'https://twitter.com/';
	let userid = '';

	if (username == '') {
		return 'nothing';
	}
	if (username.slice(0, 1) == '@') {
		username = username.slice(1);
	}

	const resp = await fetch('https://mescalc.p.rapidapi.com/account/' + username, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/octet-stream',
			Accept: 'application/json',
			'x-rapidapi-host': 'mescalc.p.rapidapi.com',
			'x-rapidapi-key': MISINFO_API
		}
	});

	console.log('Waiting for response...');
	const response = await resp.json();
	let n_follow = 0;
	let scores = "nothing";
	if (response) {
		if (response.message) {
			// console.log("Error: " + response.message);
			scores_obj = {
				username: username,
				message: 'cannot find user'
			};
		} else {
			console.log('Success!');
			scores = "success";
			userid = response.twitter_user_id;
			userid = userid.toString();
			scores_obj = {
				username: username,
				userid: userid,
				misinfo: response.misinfo_exposure_score_weighted_numtweets,
				party: response.partisan_score,
				follow_n: response.num_following,
				following: response.following,
			};
			n_follow = response.num_following;
			userurl += username;
		}
		// console.log('response', response);
		// console.log('scores_obj', scores_obj);
	} else {
		console.log('Fail to retrieve data');
	}
	return { username: username, scores: scores, scores_obj: scores_obj, userurl: userurl, n_follow: n_follow };
}

