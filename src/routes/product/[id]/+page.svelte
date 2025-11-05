<script lang="ts">
  import { onMount } from 'svelte';
  import { page } from '$app/stores';
  import { supabase } from '$lib/supabaseClient';
  import { getImageUrl } from '$lib/getImageUrl';
  import { ShoppingCart, Heart, Share2, ArrowLeft, Star, Truck, Shield, RotateCcw } from '@lucide/svelte';
  import Button from '$lib/components/ui/button/button.svelte';
  import ProductCard from '$lib/components/ProductCard.svelte';
  import { generateProductSchema, generateBreadcrumbSchema } from '$lib/seo.js';

  let product = $state<any>(null);
  let relatedProducts = $state<any[]>([]);
  let categories = $state<any[]>([]);
  let loading = $state(true);
  let error = $state('');
  let selectedImageIndex = $state(0);
  let quantity = $state(1);
  let productSchema = $state([])
  let breadcrumbSchema = $state([])
  let seo = $state([])

  const whatsappNumber = "2349033147769";
  const companyName = "FindsNg";

  onMount(async () => {
    await Promise.all([fetchProduct(), fetchCategories()]);
  });

  async function fetchProduct() {
    try {
      const productId = $page.params.id;
      
      const { data, error: fetchError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (fetchError) {
        error = 'Product not found';
        return;
      }

      product = data;
      
      // Fetch related products from the same category
      if (product.category_id) {
        await fetchRelatedProducts(product.category_id, product.id);
      }
    } catch (err) {
      console.error('Error fetching product:', err);
      error = 'Failed to load product';
    } finally {
      loading = false;
    }
  }

  async function fetchRelatedProducts(categoryId: string, excludeProductId: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category_id', categoryId)
      .eq('is_active', true)
      .neq('id', excludeProductId)
      .limit(4)
      .order('created_at', { ascending: false });

    if (!error) {
      relatedProducts = data;
    }
  }

  async function fetchCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true);

    if (!error) {
      categories = data;
    }
  }

  function getCategoryName(categoryId: string) {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.name : 'Uncategorized';
  }

  function getCategoryColor(categoryId: string) {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.color : '#6b7280';
  }

  function openWhatsappOrder() {
    if (!product) return;

    const message = `Hello ${companyName}, I would like to order:\n\nProduct: ${product.title}\nPrice: ₦${product.price?.toLocaleString()}\nQuantity: ${quantity}\n\nPlease let me know about availability and delivery.`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    window.open(whatsappURL, "_blank");
  }

  function shareProduct() {
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: product.description,
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('Product link copied to clipboard!');
    }
  }

  function incrementQuantity() {
    if (product && quantity < product.stock_quantity) {
      quantity++;
    }
  }

  function decrementQuantity() {
    if (quantity > 1) {
      quantity--;
    }
  }

  function formatProductForCard(product: any) {
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
      is_new: new Date(product.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    };
  }

  // Generate image array (you can extend this if you have multiple images)
  let productImages = $state([])
  $effect(() => {
    if (product) {
      productImages = product.image_path ? [getImageUrl(product.image_path)] : [];
    }
  });
  $effect(() => {
    productSchema = product ? generateProductSchema(product, categories) : null;
  })
  $effect(() => {
    breadcrumbSchema = generateBreadcrumbSchema($page.url.pathname, [
      { name: 'Home', item: '/' },
      { name: 'Products', item: '/products' },
      { name: product?.title || 'Product', item: `/products/${product?.id}` }
    ]);
  })
  $effect(() => {
    seo = product ? {
      title: `${product.title} - FindsNg | ₦${product.price?.toLocaleString()}`,
      description: product.description || `Buy ${product.title} - Premium Nigerian fashion from FindsNg. Price: ₦${product.price?.toLocaleString()}.`,
      image: getImageUrl(product.image_path),
      canonical: `https://findsng.vercel.app/product/${product.id}`
    } : {
      title: 'Product Not Found - FindsNg',
      description: 'Product not found. Browse our Nigerian fashion collection.'
    };
  })
