# Week 8 - Tuesday: Micro Frontends Architecture

## 1. Understanding Micro Frontends

### What Are Micro Frontends?

**Micro Frontends** extend the microservices concept to frontend development. Instead of a monolithic frontend application, the UI is split into smaller, independently deployable frontend modules.

### Traditional Frontend (Monolith)

```
┌──────────────────────────────────────────┐
│         Single Frontend Application       │
│                                          │
│  ┌──────┐  ┌──────┐  ┌──────┐           │
│  │Header│  │Catalog│ │Checkout│          │
│  └──────┘  └──────┘  └──────┘           │
│                                          │
│  - Single codebase                       │
│  - Single deployment                     │
│  - Single team                           │
└──────────────────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────────┐
│        Backend Microservices             │
│  ┌────────┐ ┌────────┐ ┌────────┐       │
│  │User API│ │Order API││Product│        │
│  └────────┘ └────────┘ └────────┘       │
└──────────────────────────────────────────┘
```

### Micro Frontend Architecture

```
┌────────┐ ┌────────┐ ┌────────┐
│Header  │ │Catalog │ │Checkout│  ← Independent Frontends
│Team A  │ │Team B  │ │Team C  │
└────┬───┘ └────┬───┘ └────┬───┘
     │          │          │
     └──────────┼──────────┘
                ▼
        ┌───────────────┐
        │  Shell/Host   │  ← Integrates all frontends
        │  Application  │
        └───────────────┘
```

---

## 2. Introduction to Micro Frontends

### Definition
**Micro Frontends** is an architectural pattern where a frontend app is decomposed into individual, semi-independent "micro" applications, each owned by independent teams.

### Core Idea
-   **Vertical Decomposition**: Each team owns a feature end-to-end (frontend + backend).
-   **Independent Deployment**: Teams can deploy their frontend independently.
-   **Technology Agnostic**: Different teams can use different frameworks (React, Angular, Vue).

### Evolution from Monolith

| Aspect | Monolithic Frontend | Micro Frontends |
| :--- | :--- | :--- |
| **Codebase** | Single, large codebase | Multiple small codebases |
| **Teams** | Single team or siloed teams | Autonomous, cross-functional teams |
| **Deployment** | Deploy entire frontend | Deploy individual micro frontends |
| **Technology** | Single framework | Polyglot (React, Vue, Angular) |
| **Scaling** | Scale team vertically | Scale team horizontally |
| **Risk** | High (one bug affects all) | Low (isolated failures) |

---

## 3. Key Principles and Concepts

### 1. Technology Agnostic
Teams can choose the best framework for their domain.

**Example**:
-   **Header**: Vanilla JavaScript (lightweight).
-   **Product Catalog**: React (rich UI).
-   **Checkout**: Vue (rapid development).

### 2. Isolate Team Code
Each micro frontend has its own repository and build pipeline.

```
Repositories:
├── mfe-header/       (Team A)
├── mfe-catalog/      (Team B)
├── mfe-checkout/     (Team C)
└── mfe-shell/        (Integration team)
```

### 3. Establish Team Prefixes
Avoid naming collisions by using team-specific prefixes.

```css
/* Team A - Header */
.header-nav { ... }
.header-logo { ... }

/* Team B - Catalog */
.catalog-grid { ... }
.catalog-item { ... }

/* Team C - Checkout */
.checkout-cart { ... }
.checkout-summary { ... }
```

### 4. Favor Native Browser Features
Use standard web APIs instead of framework-specific features.

-   **Custom Elements**: `<mfe-header></mfe-header>`
-   **Shadow DOM**: Encapsulate styles.
-   **ES Modules**: Native module system.

### 5. Build a Resilient Site
Micro frontends should degrade gracefully if one fails.

```javascript
// Fallback if micro frontend fails to load
try {
  loadMicroFrontend('catalog');
} catch (error) {
  console.error('Failed to load catalog:', error);
  showFallbackUI();
}
```

---

## 4. Understand Micro Frontend Architecture

### Architectural Patterns

#### 1. Build-Time Integration (Compile-Time)

Micro frontends are combined during the build process.

```json
// package.json
{
  "dependencies": {
    "@mfe/header": "1.2.3",
    "@mfe/catalog": "2.3.4",
    "@mfe/checkout": "3.4.5"
  }
}
```

**Pros**:
-   Simple integration.
-   Optimized bundle (tree-shaking, minification).

**Cons**:
-   Not truly independent (need to rebuild shell for updates).
-   Versioning conflicts.

#### 2. Run-Time Integration (Client-Side)

Micro frontends are loaded dynamically in the browser.

