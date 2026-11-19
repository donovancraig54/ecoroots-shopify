import iconData from '../data/icons.json';

const camel = (k) => (/^(data|aria)-/.test(k) || k === 'xmlns' ? k : k.replace(/[-:]([a-z])/g, (_, c) => c.toUpperCase()));

/** Renders one of the theme's SVG icons with the exact markup/classes the theme CSS expects. */
export default function Icon({ name, className = '' }) {
  const icon = iconData.icons[name];
  if (!icon) return null;
  const props = {};
  for (const [k, v] of Object.entries(icon.attrs)) props[camel(k)] = v;
  return (
    <svg
      {...props}
      className={`svg-icon icon-${name} ${className}`}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: icon.inner }}
    />
  );
}

export const paymentIcons = iconData.paymentIcons;
