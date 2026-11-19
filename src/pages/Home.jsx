import { Link } from 'react-router-dom';
import Slideshow from '../components/Slideshow.jsx';
import FeaturedCollection from '../components/FeaturedCollection.jsx';
import PictureBlock from '../components/PictureBlock.jsx';
import Newsletter from '../components/Newsletter.jsx';
import useBodyClass from '../lib/useBodyClass.js';
import { home } from '../lib/catalog.js';

const F = '/assets/ecoroots.us/cdn/shop/files/';

// Shopify's responsive widths, saved by the mirror as <name>__<hash>.<ext>
const WIDTHS = [
  ['0eae6d2a', 1430], ['b8859861', 1300], ['75e41ba6', 1200], ['a6806d39', 1100], ['97c148ea', 1000],
  ['775f9c85', 800], ['4736ab6e', 700], ['bd6740a8', 600], ['b269a458', 500], ['d042d206', 400], ['6b656139', 300],
];
const responsive = (base, ext) => ({
  image: `${F}${base}__0eae6d2a.${ext}`,
  srcset: WIDTHS.map(([h, w]) => `${F}${base}__${h}.${ext} ${w}w`).join(', '),
});

const GREEN = '#8cc63f';

const heroSlides = [
  {
    ...responsive('eco_friendly_products_valentines_display_pink_backdrop_gifts_soap_shampoo_lip_balm_deodorant_jpg', 'png'),
    href: '/collections/shop-all',
    ariaLabel: 'Shop All',
    title: 'Daily Essentials',
    tagline: 'Reduce waste in your everyday routine!',
    taglineWeight: 700,
    cta: 'SHOP NOW',
    align: 'left',
    button: { color: '#ffffff', bg: '#000000', padding: '30px 40px' },
  },
  {
    ...responsive('black_33_39_1430x640_crop_center_97ad7e4f-d8f8-441c-b739-d283863cae89', 'webp'),
    href: '#',
    ariaLabel: 'Best shampoo & conditioner bars bundle',
    title: 'Bundle Up & Save 20%',
    tagline: 'Best shampoo & conditioner bars that actually work!',
    cta: 'Build My Bundle',
    align: 'center',
    button: { color: '#000000', bg: GREEN, padding: '25px 40px' },
  },
  {
    image: `${F}DSC_8947_1430x640_crop_center_55a70e3d-7d6b-440a-9da2-bff5e2420418_1430x640_crop_center.webp`,
    href: '#',
    ariaLabel: 'Organic face and body soaps bundle',
    title: 'Bundle Up & Save 20%',
    tagline: 'Clean your skin naturally with organic face & body soaps!',
    cta: 'BUILD MY BUNDLE',
    align: 'left',
    button: { color: '#000000', bg: GREEN, padding: '20px 25px' },
  },
  {
    image: `${F}minikit_1430x640_crop_center_985917ef-951e-4b32-940b-ee5380a66993_1430x640_crop_center.webp`,
    href: '/products/mini-kit-complete-skincare',
    ariaLabel: 'Mini kit complete skincare',
    title: 'Mini Kit Complete Skincare',
    tagline: 'Build a clean & low-waste skincare routine with our mini kit complete skincare. No full-size commitment!',
    cta: 'GET YOUR MINI KIT',
    align: 'left',
    button: { color: '#000000', bg: GREEN, padding: '20px 40px' },
  },
  {
    image: `${F}black_33_35_1430x640_crop_center_d2a57eb1-87a8-4e19-ae4a-57708b55d277_1430x640_crop_center.webp`,
    href: '#',
    ariaLabel: 'Laundry Detergent Bundle Duo',
    title: 'Bundle & Save 20%',
    tagline: 'Less bulk, more clean—laundry done right.',
    cta: 'SHOP The Bundle Duo',
    align: 'center',
    button: { color: '#000000', bg: GREEN, padding: '20px 40px' },
  },
];

const deodorantBanner = [
  {
    ...responsive('black_33_40', 'webp'),
    href: '/products/deodorant-cream',
    ariaLabel: 'Shop Natural Deodorant now',
    title: 'Natural Deodorant',
    titleColor: '#ffffff',
    tagline: "With hundreds of five-star reviews, there's a reason this is our best seller! Baking Soda-Free & Aluminum-Free!",
    taglineColor: '#ffffff',
    cta: 'SHOP NOW',
    align: 'center',
    button: { color: '#000000', bg: GREEN, padding: '15px 30px' },
  },
];

