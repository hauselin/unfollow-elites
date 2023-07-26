<script>
	import Table from './Table.svelte';

	// https://kit.svelte.dev/docs/modules#$app-stores
	// https://www.okupter.com/blog/sveltekit-query-parameters
	// import { page } from '$app/stores';

	export let data;
	const { username, scores, scores_obj, userurl, n_follow } = data;
</script>

<section>
	<Table following={scores_obj.following} follow_n={scores_obj.follow_n} {scores} />
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
</style>
