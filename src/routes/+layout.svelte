<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { ModeWatcher } from 'mode-watcher';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { browser } from '$app/environment';
	import { generateWebsiteSchema } from '$lib/seo';


	let { children, data } = $props();

	let seo = $state([])
	let websiteSchema = $state([])

	$effect (() => {
		seo = {
			title: data?.seo?.title || 'finds.ng - Premium Nigerian Fashion & Traditional Wear',
			description: data?.seo?.description || 'Discover authentic Nigerian fashion, streetwear, and traditional wear. Handcrafted quality from Nigeria.',
			image: data?.seo?.image || 'https://finds.ng.vercel.app/og-image.jpg',
			url: browser ? window.location.href : 'https://finds.ng.vercel.app',
			canonical: 'https://finds.ng.vercel.app'
			}
		})

	$effect(() => {
		websiteSchema = generateWebsiteSchema();
	})
</script>

<svelte:head>
	
	
	<!-- Structured Data -->
	<script type="application/ld+json">
		{JSON.stringify(websiteSchema)}
	</script>
	
	<!-- Additional meta tags -->
	<meta name="geo.region" content="NG" />
	<meta name="geo.placename" content="Lagos" />
	<meta name="geo.position" content="6.524;3.379" />
	<meta name="ICBM" content="6.524, 3.379" />
</svelte:head>

<!-- <ModeWatcher/> -->
<Navbar />
{@render children?.()}
<Footer />