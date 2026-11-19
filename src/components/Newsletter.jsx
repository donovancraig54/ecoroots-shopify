import { useState } from 'react';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);

  return (
    <div id="shopify-section-1547162103029" className="shopify-section pxs-newsletter-section">
      <section className="pxs-newsletter pxs-newsletter-desktop-alignment-left pxs-newsletter-mobile-alignment-top">
        <figure className="pxs-newsletter-figure">
          <img
            src="/assets/ecoroots.us/cdn/shop/files/ECoRoots_seen_in_17_500x125_bd6c6fcc-c910-401a-9eeb-b96ff344c5cc_500x125.avif"
            alt=""
            loading="lazy"
            className="pxs-newsletter-image"
          />
        </figure>
        <div className="pxs-newsletter-content">
          <div className="pxs-newsletter-header">
            <h2 className="pxs-newsletter-heading">Newsletter</h2>
            <div className="pxs-newsletter-text">
              <p>Join thousands of happy customers and get the latest on sales, new releases, eco-friendly tips and more.</p>
            </div>
          </div>
          <div className="pxs-newsletter-form">
            {done ? (
              <p className="pxs-newsletter-text">Thanks for subscribing!</p>
            ) : (
              <form
                className="contact-form"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (email) setDone(true);
                }}
              >
                <div className="pxs-newsletter-form-fields">
                  <div className="pxs-newsletter-form-field">
                    <label className="pxs-newsletter-form-label" htmlFor="pxs-newsletter-form-email">
                      Email address
                    </label>
                    <input
                      className="pxs-newsletter-form-input"
                      id="pxs-newsletter-form-email"
                      type="email"
                      required
                      placeholder="Email address"
                      aria-label="Email address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                  <div className="pxs-newsletter-form-field">
                    <button className="pxs-newsletter-form-button" type="submit">
                      Subscribe
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