```javascript
// Load micro frontends at runtime
import('./micro-frontends/header.js');
import('./micro-frontends/catalog.js');
import('./micro-frontends/checkout.js');
```

**Pros**:
-   True independence (deploy without rebuilding shell).
-   Dynamic loading.

**Cons**:
-   Additional runtime overhead.
-   More complex error handling.

#### 3. Server-Side Integration (SSR/Edge)

Micro frontends are assembled on the server before sending to the client.

```javascript
// Server-side composition
app.get('/product/:id', async (req, res) => {
  const header = await fetchMFE('header');
  const catalog = await fetchMFE('catalog', { productId: req.params.id });
  const footer = await fetchMFE('footer');
  
  res.send(`
    ${header}
    ${catalog}
    ${footer}
  `);
});
```

**Pros**:
-   Better SEO (server-rendered).
-   Faster initial load.

**Cons**:
-   Server complexity.
-   Requires backend infrastructure.

---

## 5. Benefits of Micro Frontends

| Benefit | Description |
| :--- | :--- |
| **Incremental Upgrades** | Upgrade one micro frontend at a time (e.g., migrate from Angular to React gradually) |
| **Independent Deployment** | Teams deploy without coordinating with others |
| **Autonomous Teams** | Teams own features end-to-end (frontend + backend) |
| **Technology Flexibility** | Use the best tool for each domain |
| **Smaller Codebases** | Easier to understand and maintain |
| **Parallel Development** | Teams work in parallel without conflicts |
| **Fault Isolation** | One micro frontend failure doesn't crash the entire app |

### Use Cases

-   **Large Organizations**: Multiple teams working on the same product.
-   **Legacy Migration**: Gradually replace a monolithic frontend.
-   **Domain-Driven Design**: Align frontends with business domains.
-   **Multi-Brand**: Different teams manage different brands/products.

---

## 6. MFE Tools and Frameworks

### Comparison Table

| Tool | Approach | Framework Support | Complexity | Best For |
| :--- | :--- | :--- | :--- | :--- |
| **Single-SPA** | JavaScript orchestration | All | Medium | Framework-agnostic, existing apps |
| **Module Federation** | Webpack plugin | All | Low-Medium | React, Vue, Angular |
| **iframes** | Browser native | All | Low | Complete isolation needed |
| **Web Components** | Browser native | All | Medium | Long-term, standards-based |

---

## 7. Single-SPA

**Single-SPA** is a JavaScript router for micro frontends. It orchestrates loading and mounting of multiple micro frontends.

### Core Concepts

-   **Applications**: The micro frontends.
-   **Root Config**: The shell that loads micro frontends.
-   **Lifecycle Methods**: `bootstrap`, `mount`, `unmount`.

### Setup

#### Root Config (Shell)

```bash
npx create-single-spa
```

**root-config.js**:
```javascript
import { registerApplication, start } from 'single-spa';

// Register micro frontends
registerApplication({
  name: '@myorg/header',
  app: () => System.import('@myorg/header'),
  activeWhen: '/',  // Always active
});

registerApplication({
  name: '@myorg/catalog',
  app: () => System.import('@myorg/catalog'),
  activeWhen: '/products',  // Active on /products route
});

registerApplication({
  name: '@myorg/checkout',
  app: () => System.import('@myorg/checkout'),
  activeWhen: '/checkout',
});

start();
```

#### Micro Frontend (React)

**header/src/root.component.js**:
```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import singleSpaReact from 'single-spa-react';
import Header from './Header';

const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: Header,
});

export const { bootstrap, mount, unmount } = lifecycles;
```

**header/src/Header.jsx**:
```javascript
export default function Header() {
  return (
    <header>
      <h1>My E-Commerce Site</h1>
      <nav>
        <a href="/products">Products</a>
        <a href="/checkout">Checkout</a>
      </nav>
    </header>
  );
}
```

### Deployment

Each micro frontend is deployed independently to a CDN:
```
https://cdn.example.com/mfe/header.js
https://cdn.example.com/mfe/catalog.js
https://cdn.example.com/mfe/checkout.js
```

**Import Map** (in index.html):
```html
<script type="systemjs-importmap">
{
  "imports": {
    "@myorg/header": "https://cdn.example.com/mfe/header.js",
    "@myorg/catalog": "https://cdn.example.com/mfe/catalog.js",
    "@myorg/checkout": "https://cdn.example.com/mfe/checkout.js"
  }
}
</script>
```

---

## 8. Webpack Module Federation

**Module Federation** is a Webpack 5 feature that allows multiple independent builds to share code, including components.

### Key Concepts

