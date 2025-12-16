# Frontend Documentation

This document provides a comprehensive overview of the Feedback.fm frontend application, detailing its architecture, components, styling, API integration, and all interactive features.

## Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [Project Structure](#project-structure)
4. [Routing & Navigation](#routing--navigation)
5. [API Integration](#api-integration)
6. [Component Architecture](#component-architecture)
7. [Styling System](#styling-system)
8. [Animation Libraries & Effects](#animation-libraries--effects)
9. [Special Visual Components](#special-visual-components)
10. [State Management](#state-management)
11. [Authentication Flow](#authentication-flow)
12. [Data Flow](#data-flow)

---

## Architecture Overview

The frontend is a **Single Page Application (SPA)** built with React 19 and TypeScript, using Vite as the build tool. The application follows a component-based architecture with:

- **Client-side routing** via React Router
- **RESTful API communication** with the Spring Boot backend
- **Real-time data polling** for currently playing tracks
- **Dynamic theming** based on album artwork colors
- **Advanced visual effects** using WebGL and canvas

### Key Design Principles

1. **Component Reusability**: Shared components like `AnimatedContent` and `StaggeredMenu` are used across pages
2. **Separation of Concerns**: API calls are centralized in `services/api.ts`
3. **Progressive Enhancement**: Visual effects enhance but don't break functionality
4. **Responsive Design**: Mobile-first approach with breakpoints for different screen sizes

---

## Technology Stack

### Core Framework & Libraries

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 19.2.3 | UI framework |
| **TypeScript** | 5.9.3 | Type safety |
| **Vite** | 7.2.4 | Build tool & dev server |
| **React Router DOM** | 7.10.1 | Client-side routing |
| **Axios** | 1.13.2 | HTTP client |

### Animation & Visual Effects

| Library | Version | Purpose |
|---------|---------|---------|
| **GSAP (GreenSock)** | 3.14.2 | Advanced animations |
| **Three.js** | 0.167.1 | 3D graphics & WebGL effects |
| **Lenis** | 1.3.16 | Smooth scrolling (configured but not actively used) |

### Styling

| Technology | Version | Purpose |
|------------|---------|---------|
| **Tailwind CSS** | 4.1.18 | Utility-first CSS framework |
| **PostCSS** | 8.5.6 | CSS processing |
| **CSS Modules** | - | Component-scoped styles |

### UI Utilities

| Library | Version | Purpose |
|---------|---------|---------|
| **Lucide React** | 0.561.0 | Icon library |
| **class-variance-authority** | 0.7.1 | Component variant management |
| **clsx** | 2.1.1 | Conditional class names |
| **tailwind-merge** | 3.4.0 | Merge Tailwind classes |
| **tailwindcss-animate** | 1.0.7 | Animation utilities |

---

## Project Structure

```
frontend/
├── src/
│   ├── components/          # React components
│   │   ├── AnimatedContent.tsx
│   │   ├── ASCIIText.tsx
│   │   ├── CurrentlyPlaying.tsx
│   │   ├── Dashboard.tsx
│   │   ├── FuzzyText.tsx
│   │   ├── LiquidEther.tsx
│   │   ├── ListeningHistory.tsx
│   │   ├── Login.tsx
│   │   ├── Navbar.tsx
│   │   ├── Playlists.tsx
│   │   ├── StaggeredMenu.tsx
│   │   ├── TopArtists.tsx
│   │   ├── TopSongs.tsx
│   │   ├── LiquidEther.css
│   │   └── StaggeredMenu.css
│   ├── services/
│   │   └── api.ts           # API client & endpoints
│   ├── lib/
│   │   └── utils.ts        # Utility functions
│   ├── App.tsx             # Main app component & routing
│   ├── main.tsx            # Application entry point
│   └── style.css           # Global styles
├── assets/
│   └── logo.png            # Application logo
├── resources/
│   └── cycleList           # Dynamic messages for dashboard
├── index.html              # HTML template
├── vite.config.ts          # Vite configuration
├── tailwind.config.js      # Tailwind configuration
└── package.json            # Dependencies
```

---

## Routing & Navigation

### Route Configuration

The application uses **React Router v7** for client-side routing. Routes are defined in `App.tsx`:

```typescript
<Routes>
  <Route path="/" element={<Login />} />
  <Route path="/dashboard" element={<Dashboard />} />
  <Route path="/top-artists" element={<TopArtists />} />
  <Route path="/top-songs" element={<TopSongs />} />
  <Route path="/playlists" element={<Playlists />} />
  <Route path="/history" element={<ListeningHistory />} />
  <Route path="/currently-playing" element={<CurrentlyPlaying />} />
</Routes>
```

### Navigation Component

The **Navbar** component uses a custom `StaggeredMenu` component that provides:

- **Animated slide-in menu** from the right side
- **Staggered item animations** using GSAP
- **Social links** (GitHub, Spotify profile)
- **Logout functionality**
- **Fixed positioning** with backdrop blur

The menu items are defined in `Navbar.tsx`:

```typescript
const menuItems: StaggeredMenuItem[] = [
  { label: 'Dashboard', link: '/dashboard' },
  { label: 'Top Artists', link: '/top-artists' },
  { label: 'Top Songs', link: '/top-songs' },
  { label: 'Playlists', link: '/playlists' },
  { label: 'History', link: '/history' },
  { label: 'Now Playing', link: '/currently-playing' },
  { label: 'Logout', link: '/logout' },
];
```

### Route Protection

- Routes are not explicitly protected in the router
- Authentication is checked via API interceptors
- 401 responses automatically redirect to login
- Access tokens are stored in `localStorage`

---

## API Integration

### API Client Setup

The API client is configured in `src/services/api.ts` using **Axios**:

```typescript
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
```

### Request Interceptor

Automatically adds JWT token to all requests:

```typescript
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Response Interceptor

Handles authentication errors:

```typescript
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

### API Endpoints

The API service exports organized endpoint groups:

#### Authentication API
```typescript
authAPI.getAuthUrl()              // Get Spotify OAuth URL
authAPI.handleCallback(code)      // Exchange code for token
```

#### User API
```typescript
userAPI.getProfile(id)            // Get user profile
userAPI.getDashboard(id)          // Get dashboard data
userAPI.getStats(id)              // Get user statistics
```

#### Artists API
```typescript
artistsAPI.getTopArtists(timeRange)  // Get top artists
```

#### Songs API
```typescript
songsAPI.getTopSongs(timeRange)      // Get top songs
songsAPI.getCurrentlyPlaying()       // Get currently playing track
```

#### History API
```typescript
historyAPI.getHistory(limit)         // Get listening history
```

#### Playlists API
```typescript
playlistsAPI.getAll()                // Get all playlists
playlistsAPI.getById(id)             // Get playlist by ID
playlistsAPI.getSongs(id)            // Get playlist tracks
```

### Spotify Token Handling

Spotify access tokens are stored separately and passed via custom headers:

```typescript
const spotifyToken = localStorage.getItem('spotifyAccessToken');
return api.get('/endpoint', {
  headers: spotifyToken ? { 'X-Spotify-Token': spotifyToken } : {}
});
```

### Vite Proxy Configuration

For development, Vite proxies API requests:

```typescript
// vite.config.ts
server: {
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true
    }
  }
}
```

---

## Component Architecture

### Core Components

#### 1. **App.tsx** - Main Application Component

**Responsibilities:**
- Sets up React Router
- Conditionally renders Navbar (hidden on login page)
- Provides global styling context
- Manages main content wrapper with dot grid background

**Key Features:**
- Dynamic background pattern (radial gradient dots)
- Conditional navbar rendering based on route
- Global dark theme styling

#### 2. **Login.tsx** - Authentication Component

**Responsibilities:**
- Initiates Spotify OAuth flow
- Handles OAuth callback
- Stores tokens in localStorage
- Displays animated background

**Key Features:**
- **LiquidEther background** - WebGL fluid simulation
- **Animated login card** with fade-in effect
- **Feature highlights** with icons
- **Error handling** with user-friendly messages
- **Token management** - stores both JWT and Spotify tokens

**OAuth Flow:**
1. User clicks "Continue with Spotify"
2. Redirects to backend `/api/auth/login` endpoint
3. Backend redirects to Spotify authorization
4. Spotify redirects back with code
5. Backend exchanges code for tokens
6. Frontend receives tokens via URL parameters
7. Tokens stored in localStorage
8. User redirected to dashboard

#### 3. **Dashboard.tsx** - Main Dashboard

**Responsibilities:**
- Displays user profile
- Shows currently playing track
- Displays listening statistics
- Shows recently played tracks
- Displays top artists and songs preview

**Key Features:**
- **Dynamic color theming** - extracts dominant color from album artwork
- **ASCIIText component** - displays rotating messages with ASCII art effect
- **Real-time updates** - polls currently playing every 10 seconds
- **Auto-refresh** - dashboard data refreshes every 60 seconds
- **Responsive grid layouts** for artists and songs
- **Interactive cards** with hover effects

**Color Extraction:**
```typescript
const computeDominantColor = (img: HTMLImageElement) => {
  // Creates canvas, draws image, analyzes pixels
  // Returns dominant RGB color
  // Used to theme the entire dashboard
};
```

**Dynamic Messages:**
- Loads messages from `resources/cycleList`
- Randomly selects message when track changes
- Displays in ASCII art format

#### 4. **CurrentlyPlaying.tsx** - Now Playing Page

**Responsibilities:**
- Displays detailed information about currently playing track
- Shows progress bar with real-time updates
- Polls API every 5 seconds for updates

**Key Features:**
- **Progress visualization** - animated progress bar
- **Track metadata** - name, artist, album, duration
- **Status indicator** - playing/paused badge
- **Spotify link** - opens track in Spotify
- **Auto-refresh** - updates every 5 seconds
- **Empty state** - handles no track playing

#### 5. **TopArtists.tsx** - Top Artists Page

**Responsibilities:**
- Displays user's top artists
- Supports time range filtering (short/medium/long term)
- Provides search and sort functionality

**Key Features:**
- **Time range selector** - Last 4 weeks, 6 months, All time
- **Search functionality** - filter by artist name
- **Sort options** - by name or popularity
- **Animated grid** - staggered entrance animations
- **Responsive layout** - 5 columns on desktop, adapts to mobile
- **Click to open** - opens artist page in Spotify

**Animation:**
- Uses `AnimatedContent` wrapper for staggered animations
- Each artist card animates in with delay based on index
- Hover effects with transform and border color changes

#### 6. **TopSongs.tsx** - Top Songs Page

**Responsibilities:**
- Displays user's top tracks
- Supports time range filtering
- Provides search and sort functionality

**Key Features:**
- **Time range selector** - same as TopArtists
- **Multi-field search** - search by song name or artist
- **Sort options** - by name, artist, or popularity
- **Duration display** - shows track length
- **Album information** - displays album name
- **Animated grid** - same animation system as artists

#### 7. **ListeningHistory.tsx** - History Page

**Responsibilities:**
- Displays listening history
- Supports limit selection (10-100 tracks)
- Shows formatted timestamps

**Key Features:**
- **Limit selector** - dropdown to choose number of tracks
- **Relative timestamps** - "2h ago", "Yesterday", etc.
- **Animated list** - each item animates in with delay
- **Click to play** - opens track in Spotify
- **Image thumbnails** - album artwork for each track

#### 8. **Playlists.tsx** - Playlists Page

**Responsibilities:**
- Displays user's Spotify playlists
- Shows playlist details in modal
- Displays playlist tracks

**Key Features:**
- **Grid layout** - responsive card grid
- **Modal system** - click playlist to see tracks
- **Track listing** - numbered list with duration
- **Public/Private badges** - visual indicators
- **Empty state** - handles no playlists

#### 9. **Navbar.tsx** - Navigation Component

**Responsibilities:**
- Provides site navigation
- Handles logout
- Fetches user profile for social links

**Key Features:**
- **StaggeredMenu integration** - uses custom menu component
- **Social links** - GitHub and Spotify profile
- **Logout handler** - clears all tokens and redirects
- **Fixed positioning** - always visible at top

---

## Styling System

### Global Styles (`style.css`)

**Theme Configuration:**
- Dark theme by default
- CSS custom properties for theming
- Tailwind CSS integration
- Responsive breakpoints

**Key Styles:**
- Dot grid background pattern
- Dark form elements
- Responsive grid layouts for artists/songs
- Global typography settings

### Component Styles

#### Inline Styles (Primary Method)

Most components use **inline styles** for:
- Dynamic theming based on album colors
- Conditional styling based on state
- Responsive adjustments
- Hover effects

**Example:**
```typescript
style={{
  backgroundColor: colorWithAlpha(cycleColor, 0.05),
  border: `1px solid ${colorWithAlpha(cycleColor, 0.3)}`,
  borderRadius: '16px',
  transition: 'all 0.2s ease',
}}
```

#### CSS Modules

Some components use CSS modules:
- `LiquidEther.css` - Container styles
- `StaggeredMenu.css` - Menu animations and layout

#### Tailwind CSS

Used for:
- Utility classes
- Responsive breakpoints
- Animation utilities
- Color system

### Dynamic Theming

The dashboard implements **dynamic color theming**:

1. **Color Extraction**: Dominant color extracted from album artwork
2. **CSS Variable**: Color stored in `--accent-color`
3. **Component Usage**: All components use this color for accents
4. **Alpha Variations**: Helper function creates color with alpha:

```typescript
const colorWithAlpha = (color: string, alpha: number) => {
  // Converts hex/rgb to rgba
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};
```

### Responsive Design

**Breakpoints:**
- Desktop: 1200px+ (5 columns)
- Tablet: 900-1200px (4 columns)
- Mobile: 600-900px (3 columns)
- Small Mobile: <600px (2 columns)

**Grid System:**
- CSS Grid for layouts
- `repeat(auto-fit, minmax(300px, 1fr))` for flexible cards
- Media queries for column adjustments

---

## Animation Libraries & Effects

### GSAP (GreenSock Animation Platform)

**Primary Use Cases:**

1. **StaggeredMenu Animations**
   - Menu slide-in/out
   - Item stagger animations
   - Icon rotation
   - Text cycling effects

2. **AnimatedContent Component**
   - Scroll-triggered animations (not actively used)
   - Entrance animations
   - Stagger delays
   - Opacity and transform animations

**Key GSAP Features Used:**
- `gsap.timeline()` - Complex animation sequences
- `gsap.to()` / `gsap.fromTo()` - Property animations
- `stagger` - Sequential animations
- `ease` functions - Custom easing curves
- `ScrollTrigger` - Scroll-based animations (registered but not actively used)

### Three.js & WebGL

**Used For:**

1. **LiquidEther Component** - Fluid simulation background
   - WebGL-based fluid dynamics
   - Mouse interaction
   - Auto-demo mode
   - Color palette support

2. **ASCIIText Component** - 3D ASCII art text
   - Three.js scene with plane geometry
   - Custom shaders for wave effects
   - ASCII filter post-processing
   - Mouse-based rotation

**WebGL Features:**
- Custom vertex and fragment shaders
- Render targets for multi-pass rendering
- Texture manipulation
- Real-time fluid simulation

### Canvas-Based Effects

**FuzzyText Component:**
- Canvas-based text rendering
- Per-line horizontal displacement
- Hover intensity changes
- RequestAnimationFrame loop

---

## Special Visual Components

### 1. LiquidEther

**Purpose:** Animated fluid background for login page

**Technology:** Three.js WebGL

**Features:**
- Real-time fluid simulation
- Mouse interaction
- Auto-demo mode (moves automatically when idle)
- Customizable colors
- Performance optimized with intersection observer

**Configuration:**
```typescript
<LiquidEther 
  colors={['#1DB954', '#1ed760', '#18a344']}
  mouseForce={20}
  cursorSize={100}
  autoDemo={true}
/>
```

**How It Works:**
1. Creates WebGL renderer
2. Sets up fluid simulation with shaders
3. Tracks mouse position
4. Applies forces to fluid based on mouse movement
5. Renders color based on velocity magnitude

### 2. ASCIIText

**Purpose:** Displays text as animated ASCII art

**Technology:** Three.js + Canvas

**Features:**
- Converts text to ASCII characters
- 3D plane with wave distortion
- Mouse-based rotation
- Custom shaders for color effects
- Hue rotation based on mouse position

**How It Works:**
1. Creates canvas with text
2. Converts to Three.js texture
3. Applies to plane geometry
4. Uses ASCII filter to convert to characters
5. Applies wave shaders for animation
6. Rotates based on mouse position

**Usage:**
```typescript
<ASCIIText
  text={cycleMessage}
  asciiFontSize={4}
  textFontSize={90}
  textColor={cycleColor}
  enableWaves={false}
/>
```

### 3. AnimatedContent

**Purpose:** Wrapper for entrance animations

**Technology:** GSAP

**Features:**
- Configurable direction (vertical/horizontal)
- Stagger delays
- Opacity animations
- Scale animations
- Custom easing

**Usage:**
```typescript
<AnimatedContent
  distance={100}
  direction="vertical"
  duration={0.6}
  ease="back.out(1.7)"
  delay={index * 0.1}
>
  {/* Content */}
</AnimatedContent>
```

### 4. StaggeredMenu

**Purpose:** Animated navigation menu

**Technology:** GSAP + CSS

**Features:**
- Slide-in animation from side
- Staggered item animations
- Icon rotation
- Text cycling ("Menu" ↔ "Close")
- Color transitions
- Click-away to close
- Social links section

**Animation Sequence:**
1. Pre-layers slide in (staggered)
2. Main panel slides in
3. Menu items animate in (staggered)
4. Numbers fade in (if enabled)
5. Social links animate in

### 5. FuzzyText

**Purpose:** Text with animated "fuzzy" distortion effect

**Technology:** Canvas + RequestAnimationFrame

**Features:**
- Per-line horizontal displacement
- Hover intensity increase
- Smooth animation loop
- Font loading support

**How It Works:**
1. Renders text to offscreen canvas
2. Each frame, draws each line with random horizontal offset
3. Intensity increases on hover
4. Uses requestAnimationFrame for smooth animation

---

## State Management

### Local Component State

The application uses **React hooks** for state management:

- `useState` - Component-level state
- `useEffect` - Side effects and data fetching
- `useRef` - DOM references and animation refs
- `useCallback` - Memoized callbacks
- `useLayoutEffect` - Layout-based effects (for animations)

### Global State (localStorage)

**Stored Data:**
- `accessToken` - JWT token for backend API
- `spotifyAccessToken` - Spotify API token
- `userId` - Current user ID

**Access Pattern:**
```typescript
// Set
localStorage.setItem('accessToken', token);

// Get
const token = localStorage.getItem('accessToken');

// Remove
localStorage.removeItem('accessToken');
```

### No Global State Library

The application **does not use** Redux, Zustand, or Context API for global state. All state is:
- Component-local (useState)
- Derived from API responses
- Stored in localStorage (tokens only)

---

## Authentication Flow

### OAuth 2.0 Flow with Spotify

1. **User Initiates Login**
   - Clicks "Continue with Spotify" button
   - `Login.tsx` calls `authAPI.getAuthUrl()`
   - Backend returns Spotify authorization URL

2. **Redirect to Spotify**
   - User redirected to Spotify authorization page
   - User grants permissions
   - Spotify redirects back with `code` parameter

3. **Token Exchange**
   - Backend receives code
   - Backend exchanges code for access/refresh tokens
   - Backend creates/updates user in database
   - Backend generates JWT token
   - Backend redirects to frontend with tokens in URL

4. **Frontend Token Storage**
   - `Login.tsx` reads tokens from URL parameters
   - Stores `accessToken` (JWT) in localStorage
   - Stores `spotifyAccessToken` in localStorage
   - Stores `userId` in localStorage
   - Redirects to dashboard

5. **Authenticated Requests**
   - All API requests include JWT in `Authorization` header
   - Spotify token passed in `X-Spotify-Token` header when needed
   - 401 responses trigger automatic logout

### Logout Flow

1. User clicks "Logout" in menu
2. All tokens removed from localStorage
3. User redirected to login page

---

## Data Flow

### Typical Data Flow Pattern

```
User Action
    ↓
Component Event Handler
    ↓
API Service Call (services/api.ts)
    ↓
Axios Request (with interceptors)
    ↓
Backend API (Spring Boot)
    ↓
Response (JSON)
    ↓
Component State Update (useState)
    ↓
Re-render with New Data
```

### Example: Fetching Top Artists

```typescript
// 1. Component mounts
useEffect(() => {
  fetchTopArtists();
}, [timeRange]);

// 2. API call
const fetchTopArtists = async () => {
  const response = await artistsAPI.getTopArtists(timeRange);
  setArtists(response.data || []);
};

// 3. State update triggers re-render
// 4. Component displays artists in grid
```

### Real-time Updates

**Currently Playing Track:**
- Polls API every 5 seconds
- Updates state with new track data
- Triggers color extraction if track changed
- Updates progress bar

**Dashboard:**
- Auto-refreshes every 60 seconds
- Fetches fresh dashboard data
- Updates all statistics and previews

---

## Component Communication

### Parent-Child Communication

- **Props**: Standard React props for data and callbacks
- **No Context API**: Components receive data via props

### Sibling Communication

- **Shared State**: Siblings don't communicate directly
- **Parent State**: Common parent manages shared state
- **localStorage**: Used for tokens only, not component communication

### Event Handling

- **Click Events**: Standard React onClick handlers
- **Form Events**: onSubmit, onChange handlers
- **Custom Events**: None used

---

## Performance Optimizations

### Code Splitting

- **Not Implemented**: All code bundled together
- **Future Enhancement**: Could use React.lazy() for route-based splitting

### Image Optimization

- **Lazy Loading**: Images load as needed
- **Error Handling**: Fallback to emoji if image fails
- **No Compression**: Images served as-is from Spotify CDN

### Animation Performance

- **GPU Acceleration**: Transform and opacity animations
- **will-change**: CSS property for animation hints
- **RequestAnimationFrame**: Used for canvas animations
- **Intersection Observer**: Pauses animations when not visible

### API Optimization

- **Polling Intervals**: Optimized (5s for currently playing, 60s for dashboard)
- **Error Handling**: Graceful degradation on API failures
- **Caching**: No explicit caching, relies on browser cache

---

## Error Handling

### API Errors

```typescript
try {
  const response = await api.get('/endpoint');
  setData(response.data);
} catch (err: any) {
  setError(err.response?.data?.message || 'Failed to load data');
}
```

### Image Errors

```typescript
<img
  src={imageUrl}
  onError={() => {
    setImageError(true);
    // Fallback to placeholder
  }}
/>
```

### Network Errors

- Handled by Axios interceptors
- 401 errors trigger logout
- Other errors display user-friendly messages

---

## Accessibility

### Current Implementation

- **ARIA Labels**: Used in StaggeredMenu
- **Semantic HTML**: Proper use of headings, lists, buttons
- **Keyboard Navigation**: Basic support
- **Focus Management**: Some focus styles

### Areas for Improvement

- Screen reader support
- Keyboard-only navigation
- Focus trap in modals
- ARIA live regions for dynamic content

---

## Browser Compatibility

### Supported Browsers

- **Chrome/Edge**: Full support
- **Firefox**: Full support
- **Safari**: Full support (with iOS considerations for WebGL)
- **Mobile**: Responsive design, touch support

### WebGL Requirements

- Modern browser with WebGL 2.0 support
- iOS devices use HalfFloatType for compatibility

---

## Development Workflow

### Running the Application

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Configuration

- **API Base URL**: Hardcoded in `api.ts` (http://localhost:8080/api)
- **Vite Proxy**: Configured for development
- **No Environment Variables**: All config in code

### Hot Module Replacement

- Vite provides instant HMR
- React Fast Refresh enabled
- CSS updates without page reload

---

## Build & Deployment

### Build Process

1. **TypeScript Compilation**: `tsc` checks types
2. **Vite Build**: Bundles and optimizes
3. **Asset Processing**: Images, CSS, etc.
4. **Output**: `dist/` directory

### Production Optimizations

- Code minification
- Tree shaking
- Asset optimization
- Source maps (optional)

### Deployment Considerations

- Update API base URL for production
- Configure CORS on backend
- Set up HTTPS
- Configure environment variables (if added)

---

## Future Enhancements

### Potential Improvements

1. **State Management**: Consider Zustand or Context API for global state
2. **Code Splitting**: Implement route-based lazy loading
3. **Caching**: Add service worker for offline support
4. **Error Boundaries**: React error boundaries for better error handling
5. **Testing**: Add unit and integration tests
6. **Type Safety**: More strict TypeScript configuration
7. **Accessibility**: Enhanced ARIA support and keyboard navigation
8. **Performance**: Virtual scrolling for long lists
9. **PWA**: Progressive Web App features
10. **Internationalization**: Multi-language support

---

## Troubleshooting

### Common Issues

**1. API Connection Errors**
- Check backend is running on port 8080
- Verify CORS configuration
- Check network tab for actual requests

**2. Authentication Issues**
- Clear localStorage
- Check token expiration
- Verify OAuth redirect URI matches

**3. Animation Performance**
- Check browser WebGL support
- Reduce animation complexity on low-end devices
- Use Intersection Observer to pause off-screen animations

**4. Styling Issues**
- Clear browser cache
- Check Tailwind CSS compilation
- Verify CSS custom properties

---

## Summary

The Feedback.fm frontend is a modern React application that combines:

- **React 19** for UI components
- **TypeScript** for type safety
- **GSAP & Three.js** for advanced animations
- **Tailwind CSS** for styling
- **Axios** for API communication
- **React Router** for navigation

The application provides a rich, interactive experience with:
- Real-time track information
- Dynamic color theming
- Advanced visual effects
- Responsive design
- Smooth animations

All components are designed to be reusable, maintainable, and performant, with a focus on user experience and visual appeal.
