import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { api } from "../api/client";

export default function CartPage() {
  const [cart, setCart] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    api.getCart()
      .then((response) => setCart(response.data.cart))
      .catch((error) => setMessage(error.message));
  }, []);

  return (
    <section className="simple-page">
      <div className="simple-panel">
        <ShoppingBag size={28} />
        <h1>Cart</h1>
        {message ? <p className="notice">{message}</p> : null}
        {cart?.items?.length ? (
          <div className="cart-list">
            {cart.items.map((item) => (
              <div className="cart-row" key={item.id}>
                <span>{item.productName}</span>
                <strong>{item.quantity}</strong>
              </div>
            ))}
          </div>
        ) : (
          <p className="muted">Login and add products to start checkout testing.</p>
        )}
        <Link className="button-link" to="/">Continue shopping</Link>
      </div>
    </section>
  );
}
