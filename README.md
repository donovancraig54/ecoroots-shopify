# EcoRoots Shopify Frontend Clone

A responsive React frontend for the live EcoRoots storefront at [ecoroots.us](https://ecoroots.us/).

This project is working implementation of the EcoRoots shopping experience. It recreates the original Shopify theme structure and visual presentation, with React components and modern frontend interactions replacing the original Shopify/Liquid and jQuery behaviour.

> **Frontend prototype:** This project does not process payments, create orders, authenticate customers, or submit newsletter subscriptions to a live backend.

## Features

- Responsive desktop and mobile navigation
- Announcement bar and promotional header
- Auto-playing homepage hero slideshow
- Shopify-style collection and product grids
- Desktop mega-menu and mobile slide-out menu
- Live product search
- Shopping cart drawer with quantity controls and local storage persistence
- Quick add-to-cart controls
- Product galleries and variant selection
- Quantity selectors and product details
- FAQ accordions
- Newsletter form UI
- Responsive banners, image blocks, and footer
- Product and collection routes

## Pages and Routes

| Route | Description |
| --- | --- |
| `/` | Storefront homepage |
| `/collections/:handle` | Product collection pages |
| `/collections/shop-all` | All mirrored products |
| `/collections/bath-beauty` | Bath and beauty products |
| `/collections/home-kitchen` | Home and kitchen products |
| `/collections/zero-waste-shampoo-conditioner-bars` | Shampoo and conditioner bars |
| `/products/:handle` | Individual product page |

## Tech Stack

- **React 18**
- **Vite 5**
- **React Router 6**
- **Vanilla CSS**
- **JavaScript / ES modules**
- **Local JSON data**
- **localStorage** for cart persistence

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

The local development URL is configured for `http://localhost:5180`.

### Production Build

```bash
npm run build
```

Preview the compiled storefront with:

```bash
npm run preview
```

Or serve the built `dist` directory with the included static server:

```bash
npm run serve
```

The static server runs at `http://127.0.0.1:8081`.

## Project Structure

```text
.
├── public/assets/       # Downloaded storefront images and media
├── src/
│   ├── components/      # Header, footer, product cards, cart, and shared UI
│   ├── context/         # Shopping cart state and persistence
│   ├── data/            # Extracted homepage, collection, and product data
│   ├── lib/             # Shared frontend utilities
│   ├── pages/           # Homepage, collection, and product views
│   └── styles/          # Atlantic theme and application styles
├── tools/
│   ├── mirror.mjs       # Downloads live storefront pages and assets
│   ├── extract.mjs      # Converts mirrored HTML into React data and styles
│   └── serve.mjs        # Small production static server
├── dist/                # Generated production build
└── vite.config.js       # Vite configuration
```

## Updating Mirrored Storefront Data

The project includes utilities for downloading public storefront pages and extracting their content:

```bash
npm run mirror -- / /collections/shop-all /products/<handle>
npm run extract
```

The mirror utility stores downloaded files in `site/`, while the extraction utility creates frontend data and copies theme assets into the React application.

Pages that have not been mirrored may have only basic card data, such as title, price, and images. Mirroring individual product pages and rerunning extraction adds their detailed descriptions, options, features, and FAQ content.

## Built-in Interactions

- Slideshow navigation, dots, and autoplay
- Dropdown and mobile navigation menus
- Product search overlay/results
- Cart drawer open and close behaviour
- Cart item quantity updates and removal
- Local cart persistence
- Quick add-to-cart from product cards
- Variant and quantity controls
- Accordion product sections
- Newsletter form validation UI

## Limitations

- No Shopify checkout or payment processing
- No live inventory or store inventory updates
- No customer login or account system
- No live newsletter or marketing integration
- Cart data is stored only in the user's browser
- Product information is based on the currently mirrored public content

## Disclaimer

EcoRoots and its trademarks belong to their respective owners. This repository is an unofficial frontend implementation intended for learning, testing, and development. It is not an official EcoRoots product or an affiliated Shopify theme package.

## License

Add the appropriate project license before publishing or distributing this repository. Store assets and brand materials may have independent rights and should not be reused without permission.
