import { Component } from '@angular/core';

interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

@Component({
  selector: 'app-root',
  standalone: false,
  template: `
    <div class="products-container">
      <h1>📦 Product Catalog</h1>
      <p class="subtitle">This component is built with Angular!</p>
      
      <div class="product-grid">
        <div class="product-card" *ngFor="let product of products">
          <div class="product-icon">📱</div>
          <h3>{{ product.name }}</h3>
          <p class="description">{{ product.description }}</p>
          <div class="price">\${{ product.price.toFixed(2) }}</div>
          <button (click)="addToCart(product)">Add to Cart</button>
        </div>
      </div>
      
      <div class="cart-info" *ngIf="cartCount > 0">
        🛒 Cart: {{ cartCount }} items
      </div>
    </div>
  `,
  styles: [`
    .products-container { padding: 2rem; font-family: 'Segoe UI', sans-serif; }
    h1 { color: #2c3e50; margin-bottom: 0.5rem; }
    .subtitle { color: #7f8c8d; margin-bottom: 2rem; }
    .product-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1.5rem; }
    .product-card { background: white; border-radius: 12px; padding: 1.5rem; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .product-card:hover { transform: translateY(-5px); box-shadow: 0 8px 15px rgba(0,0,0,0.15); }
    .product-icon { font-size: 3rem; text-align: center; margin-bottom: 1rem; }
    .product-card h3 { color: #34495e; margin: 0 0 0.5rem 0; }
    .description { color: #7f8c8d; font-size: 0.9rem; margin-bottom: 1rem; }
    .price { font-size: 1.5rem; font-weight: bold; color: #27ae60; margin-bottom: 1rem; }
    button { width: 100%; padding: 0.75rem; background: #3498db; color: white; border: none; border-radius: 8px; cursor: pointer; }
    button:hover { background: #2980b9; }
    .cart-info { position: fixed; bottom: 2rem; right: 2rem; background: #27ae60; color: white; padding: 1rem 2rem; border-radius: 50px; }
  `]
})

export class App {
  products: Product[] = [
    { id: 1, name: 'Laptop Pro', price: 1299.99, description: 'High-performance laptop' },
    { id: 2, name: 'Wireless Mouse', price: 49.99, description: 'Ergonomic wireless mouse' },
    { id: 3, name: 'Mechanical Keyboard', price: 149.99, description: 'RGB mechanical keyboard' },
    { id: 4, name: 'USB-C Hub', price: 79.99, description: '7-in-1 USB-C hub' },
  ];

  cartCount = 0;

  addToCart(product: Product) {
    this.cartCount++;
    window.dispatchEvent(new CustomEvent('cart:updated', { 
      detail: { count: this.cartCount, product } 
    }));
  }
}