-   **Host**: The shell application that loads remote modules.
-   **Remote**: The micro frontends that expose modules.
-   **Shared Dependencies**: Libraries (React, Vue) shared between host and remotes to avoid duplication.

### Setup

#### Remote (Catalog Micro Frontend)

**webpack.config.js**:
```javascript
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'catalog',
      filename: 'remoteEntry.js',
      exposes: {
        './ProductList': './src/components/ProductList',
        './ProductDetail': './src/components/ProductDetail',
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
      },
    }),
  ],
};
```

#### Host (Shell Application)

**webpack.config.js**:
```javascript
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
  plugins: [
    new ModuleFederationPlugin({
      name: 'host',
      remotes: {
        catalog: 'catalog@http://localhost:3001/remoteEntry.js',
        checkout: 'checkout@http://localhost:3002/remoteEntry.js',
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true },
      },
    }),
  ],
};
```

#### Usage in Host

**App.jsx**:
```javascript
import React, { lazy, Suspense } from 'react';

// Lazy load remote components
const ProductList = lazy(() => import('catalog/ProductList'));
const Checkout = lazy(() => import('checkout/CheckoutForm'));

export default function App() {
  return (
    <div>
      <h1>Welcome</h1>
      
      <Suspense fallback={<div>Loading products...</div>}>
        <ProductList />
      </Suspense>
      
      <Suspense fallback={<div>Loading checkout...</div>}>
        <Checkout />
      </Suspense>
    </div>
  );
}
```

### Advantages

-   **True Code Sharing**: Share React components, not just bundles.
-   **Version Control**: Control which version of shared dependencies to use.
-   **Type Safety**: Works with TypeScript.

---

## 9. Iframes and Web Components

### Iframes

**Simplest approach**: Each micro frontend runs in its own iframe.

```html
<!DOCTYPE html>
<html>
<head>
  <title>E-Commerce</title>
</head>
<body>
  <!-- Header -->
  <iframe src="https://header.example.com" width="100%" height="80px"></iframe>
  
  <!-- Main Content -->
  <iframe src="https://catalog.example.com" width="100%" height="600px"></iframe>
  
  <!-- Footer -->
  <iframe src="https://footer.example.com" width="100%" height="100px"></iframe>
</body>
</html>
```

**Pros**:
-   **Complete Isolation**: Styles, scripts, and globals don't leak.
-   **Simple**: No build tools or libraries needed.
-   **Security**: Sandbox attribute provides security boundaries.

