<script>
    import Categories from "$lib/components/Categories.svelte";
    import FeaturedProducts from "$lib/components/FeaturedProducts.svelte";
    import Hero from "$lib/components/Hero.svelte";
    import Canvas from "$lib/components/Canvas.svelte";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";
  
    let visible = $state(true)

    onMount(() => {
        setTimeout (() => {
            visible = false
        }, 3000)
    }
    )

</script>

<svelte:head>
  <title>finds.ng - Premium Nigerian Fashion & Traditional Wear</title>
  <meta name="description" content="Discover authentic Nigerian fashion including Ankara dresses, Aso-Oke outfits, and traditional wear. Handcrafted quality from Aba, Nigeria. Free shipping across Nigeria." />
  <meta property="og:title" content="finds.ng - Premium Nigerian Fashion & Traditional Wear" />
  <meta property="og:description" content="'Discover authentic Nigerian fashion including Ankara dresses, Aso-Oke outfits, and traditional wear. Handcrafted quality from Aba, Nigeria. Free shipping across Nigeria"/>
  <meta property="og:image" content="https://finds.ng.vercel.app/og-image.jpg" />
</svelte:head>

{#if visible}
    <Canvas />
{:else}
<div in:fade={{ duration: 500 }} out:fade={{ duration: 500 }}>
    <Hero />
    <FeaturedProducts />
    <Categories />
    
</div>
{/if}
