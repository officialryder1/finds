<script>
    import { ShoppingBag, Search, Menu } from "@lucide/svelte";
    import Button from "./ui/button/button.svelte";
</script>
<nav class="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div class="container mx-auto px-4 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-8">
            <Button variant="ghost" size="icon" class="md:hidden">
              <Menu class="h-5 w-5" />
            </Button>
            
            <h1 class="font-display text-2xl md:text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              <a href="/">Made in 9ja</a>
            </h1>

            <div class="hidden md:flex items-center gap-6">
              <a href="/arrivals" class="text-sm font-medium hover:text-primary transition-colors">
                New Arrivals
              </a>
              <a href="/product" class="text-sm font-medium hover:text-primary transition-colors">
                Collections
              </a>
              <a href="/about" class="text-sm font-medium hover:text-primary transition-colors">
                About
              </a>
            </div>
          </div>

          <div class="flex items-center gap-4">
            <Button variant="ghost" size="icon">
              <Search class="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <ShoppingBag class="h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>