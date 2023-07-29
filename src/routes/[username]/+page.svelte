<script>
	import Table from './Table.svelte';
	import { onMount } from 'svelte';
	let referrer = '';

	onMount(() => {
		referrer = document.referrer;
		console.log('referrer:', referrer);
	});

	// https://kit.svelte.dev/docs/modules#$app-stores
	// https://www.okupter.com/blog/sveltekit-query-parameters
	// import { page } from '$app/stores';

	export let data;
	const { username, scores, scores_obj, userurl, n_follow, elites } = data;
	const following = elites.map((el) => el.username);
</script>

<section>
	<Table {username} {following} follow_n={n_follow} {scores} {elites} />
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
</style>
