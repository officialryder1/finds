import ankaraDress from "$lib/assets/product-ankara-dress.jpg";
import asoOke from "$lib/assets/product-aso-oke.jpg";
import kaftan from "$lib/assets/product-kaftan.jpg";
import wrapperSet from "$lib/assets/product-wrapper.jpg";

import { supabase } from '$lib/supabaseClient';


export interface ProductType {
    image: string;
    title: string;
    price: string;
    category: string;
}

export let Product: ProductType[] = [];


// export const Product = [
//      {
//             image: ankaraDress,
//             title: "Elegant Ankara Dress",
//             price: "₦45,000",
//             category: "Ankara",
//         },
//         {
//             image: asoOke,
//             title: "Traditional Aso-Oke Set",
//             price: "₦85,000",
//             category: "Aso-Oke",
//         },
//         {
//             image: kaftan,
//             title: "Modern Kaftan",
//             price: "₦38,000",
//             category: "Kaftan",
//         },
//         {
//             image: wrapperSet,
//             title: "Wrapper & Blouse Set",
//             price: "₦52,000",
//             category: "Wrapper",
//         },
// ]

async function fetchProducts() {
    const query = supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })


    const { data, error } = await query

    if (!error) {
      Product = data
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