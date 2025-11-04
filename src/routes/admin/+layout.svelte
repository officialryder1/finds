<script>
  import { page } from '$app/stores';
  import { 
    LayoutDashboard, 
    Package, 
    Tags, 
    Users, 
    Settings,
    Mail,
    BarChart3
  } from '@lucide/svelte';

  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
      current: true
    },
    {
      name: 'Products',
      href: '/admin/products',
      icon: Package,
      current: false
    },
    {
      name: 'Categories',
      href: '/admin/categories',
      icon: Tags,
      current: false
    },
    {
      name: 'Newsletter',
      href: '/admin/newsletter',
      icon: Mail,
      current: false
    },
    {
      name: 'Analytics',
      href: '/admin/analytics',
      icon: BarChart3,
      current: false
    },
    {
      name: 'Users',
      href: '/admin/users',
      icon: Users,
      current: false
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: Settings,
      current: false
    }
  ];

  function isCurrentPath(href) {
    return $page.url.pathname === href || $page.url.pathname.startsWith(href + '/');
  }
</script>

<div class="min-h-screen bg-background">
  <!-- Sidebar -->
  <div class="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
    <!-- Sidebar component -->
    <div class="flex grow flex-col gap-y-5 overflow-y-auto border-r bg-background px-6 pb-4">
      <div class="flex h-16 shrink-0 items-center">
        <h1 class="text-2xl font-bold text-foreground">Admin Panel</h1>
      </div>
      <nav class="flex flex-1 flex-col">
        <ul role="list" class="flex flex-1 flex-col gap-y-7">
          <li>
            <ul role="list" class="-mx-2 space-y-1">
              {#each navigation as item}
                <li>
                  <a
                    href={item.href}
                    class={`group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold transition-colors ${
                      isCurrentPath(item.href)
                        ? 'bg-primary text-white'
                        : 'text-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <item.icon class="h-6 w-6 shrink-0" />
                    {item.name}
                  </a>
                </li>
              {/each}
            </ul>
          </li>
        </ul>
      </nav>
    </div>
  </div>

  <!-- Main content -->
  <div class="lg:pl-72">
    <!-- Top header for mobile -->
    <div class="sticky top-0 z-40 flex items-center gap-x-6 bg-background px-4 py-4 shadow-sm sm:px-6 lg:hidden">
      <div class="flex-1 text-sm font-semibold leading-6 text-foreground">
        Admin Panel
      </div>
    </div>

    <!-- Page content -->
    <main class="py-8">
      <div class="px-4 sm:px-6 lg:px-8">
        <slot />
      </div>
    </main>
  </div>
</div>

<style>
  .bg-background {
    background-color: var(--background);
  }
  .text-foreground {
    color: var(--foreground);
  }
  .bg-muted {
    background-color: var(--muted);
  }
</style>