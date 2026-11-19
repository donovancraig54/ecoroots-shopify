export default function AnnouncementBar() {
  const text = 'Free Shipping on US orders over $50!';
  return (
    <div id="shopify-section-pxs-announcement-bar" className="shopify-section">
      <a
        role="region"
        className="pxs-announcement-bar"
        aria-label="Promotional Announcement"
        style={{ color: '#000000', backgroundColor: '#8cc63f' }}
      >
        <span className="pxs-announcement-bar-text-mobile">{text}</span>
        <span className="pxs-announcement-bar-text-desktop">{text}</span>
      </a>
    </div>
  );
}
