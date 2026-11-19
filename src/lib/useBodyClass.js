import { useEffect } from 'react';

/** Sets the Shopify template class on <body> (template-index, template-collection, …) the theme CSS keys off. */
export default function useBodyClass(template) {
  useEffect(() => {
    const base = 'product-grid-wide regular_customer';
    document.body.className = `template-${template} ${base}`;
  }, [template]);
}
