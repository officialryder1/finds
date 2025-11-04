<script>
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabaseClient';
  import { getImageUrl } from '$lib/getImageUrl';
  import Footer from '$lib/components/Footer.svelte';
  import ProductCard from '$lib/components/ProductCard.svelte';
  import Button from '$lib/components/ui/button/button.svelte';
  import { page } from '$app/stores';
  import { pushState } from '$app/navigation';
  import { goto } from '$app/navigation';
  
  // State management
  let selectedCategory = $state("all");
  let products = $state([]);
  let categories = $state([]);
  let loading = $state(true);
  let filteredProducts = $state([]);

  // Fetch products and categories from Supabase
  onMount(async () => {
    await fetchCategories();
    await checkUrlParams();
    await fetchProducts();
  });

  async function checkUrlParams() {
    const categorySlug = $page.url.searchParams.get('category');
    
    if (categorySlug) {
      const category = categories.find(c => c.slug === categorySlug);
      if (category) {
        selectedCategory = category.id;
      }
    }
  }

  async function fetchProducts() {
    loading = true;
    let query = supabase
      .from('products')
      .select('*')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (selectedCategory !== 'all') {
      query = query.eq('category_id', selectedCategory);
    }

    const { data, error } = await query;

    if (!error) {
      products = data;
      updateFilteredProducts();
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
    
    // Build the new URL
    let newUrl = '/product';
    if (categoryId !== 'all') {
      const category = categories.find(c => c.id === categoryId);
      if (category) {
        newUrl += `?category=${category.slug}`;
      }
    }
    
    // Use SvelteKit's navigation
    goto(newUrl, { replaceState: true, keepFocus: true });
  }
  
  function updateFilteredProducts() {
    if (selectedCategory === "all") {
      filteredProducts = products;
    } else {
      filteredProducts = products.filter(product => product.category_id === selectedCategory);
    }
  }

  // Helper function to get category name
  function getCategoryName(categoryId) {
    if (categoryId === 'all') return 'All Products';
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Uncategorized';
  }

  // Helper function to get category color
  function getCategoryColor(categoryId) {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.color : '#6b7280';
  }

  // Format product data for ProductCard component
  function formatProductForCard(product) {
    const category = categories.find(c => c.id === product.category_id);
    return {
      id: product.id,
      image: product.image_path,
      title: product.title,
      price: `₦${product.price?.toLocaleString()}`,
      category: getCategoryName(product.category_id),
      categoryColor: getCategoryColor(product.category_id),
      description: product.description,
      stock_quantity: product.stock_quantity
    };
  }
  function getCategoryDescription(categoryId) {
    if (categoryId === 'all') return null;
    const category = categories.find(c => c.id === categoryId);
    return category?.description || null;
  }

  // Watch for url changes
  $effect(() => {
    const categorySlug = $page.url.searchParams.get('category');
    if (categorySlug) {
      const category = categories.find(c => c.slug === categorySlug);
      if (category && selectedCategory !== category.id) {
        selectedCategory = category.id;
        fetchProducts();
      }
    } else if (selectedCategory !== 'all') {
      selectedCategory = 'all';
      fetchProducts();
    }
    
  });
 
</script>

<div class="min-h-screen">
  <main>
    <section class="py-12 bg-gradient-to-b from-primary/5 to-background">
      <div class="container mx-auto px-4">
        <div class="text-center mb-12">
          <h1 class="font-display text-4xl md:text-6xl font-bold mb-4">
            Our Collection
          </h1>
          <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover authentic Nigerian native wear, handcrafted with excellence
          </p>
        </div>

        <!-- Category Filters -->
        <div class="flex flex-wrap gap-3 justify-center mb-12">
          <Button
            variant={selectedCategory === "all" ? "default" : "outline"}
            onclick={() => handleCategoryChange("all")} 
          >
            All Products
          </Button>
          {#each categories as category}
            <Button
              variant={selectedCategory === category.id ? "default" : "outline"}
              onclick={() => handleCategoryChange(category.id)}
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

        <!-- Current Category Header -->
        {#if selectedCategory !== 'all'}
          <div class="text-center mb-8">
            <h2 class="text-2xl md:text-3xl font-bold">
              {getCategoryName(selectedCategory)}
            </h2>
            {#if getCategoryDescription(selectedCategory)}
              <p class="text-muted-foreground mt-2 max-w-2xl mx-auto">
                {getCategoryDescription(selectedCategory)}
              </p>
            {/if}
          </div>
        {/if}
        <!-- Loading State -->
        {#if loading}
          <div class="flex justify-center items-center py-12">
            <div class="animate-pulse text-center">
              <div class="w-12 h-12 bg-muted rounded-full mx-auto mb-4"></div>
              <p class="text-muted-foreground">Loading products...</p>
            </div>
          </div>
        {:else if filteredProducts.length === 0}
          <!-- Empty State -->
          <div class="text-center py-12">
            <div class="w-24 h-24 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg class="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold mb-2">No products found</h3>
            <p class="text-muted-foreground mb-4">
              {#if selectedCategory !== "all"}
                No products available in {getCategoryName(selectedCategory)} yet.
              {:else}
                No products available at the moment.
              {/if}
            </p>
            {#if selectedCategory !== "all"}
              <Button onclick={() => handleCategoryChange('all')} variant="outline">
                View All Products
              </Button>
            {/if}
          </div>
        {:else}
          <!-- Products Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {#each filteredProducts as product (product.id)}
              <ProductCard {...formatProductForCard(product)} />
            {/each}
          </div>

          <!-- Results Count -->
          <div class="text-center mt-8 text-muted-foreground">
            Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? 's' : ''}
            {#if selectedCategory !== "all"}
              in {getCategoryName(selectedCategory)} 
            {/if}
          </div>
        {/if}
      </div>
    </section>
  </main>
  
  <Footer />
</div>

<style>
  .container {
    max-width: 1200px;
  }
</style>