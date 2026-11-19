import { useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard.jsx';
import useBodyClass from '../lib/useBodyClass.js';
import { getCollection, getProduct } from '../lib/catalog.js';
import NotFound from './NotFound.jsx';

export default function Collection() {
  const { handle } = useParams();
  useBodyClass('collection');
  const collection = getCollection(handle);
  if (!collection) return <NotFound />;
  const items = collection.products.map(getProduct).filter(Boolean);

  return (
    <div id="shopify-section-static-collection" className="shopify-section">
      <div data-section-id="static-collection" data-section-type="static-collection">
        <main className="content">
          <header className="collection-title-header">
            <div className="collection-title page-title">
              <h1 className="label" style={{ textAlign: 'center' }}>
                {collection.title}
              </h1>
            </div>
          </header>
          <div className="content-area collection-matrix clearfix">
            <div className="collection-header clearfix" />
            <div className="collection-content">
              <ul className={`product-list row-of-${collection.rowOf}`}>
                {items.map((p, i) => (
                  <ProductCard key={p.handle} product={p} first={i === 0} />
                ))}
              </ul>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
