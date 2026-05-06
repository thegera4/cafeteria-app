import { groq } from 'next-sanity'

export const getCategoriesQuery = groq`*[_type == "category"] | order(name asc) {
  _id,
  name,
  "slug": slug.current
}`

export const getProductsQuery = groq`
  *[_type == "product" && isAvailable == true] | order(name asc) [$start...$end] {
    _id,
    name,
    "slug": slug.current,
    price,
    "imageUrl": image.asset->url,
    "categorySlug": category->slug.current,
    description
  }
`
export const getAllProductsQuery = groq`
  *[_type == "product" && isAvailable == true] | order(name asc) {
    _id,
    name,
    "slug": slug.current,
    price,
    "imageUrl": image.asset->url,
    "categorySlug": category->slug.current,
    description
  }
`
export const getProductsCountQuery = groq`count(*[_type == "product" && isAvailable == true])`

export const getProductsByCategoryQuery = groq`
  *[_type == "product" && isAvailable == true && category->slug.current == $categorySlug] | order(name asc) [$start...$end] {
    _id,
    name,
    "slug": slug.current,
    price,
    "imageUrl": image.asset->url,
    "categorySlug": category->slug.current,
    description
  }
`
export const getProductsCountByCategoryQuery = groq`count(*[_type == "product" && isAvailable == true && category->slug.current == $categorySlug])`