**Cons**:
-   **Performance**: Each iframe is a separate page load.
-   **SEO**: Poor SEO (search engines don't index iframe content well).
-   **Responsiveness**: Hard to make truly responsive.
-   **Communication**: Parent-child communication is complex (postMessage).

### Web Components

**Custom Elements** + **Shadow DOM** = **Web Components**.

#### Creating a Web Component

**header-component.js**:
```javascript
class HeaderComponent extends HTMLElement {
  connectedCallback() {
    const shadow = this.attachShadow({ mode: 'open' });
    
    shadow.innerHTML = `
      <style>
        header {
          background: #333;
          color: white;
          padding: 1rem;
        }
        nav a {
          color: white;
          margin: 0 1rem;
        }
      </style>
      <header>
        <h1>My E-Commerce</h1>
        <nav>
          <a href="/products">Products</a>
          <a href="/checkout">Checkout</a>
        </nav>
      </header>
    `;
  }
}

customElements.define('mfe-header', HeaderComponent);
```

#### Usage

```html
<!DOCTYPE html>
<html>
<head>
  <title>E-Commerce</title>
  <script src="https://cdn.example.com/header-component.js"></script>
  <script src="https://cdn.example.com/catalog-component.js"></script>
</head>
<body>
  <mfe-header></mfe-header>
  <mfe-catalog></mfe-catalog>
  <mfe-footer></mfe-footer>
</body>
</html>
```

**Pros**:
-   **Browser Native**: No framework needed.
-   **Encapsulation**: Shadow DOM isolates styles.
-   **Reusable**: Can be used in any framework.

**Cons**:
-   **Browser Support**: Older browsers need polyfills.
-   **Learning Curve**: Different from React/Vue patterns.
-   **Tooling**: Less mature than frameworks.

---

## 10. Communication Between Micro Frontends

### 1. URL/Route Parameters

```javascript
// Navigate with state
window.location.href = '/checkout?userId=123&cartId=456';

// Read in checkout micro frontend
const params = new URLSearchParams(window.location.search);
const userId = params.get('userId');
```

### 2. Custom Events

**Catalog publishes event**:
```javascript
// catalog/ProductList.jsx
function addToCart(product) {
  const event = new CustomEvent('product:added', {
    detail: { product },
  });
  window.dispatchEvent(event);
}
```

**Header listens to event**:
```javascript
// header/CartIcon.jsx
useEffect(() => {
  const handleProductAdded = (e) => {
    setCartCount(prev => prev + 1);
  };
  
  window.addEventListener('product:added', handleProductAdded);
  return () => window.removeEventListener('product:added', handleProductAdded);
}, []);
```

### 3. Shared State (Event Bus/Store)

**Pub-Sub Pattern**:
```javascript
// Shared library
class EventBus {
  constructor() {
    this.listeners = {};
  }
  
  subscribe(event, callback) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(callback);
  }
  
  publish(event, data) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(callback => callback(data));
    }
  }
}

export const eventBus = new EventBus();
```

**Usage**:
```javascript
// Catalog
eventBus.publish('cart:updated', { itemCount: 5 });

// Header
eventBus.subscribe('cart:updated', (data) => {
  setCartCount(data.itemCount);
});
```

### 4. Backend API

Use backend as source of truth:
```javascript
// All micro frontends fetch from same API
fetch('/api/cart')
  .then(res => res.json())
  .then(cart => setCartCount(cart.items.length));
```

---

## 11. Challenges and Solutions

### Challenges

| Challenge | Description | Solution |
| :--- | :--- | :--- |
| **Styling Conflicts** | CSS from one MFE affects another | CSS Modules, Shadow DOM, CSS-in-JS |
| **Duplicate Dependencies** | Multiple copies of React loaded | Module Federation shared deps, externals |
| **Performance** | Multiple bundles slow down page | Code splitting, lazy loading, caching |
| **Testing** | Integration testing is complex | Contract testing, E2E tests |
| **Versioning** | Managing versions across MFEs | Semantic versioning, import maps |
| **Communication** | MFEs need to communicate | Custom events, shared state, API |

### Best Practices

1.  **Define Clear Boundaries**: Each MFE should own a specific feature domain.
2.  **Minimize Communication**: Avoid tight coupling between MFEs.
3.  **Share UI Components**: Create a shared component library for consistency.
4.  **Automate Testing**: Use E2E tests to verify integration.
5.  **Monitor Performance**: Track bundle sizes and load times.
6.  **Documentation**: Document integration contracts and APIs.

---

## 12. Complete Example: E-Commerce with Module Federation

### Architecture

```
┌─────────────┐
│   Catalog   │ (React, Port 3001)
│   MFE       │ Exposes: ProductList, ProductDetail
└─────────────┘

┌─────────────┐
│   Checkout  │ (React, Port 3002)
│   MFE       │ Exposes: Cart, CheckoutForm
└─────────────┘

┌─────────────┐
│   Shell     │ (React, Port 3000)
│   (Host)    │ Consumes: Catalog, Checkout
└─────────────┘
```

### Shell Application

**webpack.config.js**:
```javascript
new ModuleFederationPlugin({
  name: 'shell',
  remotes: {
    catalog: 'catalog@http://localhost:3001/remoteEntry.js',
    checkout: 'checkout@http://localhost:3002/remoteEntry.js',
  },
  shared: ['react', 'react-dom'],
})
```

**App.jsx**:
```javascript
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

const ProductList = lazy(() => import('catalog/ProductList'));
const Cart = lazy(() => import('checkout/Cart'));

export default function App() {
  return (
    <BrowserRouter>
      <nav>
        <a href="/">Products</a>
        <a href="/cart">Cart</a>
      </nav>
      
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route path="/" element={<ProductList />} />
          <Route path="/cart" element={<Cart />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

---

## 13. Best Practices Summary

### Technical
1.  **Use Module Federation** for modern React/Vue/Angular apps.
2.  **Lazy Load** micro frontends for better performance.
3.  **Share Dependencies** to avoid duplication.
4.  **Encapsulate Styles** using CSS Modules or Shadow DOM.
5.  **Version APIs** for backward compatibility.

### Organizational
1.  **Autonomous Teams**: Each team owns a domain end-to-end.
2.  **Clear Contracts**: Define integration points clearly.
3.  **Automated Deployment**: CI/CD for each micro frontend.
4.  **Monitoring**: Track performance and errors for each MFE.

### Performance
1.  **Code Splitting**: Load only what's needed.
2.  **Caching**: Use CDN and browser caching.
3.  **Preloading**: Preload critical micro frontends.
4.  **Bundle Analysis**: Monitor and optimize bundle sizes.

---

## 14. Resources

- https://single-spa.js.org/
- https://github.com/nitinreddy3/react-ng-spa-app