export default function Home() {
  useBodyClass('index');

  return (
    <main>
      <Slideshow id="dynamic-slideshow" slides={heroSlides} autoplay={9000} />

      <FeaturedCollection id="dynamic-collection" title="Our Most Loved" handles={home.mostLoved} rowOf={4} />

      <Slideshow id="e6d582bb-b593-4e9a-8a96-9cc34ac72032" slides={deodorantBanner} fullWidth />

      <PictureBlock
        id="1551854320063"
        side="left"
        href="/collections/bath-beauty"
        image={`${F}Holiday_gift_guide_940_x_788_px_1000_x_1000_px_5_1000x1000.jpg`}
        heading="Skincare Essentials"
      >
        <p>Take care of your skin naturally with our Small Batch Beauty Essentials.&nbsp;</p>
        <p>Low-Waste Package &amp; Vegan Ingredients!&nbsp;</p>
        <p>
          <Link to="/collections/bath-beauty" title="Zero-Waste Products for Skincare & Beauty">
            <strong>Elevate your skincare routine!</strong>
          </Link>
        </p>
      </PictureBlock>

      <PictureBlock
        id="1561424271145"
        side="right"
        noMargin
        href="/collections/zero-waste-shampoo-conditioner-bars"
        image={`${F}shampoo_and_conditioner_bars_holiday_gifts_jpg_1000x1000.jpg`}
        heading="Vegan & Plastic-Free"
      >
        <p>
          Our{' '}
          <Link to="/collections/zero-waste-shampoo-conditioner-bars" title="Buy more save more">
            <strong>Zero-Waste Shampoo &amp; Conditioner Bars </strong>
          </Link>
          are packed with the best ingredients, all for your hair and scalp benefit.
        </p>
        <p>Oh and they&apos;re 100% plastic-free &amp; travel friendly, too!</p>
        <p>
          <Link to="/collections/zero-waste-shampoo-conditioner-bars" title="Buy more save more">
            <strong>Build Your Bundle - Save 20%</strong>
          </Link>
        </p>
      </PictureBlock>

      <PictureBlock
        id="1558138162421"
        side="left"
        noMargin
        href="/collections/home-kitchen"
        image={`${F}cleaning_essential_dish_soap_dish_brush_and_bamboo_soap_dish_jpg_1024x683.webp`}
        heading="Cleaning Supplies"
      >
        <p>
          <Link to="/collections/home-kitchen" title="Home & Kitchen">
            <strong>Essential Products</strong>
          </Link>
          <strong> </strong>for your <strong>Home &amp; Kitchen</strong>
        </p>
        <p>
          <Link to="/collections/home-kitchen" title="Zero Waste Cleaning Kit">
            <strong>Shop the Cleaning Kit &amp; Save 10%</strong>
          </Link>
        </p>
      </PictureBlock>

      <PictureBlock
        id="1543439643693"
        side="right"
        noMargin
        href="/collections/shop-all"
        image={`${F}three_deodorant_in_hands_blue_background_photo_jpg_1024x683.webp`}
        heading="Everyday Essentials, Made for You"
      >
        <p>
          The little things in your routine matter. That’s why we create products designed to bring comfort, quality, and a touch of care to
          your everyday life. From the moment you wake up to winding down at night, our essentials are here to make your daily rituals feel
          effortless and enjoyable.
        </p>
        <p>
          <Link to="/collections/shop-all">
            <strong>Because the best routines start with the right essentials</strong>
          </Link>
          .
        </p>
      </PictureBlock>

      <FeaturedCollection id="1543265782218" title="Shop more" handles={home.shopMore} rowOf={2} />

      <PictureBlock
        id="1551851836374"
        side="right"
        href="/collections/shop-all"
        image={`${F}natural_lip_balm_set_of_2_box_holiday_gift_stocking_stuffers_jpg_1000x1000.jpg`}
        heading="Thoughtfully Packed"
      >
        <p>♻</p>
        <p>
          <strong>We always ship plastic-free with compostable | recyclable materials.</strong>
        </p>
        <p>
          <Link to="/collections/bath-beauty" title="Bath & Beauty">
            <strong>Shop Now</strong>
          </Link>
        </p>
      </PictureBlock>

      <Newsletter />
    </main>
  );
}
