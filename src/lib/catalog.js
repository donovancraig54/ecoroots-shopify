import products from '../data/products.json';
import collections from '../data/collections.json';
import home from '../data/home.json';

export { products, collections, home };

export const getProduct = (handle) => products[handle] || null;
export const getCollection = (handle) => collections[handle] || null;

/** Router path for a product, or "#" when it is unknown. */
export const productUrl = (handle) => (products[handle] ? `/products/${handle}` : '#');

/** Collections that exist in the app get a real route; everything else stays a dead link like the mirror. */
export const collectionUrl = (handle) => (collections[handle] ? `/collections/${handle}` : '#');

export const money = (cents) => `$${(cents / 100).toFixed(2)}`;

/** "$13.99" -> 1399 */
export const toCents = (str) => Math.round(Number(String(str ?? '').replace(/[^0-9.]/g, '')) * 100) || 0;

export function searchProducts(q, limit = 6) {
  const term = q.trim().toLowerCase();
  if (!term) return [];
  return Object.values(products)
    .filter((p) => p.title.toLowerCase().includes(term))
    .slice(0, limit);
}
