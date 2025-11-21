<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { ModeWatcher } from 'mode-watcher';
	import Navbar from '$lib/components/Navbar.svelte';
	import Footer from '$lib/components/Footer.svelte';


	let { children, data } = $props();


</script>

<svelte:head>	
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