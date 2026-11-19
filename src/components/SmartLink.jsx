import { Link } from 'react-router-dom';

/** Router <Link> for internal paths, plain <a> for "#" and external URLs. */
export default function SmartLink({ href = '#', children, ...rest }) {
  if (href.startsWith('/')) {
    return (
      <Link to={href} {...rest}>
        {children}
      </Link>
    );
  }
  const external = /^https?:/.test(href);
  return (
    <a
      href={href}
      {...(external ? { target: '_blank', rel: 'noreferrer' } : {})}
      {...rest}
      onClick={href === '#' ? (e) => e.preventDefault() : rest.onClick}
    >
      {children}
    </a>
  );
}
