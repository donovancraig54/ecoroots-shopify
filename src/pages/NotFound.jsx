import { Link } from 'react-router-dom';
import useBodyClass from '../lib/useBodyClass.js';

export default function NotFound() {
  useBodyClass('404');
  return (
    <main className="content content-area" style={{ textAlign: 'center', padding: '80px 0' }}>
      <div className="page-title">
        <h1 className="label">Page Not Found</h1>
      </div>
      <p style={{ marginTop: 20 }}>
        This page isn&apos;t part of the frontend clone yet. <Link to="/collections/shop-all">Continue shopping</Link>
      </p>
    </main>
  );
}
