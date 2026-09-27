import { UserRound } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function AccountPage() {
  const { user } = useAuth();

  return (
    <section className="simple-page">
      <div className="simple-panel">
        <UserRound size={28} />
        <h1>Account</h1>
        {user ? (
          <>
            <p><strong>{user.firstName} {user.lastName}</strong></p>
            <p className="muted">{user.email}</p>
          </>
        ) : (
          <>
            <p className="muted">Login to view profile, addresses, wishlist, and orders.</p>
            <Link className="button-link" to="/login">Login</Link>
          </>
        )}
      </div>
    </section>
  );
}
