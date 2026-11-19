import { useEffect, useState } from 'react';
import Icon from './Icon.jsx';
import SmartLink from './SmartLink.jsx';

const FONT_TITLE = "'ITC Caslon No 224',sans-serif";
const FONT_BODY = "'Montserrat',sans-serif";

/**
 * Atlantic theme slideshow. Slides move via the theme's `.slideshow--position-N` classes;
 * React only tracks the active index and autoplay.
 * slide = { image, srcset?, href, ariaLabel, title, tagline, cta, align, titleColor, taglineColor, taglineWeight, button:{color,bg,padding} }
 */
export default function Slideshow({ id, slides, autoplay = 0, fullWidth = false }) {
  const [active, setActive] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const count = slides.length;

  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 50); // triggers the text fade-in like the theme
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!autoplay || count < 2) return;
    const t = setInterval(() => setActive((a) => (a + 1) % count), autoplay);
    return () => clearInterval(t);
  }, [autoplay, count, active]);

  const go = (i) => setActive((i + count) % count);
  const first = slides[0];

  return (
    <div id={`shopify-section-${id}`} className="shopify-section">
      <section
        className={[
          'home-section slideshow clearfix slideshow--transition-slide',
          'slideshow--desktop-height-natural slideshow--mobile-height-natural',
          fullWidth ? '' : 'content-area',
          loaded ? 'slideshow--loaded' : '',
        ].join(' ')}
        data-full-width={fullWidth}
      >
        {count > 1 && (
          <>
            <span className="prev" onClick={() => go(active - 1)} role="button" aria-label="Previous slide">
              <Icon name="arrow-thin-left" />
            </span>
            <span className="next" onClick={() => go(active + 1)} role="button" aria-label="Next slide">
              <Icon name="arrow-thin-right" />
            </span>
          </>
        )}
        <ul className="jump-to-slide">
          {count > 1 &&
            slides.map((_, i) => <li key={i} className={i === active ? 'active' : ''} onClick={() => go(i)} />)}
        </ul>
        <div className="hero-flex">
          {/* invisible sizing image – gives the slideshow its natural height */}
          <img src={first.image} srcSet={first.srcset} sizes="100vw" alt="" className="placeholder-image" />
          <div className={`slideshow--viewport ${active ? `slideshow--position-${active}` : ''}`}>
            {slides.map((s, i) => (
              <div key={i} className={`slide ${i === active ? 'active' : ''}`}>
                <div className="image-wrap">
                  <SmartLink href={s.href}>
                    <img src={s.image} srcSet={s.srcset} sizes="100vw" alt={s.title} loading={i === 0 ? 'eager' : 'lazy'} />
                  </SmartLink>
                </div>
                <div className="content-outer-wrap">
                  <SmartLink className="mobile-link" href={s.href} aria-label={s.ariaLabel} />
                  <div className="content-inner-wrap">
                    <div className={`content ${s.align || 'left'} top`}>
                      <h2 className="title" style={{ color: s.titleColor || '#000', fontFamily: FONT_TITLE, fontWeight: 700 }}>
                        {s.title}
                      </h2>
                      <h3
                        className="tagline"
                        style={{ color: s.taglineColor || '#000', fontFamily: FONT_BODY, fontWeight: s.taglineWeight || 500 }}
                      >
                        {s.tagline}
                      </h3>
                      <div className="call-to-action-wrap">
                        <span
                          className="call-to-action"
                          style={{
                            color: s.button.color,
                            fontFamily: FONT_BODY,
                            fontWeight: 700,
                            background: s.button.bg,
                            borderColor: s.button.bg,
                            padding: s.button.padding,
                          }}
                        >
                          {s.cta}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <SmartLink className="slideshow-link" href={s.href} aria-label={s.ariaLabel} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
