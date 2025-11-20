<script>
    import { Instagram, Facebook, Twitter } from "@lucide/svelte";

    const date = new Date()

</script>
<footer class="bg-secondary text-secondary-foreground py-12">
      <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 class="font-display text-2xl font-bold mb-4 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              finds.ng
            </h3>
            <p class="text-secondary-foreground/80 text-sm">
              Premium Vintage Meets Elevated StreetWears 💗.
            </p>
          </div>

          <div>
            <h4 class="font-semibold mb-4">Shop</h4>
            <ul class="space-y-2 text-sm text-secondary-foreground/80">
              <li><a href="/arrivals" class="hover:text-primary transition-colors">New Arrivals</a></li>
              <li><a href="/product" class="hover:text-primary transition-colors">Collections</a></li>
              <li><a href="#" class="hover:text-primary transition-colors">Best Sellers</a></li>
              <li><a href="#" class="hover:text-primary transition-colors">Sale</a></li>
            </ul>
          </div>

          <div>
            <h4 class="font-semibold mb-4">About</h4>
            <ul class="space-y-2 text-sm text-secondary-foreground/80">
              <li><a href="#" class="hover:text-primary transition-colors">Our Story</a></li>
              <li><a href="#" class="hover:text-primary transition-colors">Contact Us</a></li>
              <li><a href="#" class="hover:text-primary transition-colors">FAQs</a></li>
              <li><a href="#" class="hover:text-primary transition-colors">Shipping</a></li>
            </ul>
          </div>

          <div>
            <h4 class="font-semibold mb-4">Follow Us</h4>
            <div class="flex gap-4">
              <a href="#" class="hover:text-primary transition-colors">
                <Instagram class="h-5 w-5" />
              </a>
              <a href="#" class="hover:text-primary transition-colors">
                <Facebook class="h-5 w-5" />
              </a>
              <a href="#" class="hover:text-primary transition-colors">
                <Twitter class="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div class="border-t border-secondary-foreground/20 pt-8 text-center text-sm text-secondary-foreground/60">
          <p>&copy; {date.getFullYear()} finds.ng. All rights reserved.</p>
        </div>
      </div>
</footer>