</script>

<svelte:head>
  <title>{seo.title}</title>
  <meta name="description" content={seo.description} />
  
  <!-- Product Structured Data -->
  {#if productSchema}
    <script type="application/ld+json">
      {JSON.stringify(productSchema)}
    </script>
  {/if}
  
  <!-- Breadcrumb Structured Data -->
  <script type="application/ld+json">
    {JSON.stringify(breadcrumbSchema)}
  </script>
  
  <!-- Additional product meta tags -->
  <meta property="product:price:amount" content={product?.price} />
  <meta property="product:price:currency" content="NGN" />
  <meta property="product:availability" content={product?.stock_quantity > 0 ? 'in stock' : 'out of stock'} />
</svelte:head>

<div class="min-h-screen bg-background">
  <!-- Loading State -->
  {#if loading}
    <div class="container mx-auto px-4 py-8">
      <div class="animate-pulse">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <!-- Image skeleton -->
          <div class="space-y-4">
            <div class="bg-muted rounded-lg h-96"></div>
            <div class="grid grid-cols-4 gap-2">
              {#each Array(4) as _}
                <div class="bg-muted rounded h-20"></div>
              {/each}
            </div>
          </div>
          <!-- Content skeleton -->
          <div class="space-y-4">
            <div class="h-8 bg-muted rounded w-3/4"></div>
            <div class="h-6 bg-muted rounded w-1/2"></div>
            <div class="h-4 bg-muted rounded w-full"></div>
            <div class="h-4 bg-muted rounded w-2/3"></div>
            <div class="h-12 bg-muted rounded w-1/3"></div>
          </div>
        </div>
      </div>
    </div>
  {:else if error}
    <!-- Error State -->
    <div class="container mx-auto px-4 py-16 text-center">
      <div class="max-w-md mx-auto">
        <div class="w-24 h-24 bg-muted rounded-full mx-auto mb-4 flex items-center justify-center">
          <svg class="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"/>
          </svg>
        </div>
        <h1 class="text-2xl font-bold mb-2">Product Not Found</h1>
        <p class="text-muted-foreground mb-6">{error}</p>
        <Button href="/products" class="gap-2">
          <ArrowLeft class="w-4 h-4" />
          Back to Products
        </Button>
      </div>
    </div>
  {:else if product}
    <div class="container mx-auto px-4 py-8">
      <!-- Breadcrumb -->
      <nav class="flex items-center space-x-2 text-sm text-muted-foreground mb-8">
        <a href="/" class="hover:text-foreground transition-colors">Home</a>
        <span>/</span>
        <a href="/product" class="hover:text-foreground transition-colors">Products</a>
        <span>/</span>
        <span class="text-foreground font-medium">{product.title}</span>
      </nav>

      <!-- Product Details -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        <!-- Product Images -->
        <div class="space-y-4">
          <!-- Main Image -->
          <div class="bg-white rounded-lg border overflow-hidden relative group">
            <img
              src={productImages[selectedImageIndex]}
              alt={product.title}
              class="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-110"
            />
          </div>
          
          <!-- Thumbnail Gallery -->
          {#if productImages.length > 1}
            <div class="grid grid-cols-4 gap-2">
              {#each productImages as image, index}
                <button
                  onclick={() => selectedImageIndex = index}
                  class={`border-2 rounded-lg overflow-hidden transition-all ${
                    selectedImageIndex === index ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.title} view ${index + 1}`}
                    class="w-full h-20 object-cover"
                  />
                </button>
              {/each}
            </div>
          {/if}
        </div>

        <!-- Product Info -->
        <div class="space-y-6">
          <!-- Category & Status -->
          <div class="flex items-center gap-3">
            <span 
              class="px-3 py-1 rounded-full text-xs font-semibold text-white"
              style="background-color: {getCategoryColor(product.category_id)}"
            >
              {getCategoryName(product.category_id)}
            </span>
            {#if new Date(product.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)}
              <span class="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                NEW
              </span>
            {/if}
          </div>

          <!-- Title -->
          <h1 class="text-3xl lg:text-4xl font-bold text-foreground">{product.title}</h1>

          <!-- Price -->
          <div class="flex items-center gap-4">
            <p class="text-3xl font-bold text-primary">₦{product.price?.toLocaleString()}</p>
            {#if product.stock_quantity === 0}
              <span class="bg-red-500 text-white text-sm font-semibold px-3 py-1 rounded">
                Out of Stock
              </span>
            {:else if product.stock_quantity < 10}
              <span class="bg-orange-500 text-white text-sm font-semibold px-3 py-1 rounded">
                Only {product.stock_quantity} left
              </span>
            {:else}
              <span class="bg-green-500 text-white text-sm font-semibold px-3 py-1 rounded">
                In Stock
              </span>
            {/if}
          </div>

          <!-- Description -->
          {#if product.description}
            <div class="prose max-w-none">
              <p class="text-muted-foreground leading-relaxed">{product.description}</p>
            </div>
          {/if}

          <!-- Quantity Selector -->
          {#if product.stock_quantity > 0}
            <div class="flex items-center gap-4">
              <span class="font-semibold">Quantity:</span>
              <div class="flex items-center border rounded-lg">
                <button
                  onclick={decrementQuantity}
                  class="px-4 py-2 hover:bg-muted transition-colors disabled:opacity-50"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span class="px-4 py-2 font-semibold min-w-12 text-center">{quantity}</span>
                <button
                  onclick={incrementQuantity}
                  class="px-4 py-2 hover:bg-muted transition-colors disabled:opacity-50"
                  disabled={quantity >= product.stock_quantity}
                >
                  +
                </button>
              </div>
              <span class="text-sm text-muted-foreground">
                {product.stock_quantity} available
              </span>
            </div>
          {/if}

          <!-- Action Buttons -->
          <div class="flex flex-col sm:flex-row gap-4">
            <Button
              class="flex-1 gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3"
              onclick={openWhatsappOrder}
              disabled={product.stock_quantity === 0}
            >
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893-.001-3.189-1.26-6.189-3.548-8.452"/>
              </svg>
              {#if product.stock_quantity === 0}
                Out of Stock
              {:else}
                Order on WhatsApp
              {/if}
            </Button>
            
            <Button
              variant="outline"
              class="gap-2"
              onclick={shareProduct}
            >
              <Share2 class="w-4 h-4" />
              Share
            </Button>
          </div>

          <!-- Features -->
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t">
            <div class="flex items-center gap-3">
              <Truck class="w-5 h-5 text-primary" />
              <div>
                <p class="font-semibold text-sm">Free Shipping</p>
                <p class="text-xs text-muted-foreground">Across Nigeria</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <Shield class="w-5 h-5 text-primary" />
              <div>
                <p class="font-semibold text-sm">Secure Payment</p>
                <p class="text-xs text-muted-foreground">100% Protected</p>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <RotateCcw class="w-5 h-5 text-primary" />
              <div>
                <p class="font-semibold text-sm">Easy Returns</p>
                <p class="text-xs text-muted-foreground">7 Days Policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Related Products -->
      {#if relatedProducts.length > 0}
        <section class="border-t pt-16">
          <h2 class="text-2xl font-bold mb-8">Related Products</h2>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {#each relatedProducts as relatedProduct}
              <ProductCard {...formatProductForCard(relatedProduct)} />
            {/each}
          </div>
        </section>
      {/if}
    </div>
  {/if}
</div>

<style>
  .container {
    max-width: 1200px;
  }
  
  .prose {
    color: inherit;
  }
  
  .prose p {
    margin: 0;
  }
</style>