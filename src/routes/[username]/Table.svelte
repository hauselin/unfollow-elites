<script>
	import { FalsityScores } from '$lib/falsity_scores.js';

	export let following;
	export let username;
	export let follow_n;
	let followButtonStatus = {}; // keep track of click status of each button

	FalsityScores.forEach((obj, i) => {
		FalsityScores[i].elite_account = obj.elite_account.toLowerCase().trim();
	});

	const getFalsityScore = (elite_account) => {
		const obj = FalsityScores.filter((obj) => obj.elite_account === elite_account.toLowerCase());
		let score = '';
		if (obj.length > 0) {
			score = Number(obj[0].falsity_score).toFixed(3);
		}
		return score;
	};

	const gradeFromScore = (score) => {
		if (score < 25) {
			return 'Often lie';
		}
		if (score < 50) {
			return 'Sometimes lie';
		}
		if (score < 75) {
			return 'Occasionally lie';
		}
		return 'Rarely lie';
	};

	let data = [];
	following.forEach((val, i) => {
		data.push({
			i: i + 1,
			username: val.toLowerCase().trim(),
			Elite:
				"<a href='https://twitter.com/" +
				val +
				"' target='_blank' class='profile-link'>" +
				'@' +
				val +
				'</a>',
			FalsityScore: getFalsityScore(val)
		});
		followButtonStatus[val.toLowerCase().trim()] = 'Unfollow';
	});
	// console.log(followButtonStatus);

	let elitesUnfollowed = '';
	const handleButtonClick = (elite) => {
		console.log('clicked', elite);
		elitesUnfollowed += 'https://twitter.com/' + elite + ';';
		window.parent.postMessage({ message: 'iFrameData', value: elitesUnfollowed }, '*');
		localStorage.setItem('unfollow', elitesUnfollowed); // store unfollowed account in local storage
		if (followButtonStatus[elite] == 'Unfollow') {
			followButtonStatus[elite] = 'Unfollowed!';
		}
	};

	// sort values
	data = data.sort((a, b) => (a.FalsityScore > b.FalsityScore ? -1 : 1));
	// reset i values in data
	data.forEach((val, i) => {
		data[i].i = i + 1;
	});
	let elites = data;
</script>

<section>
	{#if follow_n > 1}
		<p class="center-text">
			Below are {follow_n} accounts you follow.
		</p>
	{:else}
		<p class="center-text">Below is an account you follow.</p>{/if}

	<div class="center">
		<table>
			<tr style="background-color:#94adc4">
				<th>Account</th>
				<th>Evaluation</th>
				<th />
			</tr>

			{#each elites as elite}
				<tr class="following">
					<td>{@html elite.Elite}<br /></td>
					<td>
						{gradeFromScore(100 * (1 - elite.FalsityScore))}<br />
						<div id="progress-bar" class="all-rounded">
							<div
								id="progress-bar-percentage"
								class={'all-rounded ' + gradeFromScore(100 * (1 - elite.FalsityScore))}
								style={'width:' + (20 + 100 * (1 - elite.FalsityScore)) + '%'}
							>
								<span />
							</div>
						</div>
					</td>
					<td>
						<button class="uButton" on:click|once={() => handleButtonClick(elite.username)}
							>{followButtonStatus[elite.username]}</button
						>
					</td>
				</tr>
			{/each}
		</table>
		<br />
	</div>
</section>

<style>
	.center {
		margin-left: auto;
		margin-right: auto;
	}
	.center-text {
		text-align: center;
	}
	div {
		overflow-x: hidden;
	}
	table {
		border: 1px solid #94adc4;
		border-collapse: collapse;
		font-size: 13px;
		line-height: 1rem;
		margin: auto;
	}
	th {
		text-align: center;
		padding: 10px;
	}
	td {
		text-align: left;
		padding: 8px;
	}
	.following:nth-child(even) {
		background-color: #f2f2f2;
	}
	.uButton {
		color: #ffffff;
		background-color: #1da1f2;
		font-size: 13px;
		border: 1px solid #1da1f2;
		border-radius: 15px;
		padding: 5px 15px;
		cursor: pointer;
		width: 98px;
	}
	.uButton:hover {
		color: red;
		background-color: #ffffff;
		border-color: red;
	}
	.uftext {
		align-items: center;
		padding: 8px;
	}
	#progress-bar {
		width: 100%;
		height: 8px;
		background: #cccccc;
		position: relative;
		overflow: hidden;
	}

	#progress-bar-percentage.Frequently {
		background: #ff0000;
		padding: 5px 0px;
		color: #fff;
		text-align: center;
		height: 20px;
	}
	#progress-bar-percentage.Sometimes {
		background: #ff8000;
		padding: 5px 0px;
		color: #fff;
		text-align: center;
		height: 20px;
	}
	#progress-bar-percentage.Occasionally {
		background: #ffff00;
		padding: 5px 0px;
		color: #fff;
		text-align: center;
		height: 20px;
	}
	#progress-bar-percentage.Rarely {
		background: #00ff00;
		padding: 5px 0px;
		color: #fff;
		text-align: center;
		height: 20px;
	}

	#progress-bar-percentage span {
		display: inline-block;
		position: absolute;
		width: 100%;
		left: 0;
	}
</style>
