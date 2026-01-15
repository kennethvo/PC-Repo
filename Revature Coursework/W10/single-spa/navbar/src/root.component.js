import React, { useEffect, useState } from "react";

export default function Root(props) {
  const navStyle = {
    backgroundColor: "#2c3e50",
    padding: "1rem 2rem",
    display: "flex",
    gap: "2rem",
  };

  const linkStyle = {
    color: "white",
    textDecoration: "none",
    fontSize: "1.1rem",
    fontWeight: "bold",
  };

  const activeLinkStyle = {
    ...linkStyle,
    borderBottom: "2px solid #3498db",
  };

  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Define the event handler
    const handleCartUpdate = (event) => {
      console.log('Cart updated:', event.detail);
      setCartCount(event.detail.count);
    };
    
    // Subscribe to the custom event
    window.addEventListener('cart:updated', handleCartUpdate);
    
    // Cleanup: unsubscribe when component unmounts
    // This prevents memory leaks!
    return () => {
      window.removeEventListener('cart:updated', handleCartUpdate);
    };
  }, []); // Empty array = run once on mount

  const handleNavigation = (path) => {
    // Use single-spa's navigation
    window.history.pushState(null, null, path);
    // Dispatch popstate event to trigger single-spa routing
    window.dispatchEvent(new PopStateEvent("popstate"));
  };

  const isActive = (path) => window.location.pathname === path;

  return (
    <nav style={navStyle}>
      <a
        href="/"
        style={isActive("/") ? activeLinkStyle : linkStyle}
        onClick={(e) => {
          e.preventDefault();
          handleNavigation("/");
        }}
      >
        🏠 Home
      </a>
      <a
        href="/products"
        style={isActive("/products") ? activeLinkStyle : linkStyle}
        onClick={(e) => {
          e.preventDefault();
          handleNavigation("/products");
        }}
      >
        📦 Products
      </a>
      <a
        href="/about"
        style={isActive("/about") ? activeLinkStyle : linkStyle}
        onClick={(e) => {
          e.preventDefault();
          handleNavigation("/about");
        }}
      >
        ℹ️ About
      </a>
      <span style={{ marginLeft: "auto", color: "#95a5a6" }}>
        React Navbar MFE
      </span>
      <span style={{ marginLeft: "auto", color: "white" }}>
        🛒 Cart: {cartCount}
      </span>
    </nav>
  );
}