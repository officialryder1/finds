<script>
  import { onMount } from 'svelte';
  import { supabase } from '$lib/supabaseClient';
  import { getImageUrl } from '$lib/getImageUrl';
  import { 
    Package, 
    Tags, 
    Users, 
    TrendingUp, 
    DollarSign,
    ShoppingCart,
    Eye,
    ArrowUp,
    ArrowDown,
    Calendar,
    MoreHorizontal
  } from '@lucide/svelte';
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card';
  import { Button } from '$lib/components/ui/button';
  import { Badge } from '$lib/components/ui/badge';

  let stats = $state({
    totalProducts: 0,
    totalCategories: 0,
    totalSubscribers: 0,
    totalRevenue: 125000,
    monthlyGrowth: 12.5,
    conversionRate: 3.2,
    averageOrder: 45000,
    visitors: 1240
  });
  
  let recentProducts = $state([]);
  let loading = $state(true);

  // Sample data for charts
  const revenueData = [
    { month: 'Jan', revenue: 85000 },
    { month: 'Feb', revenue: 92000 },
    { month: 'Mar', revenue: 78000 },
    { month: 'Apr', revenue: 110000 },
    { month: 'May', revenue: 125000 },
    { month: 'Jun', revenue: 142000 }
  ];

  const categoryDistribution = [
    { name: 'Ankara', value: 35, color: '#3b82f6' },
    { name: 'Aso-Oke', value: 25, color: '#ef4444' },
    { name: 'Kaftan', value: 20, color: '#10b981' },
    { name: 'Wrapper', value: 15, color: '#f59e0b' },
    { name: 'Others', value: 5, color: '#8b5cf6' }
  ];

  onMount(async () => {
    await Promise.all([fetchStats(), fetchRecentProducts()]);
  });

  async function fetchStats() {
    try {
      // Fetch products count
      const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Fetch categories count
      const { count: categoriesCount } = await supabase
        .from('categories')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      // Fetch subscribers count
      const { count: subscribersCount } = await supabase
        .from('newsletter_subscribers')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true);

      stats = {
        ...stats,
        totalProducts: productsCount || 0,
        totalCategories: categoriesCount || 0,
        totalSubscribers: subscribersCount || 0,
      };
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }

  async function fetchRecentProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(5);

      if (!error) {
        recentProducts = data;
      }
    } catch (error) {
      console.error('Error fetching recent products:', error);
    } finally {
      loading = false;
    }
  }

  function formatCurrency(amount) {
    return `₦${amount.toLocaleString()}`;
  }

  function formatNumber(num) {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
  }
</script>

