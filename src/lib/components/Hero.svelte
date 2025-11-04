<script>
    import Button from "./ui/button/button.svelte";
    import { ArrowRight } from "@lucide/svelte";
    import heroImage from "$lib/assets/hero-native-wear.jpg";
    import { tweened } from 'svelte/motion';
	  import { cubicOut } from "svelte/easing";
    import { onMount } from "svelte";
    import { supabase } from "$lib/supabaseClient";
    import NewsLetterModel from "$lib/components/NewsLetterModel.svelte";
    import { fade } from "svelte/transition"


    let date = new Date();

    let designsCount = tweened(0, { duration: 1000, easing: cubicOut});
    let customersCount = tweened(0, { duration: 1000, easing: cubicOut});
    let authenticCount = tweened(0, { duration: 1000, easing: cubicOut});
    let showNewsletterModal = $state(false)
    
    onMount(async () => {
      await Promise.all([
        designsCount.set(150),
        customersCount.set(20),
        authenticCount.set(100)
      ]);
    });
    onMount(() => {
        checkShowModal()
    })

    function checkShowModal() {
    // Don't show if already subscribed
    const hasSubscribed = localStorage.getItem('newsletterSubscribed');
    if (hasSubscribed) return;

    // Don't show if closed recently (30 days)
    const lastClosed = localStorage.getItem('newsletterClosed');
    if (lastClosed) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      if (new Date(lastClosed) > thirtyDaysAgo) {
        return;
      }
    }
    // Show modal after 3 seconds
    setTimeout(() => {
      showNewsletterModal = true;
    },3000);
  }

  function openNewsletterModal() {
    showNewsletterModal = true;
  }
</script>

<section class="relative min-h-[600px] md:min-h-[700px] flex items-center bg-gradient-to-b from-background to-muted/30">
      <div class="container mx-auto px-4 py-16">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <div class="space-y-6">
            <div class="inline-block">
              <span class="text-sm font-medium text-primary bg-primary/10 px-4 py-2 rounded-full">
                New Collection {date.getFullYear()}
              </span>
            </div>
            
            <h1 class="font-display text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
              Authentic
              <span class="block bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
                Nigerian
              </span>
              Products
            </h1>
            
            <p class="text-lg md:text-xl text-muted-foreground max-w-lg">
              Celebrate your heritage with premium Product. Crafted with pride in Nigeria, 
              where culture meets contemporary elegance.
            </p>

            <div class="flex flex-wrap gap-4">
              <Button size="lg" class="group text-white dark:text-black" onclick={() => window.location.href='/product'}>
                Shop Collection
                <ArrowRight class="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button size="lg" variant="outline">
                Our Story
              </Button>
            </div>

            <div class="flex gap-8 pt-4">
              <div>
                <div class="font-display text-3xl font-bold text-primary">{Math.round($designsCount)}+</div>
               
                <div class="text-sm text-muted-foreground">Designs</div>
              </div>
              <div>
                <div class="font-display text-3xl font-bold text-primary">{Math.round($customersCount)}K+</div>
                <div class="text-sm text-muted-foreground">Happy Customers</div>
              </div>
              <div>
                <div class="font-display text-3xl font-bold text-primary">{Math.round($authenticCount)}%</div>
                <div class="text-sm text-muted-foreground">Authentic</div>
              </div>
            </div>
          </div>
          
          <div class="relative">
            <div class="absolute -inset-4 bg-gradient-to-r from-primary/20 to-accent/20 rounded-3xl blur-2xl opacity-50"></div>
            <img
              src={heroImage}
              alt="Beautiful Nigerian Native Wear Collection"
              class="relative rounded-2xl shadow-2xl w-full h-auto object-cover"
            />
          </div>
        </div>
      </div>
    </section>
    <div in:fade={{ duration: 500 }} out:fade={{ duration: 500 }}>
        <NewsLetterModel bind:isOpen={showNewsletterModal} />
    </div>