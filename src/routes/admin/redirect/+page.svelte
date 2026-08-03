<script lang="ts">
	import { onMount } from 'svelte';
	import { handleCallback } from '$lib/pb';

	let loading = true;
	let error: string | null = null;

	onMount(async () => {
		try {
			await handleCallback();
		} catch (e) {
			loading = false;
			error = e instanceof Error ? e.message : 'Failed to complete login';
		}
	});
</script>

<div class="admin-body">
	{#if loading}
		<p class="admin-message">Completing login...</p>
	{:else}
		<p class="admin-message admin-error">{error}</p>
		<a class="admin-link" href="/admin">Return to admin</a>
	{/if}
</div>

<style>
	.admin-body {
		font-family:
			system-ui,
			-apple-system,
			sans-serif;
		display: flex;
		flex-direction: column;
		align-items: center;
		min-height: 100vh;
		padding: 2rem;
		background-color: #f3f4f6;
	}
	.admin-message {
		margin-bottom: 1rem;
	}
	.admin-error {
		color: #dc2626;
	}
	.admin-link {
		color: #2563eb;
	}
</style>
