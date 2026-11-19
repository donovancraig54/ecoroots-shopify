import SmartLink from './SmartLink.jsx';

/** Image + text "picture block" section. `children` is the rich-text body. */
export default function PictureBlock({ id, side = 'left', noMargin = false, image, alt, href = '#', heading, children }) {
  return (
    <div id={`shopify-section-${id}`} className="shopify-section">
      <section
        className={[
          'home-section clearfix picture-block',
          `picture-block-${side}`,
          'picture-block--desktop-height-natural picture-block--mobile-height-natural',
          noMargin ? 'picture-block-no-margin' : '',
        ].join(' ')}
      >
        <div className="picture-block-image">
          <SmartLink href={href}>
            <img src={image} alt={alt || heading} loading="lazy" />
          </SmartLink>
        </div>
        <div className="picture-block-wrapper">
          <div className="centering-wrapper">
            <div className="picture-block-content">
              <h2 className="picture-block-heading">{heading}</h2>
              <div className="picture-block-body">{children}</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
