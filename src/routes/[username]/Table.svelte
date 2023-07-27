<script>
	import { FalsityScores } from '$lib/falsity_scores.js';
	import { onMount } from 'svelte';

	// TODO: add link to politifact page for each user (maybe hyperlink dishonesty score)
	// https://www.politifact.com/personalities/alexandria-ocasio-cortez/

	export let username;
	export let following;
	export let follow_n;
	export let scores;
	export let elites;
	let followButtonStatus = {}; // keep track of click status of each button

	if (!following) {
		following = [];
	}
	if (!follow_n) {
		follow_n = 0;
	}

	let status_value = '';
	let follow_n_value = 0;

	// send message to parent window on load
	onMount(() => {
		if (scores == 'nothing') {
			console.log(username, 'cannot find user');
			status_value = 'cannot find user';
			follow_n_value = 0;
		}
		if (follow_n == 0 && scores != 'nothing') {
			console.log(username, 'not following any elites');
			status_value = 'found user';
			follow_n_value = 0;
		}
		if (follow_n > 0) {
			console.log(username, 'following elites');
			status_value = 'found user';
			follow_n_value = follow_n;
		}
		window.parent.postMessage({ message: 'status', value: status_value }, '*');
		window.parent.postMessage({ message: 'follow_n', value: follow_n_value }, '*');
		localStorage.setItem('status', status_value);
		localStorage.setItem('follow_n', follow_n_value);
	});

	// determine color and width of progress bar (falsity score)
	const determineColor = (score) => {
		score = Number(score);
		return `rgba(237, 29, 36, 1)`;
	};

	const determineWidthPercent = (score) => {
		score = Number(score);
		return Math.round(score * 100);
	};

	// add link to twitter page for each user
	elites.forEach((val, i) => {
		elites[i]['Elite'] =
			"<a style='color:black' href='https://twitter.com/" +
			val.username +
			"' target='_blank' title='Twitter page' class='profile-link'>" +
			'@' +
			val.username +
			'</a>';
		followButtonStatus[val.username.toLowerCase().trim()] = 'Unfollow';
	});

	// keep track of which elites are unfollowed/clicked
	let elitesUnfollowed = '';
	const handleButtonClick = (elite) => {
		console.log('click-unfollow', elite);
		elitesUnfollowed += 'https://twitter.com/' + elite + ';';
		window.parent.postMessage({ message: 'unfollow', value: elitesUnfollowed }, '*');
		try {
			localStorage.setItem('unfollow', elitesUnfollowed); // store unfollowed account in local storage
		} catch (error) {
			console.error(error);
		}
		if (followButtonStatus[elite] == 'Unfollow') {
			followButtonStatus[elite] = 'X';
		}
	};

	const scoreExplainText =
		'<p>Dishonesty scores range from <span style="color:#ed1d24; font-weight: bold;">100 (very dishonest)</span> to <span style="font-weight: bold;">0 (honest)</span>.</p>' +
		'<p>Explore the scores and click the <strong>Unfollow</strong> button to unfollow an account.</p>' +
		'<p>You may have to scroll down to see more.</p>';
</script>

{#if status_value != 'cannot find user'}
	<section>
		{#if follow_n > 1}
			<p class="center-text">
				Below are <strong>{follow_n}</strong> Twitter/X accounts <strong>{username}</strong> follow. {@html scoreExplainText}
			</p>
		{:else}
			<p class="center-text">
				Below is a Twitter/X account <strong>{username}</strong> follow. {@html scoreExplainText}
			</p>
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
							<a
								id="score-display"
								href={elite.pflink}
								target="_blank"
								title="See PolitiFact Scorecard">{(Number(elite.FalsityScore) * 100).toFixed(0)}</a
							>
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
{:else}
	Unfortunately we cannot retrieve your user information.
{/if}

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
