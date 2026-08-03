<script lang="ts">
	import { onMount } from 'svelte';
	import { marked } from 'marked';
	import { pb, checkAuth, initOAuth } from '$lib/pb';

	type Item = { id: string; name: string; content: string; language: string };
	type Draft = Record<string, string>;

	let status: 'loading' | 'logged_out' | 'ready' = 'loading';
	let error: string | null = null;
	let items: Item[] = [];
	let drafts: Draft = {};
	let savingId: string | null = null;
	let saveStatus: Record<string, string> = {};

	onMount(async () => {
		if (checkAuth()) {
			await loadContents();
			status = 'ready';
		} else {
			status = 'logged_out';
		}
	});

	async function loadContents() {
		try {
			const results = await pb.collection('hakureishodo_contents').getFullList({
				requestKey: null
			});
			items = results.map((it) => ({
				id: it.id,
				name: it.name,
				content: it.content,
				language: it.language
			})) as Item[];
			items.forEach((it) => (drafts[it.id] = it.content));
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to load contents';
		}
	}

	async function saveItem(id: string) {
		try {
			savingId = id;
			await pb.collection('hakureishodo_contents').update(id, {
				content: drafts[id]
			});
			saveStatus[id] = 'Saved';
		} catch (e) {
			saveStatus[id] = e instanceof Error ? e.message : 'Save failed';
		} finally {
			savingId = null;
		}
	}
</script>

<svelte:head>
	<title>Admin - Hakurei Shodo</title>
</svelte:head>

<div class="admin-page">
	{#if status === 'loading'}
		<p>Loading...</p>
	{:else if status === 'logged_out'}
		<h1>Hakurei Shodo Admin</h1>
		<p>Sign in to manage site contents.</p>
		<button class="login-btn" on:click={initOAuth}>Sign in with Google</button>
	{:else}
		<div class="admin-toolbar">
			<h1>Site Contents</h1>
			<button
				on:click={() => {
					error = null;
					saveStatus = {};
					loadContents();
				}}>Refresh</button
			>
		</div>

		{#if error}
			<p class="error">{error}</p>
		{/if}

		{#each items as item}
			<div class="content-item">
				<div class="item-header">
					<span class="item-key">{item.language} · {item.name}</span>
					<div class="item-actions">
						{#if saveStatus[item.id]}
							<span class="save-status">{saveStatus[item.id]}</span>
						{/if}
						<button on:click={() => saveItem(item.id)} disabled={savingId === item.id}>
							{savingId === item.id ? 'Saving...' : 'Update'}
						</button>
					</div>
				</div>
				<div class="editor">
					<textarea bind:value={drafts[item.id]} spellcheck="true" rows="10"></textarea>
					<div class="preview">{@html marked.parse(drafts[item.id] ?? item.content)}</div>
				</div>
			</div>
		{/each}
	{/if}
</div>

<style>
	.admin-page {
		max-width: 1100px;
		margin: 0 auto;
		padding: 2rem;
		font-family:
			system-ui,
			-apple-system,
			sans-serif;
	}
	.login-btn {
		padding: 0.5rem 1rem;
		cursor: pointer;
	}
	.admin-toolbar {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1.5rem;
	}
	.error {
		color: #dc2626;
		margin-bottom: 1rem;
	}
	.content-item {
		border: 1px solid #ddd;
		border-radius: 6px;
		margin-bottom: 1.5rem;
		padding: 1rem;
	}
	.item-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 0.5rem;
	}
	.item-key {
		font-weight: 600;
	}
	.item-actions {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}
	.save-status {
		color: #15803d;
	}
	.editor {
		display: grid;
		grid-template-columns: 1fr 1fr;
		gap: 1rem;
	}
	.editor textarea {
		width: 100%;
		border: 1px solid #ccc;
		padding: 0.5rem 0.75rem;
		font-family: inherit;
		resize: vertical;
	}
	.preview {
		border: 1px solid #ddd;
		padding: 0.5rem 0.75rem;
		background: #fafafa;
		overflow-wrap: break-word;
	}
</style>
