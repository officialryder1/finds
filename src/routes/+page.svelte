<script>
    import Categories from "$lib/components/Categories.svelte";
    import FeaturedProducts from "$lib/components/FeaturedProducts.svelte";
    import Hero from "$lib/components/Hero.svelte";
    import Canvas from "$lib/components/Canvas.svelte";
    import { onMount } from "svelte";
    import { fade } from "svelte/transition";

    let { data } = $props()    
    let visible = $state(true)
    let seo = $state([])

    onMount(() => {
        setTimeout (() => {
            visible = false
        }, 3000)
    }
    )

    $effect(() => {
        seo = {
            title: 'finds.ng - Premium Nigerian Fashion & Traditional Wear',
            description: 'Discover authentic Nigerian fashion including Ankara dresses, Aso-Oke outfits, and traditional wear. Handcrafted quality from Aba, Nigeria. Free shipping across Nigeria.',
            image: 'https://finds.ng.vercel.app/og-image.jpg',
            canonical: 'https://finds.ng.vercel.app'
        };
    })

</script>

<svelte:head>
  <title>{seo.title}</title>
  <meta name="description" content={seo.description} />
  <meta property="og:title" content={seo.title} />
  <meta property="og:description" content={seo.description} />
  <meta property="og:image" content={seo.image} />
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
