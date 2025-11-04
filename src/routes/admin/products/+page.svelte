<script lang="ts">
  import { supabase } from '$lib/supabaseClient'
  import { onMount } from 'svelte'
  import { Plus, Edit, Trash2, Search, ChevronDown, Upload, X } from '@lucide/svelte'
  import { getImageUrl } from '$lib/getImageUrl'
  
  // Shadcn-svelte components
  import { Button } from '$lib/components/ui/button'
  import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '$lib/components/ui/card'
  import { Input } from '$lib/components/ui/input'
  import { Label } from '$lib/components/ui/label'
  import { Textarea } from '$lib/components/ui/textarea'
  import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '$lib/components/ui/table'
  import { Badge } from '$lib/components/ui/badge'

  // State declarations
  let products = $state<any[]>([])
  let loading = $state(true)
  let showAddForm = $state(false)
  let editingProduct = $state<any>(null)
  let searchQuery = $state('')
  let selectedCategory = $state('all')
  let categories = $state<any[]>([])

  // Form fields
  let title = $state('')
  let description = $state('')
  let price = $state('')
  let category = $state('')
  let stockQuantity = $state(0)
  let isActive = $state(true)

  // File upload states
  let selectedFile = $state<File | null>(null)
  let uploadProgress = $state(0)
  let isUploading = $state(false)
  let currentImagePath = $state('')

  // UI states for custom select
  let showCategoryFilterDropdown = $state(false)
  let showCategoryFormDropdown = $state(false)

  onMount(async () => {
    await fetchProducts()
    await fetchCategories()
  })

  async function fetchProducts() {
    loading = true
    let query = supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    // Fix: Use category_id for filtering instead of old category field
    if (selectedCategory !== 'all') {
      query = query.eq('category_id', selectedCategory)
    }

    if (searchQuery) {
      query = query.ilike('title', `%${searchQuery}%`)
    }

    const { data, error } = await query

    if (!error) {
      products = data
    }
    loading = false
  }

  async function fetchCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true })

    if (!error) {
      categories = data
    }
  }

  async function handleFileSelect(event: Event) {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB')
      return
    }

    selectedFile = file
  }

  async function uploadImage() {
    if (!selectedFile) return null

    isUploading = true
    uploadProgress = 0

    try {
      // Generate unique file name
      const fileExt = selectedFile.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`
      const filePath = `products/${fileName}`

      console.log('Starting upload for:', filePath)

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(filePath, selectedFile, {
          cacheControl: '3600',
          upsert: false
        })

      if (error) {
        console.error('Upload error details:', error)
        throw error
      }

      console.log('Upload successful:', data)
      uploadProgress = 100
      return filePath

    } catch (error: any) {
      console.error('Upload failed:', error)
      
      // More specific error messages
      if (error.message?.includes('row-level security policy')) {
        alert('Storage permission error. Please check your Supabase storage policies.')
      } else if (error.message?.includes('bucket')) {
        alert('Storage bucket not found. Please create a "product-images" bucket in Supabase.')
      } else {
        alert('Failed to upload image. Please try again.')
      }
      
      return null
    } finally {
      isUploading = false
    }
  }

  async function handleSubmit(event: Event) {
    event.preventDefault()
    
    if (!title.trim() || !price || !category) {
      alert('Please fill in all required fields')
      return
    }

    let imagePath = currentImagePath

    // Upload new image if selected
    if (selectedFile) {
      imagePath = await uploadImage()
      if (!imagePath && !currentImagePath) {
        alert('Image upload failed. Please try again.')
        return
      }
    }

    const productData = {
      title: title.trim(),
      description: description.trim(),
      price: parseFloat(price),
      category_id: category,
      image_path: imagePath,
      stock_quantity: parseInt(stockQuantity.toString()),
      is_active: isActive
    }

    try {
      if (editingProduct) {
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id)
        
        if (error) throw error
      } else {
        const { error } = await supabase
          .from('products')
          .insert([productData])
        
        if (error) throw error
      }

      resetForm()
      await fetchProducts()
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Failed to save product. Please try again.')
    }
  }

  function editProduct(product: any) {
    editingProduct = product
    title = product.title
    description = product.description || ''
    price = product.price
    category = product.category_id || ''
    stockQuantity = product.stock_quantity
    isActive = product.is_active
    currentImagePath = product.image_path || ''
    selectedFile = null
    uploadProgress = 0
    showAddForm = true
  }

  async function deleteProduct(id: string) {
    if (confirm('Are you sure you want to delete this product?')) {
      // First get the product to delete its image
      const { data: product } = await supabase
        .from('products')
        .select('image_path')
        .eq('id', id)
        .single()

      // Delete the product
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id)

      if (!error) {
        // Delete the associated image from storage
        if (product?.image_path) {
          await supabase.storage
            .from('product-images')
            .remove([product.image_path])
        }
        await fetchProducts()
      }
    }
  }

  function removeSelectedFile() {
    selectedFile = null
    // Reset file input
    const fileInput = document.getElementById('image-upload') as HTMLInputElement
    if (fileInput) fileInput.value = ''
  }

  function resetForm() {
    editingProduct = null
    title = ''
    description = ''
    price = ''
    category = ''
    stockQuantity = 0
    isActive = true
    selectedFile = null
    currentImagePath = ''
    uploadProgress = 0
    showAddForm = false
    
    // Reset file input
    const fileInput = document.getElementById('image-upload') as HTMLInputElement
    if (fileInput) fileInput.value = ''
    showAddForm = false
  }

  function handleCategoryFilterChange(value: string) {
    selectedCategory = value
    showCategoryFilterDropdown = false
    fetchProducts()
  }

  function handleCategoryFormChange(value: string) {
    category = value
    showCategoryFormDropdown = false
  }

  function getSelectedCategoryName() {
    if (selectedCategory === 'all') return 'All Categories'
    const foundCategory = categories.find(c => c.id === selectedCategory)
    return foundCategory ? foundCategory.name : 'All Categories'
  }

  function getFormCategoryName() {
    if (!category) return 'Select category'
    const foundCategory = categories.find(c => c.id === category)
    return foundCategory ? foundCategory.name : 'Select category'
  }

  // Close dropdowns when clicking outside
  function setupClickOutside() {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (!target.closest('.category-filter-dropdown')) {
        showCategoryFilterDropdown = false
      }
      if (!target.closest('.category-form-dropdown')) {
        showCategoryFormDropdown = false
      }
    }
    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }

  // Shorten Product Description
  function descriptionShorter(des: string, length: number) {
    if (des.length <= length) return des
    return des.slice(0, length) + '...'

  }

  $effect(() => {
    if (searchQuery.length === 0 || searchQuery.length > 2) {
      fetchProducts()
    }
  })

  $effect(() => {
    return setupClickOutside()
  })
</script>

<div class="min-h-screen bg-background p-6">
  <div class="max-w-7xl mx-auto space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h1 class="text-3xl font-bold tracking-tight">Product Management</h1>
        <p class="text-muted-foreground mt-1">
          Manage your e-commerce products and inventory
        </p>
      </div>
      <Button size="sm" class="gap-2 text-white" onclick={() => showAddForm = true}>
        <Plus class="w-4 h-4 mr-2" />
        Add Product
      </Button>
    </div>

    <!-- Filters -->
    <Card>
      <CardHeader>
        <CardTitle>Filters & Search</CardTitle>
      </CardHeader>
      <CardContent>
        <div class="flex gap-4 flex-col sm:flex-row">
          <div class="flex-1">
            <Label for="search" class="sr-only">Search products</Label>
            <div class="relative">
              <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                id="search"
                bind:value={searchQuery}
                placeholder="Search products..."
                class="pl-10"
              />
            </div>
          </div>
          <div class="w-full sm:w-48">
            <Label for="category-filter" class="sr-only">Filter by category</Label>
            <div class="relative category-filter-dropdown">
              <Button
                variant="outline"
                class="w-full justify-between"
                onclick={() => showCategoryFilterDropdown = !showCategoryFilterDropdown}
              >
                <span>{getSelectedCategoryName()}</span>
                <ChevronDown class="w-4 h-4 opacity-50" />
              </Button>
              {#if showCategoryFilterDropdown}
                <div class="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-md max-h-60 overflow-auto">
                  <div class="p-1">
                    <!-- svelte-ignore a11y_click_events_have_key_events -->
                    <!-- svelte-ignore a11y_no_static_element_interactions -->
                    <div
                      class="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 {selectedCategory === 'all' ? 'bg-accent' : ''}"
                      onclick={() => handleCategoryFilterChange('all')}
                    >
                      All Categories
                    </div>
                    {#each categories as cat}
                      <!-- svelte-ignore a11y_click_events_have_key_events -->
                      <!-- svelte-ignore a11y_no_static_element_interactions -->
                      <div
                        class="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 {selectedCategory === cat.id ? 'bg-accent' : ''}"
                        onclick={() => handleCategoryFilterChange(cat.id)}
                      >
                        <div class="flex items-center gap-2">
                          <div class="w-3 h-3 rounded-full" style="background-color: {cat.color}"></div>
                          <span>{cat.name}</span>
                          <Badge variant="outline" class="ml-auto text-xs">
                            {cat.product_count}
                          </Badge>
                        </div>
                      </div>
                    {/each}
                  </div>
                </div>
              {/if}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>

    <!-- Add/Edit Form -->
    {#if showAddForm}
      <Card>
        <CardHeader>
          <CardTitle>{editingProduct ? 'Edit Product' : 'Add New Product'}</CardTitle>
          <CardDescription>
            {editingProduct ? 'Update the product details' : 'Add a new product to your store'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onsubmit={handleSubmit} class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="space-y-2">
                <Label for="title">Product Title *</Label>
                <Input
                  id="title"
                  bind:value={title}
                  placeholder="Enter product title"
                  required
                />
              </div>

              <div class="space-y-2">
                <Label for="price">Price *</Label>
                <Input
                  id="price"
                  type="number"
                  bind:value={price}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  required
                />
              </div>
            </div>

            <div class="space-y-2">
              <Label for="description">Description</Label>
              <Textarea
                id="description"
                bind:value={description}
                placeholder="Enter product description"
                rows="3"
              />
            </div>

            <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div class="space-y-2">
                <Label for="category">Category *</Label>
                <div class="relative category-form-dropdown">
                  <Button
                    variant="outline"
                    class="w-full justify-between {!category ? 'text-muted-foreground' : ''}"
                    type="button"
                    onclick={() => showCategoryFormDropdown = !showCategoryFormDropdown}
                  >
                    <span>{getFormCategoryName()}</span>
                    <ChevronDown class="w-4 h-4 opacity-50" />
                  </Button>
                  {#if showCategoryFormDropdown}
                    <div class="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-md max-h-60 overflow-auto">
                      <div class="p-1">
                        {#each categories as cat}
                          <!-- svelte-ignore a11y_click_events_have_key_events -->
                          <!-- svelte-ignore a11y_no_static_element_interactions -->
                          <div
                            class="relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 {category === cat.id ? 'bg-accent' : ''}"
                            onclick={() => handleCategoryFormChange(cat.id)}
                          >
                            <div class="flex items-center gap-2">
                              <div class="w-3 h-3 rounded-full" style="background-color: {cat.color}"></div>
                              <span>{cat.name}</span>
                              <Badge variant="outline" class="ml-auto text-xs">
                                {cat.product_count}
                              </Badge>
                            </div>
                          </div>
                        {/each}
                      </div>
                    </div>
                  {/if}
                </div>
              </div>

              <div class="space-y-2">
                <Label for="stock">Stock Quantity</Label>
                <Input
                  id="stock"
                  type="number"
                  bind:value={stockQuantity}
                  placeholder="0"
                  min="0"
                />
              </div>

              <div class="space-y-2">
                <Label for="image-upload">Product Image</Label>
                <div class="space-y-2">
                  <!-- Current Image Preview -->
                  {#if currentImagePath && !selectedFile}
                    <div class="relative inline-block">
                      <!-- svelte-ignore a11y_img_redundant_alt -->
                      <img
                        src={getImageUrl(currentImagePath)}
                        alt="Current product image"
                        class="w-20 h-20 object-cover rounded-md border"
                      />
                    </div>
                  {/if}

                  <!-- File Upload -->
                  <div class="flex items-center gap-2">
                    <Label
                      for="image-upload"
                      class="cursor-pointer border-2 border-dashed border-muted-foreground/25 rounded-md p-4 hover:bg-muted/50 transition-colors flex items-center gap-2"
                    >
                      <Upload class="w-4 h-4" />
                      <span class="text-sm">
                        {selectedFile ? selectedFile.name : 'Choose image...'}
                      </span>
                    </Label>
                    <Input
                      id="image-upload"
                      type="file"
                      accept="image/*"
                      class="hidden"
                      onchange={handleFileSelect}
                    />
                    
                    {#if selectedFile}
                      <Button type="button" variant="outline" size="sm" onclick={removeSelectedFile}>
                        <X class="w-4 h-4" />
                      </Button>
                    {/if}
                  </div>

                  <!-- Upload Progress -->
                  {#if isUploading}
                    <div class="space-y-1">
                      <div class="w-full bg-muted rounded-full h-2">
                        <div
                          class="bg-primary h-2 rounded-full transition-all duration-300"
                          style="width: {uploadProgress}%"
                        ></div>
                      </div>
                      <p class="text-xs text-muted-foreground">
                        Uploading... {Math.round(uploadProgress)}%
                      </p>
                    </div>
                  {/if}

                  <!-- Selected File Preview -->
                  {#if selectedFile}
                    <div class="mt-2">
                      <p class="text-sm font-medium">Preview:</p>
                      <img
                        src={URL.createObjectURL(selectedFile)}
                        alt="Selected file preview"
                        class="w-20 h-20 object-cover rounded-md border mt-1"
                      />
                    </div>
                  {/if}
                </div>
              </div>
            </div>

            <div class="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isActive"
                bind:checked={isActive}
                class="w-4 h-4"
              />
              <Label for="isActive">Product is active and visible to customers</Label>
            </div>

            <div class="flex gap-2 pt-4">
              <Button type="submit" disabled={isUploading}>
                {#if isUploading}
                  Uploading...
                {:else}
                  {editingProduct ? 'Update Product' : 'Create Product'}
                {/if}
              </Button>
              <Button type="button" variant="outline" onclick={resetForm}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    {/if}

   <!-- Products Table -->
    <Card>
      <CardHeader>
        <CardTitle>Products</CardTitle>
        <CardDescription>
          {products.length} product{products.length !== 1 ? 's' : ''} found
        </CardDescription>
      </CardHeader>
      <CardContent>
        {#if loading}
          <div class="flex justify-center py-8">
            <div class="animate-pulse text-muted-foreground">Loading products...</div>
          </div>
        {:else if products.length === 0}
          <div class="text-center py-8 text-muted-foreground">
            No products found. {#if searchQuery || selectedCategory !== 'all'}Try adjusting your filters.{:else}Start by adding your first product.{/if}
          </div>
        {:else}
          <div class="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead class="text-right">Price</TableHead>
                  <TableHead class="text-right">Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead class="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {#each products as product}
                  {@const productCategory = categories.find(c => c.id === product.category_id)}
                  <TableRow>
                    <TableCell class="font-medium">
                      <div class="flex items-center gap-3">
                        {#if product.image_path}
                          <img
                            src={getImageUrl(product.image_path)}
                            alt={product.title}
                            class="w-10 h-10 rounded-md object-cover"
                          />
                        {:else}
                          <div class="w-10 h-10 rounded-md bg-muted flex items-center justify-center">
                            <span class="text-xs text-muted-foreground">No image</span>
                          </div>
                        {/if}
                        <div>
                          <div class="font-medium">{product.title}</div>
                          {#if product.description}
                            <div class="text-sm text-muted-foreground line-clamp-1">
                              {descriptionShorter(product.description, 30)}
                            </div>
                          {/if}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {#if productCategory}
                        <Badge variant="outline" style="background-color: {productCategory.color}20; border-color: {productCategory.color}50; color: {productCategory.color}">
                          {productCategory.name}
                        </Badge>
                      {:else}
                        <Badge variant="outline">Uncategorized</Badge>
                      {/if}
                    </TableCell>
                    <TableCell class="text-right font-mono">
                      ₦{product.price?.toLocaleString()}
                    </TableCell>
                    <TableCell class="text-right">
                      <span class:font-mono={true} class:text-red-500={product.stock_quantity === 0}>
                        {product.stock_quantity}
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={product.is_active ? 'default' : 'secondary'}>
                        {product.is_active ? 'Active' : 'Inactive'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div class="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onclick={() => editProduct(product)}>
                          <Edit class="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" onclick={() => deleteProduct(product.id)}>
                          <Trash2 class="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                {/each}
              </TableBody>
            </Table>
          </div>
        {/if}
      </CardContent>
    </Card>
  </div>
</div>

<style>
  .line-clamp-1 {
    overflow: hidden;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }
</style>