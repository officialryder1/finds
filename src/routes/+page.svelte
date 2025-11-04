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

{#if visible}
    <Canvas />
{:else}
<div in:fade={{ duration: 500 }} out:fade={{ duration: 500 }}>
    <Hero />
    <FeaturedProducts />
    <Categories />
    
</div>
{/if}
