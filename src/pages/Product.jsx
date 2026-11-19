import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Icon from '../components/Icon.jsx';
import FeaturedCollection from '../components/FeaturedCollection.jsx';
import useBodyClass from '../lib/useBodyClass.js';
import { useCart } from '../context/CartContext.jsx';
import { getProduct, money, home } from '../lib/catalog.js';
import NotFound from './NotFound.jsx';

function FaqItem({ heading, html }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="faq-item">
      <div className="faq-header" onClick={() => setOpen((o) => !o)} style={{ cursor: 'pointer' }}>
        <h2 className="faq-heading">{heading}</h2>
        <span className="faq-toggle">{open ? '−' : '+'}</span>
      </div>
      <div className={`faq-content ${open ? 'active' : ''}`} dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

export default function Product() {
  const { handle } = useParams();
  useBodyClass('product');
  const product = getProduct(handle);
  const cart = useCart();
  const [imageIndex, setImageIndex] = useState(0);
  const [variantIndex, setVariantIndex] = useState(0);
  const [qty, setQty] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    setImageIndex(0);
    setVariantIndex(0);
    setQty(1);
  }, [handle]);

  if (!product) return <NotFound />;
  const d = product.detail;
  const variant = d.variants[variantIndex] || d.variants[0];
  const gallery = d.gallery.length ? d.gallery : [{ main: product.images?.[0], thumb: product.images?.[0] }];
  const hasVariants = d.variants.length > 1;

  const addToCart = (e) => {
    e.preventDefault();
    if (!variant?.available) return;
    setAdding(true);
    setTimeout(() => {
      cart.add(
        {
          variantId: variant.id,
          handle: product.handle,
          title: product.title,
          variantTitle: hasVariants ? variant.title : '',
          price: variant.price,
          image: gallery[0]?.main,
        },
        qty,
      );
      setAdding(false);
    }, 350);
  };

  return (
    <>
      <div className="shopify-section featured-product">
        <div className="content content-area">
          <section className="product-area clearfix new-product-template">
            <div className="showcase product-images zoom-enabled left-main-image">
              <div className="product-images-desktop">
                <div className="container">
                  <div className="product-main-image wrap">
                    <img src={gallery[imageIndex]?.main} alt={product.title} />
                  </div>
                </div>
                {gallery.length > 1 && (
                  <div className="pager left-main-image">
                    <div className="inner">
                      {gallery.map((g, i) => (
                        <div
                          key={g.main + i}
                          className={`wrap thumb ${i === 0 ? 'first' : ''} ${i === gallery.length - 1 ? 'last' : ''} ${i === imageIndex ? 'active' : ''}`}
                          onClick={() => setImageIndex(i)}
                        >
                          <img src={g.thumb} alt={product.title} loading="lazy" />
                          <span className="overlay" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="product-images-mobile">
                {gallery.map((g, i) => (
                  <div className="product-main-image-mobile" key={g.main + i}>
                    <div>
                      <img src={g.main} alt={product.title} loading="lazy" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="product-details-wrapper">
              <div className="product-details product-details-alignment-center border">
                <div className="header">
                  <h1 className="title">{product.title}</h1>
                  {d.quote && <p className="Product-details__quote">{d.quote}</p>}
                  {product.reviews > 0 && (
                    <div className="jdgm-prev-badge eco-stars" style={{ margin: '-5px 0 8px' }}>
                      <span className="jdgm-prev-badge__stars">
                        {[0, 1, 2, 3, 4].map((i) => (
                          <span key={i} className={`eco-star ${i < Math.round(product.rating) ? 'on' : ''}`}>
                            ★
                          </span>
                        ))}
                      </span>{' '}
                      <span className="jdgm-prev-badge__text">{product.reviews} reviews</span>
                    </div>
                  )}
                </div>

                <div className="options">
                  <form className="product-form" onSubmit={addToCart}>
                    <div className="product-form-grid product-form-grid-radio">
                      {hasVariants && (
                        <div className="selector-wrapper eco-variants">
                          <label className="eco-variants-label">{d.options[0] || 'Style'}</label>
                          <div className="eco-variants-list">
                            {d.variants.map((v, i) => (
                              <button
                                type="button"
                                key={v.id}
                                className={`eco-variant ${i === variantIndex ? 'active' : ''}`}
                                disabled={!v.available}
                                onClick={() => setVariantIndex(i)}
                              >
                                {v.title}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="quantity_action_container">
                        <div className="product_quantity_container">
                          <span className="btnqty product_qtyminus icon icon-minus" onClick={() => setQty((q) => Math.max(1, q - 1))}>
                            -
                          </span>
                          <input
                            type="number"
                            className="product-quantity product-quantity-input"
                            aria-label="Quantity"
                            min="1"
                            value={qty}
                            onChange={(e) => setQty(Math.max(1, parseInt(e.target.value, 10) || 1))}
                          />
                          <span className="btnqty product_qtyplus icon icon-plus" onClick={() => setQty((q) => q + 1)}>
                            +
                          </span>
                        </div>
                        <button
                          type="submit"
                          className={`product-submit action-button submit ${adding ? 'addtocart-button-loading' : ''} ${variant?.available ? '' : 'unavailable'}`}
                        >
                          <span className="product-card-interaction-addtocart-available">
                            {variant?.available ? 'Add to cart' : 'Sold out'}
                          </span>
                          <span> - </span>
                          <p className="price sale" style={{ display: 'inline-block', margin: 0, color: '#000' }}>
                            {variant?.compareAt && (
                              <>
                                <span className="original money">{money(variant.compareAt)}</span>{' '}
                              </>
                            )}
                            <span className="money">{money(variant?.price || 0)}</span>
                          </p>
                          <div className="product-card-interaction-addtocart-spinner">
                            <Icon name="spinner" />
                          </div>
                        </button>
                      </div>
                    </div>
                  </form>
                </div>

                <div className="payment-info">
                  Pay in 4 interest-free installments for orders over <strong>$50.00</strong> with{' '}
                  <img src="/assets/cdn.shopify.com/s/files/1/0093/5618/1562/files/shoppay.png" alt="Shop Pay" className="shop-pay-icon" />{' '}
                  <a href="#" className="learn-more" onClick={(e) => e.preventDefault()}>
                    Learn more
                  </a>
                </div>

                {(d.featureIcons.length > 0 || d.featureList.length > 0) && (
                  <div className="product-features">
                    {d.featureIcons.length > 0 && (
                      <div className="icon-text">
                        {d.featureIcons.map((f) => (
                          <div className="feature-item" key={f.label}>
                            <img src={f.icon} alt="Feature image" />
                            <span>{f.label}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {d.featureList.length > 0 && (
                      <ul className="feature-list">
                        {d.featureList.map((li) => (
                          <li key={li}>{li}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}

                {d.faq.length > 0 ? (
                  <div className="faq-section">
                    <div className="faq-container">
                      {d.faq.map((f) => (
                        <FaqItem key={f.heading} {...f} />
                      ))}
                    </div>
                  </div>
                ) : (
                  d.description && <div className="description rte" dangerouslySetInnerHTML={{ __html: d.description }} />
                )}
              </div>
            </div>
          </section>
        </div>
      </div>

      <FeaturedCollection
        id="product-recommendations"
        title="You may also like"
        handles={home.mostLoved.filter((h) => h !== handle).slice(0, 4)}
        rowOf={4}
      />
    </>
  );
}
