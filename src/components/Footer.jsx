import { Link } from 'react-router-dom';
import { paymentIcons } from './Icon.jsx';
import { SocialLinks } from './Header.jsx';
import { footerNav } from '../data/navigation.js';

export default function Footer() {
  return (
    <div id="shopify-section-static-footer" className="shopify-section">
      <div data-section-id="static-footer" data-section-type="static-footer">
        <footer className="main-footer content-area" id="main-footer">
          <ul className="connect clearfix module-count-1">
            <li className="social">
              <h2 className="title">Follow us out there</h2>
              <SocialLinks />
            </li>
          </ul>
          <div className="sub-footer">
            <nav className="footer-nav">
              <ul>
                {footerNav.map((label) => (
                  <li key={label}>
                    <a href="#" onClick={(e) => e.preventDefault()}>
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
            <p>
              <Link to="/">EcoRoots</Link> {new Date().getFullYear()}.
            </p>
            <ul className="payment-options">
              {paymentIcons.map((svg, i) => (
                <li key={i} className="payment-icon" dangerouslySetInnerHTML={{ __html: svg }} />
              ))}
            </ul>
          </div>
        </footer>
      </div>
    </div>
  );
}
