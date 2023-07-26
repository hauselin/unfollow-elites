<script>
	import { FalsityScores } from '$lib/falsity_scores.js';
	import { onMount } from 'svelte';

	// TODO: add link to politifact page for each user (maybe hyperlink dishonesty score)
	// https://www.politifact.com/personalities/alexandria-ocasio-cortez/

	export let following;
	export let follow_n;
	export let scores;
	let followButtonStatus = {}; // keep track of click status of each button

	if (!following) {
		following = [];
	}
	if (!follow_n) {
		follow_n = 0;
	}

	let status_value = '';
	let follow_n_value = 0;
	onMount(() => {
		if (scores == 'nothing') {
			console.log('cannot find user');
			status_value = 'cannot find user';
			follow_n_value = 0;
		}
		if (follow_n == 0 && scores != 'nothing') {
			console.log('not following any elites');
			status_value = 'found user';
			follow_n_value = 0;
		}
		if (follow_n > 0) {
			console.log('following elites');
			status_value = 'found user';
			follow_n_value = follow_n;
		}
		window.parent.postMessage({ message: 'status', value: status_value }, '*');
		window.parent.postMessage({ message: 'follow_n', value: follow_n_value }, '*');
		localStorage.setItem('status', status_value);
		localStorage.setItem('follow_n', follow_n_value);
	});

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

	const determineColor = (score) => {
		score = Number(score);
		// return `rgba(237, 29, 36, ${score})`;
		return `rgba(237, 29, 36, 1)`;
	};

	const determineWidthPercent = (score) => {
		score = Number(score);
		return Math.round(score * 100);
	};

	let data = [];
	following.forEach((val, i) => {
		data.push({
			i: i + 1,
			username: val.toLowerCase().trim(),
			Elite:
				"<a style='color:black' href='https://twitter.com/" +
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
			followButtonStatus[elite] = 'X';
		}
	};

	// sort values
	data = data.sort((a, b) => (a.FalsityScore > b.FalsityScore ? -1 : 1));
	// reset i values in data
	data.forEach((val, i) => {
		data[i].i = i + 1;
	});
	let elites = data;

	const scoreExplainText =
		'<p>Dishonesty scores range from <span style="color:#ed1d24; font-weight: bold;">100 (very dishonest)</span> to <span style="font-weight: bold;">0 (honest)</span>.</p>';
</script>

<section>
	{#if follow_n > 1}
		<p class="center-text">
			Below are {follow_n} accounts you follow. {@html scoreExplainText}
		</p>
	{:else}
		<p class="center-text">Below is an account you follow. {@html scoreExplainText}</p>
	{/if}

	<div class="center">
		<table>
			<tr style="background-color:#94adc4">
				<th>Account</th>
				<th>Dishonesty</th>
				<th>Action</th>
			</tr>
			{#each elites as elite}
				<tr class="following">
					<td>{@html elite.Elite}<br /></td>
					<td>
						<span id="score-display">{(Number(elite.FalsityScore) * 100).toFixed(0)}<br /></span>
						<div id="progress-bar">
							<div
								id="progress-bar-percentage"
								style="width: {determineWidthPercent(
									elite.FalsityScore
								)}%; background: {determineColor(elite.FalsityScore)};}"
							/>
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
		width: 80px;
	}
	.uButton:hover {
		color: red;
		background-color: rgba(244, 33, 46, 0.1);
		border-color: red;
	}
	#progress-bar {
		width: 100%;
		height: 8px;
		background: #ddd;
	}
	#progress-bar-percentage {
		height: 8px;
	}
	#score-display {
		display: flex;
		justify-content: center;
	}
</style>