<div class="space-y-6">
  <!-- Header -->
  <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 class="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
        Dashboard
      </h1>
      <p class="text-muted-foreground mt-2">
        Welcome back! Here's what's happening with your store today.
      </p>
    </div>
    <div class="mt-4 sm:mt-0">
      <Button class="gap-2">
        <Calendar class="w-4 h-4" />
        Last 30 days
      </Button>
    </div>
  </div>

  <!-- Stats Grid -->
  <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
    <!-- Total Revenue -->
    <Card class="relative overflow-hidden border-primary/20">
      <div class="absolute top-0 right-0 w-20 h-20 bg-primary/10 rounded-full -translate-y-10 translate-x-10"></div>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle class="text-sm font-medium">Total Revenue</CardTitle>
        <div class="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
          <DollarSign class="h-5 w-5 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
        <div class="flex items-center mt-2">
          {#if stats.monthlyGrowth > 0}
            <ArrowUp class="h-4 w-4 text-green-500 mr-1" />
            <span class="text-green-500 text-sm font-medium">+{stats.monthlyGrowth}%</span>
          {:else}
            <ArrowDown class="h-4 w-4 text-red-500 mr-1" />
            <span class="text-red-500 text-sm font-medium">{stats.monthlyGrowth}%</span>
          {/if}
          <span class="text-muted-foreground text-sm ml-2">from last month</span>
        </div>
      </CardContent>
    </Card>

    <!-- Products -->
    <Card class="relative overflow-hidden">
      <div class="absolute top-0 right-0 w-20 h-20 bg-blue-500/10 rounded-full -translate-y-10 translate-x-10"></div>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle class="text-sm font-medium">Total Products</CardTitle>
        <div class="h-9 w-9 rounded-full bg-blue-500/10 flex items-center justify-center">
          <Package class="h-5 w-5 text-blue-500" />
        </div>
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">{stats.totalProducts}</div>
        <p class="text-xs text-muted-foreground mt-2">
          Active products in store
        </p>
      </CardContent>
    </Card>

    <!-- Categories -->
    <Card class="relative overflow-hidden">
      <div class="absolute top-0 right-0 w-20 h-20 bg-green-500/10 rounded-full -translate-y-10 translate-x-10"></div>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle class="text-sm font-medium">Categories</CardTitle>
        <div class="h-9 w-9 rounded-full bg-green-500/10 flex items-center justify-center">
          <Tags class="h-5 w-5 text-green-500" />
        </div>
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">{stats.totalCategories}</div>
        <p class="text-xs text-muted-foreground mt-2">
          Product categories
        </p>
      </CardContent>
    </Card>

    <!-- Subscribers -->
    <Card class="relative overflow-hidden">
      <div class="absolute top-0 right-0 w-20 h-20 bg-purple-500/10 rounded-full -translate-y-10 translate-x-10"></div>
      <CardHeader class="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle class="text-sm font-medium">Subscribers</CardTitle>
        <div class="h-9 w-9 rounded-full bg-purple-500/10 flex items-center justify-center">
          <Users class="h-5 w-5 text-purple-500" />
        </div>
      </CardHeader>
      <CardContent>
        <div class="text-2xl font-bold">{formatNumber(stats.totalSubscribers)}</div>
        <p class="text-xs text-muted-foreground mt-2">
          Newsletter subscribers
        </p>
      </CardContent>
    </Card>
  </div>

  <!-- Charts and Additional Metrics -->
  <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    <!-- Revenue Chart -->
    <Card class="lg:col-span-2">
      <CardHeader>
        <CardTitle class="flex items-center justify-between">
          Revenue Overview
          <Badge variant="outline" class="text-xs">Last 6 months</Badge>
        </CardTitle>
        <CardDescription>
          Monthly revenue performance trends
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div class="h-80 relative">
          <!-- Simple bar chart using CSS -->
          <div class="flex items-end justify-between h-64 gap-2 mt-4">
            {#each revenueData as item, index}
              <div class="flex flex-col items-center flex-1">
                <div 
                  class="w-full bg-gradient-to-t from-primary to-primary/60 rounded-t-lg transition-all hover:from-primary/80 hover:to-primary/40"
                  style="height: {Math.max(20, (item.revenue / 150000) * 100)}%"
                  title="{formatCurrency(item.revenue)}"
                ></div>
                <span class="text-xs text-muted-foreground mt-2">{item.month}</span>
              </div>
            {/each}
          </div>
          <div class="flex justify-between items-center mt-4 pt-4 border-t">
            <div>
              <p class="text-sm text-muted-foreground">Average Monthly Revenue</p>
              <p class="text-lg font-semibold">{formatCurrency(105000)}</p>
            </div>
            <Badge variant="secondary" class="gap-1">
              <TrendingUp class="w-3 h-3" />
              Growing
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Performance Metrics -->
    <Card>
      <CardHeader>
        <CardTitle>Performance</CardTitle>
        <CardDescription>Key store metrics</CardDescription>
      </CardHeader>
      <CardContent class="space-y-4">
        <div class="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <div class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-full bg-orange-500/10 flex items-center justify-center">
              <ShoppingCart class="h-5 w-5 text-orange-500" />
            </div>
            <div>
              <p class="text-sm font-medium">Conversion Rate</p>
              <p class="text-xs text-muted-foreground">Store visits to sales</p>
            </div>
          </div>
          <Badge variant="default">{stats.conversionRate}%</Badge>
        </div>

        <div class="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <div class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
              <DollarSign class="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p class="text-sm font-medium">Avg. Order Value</p>
              <p class="text-xs text-muted-foreground">Per transaction</p>
            </div>
          </div>
          <Badge variant="default">{formatCurrency(stats.averageOrder)}</Badge>
        </div>

        <div class="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <div class="flex items-center gap-3">
            <div class="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
              <Eye class="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <p class="text-sm font-medium">Monthly Visitors</p>
              <p class="text-xs text-muted-foreground">Store traffic</p>
            </div>
          </div>
          <Badge variant="default">{formatNumber(stats.visitors)}</Badge>
        </div>

        <!-- Category Distribution -->
        <div class="mt-6">
          <p class="text-sm font-medium mb-3">Category Distribution</p>
          <div class="space-y-2">
            {#each categoryDistribution as category}
              <div class="flex items-center justify-between text-sm">
                <div class="flex items-center gap-2">
                  <div 
                    class="w-3 h-3 rounded-full" 
                    style="background-color: {category.color}"
                  ></div>
                  <span>{category.name}</span>
                </div>
                <span class="font-medium">{category.value}%</span>
              </div>
            {/each}
          </div>
        </div>
      </CardContent>
    </Card>
  </div>

  <!-- Recent Products and Quick Actions -->
  <div class="grid gap-6 lg:grid-cols-3">
    <!-- Recent Products -->
    <Card class="lg:col-span-2">
      <CardHeader class="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Recent Products</CardTitle>
          <CardDescription>Recently added products to your store</CardDescription>
        </div>
        <Button variant="ghost" size="sm" href="/admin/products">
          View All
        </Button>
      </CardHeader>
      <CardContent>
        {#if loading}
          <div class="space-y-4">
            {#each Array(3) as _}
              <div class="flex items-center space-x-4 animate-pulse">
                <div class="h-12 w-12 bg-muted rounded-lg"></div>
                <div class="space-y-2 flex-1">
                  <div class="h-4 bg-muted rounded w-3/4"></div>
                  <div class="h-3 bg-muted rounded w-1/2"></div>
                </div>
              </div>
            {/each}
          </div>
        {:else if recentProducts.length === 0}
          <div class="text-center py-8 text-muted-foreground">
            <Package class="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No products yet</p>
            <p class="text-sm">Add your first product to get started</p>
          </div>
        {:else}
          <div class="space-y-4">
            {#each recentProducts as product}
              <div class="flex items-center space-x-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
                <div class="h-12 w-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                  {#if product.image_path}
                    <img 
                      src="{getImageUrl(product.image_path)}" 
                      alt="{product.title}"
                      class="h-full w-full object-cover"
                    />
                  {:else}
                    <Package class="h-6 w-6 text-muted-foreground" />
                  {/if}
                </div>
                <div class="flex-1 min-w-0">
                  <p class="text-sm font-medium truncate">{product.title}</p>
                  <p class="text-sm text-muted-foreground">₦{product.price?.toLocaleString()}</p>
                </div>
                <Badge variant={product.is_active ? "default" : "secondary"} class="text-xs">
                  {product.is_active ? "Active" : "Inactive"}
                </Badge>
              </div>
            {/each}
          </div>
        {/if}
      </CardContent>
    </Card>

    <!-- Quick Actions -->
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Manage your store efficiently</CardDescription>
      </CardHeader>
      <CardContent class="space-y-3">
        <Button class="w-full justify-start h-12" href="/admin/products">
          <Package class="h-4 w-4 mr-3" />
          <div class="text-left">
            <div class="font-medium">Manage Products</div>
            <div class="text-xs text-muted-foreground">Add, edit, or remove products</div>
          </div>
        </Button>

        <Button class="w-full justify-start h-12" variant="outline" href="/admin/categories">
          <Tags class="h-4 w-4 mr-3" />
          <div class="text-left">
            <div class="font-medium">Categories</div>
            <div class="text-xs text-muted-foreground">Organize product categories</div>
          </div>
        </Button>

        <Button class="w-full justify-start h-12" variant="outline" href="/admin/newsletter">
          <Users class="h-4 w-4 mr-3" />
          <div class="text-left">
            <div class="font-medium">Subscribers</div>
            <div class="text-xs text-muted-foreground">View newsletter list</div>
          </div>
        </Button>

        <div class="pt-4 border-t">
          <p class="text-sm font-medium mb-3">Store Health</p>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-muted-foreground">Products Status</span>
              <Badge variant="default" class="text-xs">Healthy</Badge>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Inventory</span>
              <Badge variant="default" class="text-xs">Good</Badge>
            </div>
            <div class="flex justify-between">
              <span class="text-muted-foreground">Performance</span>
              <Badge variant="default" class="text-xs">Optimal</Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
</div>

<style>
  .bg-gradient-to-r {
    background-image: linear-gradient(to right, var(--tw-gradient-stops));
  }
  
  .bg-clip-text {
    -webkit-background-clip: text;
    background-clip: text;
  }
  
  .text-transparent {
    color: transparent;
  }
</style>