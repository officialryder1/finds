import ankaraDress from "$lib/assets/product-ankara-dress.jpg";
import asoOke from "$lib/assets/product-aso-oke.jpg";
import kaftan from "$lib/assets/product-kaftan.jpg";
import wrapperSet from "$lib/assets/product-wrapper.jpg";

import { supabase } from '$lib/supabaseClient';


export interface ProductType {
    image: string;
    title: string;
    price: string;
    categories: string;
    description: string;
    stock_quantity: number;
    is_new?: boolean;
    id: string;
}

export let Product: ProductType[] = [];


async function fetchProducts() {
    const query = supabase
      .from('products')
      .select(`
        *,
        categories (*)
        `)
      .eq('is_active', true)
      .order('created_at', { ascending: false })
      .limit(12);


    const { data, error } = await query

    if (!error) {
      Product = data
      console.log('Products fetched successfully:', Product);
    }
    
}
await fetchProducts()
console.log(Product);

export const categories = [
    { name: "Ankara", count: "120+ items", color: "from-primary to-accent" },
    { name: "Aso-Oke", count: "85+ items", color: "from-secondary to-primary" },
    { name: "Kaftan", count: "95+ items", color: "from-accent to-secondary" },
    { name: "Wrappers", count: "110+ items", color: "from-primary to-secondary" },
];

export const categoriesDetail = (pa: string) => {
   return categories.find(category => category.name === pa)
}

export const ProductDetail = (pa: string) => {
    return Product.find(product => product.title === pa)
}