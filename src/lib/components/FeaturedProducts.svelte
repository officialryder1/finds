<script lang="ts">
    import ProductCard from "./ProductCard.svelte";
    import { Product } from "$lib/db";
    import { Store, TrendingUp, Users } from '@lucide/svelte';
    import Button from "./ui/button/button.svelte";

    let loading = false;
 
    console.log('Featured Products Component - Initial Products:', Product);


    
</script>

<!-- Featured Products -->
  <section class="py-16 bg-muted/30">
    <div class="container mx-auto px-4">
      <div class="text-center mb-12">
        <h2 class="text-3xl font-bold mb-4">Featured Products</h2>
        <p class="text-muted-foreground text-lg">Handpicked items from our vendors</p>
      </div>

      {#if loading}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {#each Array(8) as _}
            <div class="animate-pulse">
              <div class="bg-muted rounded-lg h-80 mb-4"></div>
              <div class="h-4 bg-muted rounded w-3/4 mb-2"></div>
              <div class="h-4 bg-muted rounded w-1/2"></div>
            </div>
          {/each}
        </div>
      {:else if Product.length === 0}
        <div class="text-center py-12">
          <Store class="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 class="text-xl font-semibold mb-2">No Products Yet</h3>
          <p class="text-muted-foreground mb-6">Be the first to add your products!</p>
          <Button href="/become-a-vendor">
            Become a Vendor
          </Button>
        </div>
      {:else}
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {#each Product as product}
            <ProductCard {...product} />
          {/each}
        </div>
        
        <div class="text-center mt-12">
          <Button href="/products" size="lg" variant="outline">
            View All Products
          </Button>
        </div>
      {/if}
    </div>
  </section>