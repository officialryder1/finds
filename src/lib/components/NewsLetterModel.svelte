<script>
    import { onMount } from "svelte";
    import { X } from '@lucide/svelte';
    import Button from "./ui/button/button.svelte";
    import Input from "./ui/input/input.svelte";
    import Label from "./ui/label/label.svelte";
    import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
    import { supabase } from "$lib/supabaseClient";

    let { isOpen = false} = $props();

    let email = $state("");
    let isLoading = $state(false);
    let isSuccess = $state(false);
    let error = $state("");

    // close Modal when escape key is pressed
    onMount(() => {
        const handleEscape = (event) => {
            if (event.key === 'Escape') {
                closeModal();
            }
        }
    })

    function closeModal() {
        isOpen = false;

        // Store in localStorage to not show again for 30days
        localStorage.setItem('newsletterClosed', new Date().toISOString());
    }

    async function handleSubmit(event) {
        event.preventDefault();

        if (!email) {
            error = 'Please enter your email address';
            return;
        }

        if (!isValidEmail(email)) {
            error = 'Please enter a valid email address';
            return;
        }

        isLoading = true;
        error = ''

        try {
            // Save to supabase database
            const { error: supabaseError } = await supabase
                .from('newsletter_subscribers')
                .insert([
                    {
                        email: email,
                        source: 'homepage_popup'
                    }
                ])
            if (supabaseError) {
                if (supabaseError.code === '23505') {
                    error = 'This email is already subscribed!'
                } else {
                    throw supabaseError
                }
            } else {
                isSuccess = true;
                // Store in localStorage to not show again
                localStorage.setItem('newsletterSubscribed', 'true');
            }

        } catch (err) {
            console.error('Error saving email:', err)
            error = 'Something went wrong. Please try again'
        } finally {
            isLoading = false
        }
    }

    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function resetForm() {
        email = '';
        error = '';
        isSuccess = false;
    }
</script>

{#if isOpen}
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
    <div class="relative w-full max-w-md">
      <Card class="relative">
        <CardHeader class="pb-4">
          <div class="flex justify-between items-start">
            <div>
              <CardTitle class="text-2xl font-bold text-primary">
                Welcome! 👋
              </CardTitle>
              <CardDescription class="text-lg mt-2">
                Stay updated with our latest Nigerian fashion collections
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onclick={closeModal}
              class="h-8 w-8 p-0 hover:bg-muted"
            >
              <X class="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent class="pb-6">
          {#if !isSuccess}
            <form on:submit|preventDefault={handleSubmit} class="space-y-4">
              <div class="space-y-2">
                <Label for="email" class="text-sm font-medium">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  bind:value={email}
                  placeholder="Enter your email"
                  required
                  disabled={isLoading}
                  class="w-full"
                />
                {#if error}
                  <p class="text-sm text-red-500">{error}</p>
                {/if}
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                class="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                {#if isLoading}
                  <svg class="animate-spin -ml-1 mr-3 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Subscribing...
                {:else}
                  Get Updates
                {/if}
              </Button>

              <p class="text-xs text-muted-foreground text-center">
                We respect your privacy. Unsubscribe at any time.
              </p>
            </form>
          {:else}
            <div class="text-center space-y-4">
              <div class="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <svg class="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <div>
                <h3 class="text-lg font-semibold text-foreground">
                  Thank You!
                </h3>
                <p class="text-muted-foreground mt-1">
                  You're now subscribed to our updates. Look out for exclusive offers and new collections!
                </p>
              </div>
              <Button onclick={closeModal} class="w-full">
                Continue Shopping
              </Button>
            </div>
          {/if}
        </CardContent>
      </Card>
    </div>
  </div>
{/if}

<style>
  .backdrop-blur-sm {
    backdrop-filter: blur(4px);
  }
</style>