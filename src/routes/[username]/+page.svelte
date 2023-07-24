<script>
	import Table from './Table.svelte';

	// https://kit.svelte.dev/docs/modules#$app-stores
	// https://www.okupter.com/blog/sveltekit-query-parameters
	// import { page } from '$app/stores';

	export let data;
	const { username, scores, scores_obj, userurl } = data;
</script>

<section>
	{#if scores == 'nothing'}
		<p />
	{:else if scores.message}
		<p class="error">
			User {scores.username} not found or does not follow any elite accounts.
		</p>
	{:else}
		<Table
			following={scores_obj.following}
			username={scores_obj.username}
			follow_n={scores_obj.follow_n}
		/>
	{/if}
</section>

<style>
	section {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
		flex: 0.6;
	}
</style>
