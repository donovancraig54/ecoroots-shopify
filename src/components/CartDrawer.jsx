import { Link } from 'react-router-dom';
import Icon from './Icon.jsx';
import { useCart } from '../context/CartContext.jsx';
import { money } from '../lib/catalog.js';

export default function CartDrawer() {
  const cart = useCart();
  const close = () => cart.setOpen(false);

  return (
    <div
      className={`cart-mini ${cart.open ? 'cart-mini-open' : ''}`}
      role="dialog"
      aria-label="Shopping Cart"
      aria-hidden={!cart.open}
      onClick={(e) => e.target === e.currentTarget && close()}
    >
      <div className="cart-mini-sidebar">
        <div className="cart-mini-content cart-mini-items" style={{ padding: '0 25px', flexGrow: 1 }}>
          <h2 className="cart-mini-header">
            Shopping Cart
            <button type="button" className="cart-mini-header-close" aria-label="Close cart" onClick={close}>
              <Icon name="close" />
            </button>
          </h2>

          {cart.items.length === 0 && <p className="cart-mini-empty">Your cart is currently empty.</p>}

          {cart.items.map((item) => (
            <div className="cart-mini-item" key={item.variantId}>
              <div className="cart-mini-item-row">
                <div className="cart-mini-item-column cart-mini-item-column-image">
                  <Link className="cart-mini-item-image" to={`/products/${item.handle}`} onClick={close} style={{ width: 90 }}>
                    <img src={item.image} alt={item.title} />
                  </Link>
                </div>
                <div className="cart-mini-item-column cart-mini-item-column-details">
                  <h3 className="cart-mini-item-title">
                    <Link to={`/products/${item.handle}`} onClick={close}>
                      {item.title}
                    </Link>
                  </h3>
                  {item.variantTitle && item.variantTitle !== 'Default Title' && (
                    <p className="cart-mini-item-variant">{item.variantTitle}</p>
                  )}
                  <p className="cart-mini-item-price">
                    <span className="money">{money(item.price * item.qty)}</span>
                  </p>
                  <div className="cart-mini-item-quantity">
                    <div className="cart-mini-item-quantity-box">
                      <span className="btnqty cart_qtyminus" onClick={() => cart.setQty(item.variantId, item.qty - 1)}>
                        -
                      </span>
                      <input
                        className="cart-quantity-input"
                        type="number"
                        min="0"
                        aria-label="Quantity"
                        value={item.qty}
                        onChange={(e) => cart.setQty(item.variantId, Math.max(0, parseInt(e.target.value, 10) || 0))}
                      />
                      <span className="btnqty cart_qtyplus" onClick={() => cart.setQty(item.variantId, item.qty + 1)}>
                        +
                      </span>
                    </div>
                  </div>
                </div>
                <div className="cart-mini-item-column cart-mini-item-column-remove">
                  <span className="cart-mini-item-remove" role="button" aria-label="Remove" onClick={() => cart.remove(item.variantId)}>
                    ✕
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {cart.items.length > 0 && (
          <div className="side_cart_footer_container" style={{ padding: '0 25px 25px' }}>
            <div className="cart-mini-footer">
              <div className="cart-mini-subtotal">
                <span className="cart-mini-subtotal-heading">Subtotal</span>
                <span className="cart-mini-subtotal-value">
                  <span className="money">{money(cart.subtotal)}</span>
                </span>
              </div>
              <div className="cart-mini-actions">
                <button type="button" className="action-button cart-mini-actions-checkout" onClick={() => alert('Checkout is not part of this frontend demo.')}>
                  Checkout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
