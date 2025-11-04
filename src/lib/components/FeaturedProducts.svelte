<script lang="ts">
    import ProductCard from "./ProductCard.svelte";
    import { Product } from "$lib/db";

    console

</script>

 <section class="py-20 bg-muted/30">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h2 class="font-display text-4xl md:text-5xl font-bold mb-4">
            Featured Collection
          </h2>
          <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our handpicked selection of premium native wear, 
            crafted with excellence and cultural authenticity
          </p>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {#if Product}
            {#each Product as product, index}
                <ProductCard 
                    key={index}
                    image={product.image_path}
                    title={product.title}
                    price={product.price}
                    category={product.category}
                    stock_quantity={product.stock_quantity}
                    id={product.id}
                    
                />
            {/each}
          {:else}
            <p> No product yet </p>
          {/if}
        </div>
      </div>
    </section>