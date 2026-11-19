import { Fragment, useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from './Icon.jsx';
import SmartLink from './SmartLink.jsx';
import { useCart } from '../context/CartContext.jsx';
import { bundles, mainNav, social, LOGO } from '../data/navigation.js';
import { searchProducts } from '../lib/catalog.js';

const Label = ({ parts }) =>
  parts.map((p, i) =>
    typeof p === 'string' ? (
      <Fragment key={i}>{p}</Fragment>
    ) : (
      <span key={i} style={{ color: '#72a233' }}>
        {p.save}
      </span>
    ),
  );

const Desc = ({ lines }) =>
  lines.map((l, i) => (
    <Fragment key={i}>
      {i > 0 && <br />}
      {` ${l} `}
    </Fragment>
  ));

export function SocialLinks() {
  return (
    <div className="social-links">
      {social.map((s) => (
        <a key={s.name} href={s.href} className={`social-link ${s.name}`} target="_blank" rel="noreferrer" aria-label={s.name}>
          <Icon name={s.name} />
        </a>
      ))}
    </div>
  );
}

function LiveSearch() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const input = useRef(null);
  const results = searchProducts(q);
  const location = useLocation();

  useEffect(() => setOpen(false), [location.pathname]);
  useEffect(() => {
    if (open) input.current?.focus();
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const cls = [
    'live-search',
    open ? 'live-search-visible' : 'live-search-hidden',
    q.trim() ? '' : 'live-search-results-hidden',
    'live-search-results-footer-hidden',
    'live-search-alignment-left',
  ].join(' ');

  return (
    <div className={cls}>
      <button id="ls-button-search" className="ls-button-search" type="button" aria-label="Open search" onClick={() => setOpen(true)}>
        <Icon name="search" />
      </button>
      <label className="ls-label" htmlFor="ls-button-search" onClick={() => setOpen(true)}>
        Search
      </label>
      <div className="ls-dimmer" onClick={() => setOpen(false)} />
      <form className="ls-form" autoComplete="off" onSubmit={(e) => e.preventDefault()}>
        <input
          ref={input}
          className="ls-input"
          name="q"
          type="text"
          placeholder="What are you looking for?"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className="ls-form-button-search" type="submit" aria-label="Search">
          <Icon name="search" />
        </button>
        <button className="ls-form-button-close" type="button" aria-label="Close search" onClick={() => setOpen(false)}>
          <Icon name="close" />
        </button>
      </form>
      <div className="ls-results">
        <section className="ls-results-products">
          <header className="lsr-products-header">
            <h2 className="lsrp-header-title">Products</h2>
          </header>
          <div className="lsr-products-content">
            {results.length === 0 && <p className="lsrp-results-empty">No products found.</p>}
            {results.map((p) => (
              <div className="lsrp-content" key={p.handle}>
                <Link className="lsrpc-url" to={`/products/${p.handle}`} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <figure className="lsrpc-figure" style={{ width: 60, flexShrink: 0, margin: 0 }}>
                    <img src={p.images?.[0]} alt={p.title} style={{ width: '100%' }} />
                  </figure>
                  <div className="lsrpc-content">
                    <div className="lsrpcc-title">{p.title}</div>
                    <div className="lsrpcc-price">{p.price}</div>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function MobileNav({ open, onClose }) {
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    if (!open) setExpanded(false);
  }, [open]);

  return (
    <section className={`mobile-dropdown ${open ? 'active' : ''}`} id="main-header--mobile-nav">
      <div className="mobile-dropdown--wrapper">
        <div className="mobile-dropdown--content">
          <div className="mobile-dropdown--tools">
            <div className="mobile-dropdown--close" onClick={onClose}>
              <Icon name="close" />
            </div>
            <div className="mobile-dropdown--back" onClick={() => setExpanded(false)} style={{ display: expanded ? 'block' : 'none' }}>
              <Icon name="arrow-thin-left" />
            </div>
          </div>
          <ul className="list primary show-social">
            <li className={`list-item first dropdown ${expanded ? 'expanded' : ''}`} aria-expanded={expanded}>
              <a onClick={() => setExpanded(true)}>
                <span> Bundles &amp; Kits</span>
                <span className="icon">
                  <span className="plus">
                    <Icon name="arrow-thin-right" />
                  </span>
                </span>
              </a>
              <ul className="list secondary" style={{ display: expanded ? 'block' : undefined }}>
                {bundles.map((b, i) => (
                  <li className="list-item dropdown" key={i}>
                    <SmartLink href={b.href} onClick={onClose}>
                      <img loading="lazy" src={b.img} alt={b.alt} />
                      <p>
                        <span className="label" style={{ display: 'block' }}>
                          <Label parts={b.label} />
                        </span>
                        <span className="mobile_menu_descriptions">
                          <Desc lines={b.desc} />
                        </span>
                      </p>
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </li>
            {mainNav.map((n, i) => (
              <li key={n.label} className={`list-item ${i === mainNav.length - 1 ? 'last' : ''}`}>
                <SmartLink href={n.href} onClick={onClose}>
                  {n.label}
                </SmartLink>
              </li>
            ))}
          </ul>
        </div>
        <SocialLinks />
      </div>
    </section>
  );
}

export default function Header() {
  const cart = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  useEffect(() => setMobileOpen(false), [location.pathname]);

  return (
    <div id="shopify-section-static-header" className="shopify-section section-header">
      <header className="main-header-wrap main-header--expanded main-header--centered" data-header-layout="expanded">
        <section className="main-header">
          <div className="action-links clearfix">
            <div className="main-header--tools tools clearfix">
              <div className="main-header--tools-group">
                <div className="main-header--tools-left">
                  <div className="tool-container">
                    <a
                      className="menu"
                      href="#"
                      aria-haspopup="true"
                      aria-controls="main-header--mobile-nav"
                      aria-expanded={mobileOpen}
                      aria-label="Main menu"
                      onClick={(e) => {
                        e.preventDefault();
                        setMobileOpen(true);
                      }}
                    >
                      <Icon name="menu" />
                    </a>
                    <LiveSearch />
                  </div>
                </div>
                <div className="main-header--tools-center">
                  <h1 className="store-title store-logo">
                    <Link to="/" style={{ maxWidth: 150 }}>
                      <img
                        src={LOGO}
                        alt="Offering the best plastic free alternatives to everyday products! All our products are shipped in plastic free packaging!"
                        style={{ height: 75 }}
                      />
                    </Link>
                  </h1>
                </div>
                <div className="main-header--tools-right">
                  <div className="tool-container">
                    <SocialLinks />
                    <a className="account-options" href="#" onClick={(e) => e.preventDefault()}>
                      <Icon name="person" />
                      <label className="main-header--tools-label">Login</label>
                    </a>
                    <div className="mini-cart-wrap" role="button" aria-label="Open cart" onClick={() => cart.setOpen(true)}>
                      <span className="item-count">{cart.count || ''}</span>
                      <Icon name="cart" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <nav aria-label="Main Navigation" className="full">
              <ul className="main-header--nav-links">
                <li className="nav-item first dropdown" aria-haspopup="true">
                  <span className="border" />
                  <a className="label">
                    Bundles &amp; Kits
                    <Icon name="down-arrow" />
                  </a>
                  <div className="dropdown-wrap primary">
                    <ul className="special-link-ul">
                      {bundles.map((b, i) => (
                        <li
                          key={i}
                          className={`dropdown-item ${i === 0 ? 'first' : ''} ${i === bundles.length - 1 ? 'last' : ''} dropdown ${i === 0 ? 'special_link_size' : ''}`}
                        >
                          <SmartLink href={b.href} className="special_menu_link">
                            <img loading="lazy" src={b.img} alt={b.alt} />
                            <p>
                              <span className="label" style={{ display: 'block' }}>
                                <Label parts={b.label} />
                              </span>
                              <span className="desktop-menu-description">
                                <Desc lines={b.desc} />
                              </span>
                            </p>
                          </SmartLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                </li>
                {mainNav.map((n, i) => (
                  <li key={n.label} className={`nav-item ${i === mainNav.length - 1 ? 'last' : ''}`}>
                    <SmartLink className="label" href={n.href}>
                      {n.label}
                    </SmartLink>
                  </li>
                ))}
              </ul>
            </nav>

            <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
          </div>
        </section>
      </header>
    </div>
  );
}
