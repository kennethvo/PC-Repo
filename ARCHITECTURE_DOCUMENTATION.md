# Feedback.fm Architecture Documentation

## Table of Contents
1. [Overview](#overview)
2. [Frontend Architecture](#frontend-architecture)
3. [Backend Service Layer](#backend-service-layer)
4. [Spotify Web API Integration](#spotify-web-api-integration)
5. [React Component Implementation](#react-component-implementation)
6. [Communication Flow](#communication-flow)
7. [Authentication & Authorization](#authentication--authorization)
8. [Frontend Data Display Implementation](#frontend-data-display-implementation)
   - [How the Quip (ASCII Text) Works](#how-the-quip-ascii-text-works)
   - [How Displaying Spotify Stats Works](#how-displaying-spotify-stats-works)
   - [How Displaying Artists Works](#how-displaying-artists-works)
   - [How Displaying Songs/Albums Works](#how-displaying-songsalbums-works)
   - [How Displaying History Works](#how-displaying-history-works)
9. [Presentation Script: Service Layer Architecture & Spotify Integration](#presentation-script-service-layer-architecture--spotify-integration)

---

## Overview

Feedback.fm is a full-stack web application that integrates with Spotify's Web API to provide users with personalized music analytics, listening history, and real-time playback information. The application follows a modern architecture pattern with a React TypeScript frontend and a Spring Boot Java backend.

### Technology Stack

**Frontend:**
- React 19.2.3 with TypeScript
- React Router DOM 7.10.1 for routing
- Axios for HTTP requests
- GSAP (GreenSock Animation Platform) for animations
- Three.js for WebGL graphics
- Tailwind CSS for styling
- Vite as build tool

**Backend:**
- Spring Boot 4.0.0
- Spring Data JPA for database operations
- PostgreSQL database
- Spring Security with JWT authentication
- RestTemplate for external API calls

---

## Frontend Architecture

### Application Structure

The frontend follows a component-based architecture with clear separation of concerns:

```
frontend/
├── src/
│   ├── App.tsx                 # Main application component with routing
│   ├── main.tsx                # Application entry point
│   ├── components/             # React components
│   │   ├── Dashboard.tsx       # Main dashboard view
│   │   ├── Login.tsx           # Authentication page
│   │   ├── Navbar.tsx          # Navigation component
│   │   ├── TopArtists.tsx      # Top artists view
│   │   ├── TopSongs.tsx        # Top songs view
│   │   ├── CurrentlyPlaying.tsx # Real-time playback view
│   │   ├── ListeningHistory.tsx # Listening history view
│   │   ├── Playlists.tsx       # Playlists view
│   │   ├── LiquidEther.tsx     # WebGL background component
│   │   ├── StaggeredMenu.tsx   # Animated menu component
│   │   └── AnimatedContent.tsx # Scroll/entrance animations
│   ├── services/
│   │   └── api.ts              # API client with interceptors
│   └── lib/
│       └── utils.ts            # Utility functions
```

### Routing System

The application uses React Router for client-side routing. The main `App.tsx` component sets up routes:

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

### API Service Layer (`services/api.ts`)

The frontend uses a centralized API service built on Axios with interceptors for authentication and error handling:

#### Key Features:

1. **Base Configuration:**
   - Base URL: `http://localhost:8080/api`
   - Default headers: `Content-Type: application/json`

2. **Request Interceptor:**
   - Automatically attaches JWT token from `localStorage` to all requests
   - Token format: `Authorization: Bearer {token}`

3. **Response Interceptor:**
   - Handles 401 Unauthorized responses
   - Automatically redirects to login page on authentication failure
   - Clears stored tokens

4. **API Endpoints Organized by Domain:**
   - `authAPI`: Authentication endpoints
   - `userAPI`: User profile and dashboard data
   - `artistsAPI`: Artist-related endpoints
   - `songsAPI`: Song-related endpoints
   - `historyAPI`: Listening history endpoints
   - `playlistsAPI`: Playlist endpoints
   - `albumsAPI`: Album endpoints

5. **Spotify Token Handling:**
   - Spotify access tokens are passed via custom header: `X-Spotify-Token`
   - Tokens stored in `localStorage` as `spotifyAccessToken`

### State Management

The application uses React's built-in state management:
- **Local Component State**: `useState` hook for component-specific data
- **Local Storage**: Persistent storage for tokens and user ID
- **No Global State Library**: No Redux or Context API for global state (kept simple)

### Component Communication

Components communicate through:
1. **Props**: Parent-to-child data flow
2. **React Router**: Navigation and URL parameters
3. **API Service**: Shared service layer for backend communication
4. **Local Storage**: Cross-component data persistence

---

## Backend Service Layer

### Architecture Pattern

The backend follows a layered architecture:

```
Controller Layer (REST API)
    ↓
Service Layer (Business Logic)
    ↓
Repository Layer (Data Access)
    ↓
Database (PostgreSQL)
```

### Service Layer Structure

#### 1. **Domain Services**

Each domain entity has its own service interface and implementation:

- `ListenerService` / `ListenerServiceImpl`: User/listener management
- `SongService` / `SongServiceImpl`: Song entity management
- `ArtistService` / `ArtistServiceImpl`: Artist entity management
- `AlbumService` / `AlbumServiceImpl`: Album entity management
- `PlaylistService` / `PlaylistServiceImpl`: Playlist management
- `HistoryService` / `HistoryServiceImpl`: Listening history tracking

#### 2. **Spotify Integration Services**

- `SpotifyAuthService`: Handles OAuth 2.0 authentication flow
- `SpotifyApiService`: Makes API calls to Spotify Web API
- `SpotifySyncService`: Synchronizes Spotify data with local database

### Service Communication Flow

```
Controller
  ↓ (calls)
Service Interface
  ↓ (implemented by)
Service Implementation
  ↓ (uses)
Repository Interface
  ↓ (Spring Data JPA provides)
Repository Implementation
  ↓ (queries)
Database
```

### Example: Artist Service Flow

1. **Controller** (`ArtistController.java`):
   - Receives HTTP request at `/api/artists/top`
   - Extracts `X-Spotify-Token` header
   - Calls `SpotifyApiService.getTopArtists()`
   - Transforms Spotify response to frontend format
   - Returns JSON response

2. **Spotify API Service** (`SpotifyApiService.java`):
   - Creates HTTP request with Bearer token
   - Calls Spotify API: `GET https://api.spotify.com/v1/me/top/artists`
   - Returns raw Spotify response as `Map<String, Object>`

3. **Controller Transformation**:
   - Extracts relevant fields from Spotify response
   - Maps to frontend-friendly format
   - Returns `List<Map<String, Object>>`

### Data Transfer Objects (DTOs)

DTOs are used to transfer data between layers:
- `ListenerDTO`: User/listener information
- `SongDTO`: Song information
- `ArtistDTO`: Artist information
- `AlbumDTO`: Album information
- `PlaylistDTO`: Playlist information
- `HistoryDTO`: Listening history entry

DTOs are immutable records in Java, ensuring data integrity.

---

## Spotify Web API Integration

### Authentication Flow (OAuth 2.0 Authorization Code Flow)

#### Step 1: Authorization Request

**Frontend (`Login.tsx`):**
```typescript
const response = await authAPI.getAuthUrl();
window.location.href = response.data.authUrl;
```

**Backend (`SpotifyAuthService.getAuthorizationUrl()`):**
- Constructs authorization URL with required scopes:
  - `user-read-private`
  - `user-read-email`
  - `user-read-recently-played`
  - `user-top-read`
  - `user-read-currently-playing`
- Redirect URI: `http://127.0.0.1:8080/api/auth/callback`
- Returns: `https://accounts.spotify.com/authorize?...`

#### Step 2: User Authorization

User is redirected to Spotify's authorization page, where they:
1. Log in to Spotify
2. Grant permissions to the application
3. Spotify redirects back with authorization code

#### Step 3: Token Exchange

**Backend (`SpotifyAuthController.handleCallback()`):**

1. Receives authorization code from Spotify
2. Exchanges code for access token via `SpotifyAuthService.exchangeCodeForToken()`:
   - Makes POST request to `https://accounts.spotify.com/api/token`
   - Uses Basic Authentication with client ID and secret
   - Sends `grant_type=authorization_code` with code and redirect URI
   - Receives `access_token` and `refresh_token`

3. Fetches user profile using access token:
   - Calls `SpotifyApiService.getCurrentUser(accessToken)`
   - Creates/updates listener in database

4. Generates JWT token for application authentication:
   - Uses `JwtUtil.generateToken(spotifyId)`

5. Redirects to frontend with tokens in URL:
   - `/?token={jwt}&listenerId={id}&spotifyToken={accessToken}`

#### Step 4: Frontend Token Storage

**Frontend (`Login.tsx`):**
```typescript
useEffect(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const token = urlParams.get('token');
  const spotifyToken = urlParams.get('spotifyToken');
  
  if (token) {
    setAccessToken(token);  // JWT for backend API
    localStorage.setItem('spotifyAccessToken', spotifyToken);  // For Spotify API calls
    navigate('/dashboard');
  }
}, []);
```

### Spotify API Service Implementation

#### Configuration

**`application.properties`:**
```properties
spotify.client.id=${SPOTIFY_CLIENT_ID}
spotify.client.secret=${SPOTIFY_CLIENT_SECRET}
spotify.redirect.uri=http://127.0.0.1:8080/api/auth/callback
spotify.api.base.url=https://api.spotify.com/v1
```

#### API Methods (`SpotifyApiService.java`)

1. **`getCurrentUser(String accessToken)`**
   - Endpoint: `GET /me`
   - Returns: User profile information

2. **`getCurrentlyPlaying(String accessToken)`**
   - Endpoint: `GET /me/player/currently-playing`
   - Returns: Currently playing track or null if nothing playing

3. **`getTopArtists(String accessToken, String timeRange)`**
   - Endpoint: `GET /me/top/artists?time_range={timeRange}&limit=50`
   - Time ranges: `short_term`, `medium_term`, `long_term`
   - Returns: Top 50 artists

4. **`getTopTracks(String accessToken, String timeRange)`**
   - Endpoint: `GET /me/top/tracks?time_range={timeRange}&limit=50`
   - Returns: Top 50 tracks

5. **`getRecentlyPlayed(String accessToken, int limit)`**
   - Endpoint: `GET /me/player/recently-played?limit={limit}`
   - Max limit: 50
   - Returns: Recently played tracks with timestamps

6. **`getUserPlaylists(String accessToken, int limit, int offset)`**
   - Endpoint: `GET /me/playlists?limit={limit}&offset={offset}`
   - Returns: User's playlists

7. **`getPlaylistTracks(String accessToken, String playlistId)`**
   - Endpoint: `GET /playlists/{playlistId}/tracks`
   - Returns: Tracks in a specific playlist

#### Request Headers

All Spotify API requests include:
```java
HttpHeaders headers = new HttpHeaders();
headers.setBearerAuth(accessToken);
headers.setContentType(MediaType.APPLICATION_JSON);
```

### Data Synchronization (`SpotifySyncService.java`)

The `SpotifySyncService` synchronizes Spotify data with the local database:

1. **`syncUserProfile(String accessToken)`**
   - Fetches user profile from Spotify
   - Creates or updates `Listener` entity

2. **`syncRecentlyPlayed(String accessToken, String listenerId)`**
   - Fetches recently played tracks
   - Creates `Song`, `Artist`, `Album` entities if they don't exist
   - Creates `History` entries
   - Updates cumulative stats (total listening time, songs played)

3. **`syncTopArtists(String accessToken, String listenerId, String timeRange)`**
   - Fetches top artists
   - Creates/updates `Artist` entities

4. **`syncTopTracks(String accessToken, String listenerId, String timeRange)`**
   - Fetches top tracks
   - Creates/updates `Song`, `Artist`, `Album` entities

5. **`syncUserPlaylists(String accessToken, String listenerId)`**
   - Fetches user playlists
   - Creates/updates `Playlist` entities

### Token Refresh

**Backend (`SpotifyAuthService.refreshToken()`):**
- Endpoint: `POST /api/auth/refresh`
- Uses `grant_type=refresh_token`
- Returns new access token (refresh token may or may not be included)

**Note:** The current implementation stores refresh tokens but doesn't automatically refresh expired access tokens. This would need to be implemented for production use.

---

## React Component Implementation

### Custom Components from React Bits

The application uses several custom animated components, likely from a component library or custom implementations:

#### 1. **LiquidEther Component** (`LiquidEther.tsx`)

A WebGL-based fluid simulation background component using Three.js.

**Features:**
- Real-time fluid dynamics simulation
- Mouse/touch interaction
- Auto-demo mode when idle
- Customizable colors, viscosity, and resolution
- Performance optimized with intersection observers

**Implementation Details:**
- Uses Three.js for WebGL rendering
- Implements fluid simulation using shaders (advection, pressure, viscosity)
- BFECC (Back and Forth Error Compensation and Correction) for stability
- Responsive to container size changes
- Pauses when tab is hidden for performance

**Usage:**
```typescript
<LiquidEther 
  colors={['#1DB954', '#1ed760', '#18a344']}
  style={{ position: 'absolute', width: '100%', height: '100%' }}
/>
```

**Key Props:**
- `colors`: Array of color stops for the fluid
- `mouseForce`: Force applied by mouse movement
- `cursorSize`: Size of the cursor interaction area
- `resolution`: Simulation resolution (0-1)
- `autoDemo`: Enable automatic animation when idle
- `autoSpeed`: Speed of auto animation

#### 2. **StaggeredMenu Component** (`StaggeredMenu.tsx`)

An animated navigation menu with staggered entrance animations.

**Features:**
- Slide-in animation from left or right
- Staggered item animations
- Animated icon (plus to X transformation)
- Text cycling animation (Menu ↔ Close)
- Color transitions
- Click-away to close
- Social links section

**Implementation Details:**
- Uses GSAP (GreenSock Animation Platform) for animations
- Multiple pre-layers for depth effect
- Timeline-based animations for precise control
- Accessibility features (ARIA labels, keyboard navigation)

**Usage:**
```typescript
<StaggeredMenu
  position="right"
  items={menuItems}
  socialItems={socialItems}
  colors={['#121212', '#181818', '#282828']}
  accentColor="#1DB954"
  onItemClick={handleItemClick}
/>
```

**Animation Sequence:**
1. Pre-layers slide in with staggered timing (0.07s intervals)
2. Main panel slides in
3. Menu items animate in with rotation and translation
4. Social links fade in
5. Icon rotates 225° (plus to X)
6. Text cycles through "Menu" and "Close"

#### 3. **AnimatedContent Component** (`AnimatedContent.tsx`)

A wrapper component for entrance animations using GSAP.

**Features:**
- Vertical or horizontal slide animations
- Opacity fade-in
- Scale animations
- Customizable easing and duration
- Stagger support (via parent component)

**Usage:**
```typescript
<AnimatedContent
  distance={100}
  direction="vertical"
  duration={0.6}
  ease="back.out(1.7)"
  delay={index * 0.1}
>
  <div>Content to animate</div>
</AnimatedContent>
```

**Implementation:**
- Uses GSAP for animation
- Sets initial state (offset, scale, opacity)
- Animates to final state on mount
- Supports optional disappearance animation

### Standard React Components

#### Dashboard Component (`Dashboard.tsx`)

**Features:**
- Displays user profile information
- Shows currently playing track
- Displays listening statistics
- Shows recently played tracks
- Displays top artists and songs
- Dynamic color theming based on album artwork

**Key Functionality:**
1. **Data Fetching:**
   - Fetches dashboard data on mount
   - Polls currently playing every 10 seconds
   - Auto-refreshes dashboard every 60 seconds

2. **Color Extraction:**
   - Extracts dominant color from album artwork
   - Uses canvas API to analyze image pixels
   - Applies color to UI elements dynamically

3. **ASCII Text Display:**
   - Shows random messages from `cycleList` resource
   - Uses `ASCIIText` component for display

#### TopArtists Component (`TopArtists.tsx`)

**Features:**
- Displays top artists in a grid
- Time range selector (4 weeks, 6 months, all time)
- Search functionality
- Sort options (default, name, popularity)
- Animated entrance for each artist card

**Data Flow:**
1. User selects time range
2. Component calls `artistsAPI.getTopArtists(timeRange)`
3. Backend fetches from Spotify API
4. Data is transformed and displayed
5. Each artist card uses `AnimatedContent` for entrance animation

#### CurrentlyPlaying Component (`CurrentlyPlaying.tsx`)

**Features:**
- Real-time currently playing track display
- Progress bar with time indicators
- Album artwork display
- Play/pause status indicator
- Polls every 5 seconds for updates

**Implementation:**
```typescript
useEffect(() => {
  const fetchCurrentlyPlaying = async () => {
    const response = await songsAPI.getCurrentlyPlaying();
    setCurrentTrack(response.data);
  };
  
  fetchCurrentlyPlaying();
  const intervalId = setInterval(fetchCurrentlyPlaying, 5000);
  return () => clearInterval(intervalId);
}, []);
```

---

## Communication Flow

### Request Flow Diagram

```
┌─────────────┐
│   Browser   │
│  (React)    │
└──────┬──────┘
       │
       │ 1. HTTP Request (with JWT in header)
       │    X-Spotify-Token: {spotifyToken}
       │
       ▼
┌─────────────────┐
│  API Service    │
│  (api.ts)       │
│  - Interceptors │
│  - Token attach │
└──────┬──────────┘
       │
       │ 2. Axios Request
       │
       ▼
┌─────────────────┐
│   Spring Boot   │
│   Controller    │
│  - @RestController│
│  - @CrossOrigin │
└──────┬──────────┘
       │
       │ 3. Extract Spotify Token
       │    Call SpotifyApiService
       │
       ▼
┌─────────────────┐
│ SpotifyApiService│
│  - RestTemplate │
│  - Bearer Token │
└──────┬──────────┘
       │
       │ 4. HTTP Request
       │    Authorization: Bearer {token}
       │
       ▼
┌─────────────────┐
│  Spotify API    │
│  api.spotify.com│
└──────┬──────────┘
       │
       │ 5. JSON Response
       │
       ▼
┌─────────────────┐
│ SpotifyApiService│
│  - Parse Response│
└──────┬──────────┘
       │
       │ 6. Return Map<String, Object>
       │
       ▼
┌─────────────────┐
│   Controller    │
│  - Transform    │
│  - Format       │
└──────┬──────────┘
       │
       │ 7. JSON Response
       │
       ▼
┌─────────────────┐
│  API Service    │
│  - Interceptor  │
└──────┬──────────┘
       │
       │ 8. Update React State
       │
       ▼
┌─────────────┐
│   Browser   │
│  (React)    │
│  - Render   │
└─────────────┘
```

### Example: Fetching Top Artists

1. **User Action:** User selects "Last 6 Months" in TopArtists component

2. **Frontend:**
   ```typescript
   const response = await artistsAPI.getTopArtists('medium_term');
   ```

3. **API Service:**
   ```typescript
   getTopArtists: (timeRange: string = 'medium_term') => {
     const spotifyToken = localStorage.getItem('spotifyAccessToken');
     return api.get(`/artists/top?time_range=${timeRange}`, {
       headers: spotifyToken ? { 'X-Spotify-Token': spotifyToken } : {}
     });
   }
   ```

4. **Request Interceptor:**
   - Adds JWT token: `Authorization: Bearer {jwtToken}`
   - Adds Spotify token: `X-Spotify-Token: {spotifyToken}`

5. **Backend Controller:**
   ```java
   @GetMapping("/top")
   public ResponseEntity<List<Map<String, Object>>> getTopArtists(
       @RequestParam String time_range,
       @RequestHeader("X-Spotify-Token") String spotifyToken) {
       
       Map<String, Object> spotifyResponse = 
           spotifyApiService.getTopArtists(spotifyToken, time_range);
       // Transform and return
   }
   ```

6. **Spotify API Service:**
   ```java
   public Map<String, Object> getTopArtists(String accessToken, String timeRange) {
       String url = apiBaseUrl + "/me/top/artists?time_range=" + timeRange + "&limit=50";
       HttpHeaders headers = createHeaders(accessToken);
       // Make request to Spotify API
   }
   ```

7. **Response Flow:**
   - Spotify API returns JSON
   - SpotifyApiService returns `Map<String, Object>`
   - Controller transforms to frontend format
   - Frontend receives array of artist objects
   - Component updates state and re-renders

---

## Authentication & Authorization

### Two-Token System

The application uses two separate tokens:

1. **JWT Token (Application Authentication)**
   - Purpose: Authenticate requests to the backend API
   - Storage: `localStorage.getItem('accessToken')`
   - Header: `Authorization: Bearer {jwtToken}`
   - Generated by: `JwtUtil.generateToken(spotifyId)`
   - Expiration: 24 hours (86400000 ms)

2. **Spotify Access Token (Spotify API Access)**
   - Purpose: Authenticate requests to Spotify Web API
   - Storage: `localStorage.getItem('spotifyAccessToken')`
   - Header: `X-Spotify-Token: {spotifyToken}`
   - Obtained from: OAuth 2.0 flow
   - Expiration: 1 hour (Spotify default)

### Security Configuration

**Backend (`SecurityConfig.java`):**
- JWT authentication filter for protected endpoints
- Public endpoints: `/api/auth/**`
- Protected endpoints: All other `/api/**` endpoints
- CORS enabled for `http://localhost:3000`

**JWT Filter (`JwtAuthenticationFilter.java`):**
- Intercepts requests to protected endpoints
- Extracts JWT from `Authorization` header
- Validates token using `JwtUtil`
- Sets authentication in security context

### Token Refresh Strategy

**Current Implementation:**
- Refresh token is stored but not automatically used
- User must re-authenticate when Spotify token expires

**Recommended Enhancement:**
- Implement automatic token refresh before expiration
- Store refresh token securely
- Background job to refresh tokens
- Frontend interceptor to handle 401 responses and refresh

---

## Database Schema

### Entity Relationships

```
Listener (User)
  ├── One-to-Many → History
  └── One-to-Many → Playlist

History
  ├── Many-to-One → Listener
  └── Many-to-One → Song

Song
  ├── Many-to-Many → Artist
  ├── Many-to-Many → Album
  └── One-to-Many → History

Artist
  ├── Many-to-Many → Song
  └── One-to-Many → Album

Album
  ├── Many-to-One → Artist
  └── Many-to-Many → Song

Playlist
  ├── Many-to-One → Listener
  └── Many-to-Many → Song (via join table)
```

### Key Entities

**Listener:**
- `listenerId` (Primary Key, Spotify ID)
- `displayName`
- `email`
- `country`
- `href` (Spotify profile URL)
- `totalListeningTimeMs` (cumulative)
- `totalSongsPlayed` (cumulative)
- `currentStreak` (days)

**History:**
- `id` (Primary Key)
- `playedAt` (timestamp)
- `listenerId` (Foreign Key)
- `songId` (Foreign Key)

**Song:**
- `songId` (Primary Key, Spotify ID)
- `name`
- `href`
- `durationMs`

**Artist:**
- `artistId` (Primary Key, Spotify ID)
- `name`
- `href`

**Album:**
- `albumId` (Primary Key, Spotify ID)
- `title`
- `releaseYear`
- `href`
- `artistId` (Foreign Key)

---

## Error Handling

### Frontend Error Handling

**API Interceptor:**
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

**Component-Level:**
- Try-catch blocks in async functions
- Error state management with `useState`
- User-friendly error messages
- Fallback UI for error states

### Backend Error Handling

**Global Exception Handler (`GlobalExceptionHandler.java`):**
- `@ControllerAdvice` for centralized error handling
- Handles custom exceptions:
  - `ResourceNotFoundException`
  - `InvalidRequestException`
  - `AuthenticationException`
  - `SpotifyApiException`

**Exception Types:**
- `ResourceNotFoundException`: 404 Not Found
- `InvalidRequestException`: 400 Bad Request
- `AuthenticationException`: 401 Unauthorized
- `SpotifyApiException`: 500 Internal Server Error (Spotify API issues)

---

## Performance Optimizations

### Frontend

1. **Lazy Loading:**
   - Components loaded on demand via React Router
   - Code splitting with Vite

2. **Polling Optimization:**
   - Currently playing: 5-second intervals
   - Dashboard: 60-second intervals
   - Cleans up intervals on unmount

3. **Image Optimization:**
   - Lazy loading for images
   - Error handling with fallback UI
   - Dominant color extraction for dynamic theming

4. **Animation Performance:**
   - GSAP for hardware-accelerated animations
   - Intersection Observer for visibility-based rendering
   - WebGL background pauses when tab is hidden

### Backend

1. **Database:**
   - JPA entity relationships for efficient queries
   - Indexed primary keys
   - Transaction management for data consistency

2. **API Calls:**
   - RestTemplate connection pooling
   - Error handling to prevent cascading failures
   - Response caching (could be enhanced)

3. **Synchronization:**
   - Batch operations for history sync
   - Duplicate detection to prevent redundant entries
   - Incremental stats updates

---

## Development Setup

### Frontend

```bash
cd frontend
npm install
npm run dev  # Starts Vite dev server on port 3000
```

### Backend

```bash
cd backend
./mvnw spring-boot:run  # Starts Spring Boot on port 8080
```

### Database

```bash
cd database
docker-compose up -d  # Starts PostgreSQL container
```

### Environment Variables

**Backend (`application.properties`):**
- `SPOTIFY_CLIENT_ID`: Spotify application client ID
- `SPOTIFY_CLIENT_SECRET`: Spotify application client secret

**Frontend:**
- API base URL: `http://localhost:8080/api` (hardcoded in `api.ts`)

---

## Future Enhancements

1. **Token Refresh:**
   - Automatic Spotify token refresh
   - Background refresh before expiration

2. **Caching:**
   - Redis for frequently accessed data
   - Frontend caching for API responses

3. **Real-time Updates:**
   - WebSocket connection for live playback updates
   - Server-sent events for notifications

4. **Analytics:**
   - Enhanced listening statistics
   - Genre analysis
   - Time-based listening patterns

5. **Social Features:**
   - Share playlists
   - Compare listening habits
   - Follow other users

---

## Frontend Data Display Implementation

### How the Quip (ASCII Text) Works

The Dashboard features an animated ASCII text display that shows random messages ("quips") related to the currently playing track. This is implemented using the `ASCIIText` component.

#### Component Architecture

**ASCIIText Component (`ASCIIText.tsx`):**

The component uses Three.js WebGL rendering to create an animated 3D text plane that is converted to ASCII art in real-time.

**Key Features:**

1. **Text Rendering Pipeline:**
   - `CanvasTxt` class: Renders text to a 2D canvas with custom font, size, and color
   - Creates a texture from the canvas
   - Applies the texture to a 3D plane geometry in Three.js

2. **ASCII Conversion:**
   - `AsciiFilter` class: Converts the rendered 3D scene to ASCII characters
   - Uses a character set: `' .\'`^",:;Il!i~+_-?][}{1)(|/tfjrxnuvczXYUJCLQ0OZmwqpdbkhao*#MW&8%B@$'`
   - Maps pixel brightness to character density (darker = denser characters)
   - Applies hue rotation based on mouse position

3. **Animation:**
   - Wave effect: Vertex shader applies sine/cosine waves to the plane geometry
   - Mouse interaction: Plane rotates based on mouse position
   - RGB channel separation: Fragment shader creates chromatic aberration effect
   - Continuous animation loop using `requestAnimationFrame`

#### Integration in Dashboard

**Message Selection (`Dashboard.tsx`):**

```typescript
useEffect(() => {
  if (!currentTrack || !currentTrack.name) return;
  
  // Load messages from cycleList resource file
  const messages = cycleList.split(/\r?\n/).filter(Boolean);
  
  // Pick random message
  const message = messages[Math.floor(Math.random() * messages.length)];
  setCycleMessage(message);
  
  // Extract dominant color from album artwork
  const imgUrl = currentTrack.albumImage || currentTrack.image;
  if (imgUrl) {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imgUrl;
    img.onload = () => {
      const dominant = computeDominantColor(img);
      setCycleColor(dominant || fallbackColor);
    };
  }
}, [currentTrack?.id, currentTrack?.name]);
```

**Message Source (`resources/cycleList`):**

Contains a list of humorous messages, one per line:
```
😭 you actually like this kinda music 😭
you are not niche and mysterious bro.
ok this one is a banger 🔥
TURN THIS OFF!!!!!!! 😭😭😭
never give this guy aux 🕳️👨‍🦯
you should listen to starting over by LSD and the search for god 🙄
this song + a cigarette 🤔
```

**Display:**

```typescript
<ASCIIText
  text={cycleMessage || '...'}
  asciiFontSize={4}
  textFontSize={90}
  textColor={cycleColor}
  enableWaves={false}
/>
```

**Color Extraction:**

The component extracts the dominant color from the currently playing track's album artwork:

```typescript
const computeDominantColor = (img: HTMLImageElement) => {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  // Resize to 50x50 for performance
  canvas.width = 50;
  canvas.height = 50;
  context.drawImage(img, 0, 0, 50, 50);
  
  // Quantize colors into buckets
  const imageData = context.getImageData(0, 0, 50, 50);
  const buckets: Record<string, number> = {};
  const quant = 24; // Color quantization factor
  
  // Count color occurrences
  for (let i = 0; i < pixels.length; i += 4) {
    const r = Math.round(pixels[i] / quant) * quant;
    const g = Math.round(pixels[i + 1] / quant) * quant;
    const b = Math.round(pixels[i + 2] / quant) * quant;
    const key = `${r},${g},${b}`;
    buckets[key] = (buckets[key] || 0) + 1;
  }
  
  // Find most common color
  let dominant = null;
  let max = 0;
  Object.entries(buckets).forEach(([key, count]) => {
    if (count > max) {
      max = count;
      dominant = key;
    }
  });
  
  return dominant ? `rgb(${dominant})` : null;
};
```

This dominant color is then applied to:
- The ASCII text color
- UI accent colors throughout the dashboard
- CSS custom property: `--accent-color`

---

### How Displaying Spotify Stats Works

The Dashboard displays user statistics including total listening time, songs played, and current streak.

#### Backend Stats Calculation (`ListenerController.getDashboard()`)

**Data Sources:**

1. **Cumulative Stats (Database):**
   - `totalListeningTimeMs`: Sum of all song durations from history
   - `totalSongsPlayed`: Count of history entries
   - Stored in `Listener` entity and updated during sync

2. **Streak Calculation (Spotify API):**
   - Fetches recently played tracks (last 50)
   - Extracts play dates from `played_at` timestamps
   - Calculates consecutive days of listening

**Stats Calculation Flow:**

```java
// 1. Get base stats from database
Long totalListeningTimeMs = listener.totalListeningTimeMs();
Integer totalSongsPlayed = listener.totalSongsPlayed();

// 2. Convert to human-readable format
long totalMinutes = totalListeningTimeMs / 60000;
long hours = totalMinutes / 60;
long minutes = totalMinutes % 60;
stats.put("totalListeningTime", hours + " hours " + minutes + " minutes");

// 3. Calculate streak from recently played
Map<String, Object> recentlyPlayed = spotifyApiService.getRecentlyPlayed(spotifyToken, 50);
Set<String> listeningDays = new HashSet<>();

for (Map<String, Object> item : items) {
    Instant instant = Instant.parse((String) item.get("played_at"));
    LocalDate date = instant.atZone(ZoneId.systemDefault()).toLocalDate();
    listeningDays.add(date.toString());
}

// Count consecutive days from today backwards
LocalDate today = LocalDate.now();
int streak = 0;
LocalDate checkDate = today;
while (listeningDays.contains(checkDate.toString())) {
    streak++;
    checkDate = checkDate.minusDays(1);
}
stats.put("currentStreak", streak);

// 4. Sync and recalculate to ensure accuracy
spotifySyncService.syncRecentlyPlayed(spotifyToken, id);
spotifySyncService.recalculateStatsFromHistory(id);
```

**Stats Synchronization:**

When the dashboard is accessed:
1. Fetches recently played tracks from Spotify
2. Syncs new tracks to database (creates history entries)
3. Updates cumulative stats (adds new listening time and song count)
4. Recalculates stats from all history records to ensure accuracy
5. Returns updated stats to frontend

#### Frontend Stats Display (`Dashboard.tsx`)

**Stats Section:**

```typescript
<div style={{ 
  display: 'grid',
  gridTemplateColumns: 'repeat(3, minmax(180px, 1fr))',
  gap: '1.5rem',
  padding: '20px',
  backgroundColor: colorWithAlpha(cycleColor, 0.1),
  borderRadius: '12px',
  border: `1px solid ${colorWithAlpha(cycleColor, 0.2)}`
}}>
  {/* Listening Time */}
  <div style={{ textAlign: 'center' }}>
    <div style={{ fontSize: '2rem', fontWeight: '700', color: cycleColor }}>
      {dashboardData?.stats?.totalListeningTime || '0 minutes'}
    </div>
    <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)' }}>
      Listening Time
    </div>
  </div>
  
  {/* Songs Played */}
  <div style={{ textAlign: 'center' }}>
    <div style={{ fontSize: '2rem', fontWeight: '700', color: cycleColor }}>
      {dashboardData?.stats?.songsPlayed ?? 0}
    </div>
    <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)' }}>
      Songs Played
    </div>
  </div>
  
  {/* Day Streak */}
  <div style={{ textAlign: 'center' }}>
    <div style={{ fontSize: '2rem', fontWeight: '700', color: cycleColor }}>
      {dashboardData?.stats?.currentStreak ?? 0}
    </div>
    <div style={{ fontSize: '0.8rem', color: 'rgba(255, 255, 255, 0.6)' }}>
      Day Streak
    </div>
  </div>
</div>
```

**Dynamic Theming:**

Stats use the dynamically extracted color from the currently playing track's album artwork, creating a cohesive visual experience.

---

### How Displaying Artists Works

The Top Artists page displays a user's most-played artists with filtering, sorting, and search capabilities.

#### Data Flow

**1. Frontend Request (`TopArtists.tsx`):**

```typescript
useEffect(() => {
  const fetchTopArtists = async () => {
    const response = await artistsAPI.getTopArtists(timeRange);
    setArtists(response.data || []);
  };
  fetchTopArtists();
}, [timeRange]);
```

**2. Backend Processing (`ArtistController.getTopArtists()`):**

```java
@GetMapping("/top")
public ResponseEntity<List<Map<String, Object>>> getTopArtists(
    @RequestParam String time_range,
    @RequestHeader("X-Spotify-Token") String spotifyToken) {
    
    // Call Spotify API
    Map<String, Object> spotifyResponse = 
        spotifyApiService.getTopArtists(spotifyToken, time_range);
    
    // Extract items array
    List<Map<String, Object>> items = 
        (List<Map<String, Object>>) spotifyResponse.get("items");
    
    // Transform to frontend format
    List<Map<String, Object>> artists = new ArrayList<>();
    for (Map<String, Object> item : items) {
        Map<String, Object> artist = new HashMap<>();
        artist.put("id", item.get("id"));
        artist.put("name", item.get("name"));
        artist.put("href", externalUrls.get("spotify"));
        artist.put("image", images.get(0).get("url"));
        artists.add(artist);
    }
    
    return ResponseEntity.ok(artists);
}
```

**3. Frontend Display:**

**Grid Layout:**
```typescript
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(5, 1fr)',
  gap: '2rem',
  padding: '20px 0'
}}>
  {filteredArtists.map((artist, index) => (
    <AnimatedContent
      key={artist.id}
      delay={index * 0.1}  // Staggered animation
      // ... animation props
    >
      <div onClick={() => window.open(artist.href, '_blank')}>
        {/* Circular artist image */}
        <div style={{
          width: '100%',
          aspectRatio: '1',
          borderRadius: '50%',
          overflow: 'hidden'
        }}>
          <img src={artist.image} alt={artist.name} />
        </div>
        {/* Artist name */}
        <p>{artist.name}</p>
        {/* Genres and followers if available */}
      </div>
    </AnimatedContent>
  ))}
</div>
```

**Filtering & Sorting:**

```typescript
const filteredArtists = artists
  .filter((artist) =>
    artist.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    } else if (sortBy === 'popularity') {
      return b.popularity - a.popularity;
    }
    return 0; // Default order from API
  });
```

**Time Range Options:**
- `short_term`: Last 4 weeks
- `medium_term`: Last 6 months
- `long_term`: All time

**Features:**
- Search by artist name
- Sort by name (A-Z) or popularity
- Click to open artist on Spotify
- Staggered entrance animations
- Hover effects with border color change

---

### How Displaying Songs/Albums Works

Songs are displayed in the Top Songs page and within playlists. Albums are shown as part of song information.

#### Top Songs Display (`TopSongs.tsx`)

**Data Flow:**

1. **Fetch Top Songs:**
```typescript
const response = await songsAPI.getTopSongs(timeRange);
setSongs(response.data || []);
```

2. **Backend Processing (`SongController.getTopSongs()`):**
```java
Map<String, Object> spotifyResponse = 
    spotifyApiService.getTopTracks(spotifyToken, time_range);

// Transform each track
for (Map<String, Object> item : items) {
    Map<String, Object> song = new HashMap<>();
    song.put("id", item.get("id"));
    song.put("name", item.get("name"));
    song.put("artistName", artists.get(0).get("name"));
    song.put("album", album.get("name"));
    song.put("duration_ms", item.get("duration_ms"));
    song.put("image", albumImages.get(0).get("url"));  // Album artwork
    song.put("href", externalUrls.get("spotify"));
}
```

3. **Frontend Display:**

**Grid Layout:**
```typescript
<div style={{
  display: 'grid',
  gridTemplateColumns: 'repeat(5, 1fr)',
  gap: '2rem'
}}>
  {filteredSongs.map((song, index) => (
    <AnimatedContent delay={index * 0.1}>
      <div>
        {/* Album artwork (square) */}
        <div style={{
          aspectRatio: '1',
          borderRadius: '8px',
          overflow: 'hidden'
        }}>
          <img src={song.image} alt={song.album} />
        </div>
        {/* Song name */}
        <p>{song.name}</p>
        {/* Artist name */}
        <p>{song.artistName}</p>
        {/* Album name (optional) */}
        {song.album && <p>{song.album}</p>}
        {/* Duration */}
        {song.duration_ms && (
          <p>{formatDuration(song.duration_ms)}</p>
        )}
      </div>
    </AnimatedContent>
  ))}
</div>
```

**Duration Formatting:**
```typescript
const formatDuration = (ms: number) => {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${String(seconds).padStart(2, '0')}`;
};
```

**Filtering:**
- Search by song name or artist name
- Sort by song name, artist name, or popularity

**Album Information:**

Albums are displayed as part of song metadata:
- Album artwork is used as the song's image
- Album name is shown below the artist name
- Album information comes from the track's `album` object in Spotify API response

---

### How Displaying History Works

The Listening History page shows recently played tracks with timestamps and playback information.

#### Data Flow

**1. Frontend Request (`ListeningHistory.tsx`):**

```typescript
const response = await historyAPI.getHistory(limit);
setHistory(response.data || []);
```

**2. Backend Processing (`HistoryController`):**

The history endpoint returns entries from the database that were synced from Spotify's recently played API. Each entry contains:
- Song information (name, artist, album, image)
- Play timestamp (`playedAt`)
- Spotify link (`href`)

**3. Frontend Display:**

**List Layout:**
```typescript
<div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
  {history.map((item, index) => (
    <AnimatedContent delay={index * 0.1}>
      <div
        onClick={() => window.open(item.href, '_blank')}
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: '1rem',
          padding: '12px',
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: '8px'
        }}
      >
        {/* Album artwork thumbnail */}
        <div style={{ width: '64px', height: '64px', borderRadius: '8px' }}>
          <img src={item.image} alt={item.songName} />
        </div>
        
        {/* Song info */}
        <div style={{ flex: 1 }}>
          <p>{item.songName}</p>
          <p>{item.artistName}</p>
          <p>{formatDate(item.playedAt)}</p>
        </div>
        
        {/* Play icon */}
        {item.href && <div>▶</div>}
      </div>
    </AnimatedContent>
  ))}
</div>
```

**Date Formatting:**
```typescript
const formatDate = (playedAt: string) => {
  const date = new Date(playedAt);
  const month = date.toLocaleString('default', { month: 'short' });
  const day = date.getDate();
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${month} ${day}, ${hours}:${minutes}`;
};
```

**Limit Selector:**
```typescript
<select value={limit} onChange={(e) => setLimit(parseInt(e.target.value))}>
  <option value={10}>10 tracks</option>
  <option value={20}>20 tracks</option>
  <option value={30}>30 tracks</option>
  <option value={50}>50 tracks</option>
  <option value={75}>75 tracks</option>
  <option value={100}>100 tracks</option>
</select>
```

**Features:**
- Adjustable limit (10-100 tracks)
- Chronological display (most recent first)
- Click to play on Spotify
- Hover effects with background color change
- Staggered entrance animations
- Responsive layout

**Data Synchronization:**

History entries are created when:
1. User accesses dashboard (triggers `syncRecentlyPlayed`)
2. Currently playing track is detected (if not recently recorded)
3. Manual sync is triggered

Each history entry links to:
- `Listener` (who played it)
- `Song` (what was played)
- `playedAt` timestamp (when it was played)

---

## Presentation Script: Service Layer Architecture & Spotify Integration

*This script is designed to be presented in a meeting setting, explaining the service layer architecture and Spotify integration in a clear, conversational manner.*

---

### Introduction

"Good morning everyone. Today I'm going to walk you through how our Feedback.fm backend service layer works and how we've integrated with Spotify's Web API. This is a critical part of our architecture that handles all business logic and external API communication."

---

### Part 1: Service Layer Architecture Overview

"Let me start by explaining our service layer architecture. We follow a layered architecture pattern, which provides clear separation of concerns and makes our code maintainable and testable."

#### The Layered Pattern

"Our architecture has four main layers:

**First, we have the Controller Layer** - These are our REST API endpoints. Controllers receive HTTP requests, extract parameters, and delegate to the service layer. They don't contain business logic - they're just the entry point.

**Second is the Service Layer** - This is where all our business logic lives. Each domain entity has its own service interface and implementation. For example, we have `ListenerService`, `SongService`, `ArtistService`, and so on.

**Third is the Repository Layer** - This handles all database operations. We use Spring Data JPA, which automatically generates repository implementations based on method names. This means we don't write SQL queries - Spring does it for us.

**Finally, we have the Database Layer** - Our PostgreSQL database where all data is persisted."

#### Service Interface Pattern

"Each service follows the interface-implementation pattern. For example, we have `ListenerService` as an interface, and `ListenerServiceImpl` as the concrete implementation. This pattern gives us several benefits:

- **Testability**: We can easily mock interfaces for unit testing
- **Flexibility**: We can swap implementations without changing the rest of the code
- **Clear Contracts**: The interface defines exactly what operations are available

Let me show you how a typical service works using `ListenerService` as an example."

#### Example: ListenerService

"`ListenerService` manages user accounts in our system. Here's how it works:

When a user logs in through Spotify OAuth, we need to create or update their profile. The service handles this with two key methods:

**First, `getById()`** - This retrieves a listener by their Spotify ID. It validates the input, queries the repository, and converts the entity to a DTO for the controller.

**Second, `create()` and `update()`** - These methods handle persistence. Before saving, they validate the data - checking for required fields, email format, and duplicate entries. If validation passes, they convert the DTO to an entity and save it to the database.

**Key point**: All write operations are marked with `@Transactional`, which ensures data consistency. If anything goes wrong, the entire operation rolls back."

#### Data Transfer Objects (DTOs)

"We use DTOs - Data Transfer Objects - to transfer data between layers. DTOs are immutable records in Java, which means once created, they can't be modified. This prevents accidental data corruption.

For example, `ListenerDTO` contains:
- The listener's Spotify ID
- Display name and email
- Country code
- Spotify profile URL
- Cumulative stats like total listening time and songs played

DTOs are lightweight and don't contain database relationships, making them perfect for API responses."

---

### Part 2: Domain Services Deep Dive

"Now let me walk you through each of our domain services and what they do."

#### ListenerService

"`ListenerService` manages user accounts. It handles:
- Creating new listener accounts when users first log in
- Updating profiles when users return
- Validating email formats and checking for duplicates
- Managing cumulative statistics like total listening time

The service ensures data integrity by validating all inputs before persistence."

#### SongService

"`SongService` manages song entities. It provides:
- CRUD operations for songs
- Search functionality by name
- Finding songs by artist or duration
- Managing relationships between songs, artists, and albums

When we sync data from Spotify, we use this service to create or update song records in our database."

#### ArtistService

"`ArtistService` handles artist information. It:
- Stores artist metadata from Spotify
- Maintains relationships with songs and albums
- Provides search capabilities

Artists are linked to songs through a many-to-many relationship, so one artist can have many songs, and one song can have multiple artists."

#### HistoryService

"`HistoryService` tracks listening history. This is crucial for our analytics. It:
- Records when a user plays a song
- Links history entries to both the listener and the song
- Enables querying by listener, song, or date range

History entries are created automatically when we sync recently played tracks from Spotify."

#### AlbumService and PlaylistService

"`AlbumService` and `PlaylistService` work similarly - they manage album and playlist entities, maintaining relationships with songs and artists."

---

### Part 3: Spotify Integration Architecture

"Now let's talk about how we integrate with Spotify's Web API. This is a critical part of our system."

#### The Integration Services

"We have three specialized services for Spotify integration:

**First, `SpotifyAuthService`** - This handles OAuth 2.0 authentication. It:
- Generates authorization URLs for users to log in
- Exchanges authorization codes for access tokens
- Handles token refresh when tokens expire

**Second, `SpotifyApiService`** - This makes all API calls to Spotify. It:
- Fetches user profiles
- Gets top artists and tracks
- Retrieves currently playing tracks
- Fetches recently played history
- Gets user playlists

**Third, `SpotifySyncService`** - This synchronizes Spotify data with our database. It:
- Syncs user profiles
- Syncs recently played tracks
- Syncs top artists and tracks
- Updates cumulative statistics
- Prevents duplicate entries"

#### OAuth 2.0 Flow

"Let me walk you through our authentication flow:

**Step 1**: User clicks 'Login with Spotify' on the frontend. The frontend calls our `/api/auth/login` endpoint.

**Step 2**: Our `SpotifyAuthService` generates an authorization URL with the required scopes - things like reading user profile, reading listening history, and reading top artists.

**Step 3**: User is redirected to Spotify's authorization page, where they grant permissions.

**Step 4**: Spotify redirects back to our callback endpoint with an authorization code.

**Step 5**: Our `SpotifyAuthService` exchanges this code for an access token and refresh token. We use Basic Authentication with our client ID and secret.

**Step 6**: We use the access token to fetch the user's profile from Spotify, then create or update their account in our database.

**Step 7**: We generate a JWT token for our own API authentication and redirect the user back to the frontend with both tokens."

#### API Communication Pattern

"Here's how we make API calls to Spotify:

**All requests use Bearer Authentication** - We attach the access token in the Authorization header.

**We use Spring's RestTemplate** - This is a synchronous HTTP client that handles connection pooling and error handling.

**Each API method follows a consistent pattern**:
1. Build the URL with query parameters
2. Create HTTP headers with the Bearer token
3. Make the request
4. Handle the response
5. Transform the data if needed

For example, to get top artists, we call `GET https://api.spotify.com/v1/me/top/artists` with a time range parameter. Spotify returns JSON, which we parse into a Map structure."

#### Data Synchronization Strategy

"This is where `SpotifySyncService` comes in. When a user accesses their dashboard, we:

**First**, fetch their recently played tracks from Spotify - up to 50 tracks, which is Spotify's limit.

**Second**, for each track, we:
- Check if the song exists in our database, create it if not
- Check if the artists exist, create them if not
- Check if the album exists, create it if not
- Create a history entry linking the listener, song, and timestamp

**Third**, we update cumulative statistics:
- Add the song's duration to total listening time
- Increment the songs played counter

**Fourth**, we prevent duplicates by checking if we've already recorded this specific play within the last minute.

This synchronization happens automatically when users access their dashboard, ensuring our data stays up-to-date."

#### Error Handling

"We've implemented robust error handling:

**For API failures**, we catch exceptions and return appropriate error responses. We don't let Spotify API errors crash our application.

**For missing data**, we return empty lists or default values rather than throwing errors.

**For authentication failures**, we return 401 status codes and clear tokens on the frontend.

**For rate limiting**, we handle 429 responses gracefully, though we haven't implemented retry logic yet - that's a future enhancement."

---

### Part 4: Request Flow Example

"Let me walk you through a complete example - what happens when a user requests their top artists:

**Step 1**: Frontend makes a request to `/api/artists/top?time_range=medium_term` with the Spotify token in a custom header.

**Step 2**: `ArtistController` receives the request, extracts the token and time range parameter.

**Step 3**: Controller calls `SpotifyApiService.getTopArtists()` with the token and time range.

**Step 4**: `SpotifyApiService` builds the URL, creates headers with Bearer authentication, and makes the HTTP request to Spotify.

**Step 5**: Spotify returns JSON with artist data.

**Step 6**: `SpotifyApiService` parses the response and returns it as a Map.

**Step 7**: Controller transforms the Spotify response into a frontend-friendly format - extracting just the fields we need like ID, name, image, and Spotify URL.

**Step 8**: Controller returns the formatted data as JSON.

**Step 9**: Frontend receives the data and displays it in a grid with animations.

This entire flow happens in milliseconds, and the user sees their top artists displayed beautifully."

---

### Part 5: Key Design Decisions

"Let me highlight some key design decisions we made:

**First, we separate Spotify API calls from database operations**. This means if Spotify is down, our database operations still work. We can serve cached data or show appropriate error messages.

**Second, we use DTOs instead of entities in our API**. This prevents exposing internal database structure and gives us flexibility to change our database schema without breaking the API.

**Third, we validate all inputs at the service layer**. This ensures data integrity regardless of where the request comes from.

**Fourth, we use transactions for write operations**. This ensures data consistency - if part of an operation fails, everything rolls back.

**Fifth, we handle errors gracefully**. We don't let external API failures crash our application. We log errors and return appropriate responses."

---

### Part 6: Statistics and Analytics

"One interesting aspect is how we calculate statistics:

**Total Listening Time**: We sum up the duration of all songs in a user's history. This is stored cumulatively in the database and updated during sync.

**Songs Played**: We count the number of history entries. Again, this is stored cumulatively.

**Day Streak**: This is calculated dynamically from recently played tracks. We extract the play dates, find consecutive days starting from today, and count backwards.

**The challenge**: Spotify's recently played API only returns the last 50 tracks. For comprehensive stats, we need to store history in our database, which we do through synchronization."

---

### Part 7: Future Enhancements

"Looking ahead, there are several enhancements we could make:

**Token Refresh**: Currently, when Spotify tokens expire, users need to re-authenticate. We should implement automatic token refresh using refresh tokens.

**Caching**: We could cache frequently accessed data like top artists to reduce API calls and improve performance.

**Background Sync**: Instead of syncing on-demand, we could run background jobs to keep data synchronized.

**Rate Limiting**: We should implement retry logic with exponential backoff for rate-limited requests.

**Webhooks**: Spotify supports webhooks for real-time updates. We could use this instead of polling."

---

### Conclusion

"In summary, our service layer provides:

- **Clear separation of concerns** through layered architecture
- **Robust business logic** with validation and error handling
- **Seamless Spotify integration** through specialized services
- **Data synchronization** that keeps our database up-to-date
- **Scalable design** that can grow with our needs

The architecture is maintainable, testable, and follows industry best practices. It provides a solid foundation for future enhancements.

Thank you. I'm happy to answer any questions."

---

## Conclusion

Feedback.fm demonstrates a well-structured full-stack application with clear separation of concerns, modern React patterns, and robust Spotify API integration. The architecture supports scalability and maintainability while providing a rich user experience through animations and real-time data updates.
