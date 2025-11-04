<script>
    import { onMount } from 'svelte';
    import { supabase } from '$lib/supabaseClient';
    import { getImageUrl } from '$lib/getImageUrl';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
    import ProductCard from '$lib/components/ProductCard.svelte';
    import { Button } from '$lib/components/ui/button';


    let products = $state([]);
    let loading = $state(true);
    let categories = $state([]);
    let selectedCategory = $state('all');

    onMount(async () => {
        await Promise.all([fetchNewArrivals(), fetchCategories()]);
    })

    async function fetchNewArrivals(){
        loading = true;

        let query = supabase
            .from('products')
            .select('*')
            .eq('is_active', true)
            .order('created_at', { ascending: false })
            .limit(20);
        
        if (selectedCategory !== 'all') {
            query = query.eq('category_id', selectedCategory);
        }

        const { data, error } = await query;

        if (!error) {
            products = data;
        }
        loading = false;
    }
async function fetchCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true });

    if (!error) {
      categories = data;
    }
  }

  function handleCategoryChange(categoryId) {
    selectedCategory = categoryId;
    fetchNewArrivals();
  }

  function getCategoryName(categoryId) {
    if (categoryId === 'all') return 'All Categories';
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Uncategorized';
  }

  function formatProductForCard(product) {
    const category = categories.find(c => c.id === product.category_id);
    return {
      id: product.id,
      image: product.image_path,
      title: product.title,
      price: `₦${product.price?.toLocaleString()}`,
      category: category?.name || 'Uncategorized',
      categoryColor: category?.color || '#6b7280',
      description: product.description,
      stock_quantity: product.stock_quantity,
      is_new: true // Flag to show "New" badge
    };
  }

  // Get products added in the last 7 days
  function getRecentProducts() {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    return products.filter(product => {
      const productDate = new Date(product.created_at);
      return productDate > oneWeekAgo;
    });
  }

let recentProducts = $state([]);
$effect(()=>{
recentProducts = getRecentProducts();   
})
</script>

<div class="min-h-screen bg-background">
  <main>
    <section class="py-12 bg-gradient-to-b from-primary/10 to-background">
      <div class="container mx-auto px-4">
        <!-- Header -->
        <div class="text-center mb-12">
          <h1 class="font-display text-4xl md:text-6xl font-bold mb-4">
            New Arrivals
          </h1>
          <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover our latest fashion pieces fresh from the workshop
          </p>
          <div class="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <div class="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span>Fresh stock added regularly</span>
          </div>
        </div>

        <!-- Category Filters -->
        <Card class="mb-8">
          <CardHeader>
            <CardTitle>Filter by Category</CardTitle>
            <CardDescription>
              Browse new arrivals in specific categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="flex flex-wrap gap-2">
              <Button
                variant={selectedCategory === "all" ? "default" : "outline"}
                on:click={() => handleCategoryChange("all")}
                class="rounded-full"
              >
                All New Arrivals
              </Button>
              {#each categories as category}
                <Button
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  on:click={() => handleCategoryChange(category.id)}
                  class="rounded-full"
                  style={selectedCategory === category.id ? `background-color: ${category.color}; border-color: ${category.color}` : ''}
                >
                  {category.name}
                  {#if category.product_count > 0}
                    <span class="ml-2 px-2 py-1 text-xs bg-white/20 rounded-full">
                      {category.product_count}
                    </span>
                  {/if}
                </Button>
              {/each}
            </div>
          </CardContent>
        </Card>

        <!-- New This Week Section -->
        {#if recentProducts.length > 0}
          <Card class="mb-8 border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle class="flex items-center gap-2 text-green-800">
                <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                New This Week
              </CardTitle>
              <CardDescription class="text-green-700">
                Fresh additions from the past 7 days
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {#each recentProducts as product (product.id)}
                  <ProductCard {...formatProductForCard(product)} />
                {/each}
              </div>
            </CardContent>
          </Card>
        {/if}

        <!-- All New Arrivals -->
        <Card>
          <CardHeader>
            <CardTitle>All New Arrivals</CardTitle>
            <CardDescription>
              {products.length} new product{products.length !== 1 ? 's' : ''} added recently
            </CardDescription>
          </CardHeader>
          <CardContent>
            <!-- Loading State -->
            {#if loading}
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {#each Array(8) as _}
                  <div class="animate-pulse">
                    <div class="bg-muted rounded-lg h-64 mb-2"></div>
                    <div class="h-4 bg-muted rounded w-3/4 mb-2"></div>
                    <div class="h-4 bg-muted rounded w-1/2"></div>
                  </div>
                {/each}
              </div>
            {:else if products.length === 0}
              <!-- Empty State -->
              <div class="text-center py-12">
                <div class="w-24 h-24 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
                  <svg class="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
                  </svg>
                </div>
                <h3 class="text-xl font-semibold mb-2">No New Arrivals Yet</h3>
                <p class="text-muted-foreground mb-4">
                  {#if selectedCategory !== "all"}
                    No new products in {getCategoryName(selectedCategory)} yet.
                  {:else}
                    Check back soon for new fashion pieces!
                  {/if}
                </p>
                {#if selectedCategory !== "all"}
                  <Button on:click={() => handleCategoryChange('all')} variant="outline">
                    View All New Arrivals
                  </Button>
                {/if}
              </div>
            {:else}
              <!-- Products Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {#each products as product (product.id)}
                  <ProductCard {...formatProductForCard(product)} />
                {/each}
              </div>

              <!-- Results Info -->
              <div class="text-center mt-8 text-muted-foreground">
                <p>
                  Showing {products.length} new product{products.length !== 1 ? 's' : ''}
                  {#if selectedCategory !== "all"}
                    in {getCategoryName(selectedCategory)}
                  {/if}
                </p>
                {#if recentProducts.length > 0}
                  <p class="text-sm mt-1">
                    <span class="text-green-600 font-medium">{recentProducts.length}</span> added this week
                  </p>
                {/if}
              </div>
            {/if}
          </CardContent>
        </Card>

        <!-- Call to Action -->
        <div class="text-center mt-12">
          <Card class="max-w-2xl mx-auto">
            <CardContent class="pt-6">
              <h3 class="text-xl font-semibold mb-2">Never Miss New Arrivals</h3>
              <p class="text-muted-foreground mb-4">
                Subscribe to get notified when we add new fashion pieces
              </p>
              <Button size="lg" href="/#newsletter">
                Get Notified
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  </main>
</div>

<style>
  .container {
    max-width: 1200px;
  }
  
  .bg-gradient-to-b {
    background-image: linear-gradient(to bottom, var(--tw-gradient-stops));
  }
</style>