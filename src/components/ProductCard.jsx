import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Icon from './Icon.jsx';
import { useCart } from '../context/CartContext.jsx';
import { productUrl, toCents } from '../lib/catalog.js';

function Stars({ rating, reviews }) {
  if (!reviews) return null;
  const full = Math.round(rating);
  return (
    <div className="jdgm-widget jdgm-preview-badge">
      <div className="jdgm-prev-badge eco-stars">
        <span className="jdgm-prev-badge__stars" aria-label={`${rating} stars`}>
          {[0, 1, 2, 3, 4].map((i) => (
            <span key={i} className={`eco-star ${i < full ? 'on' : ''}`}>
              ★
            </span>
          ))}
        </span>{' '}
        <span className="jdgm-prev-badge__text">{reviews} reviews</span>
      </div>
    </div>
  );
}

function Details({ product, url }) {
  return (
    <div className="product-card-details">
      <h2 className="title">
        <Link to={url}>{product.title}</Link>
      </h2>
      <Stars rating={product.rating} reviews={product.reviews} />
      <p className={`price ${product.onSale ? 'sale' : ''}`}>
        {product.compareAt && (
          <>
            <span className="original money">{product.compareAt}</span>{' '}
          </>
        )}
        <span className="money">{product.price}</span>
      </p>
    </div>
  );
}

/** Mirrors the Atlantic theme's product card (<li class="product">) markup. */
export default function ProductCard({ product, first = false }) {
  const cart = useCart();
  const navigate = useNavigate();
  const [state, setState] = useState('idle'); // idle | loading
  const url = productUrl(product.handle);
  const [img1, img2] = product.images || [];
  const hasVariants = (product.detail?.variants?.length || 1) > 1;

  const addToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (hasVariants) return navigate(url);
    setState('loading');
    setTimeout(() => {
      cart.add({
        variantId: product.variantId || product.id,
        handle: product.handle,
        title: product.title,
        variantTitle: '',
        price: toCents(product.price),
        image: img1,
      });
      setState('idle');
    }, 350);
  };

  const quickshop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(url);
  };

  return (
    <li className={`product product-${product.id} ${first ? 'first flush' : ''}`} data-product-item>
      <div className="product-inner">
        <figure className="product-card-figure">
          {[img1, img2].filter(Boolean).map((src, i) => (
            <span
              key={i}
              className="product-card-figure-ie"
              data-rimg="loaded"
              role="img"
              aria-label={product.title}
              style={{ backgroundImage: `url("${src}")` }}
            />
          ))}
          <Link to={url} aria-label={product.title} />
          <Link className="product-card-overlay" to={url} aria-label={product.title}>
            <div className="product-card-overlay-content">
              <div className="product-card-interactions">
                {product.quickshop && (
                  <button type="button" className="product-card-interaction product-card-interaction-quickshop" onClick={quickshop}>
                    Quickshop
                  </button>
                )}
                <button
                  type="button"
                  className={`product-card-interaction product-card-interaction-addtocart ${state === 'loading' ? 'addtocart-button-loading' : ''}`}
                  onClick={addToCart}
                >
                  <span className="product-card-interaction-addtocart-available">{hasVariants ? 'Choose options' : 'Add to cart'}</span>
                  <span className="product-card-interaction-addtocart-error">Unavailable</span>
                  <div className="product-card-interaction-addtocart-spinner">
                    <Icon name="spinner" />
                  </div>
                </button>
              </div>
            </div>
          </Link>
          <div className="badges-wrapper">
            {product.badges?.map((b) => (
              <span key={b.cls} className={`badge ${b.cls}`}>
                {b.label}
              </span>
            ))}
          </div>
        </figure>
        <div className="product-card-footer">
          <Details product={product} url={url} />
        </div>
        <div className="product-card-footer-mobile">
          <Details product={product} url={url} />
        </div>
      </div>
    </li>
  );
}
