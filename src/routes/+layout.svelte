<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { SvelteQueryDevtools } from '@tanstack/svelte-query-devtools';
	import { ModeWatcher } from 'mode-watcher';
	import Footer from '$components/footer.svelte';
	import Header from '$components/header.svelte';

	let { children, data } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
</svelte:head>

<QueryClientProvider client={data.queryClient}>
	<ModeWatcher />
	<Header user={data.user} />
	{@render children?.()}
	<Footer />
	<SvelteQueryDevtools buttonPosition="bottom-left" />
</QueryClientProvider>
