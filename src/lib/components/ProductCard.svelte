<script lang="ts">
    import { ShoppingCart, X } from "@lucide/svelte";
    import Button from "./ui/button/button.svelte";
    import Card from "./ui/card/card.svelte";
    import CardContent from "./ui/card/card-content.svelte";
    import { getImageUrl } from "$lib/getImageUrl";

    interface ProductCardProps {
        image: string;
        title: string;
        price: string;
        category: string;
        description: string;
        stock_quantity: number;
        is_new?: boolean;
        id: number;
    }
    const { image, title, price, category, description, stock_quantity, is_new=false, id }: ProductCardProps = $props();

    let showModel = $state(false)
    const whatsappNumber = "2349033147769"
    const companyName = "FindsNg"

    function openWhatsappOrder() {
      // Message to be sent
      const message = `Hello ${companyName}, I would like to order:\n\nProduct: ${title}\nPrice: ${price}\n\nPlease let me know about availability and delivery `

      // Encode and open WhatsApp URL
      const encodedMessage = encodeURIComponent(message)
      const whatsappURL = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`

      window.open(whatsappURL, "_blank")
      showModel = false // Close the modal after opening WhatsApp
    }

    function closeModal() {
      showModel = false
    }

    function handleBackdropClick(event: MouseEvent) {
      if (event.target === event.currentTarget) {
        closeModal()
      }
    }
</script>

<a href="/product/{id}" class="block">
<Card class="group overflow-hidden border-border hover:shadow-xl transition-all duration-300 hover:scale-105">
    
      <div class="relative overflow-hidden">
        <img
          src={getImageUrl(image)}
          alt={title}
          class="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-110"
        />
        
        <!-- Category Badge -->
        <span class="absolute top-4 left-4 bg-primary text-white font-semibold text-xs px-3 py-1 rounded-full shadow-lg">
          {category}
        </span>
        
        <!-- New Badge -->
        {#if is_new}
          <span class="absolute top-4 right-4 bg-green-500 text-white font-bold text-xs px-3 py-1 rounded-full shadow-lg animate-pulse">
            NEW
          </span>
        {/if}
        
        <!-- Stock Status Badge -->
        {#if stock_quantity === 0}
          <span class="absolute top-16 left-4 bg-red-500 text-white font-semibold text-xs px-2 py-1 rounded">
            Out of Stock
          </span>
        {:else if stock_quantity < 10}
          <span class="absolute top-4 right-4 bg-orange-500 text-white font-semibold text-xs px-2 py-1 rounded">
            Only {stock_quantity} left
          </span>
        {/if}

        <!-- Hover Overlay with Order Button -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
          <Button size="sm" class="gap-2 bg-white text-primary hover:bg-white/90 font-semibold" onclick={() => showModel = true}>
            <ShoppingCart class="h-4 w-4" />
            Order Now
          </Button>
        </div>
      </div>
      
      <CardContent class="p-4">
        <h3 class="font-display font-semibold text-lg mb-2 line-clamp-2">{title}</h3>
        {#if description}
          <p class="text-muted-foreground text-sm mb-3 line-clamp-2">{description}</p>
        {/if}
        <div class="flex items-center justify-between">
          <p class="text-primary font-bold text-xl">₦{price?.toLocaleString()}</p>
          {#if stock_quantity > 0}
            <span class="text-green-600 text-sm font-medium">In Stock</span>
          {/if}
        </div>
      </CardContent>
  </Card>
  </a>

  {#if showModel}
    <!-- Modal Backdrop -->
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div 
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-opacity duration-300"
        onclick={handleBackdropClick}
    >
        <!-- Modal Content -->
        <div class="bg-white rounded-lg shadow-xl max-w-md w-full transform transition-all duration-300 scale-95 animate-in fade-in-0 zoom-in-95">
            <!-- Modal Header -->
            <div class="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 class="text-lg font-semibold text-gray-900">Confirm Order</h3>
                <button 
                    onclick={closeModal}
                    class="text-gray-400 hover:text-gray-600 transition-colors rounded-full hover:bg-gray-100 p-1"
                >
                    <X class="h-5 w-5" />
                </button>
            </div>
            
            <!-- Modal Body -->
            <div class="p-6">
                <div class="flex items-center space-x-4 mb-4">
                    <img 
                        src={getImageUrl(image)} 
                        alt={title}
                        class="w-20 h-20 object-cover rounded-lg border"
                    />
                    <div class="flex-1">
                        <h4 class="font-semibold text-gray-900 text-lg">{title}</h4>
                        <p class="text-primary font-bold text-xl mt-1">{price}</p>
                        {#if is_new}
                          <span class="inline-block bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full mt-1">
                            New Arrival
                          </span>
                        {/if}
                    </div>
                </div>
                
                {#if description}
                  <p class="text-gray-600 mb-4 text-sm">{description}</p>
                {/if}
                
                <div class="space-y-3 mb-6">
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-500">Category:</span>
                    <span class="font-medium">{category}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-500">Availability:</span>
                    <span class:font-medium={true} class:text-red-500={stock_quantity === 0} class:text-green-600={stock_quantity > 0}>
                      {#if stock_quantity === 0}
                        Out of Stock
                      {:else if stock_quantity < 10}
                        Only {stock_quantity} left
                      {:else}
                        In Stock
                      {/if}
                    </span>
                  </div>
                </div>
                
                <div class="bg-green-50 border border-green-200 rounded-lg p-4">
                    <p class="text-green-800 text-sm">
                        <strong>Note:</strong> You'll be redirected to WhatsApp to send a pre-filled message to our team for order confirmation and delivery details.
                    </p>
                </div>
            </div>
            
            <!-- Modal Footer -->
            <div class="flex gap-3 p-6 border-t border-gray-200">
                <Button 
                    variant="outline" 
                    class="flex-1" 
                    onclick={closeModal}
                >
                    Cancel
                </Button>
                <Button 
                    class="flex-1 gap-2 bg-green-600 hover:bg-green-700 text-white font-semibold"
                    onclick={openWhatsappOrder}
                    disabled={stock_quantity === 0}
                >
                    <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893-.001-3.189-1.26-6.189-3.548-8.452"/>
                    </svg>
                    {#if stock_quantity === 0}
                      Out of Stock
                    {:else}
                      Order on WhatsApp
                    {/if}
                </Button>
            </div>
        </div>
    </div>
{/if}

<style>
    .line-clamp-2 {
        overflow: hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
    }
    
    .animate-in {
        animation-duration: 200ms;
        animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
    
    .fade-in-0 {
        animation-name: fadeIn;
    }
    
    .zoom-in-95 {
        animation-name: zoomIn;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes zoomIn {
        from { transform: scale(0.95); }
        to { transform: scale(1); }
    }
</style>