import ProductCard from './ProductCard.jsx';
import { getProduct } from '../lib/catalog.js';

export default function FeaturedCollection({ id, title, handles, rowOf = 4 }) {
  const items = handles.map(getProduct).filter(Boolean);
  return (
    <div id={`shopify-section-${id}`} className="shopify-section">
      <div data-section-id={id} data-section-type="dynamic-collection">
        <section className="home-section featured-collection clearfix content-area has-heading">
          <h2 className="section-title">{title}</h2>
          <ul className={`product-list row-of-${rowOf}`}>
            {items.map((p, i) => (
              <ProductCard key={p.handle} product={p} first={i === 0} />
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
