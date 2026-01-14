# Feedback.fm - How Everything Works (Explained Simply)

This document explains the key concepts and flows in the Feedback.fm application in an easy-to-understand way.

---

## 1. Basic Flow of the Program and Service Calls

### The Big Picture

Think of the application like a restaurant:
- **Frontend (React)** = The dining room where customers see and interact
- **Backend (Spring Boot)** = The kitchen that prepares everything
- **Spotify API** = The supplier that provides the ingredients (music data)
- **Database** = The pantry that stores everything

### How a Request Flows

Let's say you want to see your top artists:

1. **You click "Top Artists"** in the frontend
   - React component (`TopArtists.tsx`) detects the click
   - It calls `artistsAPI.getTopArtists(timeRange)` from `api.ts`

2. **API Service Layer** (`api.ts`)
   - Adds your authentication token to the request
   - Sends HTTP request to: `http://localhost:8080/api/artists/top?time_range=medium_term`
   - Includes Spotify token in `X-Spotify-Token` header

3. **Backend Controller** (`ArtistController.java`)
   - Receives the request
   - Checks authentication (JWT token)
   - Calls the service layer: `artistService.getTopArtists()`

4. **Service Layer** (`ArtistServiceImpl.java`)
   - The service might:
     - Check the database first (if data exists)
     - OR call `SpotifyApiService` to get fresh data from Spotify
     - Process and format the data
     - Return it as a DTO (Data Transfer Object)

5. **Spotify API Service** (`SpotifyApiService.java`)
   - Makes HTTP request to Spotify's servers
   - Uses the Spotify access token for authentication
   - Gets raw data from Spotify
   - Returns it to the service layer

6. **Response Flows Back**
   - Service → Controller → Frontend API → React Component
   - Component updates its state
   - React re-renders the page with new data

### Service Call Hierarchy

```
User Action
    ↓
React Component (Frontend)
    ↓
API Service (api.ts) - Adds tokens, formats request
    ↓
Backend Controller - Validates, routes request
    ↓
Business Service (e.g., ArtistService) - Business logic
    ↓
Spotify API Service - Calls external Spotify API
    ↓
Spotify Servers - Returns data
    ↓
(Data flows back up the chain)
```

---

## 2. How OAuth Works

OAuth is like getting a temporary key card to access a building. Here's how it works in Feedback.fm:

### Step-by-Step OAuth Flow

#### Step 1: User Clicks "Login with Spotify"
- Frontend (`Login.tsx`) calls `authAPI.getAuthUrl()`
- Backend (`SpotifyAuthController`) generates a special URL
- This URL includes:
  - Your app's ID (like your ID card)
  - What permissions you're asking for (read listening history, etc.)
  - Where to send the user back after they approve

#### Step 2: Redirect to Spotify
- User is sent to Spotify's website
- Spotify shows: "Feedback.fm wants to access your listening data. Allow?"
- User clicks "Allow"

#### Step 3: Spotify Sends Back a Code
- Spotify redirects back to your backend with a special **authorization code**
- This code is like a temporary ticket - it's only good for a few minutes
- The code is sent to: `http://localhost:8080/api/auth/callback?code=ABC123...`

#### Step 4: Backend Exchanges Code for Tokens
- Backend receives the code
- Calls `SpotifyAuthService.exchangeCodeForToken(code)`
- This sends the code to Spotify along with your app's secret password
- Spotify verifies everything and gives back:
  - **Access Token** - Like a key that works for 1 hour
  - **Refresh Token** - Like a master key to get new access tokens

#### Step 5: Backend Gets User Info
- Uses the access token to call `SpotifyApiService.getCurrentUser()`
- Gets user's profile (name, email, Spotify ID)

