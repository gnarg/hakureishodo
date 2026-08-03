<script lang="ts">
	import { onMount, tick } from 'svelte';
	import 'quill/dist/quill.snow.css';
	import type Quill from 'quill';
	import { pb, checkAuth, initOAuth } from '$lib/pb';

	type Item = { id: string; name: string; content: string; language: string };
	type Group = { name: string; items: Item[] };

	let status: 'loading' | 'logged_out' | 'ready' = 'loading';
	let error: string | null = null;
	let items: Item[] = [];
	let groups: Group[] = [];
	let selected: Item | null = null;
	let quillEl: HTMLDivElement | undefined;
	let quill: Quill | undefined;
	let dirty = false;
	let saving = false;
	let saveStatus: string | null = null;

	const LANG_LABEL: Record<string, string> = { en: 'English', ja: '日本語' };

	function groupItems(list: Item[]): Group[] {
		const byName = new Map<string, Item[]>();
		for (const it of list) {
			const arr = byName.get(it.name) ?? [];
			arr.push(it);
			byName.set(it.name, arr);
		}
		return [...byName.entries()]
			.sort(([a], [b]) => a.localeCompare(b))
			.map(([name, arr]) => ({
				name,
				items: arr.sort((a, b) => (a.language < b.language ? -1 : 1))
			}));
	}

	onMount(async () => {
		if (checkAuth()) {
			await loadContents();
			status = 'ready';
			await tick();
			if (quillEl) {
				const { default: QuillClass } = await import('quill');
				quill = new QuillClass(quillEl, {
					theme: 'snow',
					modules: {
						toolbar: [
							[{ header: [1, 2, 3, false] }],
							['bold', 'italic', 'underline', 'strike'],
							[{ list: 'ordered' }, { list: 'bullet' }],
							[{ align: [] }],
							[{ color: [] }, { background: [] }],
							['blockquote', 'code-block'],
							['clean']
						]
					}
				});
				quill.on('text-change', () => {
					dirty = true;
				});
				if (groups.length > 0) {
					openItem(groups[0].items[0]);
				}
			}
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
			groups = groupItems(items);
		} catch (e) {
			error = e instanceof Error ? e.message : 'Failed to load contents';
		}
	}

	function openItem(item: Item) {
		selected = item;
		saveStatus = null;
		dirty = false;
		if (quill) {
			quill.clipboard.dangerouslyPasteHTML(item.content, 'silent');
		}
	}

	async function refresh() {
		const prevId = selected?.id;
		error = null;
		saveStatus = null;
		await loadContents();
		selected = groups.flatMap((g) => g.items).find((it) => it.id === prevId) ?? null;
		dirty = false;
		if (selected && quill) {
			quill.clipboard.dangerouslyPasteHTML(selected.content, 'silent');
		}
	}

	async function save() {
		if (!selected || !quill) return;
		try {
			saving = true;
			await pb.collection('hakureishodo_contents').update(selected.id, {
				content: quill.root.innerHTML
			});
			saveStatus = 'Saved';
			dirty = false;
		} catch (e) {
			saveStatus = e instanceof Error ? e.message : 'Save failed';
		} finally {
			saving = false;
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
			<button class="toolbar-btn" on:click={refresh} disabled={saving}>Refresh</button>
		</div>

		{#if error}
			<p class="error">{error}</p>
		{/if}

		<div class="admin-body">
			<nav class="sidebar">
				<h2 class="sidebar-title">Sections</h2>
				{#each groups as group}
					<div class="section-group">
						<h3 class="section-name">{group.name}</h3>
						<ul class="section-items">
							{#each group.items as item}
								<li>
									<button class:active={selected?.id === item.id} on:click={() => openItem(item)}
										>{LANG_LABEL[item.language] ?? item.language}</button
									>
								</li>
							{/each}
						</ul>
					</div>
				{/each}
			</nav>

			<main class="editor-pane">
				<div class="editor-header">
					<span class="editor-key"
						>{selected
							? `${selected.name} · ${LANG_LABEL[selected.language] ?? selected.language}`
							: 'Select a section'}</span
					>
					<div class="editor-actions">
						{#if saveStatus}
							<span class="save-status">{saveStatus}</span>
						{/if}
						<button class="save-btn" on:click={save} disabled={saving || !selected || !dirty}
							>{saving ? 'Saving...' : 'Save'}</button
						>
					</div>
				</div>
				<div class="quill-wrap" bind:this={quillEl}></div>
			</main>
		</div>
	{/if}
</div>

<style>
	.admin-page {
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
		padding: 1.25rem 1.5rem;
		border-bottom: 1px solid #ddd;
		background: #fff;
	}
	.toolbar-btn {
		padding: 0.4rem 0.9rem;
		cursor: pointer;
	}
	.error {
		color: #dc2626;
		padding: 1rem 1.5rem;
	}
	.admin-body {
		display: flex;
		min-height: calc(100vh - 70px);
	}
	.sidebar {
		width: 240px;
		flex: 0 0 240px;
		border-right: 1px solid #ddd;
		background: #f8f8f8;
		padding: 1rem;
		overflow-y: auto;
	}
	.sidebar-title {
		font-size: 0.75rem;
		text-transform: uppercase;
		letter-spacing: 0.05em;
		color: #666;
		margin: 0 0 0.75rem;
	}
	.section-group {
		margin-bottom: 1rem;
	}
	.section-name {
		font-size: 0.8rem;
		color: #333;
		margin: 0 0 0.25rem;
	}
	.section-items {
		list-style: none;
		margin: 0;
		padding: 0;
	}
	.section-items li {
		margin-bottom: 2px;
	}
	.section-items button {
		width: 100%;
		text-align: left;
		padding: 0.35rem 0.5rem;
		border: 1px solid transparent;
		border-radius: 4px;
		background: none;
		cursor: pointer;
		color: #444;
		font-size: 0.85rem;
	}
	.section-items button:hover {
		background: #eee;
	}
	.section-items button.active {
		background: #2563eb;
		color: #fff;
	}
	.editor-pane {
		flex: 1;
		padding: 1.5rem;
		background: #fff;
	}
	.editor-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 1rem;
	}
	.editor-key {
		font-weight: 600;
	}
	.editor-actions {
		display: flex;
		align-items: center;
		gap: 0.75rem;
	}
	.save-status {
		color: #15803d;
	}
	.save-btn {
		padding: 0.4rem 1rem;
		cursor: pointer;
		font-weight: 600;
	}
	.save-btn:disabled {
		cursor: not-allowed;
		opacity: 0.6;
	}
	.quill-wrap {
		border: 1px solid #ddd;
		border-radius: 6px;
	}
</style>
