import { MISINFO_API } from '$env/static/private';
import { FalsityScores } from '$lib/falsity_scores.js';

FalsityScores.forEach((obj, i) => {
	FalsityScores[i].elite_account = obj.elite_account.toLowerCase().trim();
	FalsityScores[i].pf_link = obj.pf_link.toLowerCase().trim().replace("http", "https");
});

const getFalsityScore = (elite_account) => {
	const obj = FalsityScores.filter((obj) => obj.elite_account === elite_account.toLowerCase().trim());
	let score = '';
	if (obj.length > 0) {
		score = Number(obj[0].falsity_score).toFixed(3);
	}
	return score;
};

const getPfLink = (elite_account) => {
	const obj = FalsityScores.filter((obj) => obj.elite_account === elite_account.toLowerCase());
	let value = '';
	if (obj.length > 0) {
		value = obj[0].pf_link;
		value = value.replace('http:', 'https:');
	}
	return value;
};

export async function load({ fetch, params }) {
	let username = params.username.trim().toLowerCase();
	let scores_obj = {};
	let userurl = 'https://twitter.com/';
	let userid = '';
	let elites = [];

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

		let data = [];
		let { following } = scores_obj;
		// console.log(following);
		if (scores_obj.follow_n > 0) {
			following.forEach((val, i) => {
				data.push({
					i: i + 1,
					username: val.toLowerCase().trim(),
					FalsityScore: getFalsityScore(val),
					pflink: getPfLink(val)
				});
			});
		}
		// sort values
		data = data.sort((a, b) => (a.FalsityScore > b.FalsityScore ? -1 : 1));
		// reset i values in data
		data.forEach((val, i) => {
			data[i].i = i + 1;
		});
		elites = data;
	} else {
		console.log('Fail to retrieve data');
	}
	return { username: username, scores: scores, scores_obj: scores_obj, userurl: userurl, n_follow: n_follow, elites: elites };
}



