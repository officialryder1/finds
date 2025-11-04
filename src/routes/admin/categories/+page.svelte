<script>
  import { supabase } from '$lib/supabaseClient'
  import { onMount } from 'svelte'
  import { Plus, Edit, Trash2, Search, Palette } from '@lucide/svelte'
  
  import { Button } from '$lib/components/ui/button'
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card'
  import { Input } from '$lib/components/ui/input'
  import { Label } from '$lib/components/ui/label'
  import { Textarea } from '$lib/components/ui/textarea'
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '$lib/components/ui/table'
  import { Badge } from '$lib/components/ui/badge'

  let categories = $state([])
  let loading = $state(true)
  let showAddForm = $state(false)
  let editingCategory = $state(null)
  let searchQuery = $state('')

  // Form fields
  let name = $state('')
  let description = $state('')
  let color = $state('#3b82f6') // Default blue
  let isActive = $state(true)

  // Color presets for easy selection
  const colorPresets = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e', '#10b981',
    '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7',
    '#d946ef', '#ec4899', '#f43f5e', '#64748b', '#475569', '#334155'
  ]

  onMount(async () => {
    await fetchCategories()
  })

  async function fetchCategories() {
    loading = true
    let query = supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })

    if (searchQuery) {
      query = query.ilike('name', `%${searchQuery}%`)
    }

    const { data, error } = await query

    if (!error) {
      categories = data
    }
    loading = false
  }

  function generateSlug(categoryName) {
    return categoryName
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  async function handleSubmit() {
    if (!name.trim()) {
      alert('Please enter a category name')
      return
    }

    const categoryData = {
      name: name.trim(),
      slug: generateSlug(name),
      description: description.trim(),
      color,
      is_active: isActive
    }

    try {
      if (editingCategory) {
        const { error } = await supabase
          .from('categories')
          .update(categoryData)
          .eq('id', editingCategory.id)
        
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('categories')
          .insert([categoryData])
        
        if (error) throw error
      }

      resetForm()
      await fetchCategories()
    } catch (error) {
      console.error('Error saving category:', error)
      alert('Failed to save category. It might already exist.')
    }
  }

  function editCategory(category) {
    editingCategory = category
    name = category.name
    description = category.description || ''
    color = category.color || '#3b82f6'
    isActive = category.is_active
    showAddForm = true
  }

  async function deleteCategory(id) {
    if (confirm('Are you sure you want to delete this category? Products in this category will lose their category assignment.')) {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id)

      if (!error) {
        await fetchCategories()
      }
    }
  }

  function resetForm() {
    editingCategory = null
    name = ''
    description = ''
    color = '#3b82f6'
    isActive = true
    showAddForm = false
  }

  function selectColor(colorValue) {
    color = colorValue
  }

  $effect(() => {
    if (searchQuery.length === 0 || searchQuery.length > 2) {
      fetchCategories()
    }
  })
</script>

<div class="min-h-screen bg-background p-6">
  <div class="max-w-7xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Category Management</h1>
        <p class="text-muted-foreground mt-1">
          Manage product categories and organization
        </p>
      </div>
      <Button size="sm" class="gap-2 text-white" onclick={() => showAddForm = true}>
        <Plus class="w-4 h-4 mr-2" />
        Add Category
      </Button>
    </div>

    <!-- Search -->
    <Card>
      <CardHeader>
        <CardTitle>Search Categories</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="flex gap-4">
          <div class="flex-1">
            <Label for="search" class="sr-only">Search categories</Label>
            <div class="relative">
              <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="search"
                bind:value={searchQuery}
                placeholder="Search categories..."
                class="pl-10"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Add/Edit Form -->
    {#if showAddForm}
      <Card>
        <CardHeader>
          <CardTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</CardTitle>
          <CardDescription>
            {editingCategory ? 'Update the category details' : 'Create a new product category'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onsubmit={handleSubmit} class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="name">Category Name *</Label>
                <Input
                  id="name"
                  bind:value={name}
                  placeholder="Enter category name"
                  required
                />
              </div>

              <div class="space-y-2">
                <Label for="color">Category Color</Label>
                <div class="flex items-center gap-2">
                  <div class="relative">
                    <Input
                      id="color"
                      type="color"
                      bind:value={color}
                      class="w-20 h-10 p-1 cursor-pointer"
                    />
                  </div>
                  <span class="text-sm text-muted-foreground">{color}</span>
                </div>
              </div>
            </div>

            <div class="space-y-2">
              <Label>Color Presets</Label>
              <div class="flex flex-wrap gap-2">
                {#each colorPresets as preset}
                  <button
                    type="button"
                    class="w-8 h-8 rounded-full border-2 {color === preset ? 'border-foreground' : 'border-muted'} transition-all hover:scale-110"
                    style="background-color: {preset}"
                    onclick={() => selectColor(preset)}
                    title="{preset}"
                  ></button>
                {/each}
              </div>
            </div>

            <div class="space-y-2">
              <Label for="description">Description</Label>
              <Textarea
                id="description"
                bind:value={description}
                placeholder="Enter category description"
                rows="3"
              />
            </div>

            <div class="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                bind:checked={isActive}
                class="w-4 h-4"
              />
              <Label for="isActive">Category is active and visible</Label>
            </div>

            <div class="flex gap-2 pt-4">
              <Button type="submit">
                {editingCategory ? 'Update Category' : 'Create Category'}
              </Button>
              <Button type="button" variant="outline" onclick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    {/if}

    <!-- Categories Grid -->
    <Card>
      <CardHeader>
        <CardTitle>Categories</CardTitle>
        <CardDescription>
          {categories.length} categor{categories.length !== 1 ? 'ies' : 'y'} found
        </CardDescription>
      </CardHeader>
      <CardContent>
        {#if loading}
          <div class="flex justify-center py-8">
            <div class="animate-pulse text-muted-foreground">Loading categories...</div>
          </div>
        {:else if categories.length === 0}
          <div class="text-center py-8 text-muted-foreground">
            No categories found. {#if searchQuery}Try adjusting your search.{:else}Start by creating your first category.{/if}
          </div>
        {:else}
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {#each categories as category}
              <div class="border rounded-lg p-4 space-y-3 hover:shadow-md transition-shadow">
                <!-- Color Header -->
                <div 
                  class="h-3 rounded-full mb-2"
                  style="background-color: {category.color || '#3b82f6'}"
                ></div>
                
                <!-- Category Info -->
                <div class="space-y-2">
                  <div class="flex items-start justify-between">
                    <h3 class="font-semibold text-lg">{category.name}</h3>
                    <Badge variant={category.is_active ? 'default' : 'secondary'}>
                      {category.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                  
                  {#if category.description}
                    <p class="text-sm text-muted-foreground line-clamp-2">
                      {category.description}
                    </p>
                  {/if}
                  
                  <div class="flex items-center justify-between text-sm">
                    <span class="text-muted-foreground">
                      {category.product_count} product{category.product_count !== 1 ? 's' : ''}
                    </span>
                    <span class="text-muted-foreground">
                      {new Date(category.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    class="flex-1"
                    onclick={() => editCategory(category)}
                  >
                    <Edit class="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onclick={() => deleteCategory(category.id)}
                  >
                    <Trash2 class="w-3 h-3" />
                  </Button>
                </div>
              </div>
            {/each}
          </div>
        {/if}
      </CardContent>
    </Card>
  </div>
</div>

<style>
  .line-clamp-2 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
  }
</style>