#### Step 6: Backend Creates/Updates User
- Checks if user exists in database
- Creates new user OR updates existing one
- Generates a JWT token (for your app's authentication)

#### Step 7: Redirect to Frontend with Tokens
- Backend redirects to frontend with tokens in URL:
  ```
  http://localhost:3000/?token=JWT_TOKEN&listenerId=USER_ID&spotifyToken=SPOTIFY_TOKEN
  ```

#### Step 8: Frontend Stores Tokens
- `Login.tsx` reads tokens from URL
- Stores in `localStorage`:
  - `accessToken` - For your backend API
  - `spotifyAccessToken` - For Spotify API calls
  - `userId` - The user's ID
- Redirects to dashboard

### Why Two Tokens?

- **JWT Token**: Authenticates with YOUR backend (Feedback.fm)
- **Spotify Token**: Authenticates with Spotify's API to get music data

### Token Refresh

When Spotify access token expires (after 1 hour):
- Backend can use the refresh token to get a new access token
- This happens automatically in the background

---

## 3. How SpotifyApiService Works (Step-by-Step Example)

Let's trace through getting your currently playing song:

### Example: Getting Currently Playing Track

#### Step 1: Request Comes In
```java
// Somewhere in your code calls:
spotifyApiService.getCurrentlyPlaying(accessToken);
```

#### Step 2: Build the URL
```java
String url = apiBaseUrl + "/me/player/currently-playing";
// Results in: "https://api.spotify.com/v1/me/player/currently-playing"
```

#### Step 3: Create Headers
```java
HttpHeaders headers = createHeaders(accessToken);
// This creates headers with:
// - Authorization: "Bearer YOUR_SPOTIFY_TOKEN"
// - Content-Type: "application/json"
```

#### Step 4: Make HTTP Request
```java
ResponseEntity<Map> response = restTemplate.exchange(
    url,           // The Spotify API endpoint
    HttpMethod.GET, // GET request (just reading data)
    entity,        // Headers and body (just headers here)
    Map.class      // Expect JSON response as a Map
);
```

**What happens behind the scenes:**
- Opens connection to `api.spotify.com`
- Sends HTTP GET request
- Includes your access token in Authorization header
- Waits for response

#### Step 5: Spotify Responds
Spotify sends back JSON like:
```json
{
  "is_playing": true,
  "item": {
    "name": "Bohemian Rhapsody",
    "artists": [{"name": "Queen"}],
    "album": {"name": "A Night at the Opera"},
    "duration_ms": 355000
  },
  "progress_ms": 120000
}
```

#### Step 6: Handle Response
```java
if (response.getStatusCode().is2xxSuccessful()) {
    return response.getBody(); // Returns the Map (JSON converted to Map)
} else {
    return null; // No song playing (204 No Content)
}
```

#### Step 7: Data Flows Back
- Service returns the Map
- Controller wraps it in a response
- Frontend receives it
- Component displays: "Now Playing: Bohemian Rhapsody by Queen"

### All SpotifyApiService Methods Work Similarly

Every method follows this pattern:
1. Build URL with endpoint and parameters
2. Create headers with access token
3. Make HTTP request using RestTemplate
4. Handle response (success or error)
5. Return data (or throw exception)

**Other endpoints:**
- `/me/top/artists` - Get top artists
- `/me/top/tracks` - Get top tracks
- `/me/player/recently-played` - Get listening history
- `/me/playlists` - Get user's playlists

---

## 4. How Dynamic Accents Work (Color Extraction)

The dashboard changes colors to match the album cover of the currently playing song. Here's how:

### The Process

#### Step 1: Get Currently Playing Track
- Dashboard fetches currently playing track
- Gets the album artwork image URL

#### Step 2: Load the Image
```typescript
const img = new Image();
img.crossOrigin = 'Anonymous'; // Allows reading pixel data
img.src = currentTrack.albumImage; // Load the image
```

#### Step 3: Wait for Image to Load
```typescript
img.onload = () => {
    const dominant = computeDominantColor(img);
    setCycleColor(dominant || fallbackColor);
};
```

#### Step 4: Extract Dominant Color (The Magic Part)

The `computeDominantColor` function:

1. **Create a Canvas**
   ```typescript
   const canvas = document.createElement('canvas');
   const context = canvas.getContext('2d');
   canvas.width = 50;  // Small size for speed
   canvas.height = 50;
   ```

2. **Draw Image to Canvas**
   ```typescript
   context.drawImage(img, 0, 0, width, height);
   // This "flattens" the image into pixels we can read
   ```

3. **Get Pixel Data**
   ```typescript
   const imageData = context.getImageData(0, 0, width, height);
   const pixels = imageData.data;
   // pixels is an array: [R, G, B, A, R, G, B, A, ...]
   // Each pixel is 4 numbers: Red, Green, Blue, Alpha
   ```

4. **Quantize Colors** (Group Similar Colors)
   ```typescript
   const quant = 24; // Round to nearest 24 (makes similar colors group together)
   for (let i = 0; i < pixels.length; i += 4) {
       const r = Math.round(pixels[i] / quant) * quant;
       const g = Math.round(pixels[i + 1] / quant) * quant;
       const b = Math.round(pixels[i + 2] / quant) * quant;
       const key = `${r},${g},${b}`;
       buckets[key] = (buckets[key] || 0) + 1; // Count occurrences
   }
   ```
   
   **Why quantize?** 
   - Without it, you'd have thousands of slightly different colors
   - Quantization groups similar colors (e.g., all shades of red become one "red")
   - Makes it easier to find the most common color

5. **Find Most Common Color**
   ```typescript
   let dominant = null;
   let max = 0;
   Object.entries(buckets).forEach(([key, count]) => {
       if (count > max) {
           max = count;
           dominant = key; // This is the color that appears most
       }
   });
   return `rgb(${dominant})`; // Returns like "rgb(255, 100, 50)"
   ```

#### Step 5: Apply Color Throughout Dashboard

```typescript
// Store in state
setCycleColor(dominant);

// Use everywhere:
style={{ color: cycleColor }}  // Headings
style={{ borderColor: cycleColor }}  // Borders
style={{ backgroundColor: colorWithAlpha(cycleColor, 0.1) }}  // Backgrounds
```

The `colorWithAlpha` function converts the color to rgba format:
```typescript
colorWithAlpha('#1DB954', 0.1) → 'rgba(29, 185, 84, 0.1)'
```

### Visual Example

```
Album Cover (Image)
    ↓
Load into Canvas
    ↓
Read Pixels: [255,100,50, 255,102,48, 254,99,51, ...]
    ↓
Quantize: Group similar colors
    ↓
Count: Red(255,100,50) appears 500 times
       Blue(50,100,255) appears 200 times
       Green(100,255,50) appears 50 times
    ↓
Dominant = Red(255,100,50)
    ↓
Apply to Dashboard: Headers, borders, accents all become red-orange
```

---

## 5. GSAP, Three.js, and WebGL Explained

### What Are They?

#### GSAP (GreenSock Animation Platform)
**What it is:** A JavaScript library for smooth, professional animations

**Think of it as:** A professional animator that can make anything move smoothly

**What it does:**
- Animates CSS properties (position, opacity, scale, rotation)
- Creates complex animation sequences
- Handles timing, easing (how fast/slow animations feel)
- Much smoother than CSS animations

**How we use it:**
- **StaggeredMenu**: Animates menu sliding in, items appearing one by one
- **AnimatedContent**: Makes cards fade in and slide up when they appear
- **Text cycling**: Animates text changing from "Menu" to "Close"

**Example:**
```typescript
gsap.to(element, {
    x: 100,        // Move 100px right
    opacity: 1,    // Fade in
    duration: 1,   // Over 1 second
    ease: "power2.out"  // Start fast, end slow
});
```

#### Three.js
**What it is:** A JavaScript library for 3D graphics in the browser

**Think of it as:** A 3D engine that can create 3D scenes, objects, cameras, lights

**What it does:**
- Creates 3D objects (cubes, spheres, planes)
- Handles cameras (perspective, how you view the scene)
- Manages lighting
- Renders 3D scenes to canvas

**How we use it:**
- **ASCIIText**: Creates a 3D plane with text texture, applies wave effects
- **LiquidEther**: Creates 3D fluid simulation (though the fluid itself is 2D)

**Example:**
```typescript
// Create a 3D scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();

// Create a 3D plane
const geometry = new THREE.PlaneGeometry(2, 2);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const plane = new THREE.Mesh(geometry, material);
scene.add(plane);
```

#### WebGL
**What it is:** A low-level API for rendering 2D/3D graphics using your graphics card

**Think of it as:** Direct access to your GPU (graphics card) for maximum performance

**What it does:**
- Uses your graphics card (GPU) instead of CPU
- Extremely fast for graphics operations
- Uses shaders (small programs that run on GPU)
- Can handle complex visual effects

**How we use it:**
- **LiquidEther**: Uses WebGL shaders to simulate fluid dynamics
- **ASCIIText**: Uses WebGL to render 3D text with effects

**Shaders Explained Simply:**
- **Vertex Shader**: Runs for each point (vertex) of a shape
  - Can move points, create waves, distortions
- **Fragment Shader**: Runs for each pixel on screen
  - Determines the color of each pixel
  - Can create gradients, patterns, effects

**Example (simplified):**
```glsl
// Vertex Shader - Moves points to create waves
void main() {
    position.y += sin(time + position.x) * 0.5; // Wave effect
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

// Fragment Shader - Colors pixels
void main() {
    gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0); // Red color
}
```

### Why Use These?

- **GSAP**: Smooth, professional animations that feel polished
- **Three.js**: Easy way to create 3D effects without writing raw WebGL
- **WebGL**: Maximum performance for complex visual effects (fluid simulation)

---

## 6. How LiquidEther and StaggeredMenu Were Implemented

### LiquidEther Component

**What it does:** Creates an animated fluid-like background that responds to mouse movement

#### The Implementation

**1. Setup WebGL Renderer**
```typescript
// Creates a WebGL context (like a canvas for 3D)
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(width, height);
```

**2. Create Fluid Simulation**
The fluid is simulated using a technique called "Stable Fluids":
- Creates a grid of "cells" (like pixels)
- Each cell has a velocity (speed and direction)
- Physics calculations determine how fluid moves

**3. Shader Passes** (Multiple Steps)
The fluid simulation uses multiple rendering passes:

- **Advection**: Moves the fluid based on its current velocity
- **External Force**: Applies mouse movement as a force
- **Viscous**: Simulates fluid thickness/stickiness
- **Divergence**: Calculates pressure differences
- **Poisson**: Solves pressure equations (makes fluid flow correctly)
- **Pressure**: Applies pressure to adjust velocity
- **Color**: Converts velocity to color (faster = brighter)

**4. Mouse Interaction**
```typescript
// Track mouse position
onMouseMove(event) {
    const x = (event.clientX - rect.left) / width;
    const y = (event.clientY - rect.top) / height;
    mouse.setNormalized(x, y);
}

// Apply force at mouse position
uniforms.force.value.set(mouseForceX, mouseForceY);
uniforms.center.value.set(mouseX, mouseY);
```

**5. Auto-Demo Mode**
When mouse is idle:
- Automatically moves the "mouse" position
- Creates flowing animation even without user interaction
- Stops when user moves mouse again

**6. Animation Loop**
```typescript
function animate() {
    requestAnimationFrame(animate); // Runs every frame (~60fps)
    
    // Update simulation
    simulation.update();
    
    // Render to screen
    renderer.render(scene, camera);
}
```

**The Result:** A beautiful, flowing, interactive background that responds to your mouse.

### StaggeredMenu Component

**What it does:** An animated navigation menu that slides in from the side with staggered item animations

#### The Implementation

**1. Structure**
```typescript
<div className="staggered-menu-wrapper">
    {/* Pre-layers: Colored backgrounds that slide in first */}
    <div className="sm-prelayers">
        <div className="sm-prelayer" style={{ background: '#121212' }} />
        <div className="sm-prelayer" style={{ background: '#181818' }} />
    </div>
    
    {/* Header: Logo and toggle button */}
    <header>
        <div className="sm-logo">feedback.fm</div>
        <button onClick={toggleMenu}>Menu</button>
    </header>
    
    {/* Panel: The actual menu */}
    <aside className="staggered-menu-panel">
        <ul>
            <li>Dashboard</li>
            <li>Top Artists</li>
            {/* ... */}
        </ul>
    </aside>
</div>
```

**2. Initial State (Hidden)**
```typescript
// All elements start off-screen
gsap.set([panel, ...preLayers], { xPercent: 100 }); // 100% to the right
gsap.set(menuItems, { yPercent: 140 }); // Below visible area
```

**3. Opening Animation (GSAP Timeline)**
```typescript
const tl = gsap.timeline();

// Step 1: Pre-layers slide in (staggered)
preLayers.forEach((layer, i) => {
    tl.to(layer, {
        xPercent: 0,  // Slide to visible
        duration: 0.5,
        ease: 'power4.out'
    }, i * 0.07);  // Each layer starts 0.07s after previous
});

// Step 2: Main panel slides in
tl.to(panel, {
    xPercent: 0,
    duration: 0.65,
    ease: 'power4.out'
}, 0.5);  // Starts 0.5s into timeline

// Step 3: Menu items animate in (staggered)
tl.to(menuItems, {
    yPercent: 0,     // Slide up
    rotate: 0,       // Straighten
    duration: 1,
    ease: 'power4.out',
    stagger: { each: 0.1 }  // 0.1s delay between each item
}, 0.6);
```

**4. Icon Animation**
```typescript
// Plus icon rotates to X
gsap.to(icon, {
    rotate: 225,  // 225 degrees = X shape
    duration: 0.8,
    ease: 'power4.out'
});
```

**5. Text Cycling**
```typescript
// Text cycles: Menu → Close → Menu → Close → Close
const seq = ['Menu', 'Close', 'Menu', 'Close', 'Close'];
setTextLines(seq);

// Animate text sliding up
gsap.to(textInner, {
    yPercent: -80,  // Move up to show next line
    duration: 0.5,
    ease: 'power4.out'
});
```

**6. Closing Animation**
```typescript
// Everything slides back off-screen
gsap.to([panel, ...preLayers], {
    xPercent: 100,  // Back off-screen
    duration: 0.32,
    ease: 'power3.in'
});
```

**The Result:** A smooth, professional menu that feels polished and responsive.

---

## 7. How Refresh Works, Now Playing, and Why Dashboard is Slow

### How Refresh Works

#### Dashboard Auto-Refresh

**Current Setup:**
```typescript
const refreshInterval = 120; // 2 minutes (120 seconds)

useEffect(() => {
    const fetchDashboard = async () => {
        // Fetch dashboard data
        const response = await userAPI.getDashboard(userId);
        setDashboardData(response.data);
    };
    
    fetchDashboard(); // Fetch immediately
    
    // Then set up interval
    if (refreshInterval > 0) {
        const intervalId = setInterval(() => {
            fetchDashboard(); // Fetch every 2 minutes
        }, refreshInterval * 1000);
        
        return () => clearInterval(intervalId); // Cleanup
    }
}, [refreshInterval]);
```

**What Happens:**
1. Component mounts → Fetches data immediately
2. Sets up timer → Fetches again after 2 minutes
3. Repeats every 2 minutes
4. When component unmounts → Clears timer (cleanup)

#### Currently Playing Refresh

**Current Setup:**
```typescript
useEffect(() => {
    const fetchCurrentlyPlaying = async () => {
        const response = await songsAPI.getCurrentlyPlaying();
        setCurrentTrack(response.data);
    };
    
    fetchCurrentlyPlaying(); // Fetch immediately
    
    // Poll every 2 minutes
    const intervalId = setInterval(fetchCurrentlyPlaying, 120000);
    return () => clearInterval(intervalId);
}, []);
```

**What Happens:**
1. Component mounts → Fetches currently playing
2. Sets up timer → Fetches again after 2 minutes
3. Updates display if track changed
4. Repeats every 2 minutes

### How Now Playing Works

#### The Flow

1. **Frontend Requests**
   ```typescript
   songsAPI.getCurrentlyPlaying()
   // Sends: GET /api/songs/currently-playing
   // Headers: X-Spotify-Token: YOUR_SPOTIFY_TOKEN
   ```

2. **Backend Controller**
   - Receives request
   - Gets Spotify token from header
   - Calls `SpotifyApiService.getCurrentlyPlaying(spotifyToken)`

3. **Spotify API Service**
   - Makes request to: `https://api.spotify.com/v1/me/player/currently-playing`
   - Spotify returns JSON with track info

4. **Response Processing**
   - Backend formats the data
   - Returns to frontend

5. **Frontend Updates**
   - Component receives data
   - Updates state: `setCurrentTrack(response.data)`
   - React re-renders with new track info
   - If track changed → Extracts new color from album art

### Why Dashboard is Slow

#### The Bottlenecks

**1. Multiple API Calls**
When dashboard loads, it makes several API calls:
- `userAPI.getDashboard()` - Gets profile, stats, top artists, top songs
- `songsAPI.getCurrentlyPlaying()` - Gets currently playing track
- `historyAPI.getHistory()` - Gets recently played

**Each call involves:**
- Frontend → Backend (network delay)
- Backend → Spotify API (network delay)
- Spotify processing (their server time)
- Response back (network delay)

**2. Sequential Processing**
Some operations happen one after another:
```typescript
// 1. Fetch dashboard data (wait)
const dashboard = await userAPI.getDashboard();

// 2. Fetch currently playing (wait)
const current = await songsAPI.getCurrentlyPlaying();

// 3. Extract color from image (wait for image to load)
img.onload = () => {
    const color = computeDominantColor(img);
};
```

**3. Image Loading**
Color extraction requires:
- Downloading album artwork image
- Loading into browser
- Drawing to canvas
- Processing pixels
- Finding dominant color

**4. Heavy Components**
- **ASCIIText**: 3D rendering, ASCII conversion (CPU intensive)
- **LiquidEther**: WebGL fluid simulation (GPU intensive)
- **Multiple animations**: GSAP animations running simultaneously

**5. Database Queries**
Backend might:
- Query database for user data
- Query for listening history
- Calculate statistics
- All before responding

#### Performance Timeline (Example)

```
0ms    - User navigates to dashboard
50ms   - React component mounts
100ms  - API call starts
200ms  - Request reaches backend
300ms  - Backend calls Spotify API
800ms  - Spotify responds
900ms  - Backend processes data
1000ms - Response back to frontend
1100ms - React updates state
1200ms - Component re-renders
1300ms - Image starts loading
1800ms - Image loaded
1900ms - Color extraction starts
2000ms - Color extracted
2100ms - Dashboard fully rendered
```

**Total: ~2 seconds** (can vary based on network, server load, etc.)

#### Why It Feels Slow

1. **No Loading States**: User sees blank screen while loading
2. **Blocking Operations**: Everything waits for API calls
3. **Heavy Rendering**: Complex components take time to render
4. **Network Latency**: Multiple round trips to servers

#### Potential Optimizations

1. **Show Loading Spinner**: Immediate feedback
2. **Parallel Requests**: Fetch multiple things at once
3. **Caching**: Store data locally, show cached version first
4. **Lazy Loading**: Load heavy components after initial render
5. **Code Splitting**: Load components only when needed
6. **Optimize Images**: Compress or use smaller thumbnails

---

## Summary

### Key Takeaways

1. **Service Flow**: Frontend → API Service → Backend Controller → Business Service → Spotify API → Database
2. **OAuth**: User approves → Spotify gives code → Backend exchanges for tokens → User authenticated
3. **SpotifyApiService**: Builds URL, adds token, makes HTTP request, handles response
4. **Dynamic Colors**: Load image → Draw to canvas → Read pixels → Find most common color → Apply everywhere
5. **GSAP**: Smooth animations library
6. **Three.js**: 3D graphics library
7. **WebGL**: Low-level GPU graphics API
8. **LiquidEther**: WebGL fluid simulation with shaders
9. **StaggeredMenu**: GSAP animations with staggered timing
10. **Performance**: Multiple API calls + image processing + heavy rendering = slower load times

The application is a complex system with many moving parts, but understanding these flows helps explain how everything works together!
