<script>
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabaseClient';
  import Card from "./ui/card/card.svelte";
  import CardContent from "./ui/card/card-content.svelte";
  
  let categories = $state([]);
  let loading = $state(true);

  onMount(async () => {
    await fetchCategories();
  });

  async function fetchCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('product_count', { ascending: false });

    if (!error) {
      categories = data;
    }
    loading = false;
  }

  // Helper function to generate slug for URLs
  function generateSlug(name) {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }

  // Helper function to get count text
  function getCountText(count) {
    return `${count} product${count !== 1 ? 's' : ''}`;
  }
</script>

<section class="py-20">
  <div class="container mx-auto px-4">
    <div class="text-center mb-12">
      <h2 class="font-display text-4xl md:text-5xl font-bold mb-4">
        Shop by Category
      </h2>
      <p class="text-lg text-muted-foreground">
        Explore our diverse collection.
      </p>
    </div>

    {#if loading}
      <!-- Loading State -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {#each Array(4) as _, i}
          <Card class="overflow-hidden border-border">
            <CardContent class="p-8">
              <div class="animate-pulse">
                <div class="h-6 bg-muted rounded w-3/4 mb-2"></div>
                <div class="h-4 bg-muted rounded w-1/2"></div>
              </div>
            </CardContent>
          </Card>
        {/each}
      </div>
    {:else if categories.length === 0}
      <!-- Empty State -->
      <div class="text-center py-12">
        <div class="w-24 h-24 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
          <svg class="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
          </svg>
        </div>
        <h3 class="text-xl font-semibold mb-2">No categories available</h3>
        <p class="text-muted-foreground">Check back soon for new categories!</p>
      </div>
    {:else}
      <!-- Categories Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {#each categories as category (category.id)}
          <Card class="group cursor-pointer overflow-hidden border-border hover:shadow-xl transition-all duration-300 hover:scale-105">
            <a href="/product?category={category.slug}">
              <CardContent class="p-8 relative h-full min-h-[140px] flex items-center">
                <!-- Background with category color -->
                <div 
                  class="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-300"
                  style="background-color: {category.color}"
                ></div>
                
                <!-- Content -->
                <div class="relative z-10 w-full">
                  <h3 class="font-display text-2xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">
                    {category.name}
                  </h3>
                  <p class="text-muted-foreground group-hover:text-foreground transition-colors">
                    {getCountText(category.product_count)}
                  </p>
                </div>

                <!-- Hover arrow indicator -->
                <div class="absolute right-4 top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg class="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                  </svg>
                </div>
              </CardContent>
            </a>
          </Card>
        {/each}
      </div>
    {/if}
  </div>
</section>

<style>
  .container {
    max-width: 1200px;
  }
</style>