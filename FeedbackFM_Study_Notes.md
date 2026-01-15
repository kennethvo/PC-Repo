# FeedbackFM — Interview Study Notes

## Project Overview
FeedbackFM is a full-stack Spotify statistics dashboard built with React (frontend) and Spring Boot (backend). It uses OAuth 2.0 for authentication, stores listening history in a PostgreSQL database, and provides real-time insights into user listening habits.

**Tech Stack:**
- **Frontend:** React, TypeScript, Axios, React Router
- **Backend:** Spring Boot, Java, PostgreSQL, JPA/Hibernate
- **Integration:** Spotify Web API, OAuth 2.0
- **Authentication:** JWT for API access, Spotify access tokens for Spotify API calls

---

# PART 1: FRONTEND CORE FLOW

## 1. Authentication Flow (OAuth 2.0 + JWT)

### How Login Works (Step-by-Step)

**Initial Load (`Login.tsx`):**

```30:67:P1-feedback.fm/frontend/src/components/Login.tsx
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    const listenerId = urlParams.get('listenerId');
    const spotifyToken = urlParams.get('spotifyToken');
    const error = urlParams.get('error');
    if (error) {
      setError(error);
      window.history.replaceState({}, document.title, '/');
      return;
    }
    if (token) {
      setAccessToken(token);
      if (listenerId) localStorage.setItem('userId', listenerId);
      if (spotifyToken) localStorage.setItem('spotifyAccessToken', spotifyToken);
      window.history.replaceState({}, document.title, '/');
      navigate('/dashboard');
      return;
    }
    const code = urlParams.get('code');
    if (code) handleCallback(code);
  }, [navigate]);
```

**The Complete Flow:**

1. **User clicks "Login with Spotify"**
   - Frontend calls `/api/auth/login`
   - Backend returns Spotify authorization URL
   - Frontend redirects to Spotify login page

2. **User authorizes the app on Spotify**
   - Spotify redirects back to backend at `/api/auth/callback?code=...`
   - Backend exchanges authorization code for Spotify access token
   - Backend creates/updates user in database
   - Backend generates JWT token

3. **Backend redirects to frontend with tokens**
   - URL format: `/?token=JWT&listenerId=SPOTIFY_ID&spotifyToken=ACCESS_TOKEN`
   - Frontend extracts all three values from URL parameters
   - Stores them in localStorage
   - Navigates to `/dashboard`

**Key Interview Points:**
- **Two-token system:** JWT for backend authentication, Spotify token for Spotify API calls
- **Security:** Tokens stored in localStorage (could discuss alternatives like httpOnly cookies)
- **Token refresh:** Currently doesn't handle token expiration (could be improvement point)
- **URL cleanup:** Uses `window.history.replaceState()` to remove tokens from URL

---

## 2. API Client Architecture (`services/api.ts`)

### Centralized API Service

The frontend uses a single Axios instance for all API calls:

```1:117:P1-feedback.fm/frontend/src/services/api.ts
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  getAuthUrl: () => api.get('/auth/login'),
  handleCallback: (code: string) => api.get(`/auth/callback?code=${code}`),
};

export const userAPI = {
  getDashboard: (id: string) => {
    const spotifyToken = localStorage.getItem('spotifyAccessToken');
    return api.get(`/users/${id}/dashboard`, {
      headers: spotifyToken ? { 'X-Spotify-Token': spotifyToken } : {}
    });
  },
};
```

### How It Works:

**1. Request Interceptor:**
- Automatically attaches JWT token to every request via `Authorization: Bearer ${token}`
- Runs before every API call
- Eliminates need to manually add auth headers in components

**2. Spotify Token Header:**
- Spotify-specific endpoints require `X-Spotify-Token` header
- Added manually in functions that need it (e.g., `getDashboard`, `getCurrentlyPlaying`)
- Backend uses this to call Spotify API on user's behalf

**3. Organized API Modules:**
- `authAPI` - login/callback
- `userAPI` - dashboard data
- `songsAPI` - top songs, currently playing
- `artistsAPI` - top artists
- `historyAPI` - listening history
- `playlistsAPI` - playlists and tracks

**Key Interview Points:**
- **Separation of concerns:** API logic separated from components
- **DRY principle:** Interceptor prevents repetitive auth header code
- **Type safety:** TypeScript ensures correct API usage
- **Scalability:** Easy to add new endpoints
- **Error handling:** Could discuss adding response interceptor for global error handling

---

## 3. Routing & Navigation (`App.tsx`)

### Application Structure

```1:49:P1-feedback.fm/frontend/src/App.tsx
  const isLoginPage = location.pathname === '/';
  return (
    <div className="App">
      {!isLoginPage && <Navbar />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/top-artists" element={<TopArtists />} />
        <Route path="/top-songs" element={<TopSongs />} />
        <Route path="/playlists" element={<Playlists />} />
        <Route path="/history" element={<ListeningHistory />} />
        <Route path="/currently-playing" element={<CurrentlyPlaying />} />
      </Routes>
    </div>
  );
```

**Key Features:**
- **Conditional navigation:** Navbar hidden on login page for clean UX
- **Protected routes:** Could implement `ProtectedRoute` component to check authentication
- **Single-page application:** Uses React Router for client-side routing

**Key Interview Points:**
- **UX decision:** Why navbar is hidden on login (cleaner first impression)
- **Route protection:** Currently no guards; could add authentication checks
- **Navigation flow:** User journey from login → dashboard → feature pages
- **Scalability:** Easy to add new routes as features expand

---

## 4. Dashboard Component (Main Hub)

### Multi-Source Data Fetching

The Dashboard is the most complex component, fetching from three different endpoints:

```84:191:P1-feedback.fm/frontend/src/components/Dashboard.tsx
  useEffect(() => {
    const fetchDashboard = async () => {
      const userId = localStorage.getItem('userId');
      const response = await userAPI.getDashboard(userId);
      setDashboardData(response.data);
    };
    fetchDashboard();
    const intervalId = setInterval(fetchDashboard, refreshInterval * 1000);
    return () => clearInterval(intervalId);
  }, [refreshInterval]);

  useEffect(() => {
    const fetchCurrentlyPlaying = async () => {
      const response = await songsAPI.getCurrentlyPlaying();
      setCurrentTrack(response.data);
    };
    fetchCurrentlyPlaying();
    const intervalId = setInterval(fetchCurrentlyPlaying, 10000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    const fetchRecentlyPlayed = async () => {
      const response = await historyAPI.getHistory(10);
      setRecentlyPlayed(response.data || []);
    };
    fetchRecentlyPlayed();
  }, []);
```

### What's Happening:

**1. Dashboard Stats (Polling every 30s by default):**
- Total listening time, songs played, current streak
- Top 5 songs and top 5 artists
- Configurable refresh interval

**2. Currently Playing (Polling every 10s):**
- Real-time track currently playing on Spotify
- Updates automatically to show live listening
- Shows track name, artist, album, artwork

**3. Recently Played (One-time fetch):**
- Last 10 songs played
- Static display (no polling)

**Key Interview Points:**
- **Multiple useEffect hooks:** Separation of concerns for different data sources
- **Polling strategy:** Balance between real-time updates and API load
- **Cleanup:** `clearInterval()` in return prevents memory leaks
- **User control:** Configurable refresh interval shows attention to UX
- **Performance consideration:** Why currently playing polls more frequently (10s vs 30s)

---

## 5. Data Visualization Features

### Top Artists & Top Songs

Both components follow the same pattern with time range filtering:

```25:41:P1-feedback.fm/frontend/src/components/TopArtists.tsx
  useEffect(() => {
    const fetchTopArtists = async () => {
      const response = await artistsAPI.getTopArtists(timeRange);
      setArtists(response.data || []);
    };
    fetchTopArtists();
  }, [timeRange]);
```

```25:41:P1-feedback.fm/frontend/src/components/TopSongs.tsx
  useEffect(() => {
    const fetchTopSongs = async () => {
      const response = await songsAPI.getTopSongs(timeRange);
      setSongs(response.data || []);
    };
    fetchTopSongs();
  }, [timeRange]);
```

**Time Range Options:**
- `short_term` - Last 4 weeks
- `medium_term` - Last 6 months (default)
- `long_term` - All time

**Key Interview Points:**
- **Reactive updates:** Re-fetches when timeRange changes (dependency array)
- **Spotify API feature:** Time ranges come from Spotify's native functionality
- **User insight:** Allows users to see how tastes change over time
- **Code reusability:** Same pattern used across multiple components

---

### Listening History

```11:29:P1-feedback.fm/frontend/src/components/ListeningHistory.tsx
  useEffect(() => {
    const fetchHistory = async () => {
      const response = await historyAPI.getHistory(limit);
      setHistory(response.data || []);
    };
    fetchHistory();
  }, [limit]);
```

**Features:**
- Displays chronological list of recently played tracks
- Configurable limit (pagination-ready)
- Shows timestamps formatted for readability
- Fallback to database if Spotify token unavailable

**Key Interview Points:**
- **Dual data source:** Live Spotify data OR database history
- **Timestamp formatting:** Converting ISO strings to readable format
- **Pagination ready:** Limit parameter prepares for load-more functionality
- **Data persistence:** History synced to database for long-term storage

---

### Currently Playing (Dedicated Page)

```10:31:P1-feedback.fm/frontend/src/components/CurrentlyPlaying.tsx
  useEffect(() => {
    const fetchCurrentlyPlaying = async () => {
      const response = await songsAPI.getCurrentlyPlaying();
      setCurrentTrack(response.data);
      setLastUpdated(new Date());
    };
    fetchCurrentlyPlaying();
    const intervalId = setInterval(fetchCurrentlyPlaying, 120000);
    return () => clearInterval(intervalId);
  }, []);
```

**Features:**
- Full-page "Now Playing" experience
- Polls every 2 minutes
- Shows last update timestamp
- Progress bar (if Spotify provides progress data)

**Key Interview Points:**
- **Different polling rate:** 2 minutes vs 10s on dashboard (why?)
- **User expectations:** Dedicated page implies less urgency for updates
- **Spotify API limitations:** Rate limiting considerations
- **UX enhancement:** Last updated timestamp builds user trust

---

### Playlists

```12:38:P1-feedback.fm/frontend/src/components/Playlists.tsx
  useEffect(() => {
    const fetchPlaylists = async () => {
      const response = await playlistsAPI.getAll();
      setPlaylists(response.data || []);
    };
    fetchPlaylists();
  }, []);

  const handlePlaylistClick = async (playlist: any) => {
    const response = await playlistsAPI.getSongs(playlist.playlistId);
    setSelectedPlaylist({ ...playlist, songs: response.data });
    setShowSongs(true);
  };
```

**Features:**
- Grid display of all user playlists
- Click to view tracks in modal
- Lazy loading: tracks only fetched when playlist clicked
- Shows playlist metadata (image, name, track count)

**Key Interview Points:**
- **Lazy loading strategy:** Don't fetch all tracks upfront (performance)
- **Modal pattern:** Keeps user context while showing details
- **Network optimization:** Only fetch what's needed when needed
- **User experience:** Fast initial load, then details on demand

---

## Frontend Architecture Summary

### Key Design Patterns

**1. Component Composition:**
- Each page is a self-contained component
- Shared logic extracted to API service layer
- Components focus on UI and user interaction

**2. Data Fetching Strategy:**
- useEffect for side effects (API calls)
- Dependency arrays for reactive re-fetching
- Polling for real-time data
- Lazy loading for performance

**3. State Management:**
- Local state with useState for component-specific data
- localStorage for persistent auth data
- No global state library (Redux, Context) - could be next step

**4. Error Handling:**
- Basic error states in components
- Could implement: global error boundary, toast notifications, retry logic

---

## Top Frontend Interview Questions & Answers

### 1. "Walk me through the authentication flow."
**Answer:** When user clicks login, we call our backend which generates a Spotify OAuth URL. User authorizes on Spotify, which redirects to our backend callback. Backend exchanges the auth code for a Spotify access token, creates/updates the user in our database, generates a JWT, and redirects back to frontend with both tokens in URL params. Frontend extracts them, stores in localStorage, and navigates to dashboard.

**Why this matters:** Shows understanding of OAuth 2.0, backend-frontend coordination, and security considerations.

---

### 2. "Why do you use two different tokens?"
**Answer:** The JWT authenticates requests to our backend API and proves the user is who they say they are. The Spotify access token is required to call Spotify's API on behalf of the user. We can't use JWT for Spotify because Spotify doesn't know about our tokens. Separating them also follows the principle of least privilege - our backend only gets the JWT, and only adds the Spotify token when making Spotify API calls.

**Why this matters:** Demonstrates security awareness and understanding of token-based authentication patterns.

---

### 3. "How do you handle real-time updates on the dashboard?"
**Answer:** We use polling with setInterval for two types of data: dashboard stats refresh every 30 seconds (configurable), and currently playing refreshes every 10 seconds. We poll more frequently for currently playing because users expect near-real-time updates for what's playing right now. We return cleanup functions in useEffect to clear intervals on unmount, preventing memory leaks.

**Follow-up answer:** Future improvement could be WebSockets for true real-time updates without polling, reducing API calls and server load.

**Why this matters:** Shows understanding of React lifecycle, memory management, and trade-offs between polling vs WebSockets.

---

### 4. "What's your strategy for making API calls?"
**Answer:** We use a centralized Axios instance with request interceptors that automatically attach the JWT token to every request. This follows DRY principles - we don't repeat auth logic in every component. For Spotify-specific endpoints, we manually add the X-Spotify-Token header. All API functions are organized into logical modules (authAPI, userAPI, songsAPI, etc.) making the codebase more maintainable.

**Why this matters:** Demonstrates code organization, reusability, and understanding of HTTP interceptors.

---

### 5. "How do you handle errors in your frontend?"
**Answer:** Currently, we use basic error states in components and optional chaining (response.data || []) to prevent crashes. For authentication errors, we check if tokens exist before making calls. 

**Honest improvement:** I'd add a global error boundary to catch rendering errors, implement toast notifications for user feedback, add response interceptors to handle 401s by redirecting to login, and implement retry logic for failed requests.

**Why this matters:** Shows self-awareness, ability to identify improvements, and understanding of error handling patterns.

---

### 6. "Why don't you use Redux or Context API?"
**Answer:** The app's state management needs are relatively simple - most state is component-local, and the only shared data (auth tokens) is stored in localStorage. Adding Redux would introduce unnecessary complexity for our current scale. 

**When I'd add it:** If we had complex state shared across many components (like real-time notifications, complex filtering across pages, or optimistic UI updates), then global state management would make sense.

**Why this matters:** Shows you understand when NOT to use a tool - just as important as knowing when to use it.

---

### 7. "Explain the lazy loading strategy in your Playlists component."
**Answer:** When the page loads, we only fetch playlist metadata (names, images, track counts) - not the individual tracks. Tracks are only fetched when a user clicks on a specific playlist. This significantly reduces initial load time and API calls. If a user only looks at 2 playlists out of 50, we've saved 48 unnecessary API calls.

**Why this matters:** Demonstrates understanding of performance optimization and network efficiency.

---

### 8. "How would you handle Spotify token expiration?"
**Answer:** Currently, we don't handle token refresh. Spotify access tokens expire after 1 hour. 

**My approach:** I'd implement a response interceptor that catches 401 errors from Spotify-related endpoints, then call a backend endpoint to refresh the token using the stored refresh token. After getting a new access token, retry the original request. For better UX, I could proactively refresh tokens before they expire (maybe at 50 minutes).

**Why this matters:** Shows understanding of OAuth token lifecycle and practical problem-solving.

---

### 9. "Why do you poll at different intervals for different data?"
**Answer:** It's about balancing user expectations with API efficiency. Currently playing updates every 10 seconds because users expect near-real-time feedback - if they skip a song, they want to see it reflected quickly. Dashboard stats update every 30 seconds (configurable) because cumulative stats change slowly. Recent history doesn't poll at all - it's a static snapshot. This prevents unnecessary API calls while maintaining good UX.

**Why this matters:** Shows you think about performance, API costs, and user experience trade-offs.

---

### 10. "How does the component lifecycle work in your Dashboard?"
**Answer:** The Dashboard uses three separate useEffect hooks. Each has its own responsibility: one for dashboard stats with configurable polling, one for currently playing with 10-second polling, and one for recently played that runs once. Each polling effect returns a cleanup function that clears the interval when the component unmounts. The dependency arrays control when effects re-run - the dashboard effect re-runs when refreshInterval changes, the others only run on mount.

**Why this matters:** Tests deep understanding of React hooks and component lifecycle.

---

# PART 2: BACKEND SERVICE LAYER

## Overview of Service Layer

The service layer is the **business logic center** of the application. It sits between controllers (which handle HTTP requests) and repositories (which handle database operations).

**Responsibilities:**
1. **Input validation** - Ensure data is valid before processing
2. **Business rules** - Enforce application-specific logic
3. **DTO/Entity mapping** - Convert between API representations and database entities
4. **Transaction management** - Ensure data consistency
5. **Error handling** - Throw meaningful exceptions

---

## 1. Listener Service (User Management)

### Core Responsibilities

```31:193:P1-feedback.fm/backend/src/main/java/com/feedback/fm/feedbackfm/service/ListenerServiceImpl.java
    public Optional<ListenerDTO> getById(String id) {
        if (id == null || id.isBlank()) {
            throw new InvalidRequestException("Listener ID cannot be null or blank");
        }
        return repository.findById(id).map(this::listenerToDto);
    }

    @Transactional
    public ListenerDTO create(ListenerDTO dto) {
        validateListenerDTO(dto);
        if (repository.existsById(dto.listenerId())) {
            throw new InvalidRequestException("Listener with ID '" + dto.listenerId() + "' already exists");
        }
        Listener listener = new Listener(dto.listenerId(), dto.displayName(), dto.email(), dto.country(), dto.href());
        listener.setTotalListeningTimeMs(dto.totalListeningTimeMs() != null ? dto.totalListeningTimeMs() : 0L);
        listener.setTotalSongsPlayed(dto.totalSongsPlayed() != null ? dto.totalSongsPlayed() : 0);
        return listenerToDto(repository.save(listener));
    }
```

### What It Does:

**1. Validation:**
- Checks if listenerId is null or blank
- Validates email format
- Ensures required fields are present
- Prevents duplicate IDs

**2. Entity/DTO Mapping:**
- Converts incoming DTOs (from controllers) to entities (for database)
- Converts entities (from database) to DTOs (for API responses)
- Protects internal database structure from API

**3. Business Logic:**
- Initializes cumulative stats to 0 for new users
- Handles null values gracefully with defaults
- Prevents duplicate user creation

**4. Transaction Management:**
- `@Transactional` ensures atomic operations
- If anything fails, entire operation rolls back
- Prevents partial updates to database

### Key Interview Points:

**Q: "Why use DTOs instead of returning entities directly?"**
**A:** DTOs decouple the API layer from database structure. If I change the database schema, I don't break the API contract. DTOs also prevent exposing internal fields, allow for different API versions, and can aggregate data from multiple entities.

**Q: "Why check for duplicate IDs in the service layer?"**
**A:** Defense in depth. While the database has unique constraints, checking in service layer gives better error messages and prevents unnecessary database calls. It also allows us to handle the duplicate case with application logic rather than catching database exceptions.

**Q: "Explain the @Transactional annotation."**
**A:** It creates a database transaction boundary. All database operations within this method either succeed together or fail together. If an exception is thrown, Spring automatically rolls back all changes. This prevents inconsistent states where part of an operation succeeds and part fails.

---

## 2. History Service (Listening Tracking)

### Core Responsibilities

```127:195:P1-feedback.fm/backend/src/main/java/com/feedback/fm/feedbackfm/service/HistoryServiceImpl.java
    @Transactional
    public HistoryDTO create(HistoryDTO dto) {
        validateHistoryDTO(dto);
        History history = new History();
        if (dto.playedAt() != null) {
            history.setPlayedAt(dto.playedAt());
        } else {
            history.setPlayedAt(LocalDateTime.now());
        }
        Listener listener = listenerRepository.findById(dto.listenerId())
                .orElseThrow(() -> new ResourceNotFoundException("Listener", dto.listenerId()));
        history.setListener(listener);
        Song song = songRepository.findById(dto.songId())
                .orElseThrow(() -> new ResourceNotFoundException("Song", dto.songId()));
        history.setSong(song);
        return historyToDto(repository.save(history));
    }
```

### What It Does:

**1. Data Integrity Enforcement:**
- Verifies listener exists before creating history entry
- Verifies song exists before creating history entry
- Throws meaningful exceptions if references don't exist
- Prevents orphaned records

**2. Timestamp Handling:**
- Uses provided timestamp if available (from Spotify)
- Falls back to current time if not provided
- Ensures every history entry has a valid timestamp

**3. Relationship Management:**
- Properly establishes foreign key relationships
- Fetches related entities (Listener, Song) from database
- Sets up bidirectional relationships (if configured)

**4. Validation:**
- Checks required fields (listenerId, songId)
- Validates timestamp format if provided
- Ensures data consistency before persistence

### Key Interview Points:

**Q: "Why do you fetch the Listener and Song entities before saving History?"**
**A:** JPA requires actual entity references to establish relationships, not just IDs. This approach also validates that the referenced entities exist (referential integrity). If either is missing, we fail fast with a clear error message rather than getting a cryptic foreign key constraint violation from the database.

**Q: "How do you handle duplicate history entries?"**
**A:** The sync service checks for duplicates before calling create. We could add a unique constraint on (listenerId, songId, playedAt) in the database for additional safety, or implement duplicate detection in the service layer using a combination of listener, song, and timestamp within a small time window.

**Q: "What's the purpose of the DTO conversion?"**
**A:** The entity contains JPA annotations and bidirectional relationships that would cause circular references if serialized directly. The DTO provides a flat, serialization-friendly structure with only the data the API needs to return.

---

## 3. Song Service (Music Catalog)

### Core Responsibilities

```33:186:P1-feedback.fm/backend/src/main/java/com/feedback/fm/feedbackfm/service/SongServiceImpl.java
    public Optional<SongDTO> getById(String id) {
        if (id == null || id.isBlank()) {
            throw new InvalidRequestException("Song ID cannot be null or blank");
        }
        return repository.findById(id).map(this::songToDto);
    }

    @Transactional
    public SongDTO create(SongDTO dto) {
        validateSongDTO(dto);
        if (repository.existsById(dto.songId())) {
            throw new InvalidRequestException("Song with ID '" + dto.songId() + "' already exists");
        }
        Song song = new Song(dto.songId(), dto.name(), dto.durationMs(), dto.href());
        return songToDto(repository.save(song));
    }
```

### What It Does:

**1. Music Metadata Validation:**
- Validates song ID format (not null/blank)
- Ensures name is provided
- Validates duration is positive
- Checks Spotify URL format

**2. Duplicate Prevention:**
- Prevents duplicate song entries with same Spotify ID
- Uses Spotify ID as primary key (external identifier)
- Throws clear error if duplicate detected

**3. Relationship Handling:**
- Song has many-to-many with Artists (through intermediate table)
- Song belongs to one Album
- Song appears in many History entries
- DTO flattens these relationships for API

**4. Entity/DTO Conversion:**
- Entity includes JPA relationships
- DTO includes just IDs and basic fields
- Prevents circular reference issues in JSON serialization

### Key Interview Points:

**Q: "Why use Spotify's ID as your primary key instead of generating your own?"**
**A:** Using Spotify's ID prevents duplicate songs if we sync the same song multiple times. It also makes it easy to correlate our data with Spotify's data - if we need to fetch updated info, we have the Spotify ID readily available. The downside is we're coupled to Spotify's ID scheme.

**Q: "How do you handle relationships between Song, Artist, and Album?"**
**A:** Song has a many-to-many with Artists (because songs can have multiple artists, and artists have multiple songs) and many-to-one with Album. In the database, the many-to-many is represented by a join table. The service layer handles establishing these relationships during sync operations.

**Q: "What happens if Spotify changes song metadata?"**
**A:** Currently, we don't update existing songs. An improvement would be to implement an upsert pattern: check if song exists, and if it does, update the metadata. This would keep our database in sync with Spotify's latest data.

---

## 4. Artist Service (Artist Catalog)

### Core Responsibilities

```typescript
// Similar pattern to Song Service
@Service
public class ArtistServiceImpl implements ArtistService {
    
    @Transactional
    public ArtistDTO create(ArtistDTO dto) {
        validateArtistDTO(dto);
        if (repository.existsById(dto.artistId())) {
            throw new InvalidRequestException("Artist already exists");
        }
        Artist artist = new Artist(dto.artistId(), dto.name(), dto.href());
        return artistToDto(repository.save(artist));
    }
    
    public Optional<ArtistDTO> getById(String id) {
        return repository.findById(id).map(this::artistToDto);
    }
}
```

### What It Does:

**1. Artist Management:**
- Stores Spotify artist ID, name, and profile URL
- Validates artist data before persistence
- Prevents duplicate artists

**2. Relationship Handling:**
- Many-to-many with Songs
- One-to-many with Albums
- Join table managed by JPA

**3. Validation:**
- Checks required fields (ID, name)
- Validates Spotify URL format
- Ensures data integrity

### Key Interview Points:

**Q: "How do you handle the many-to-many relationship between Songs and Artists?"**
**A:** JPA manages a join table automatically. When we save a song with multiple artists, JPA creates entries in the join table. The service layer doesn't directly interact with the join table - we just set the artists collection on the song entity, and JPA handles the rest.

---

## 5. Album Service (Album Catalog)

### Core Responsibilities

```typescript
// Similar pattern to Song/Artist Service
@Service
public class AlbumServiceImpl implements AlbumService {
    
    @Transactional
    public AlbumDTO create(AlbumDTO dto) {
        validateAlbumDTO(dto);
        if (repository.existsById(dto.albumId())) {
            throw new InvalidRequestException("Album already exists");
        }
        Album album = new Album(dto.albumId(), dto.name(), dto.releaseDate(), dto.href());
        return albumToDto(repository.save(album));
    }
}
```

### What It Does:

**1. Album Metadata:**
- Stores album ID, name, release date, cover image
- Links to Spotify album page
- Maintains release date for chronological sorting

**2. Relationships:**
- One album has many songs
- One album belongs to one or more artists
- Songs reference their parent album

**3. Validation:**
- Validates release date format
- Ensures required fields present
- Prevents duplicates

---

## Service Layer Architecture Patterns

### 1. Dependency Injection

All services use constructor-based dependency injection:

```java
@Service
public class ListenerServiceImpl implements ListenerService {
    private final ListenerRepository repository;
    
    @Autowired
    public ListenerServiceImpl(ListenerRepository repository) {
        this.repository = repository;
    }
}
```

**Benefits:**
- Makes dependencies explicit
- Easier to test (can inject mocks)
- Immutable dependencies (final fields)
- Spring manages lifecycle

---

### 2. Interface-Based Design

Each service has an interface:

```java
public interface ListenerService {
    Optional<ListenerDTO> getById(String id);
    ListenerDTO create(ListenerDTO dto);
    ListenerDTO update(String id, ListenerDTO dto);
    void delete(String id);
}
```

**Benefits:**
- Loose coupling between layers
- Easy to swap implementations
- Better for testing (mock the interface)
- Clear contract definition

---

### 3. DTO Pattern

DTOs separate API representation from database entities:

```java
public record ListenerDTO(
    String listenerId,
    String displayName,
    String email,
    String country,
    String href,
    Long totalListeningTimeMs,
    Integer totalSongsPlayed
) {}
```

**Benefits:**
- API stability (changes to entity don't break API)
- Security (don't expose internal fields)
- Flexibility (can aggregate multiple entities)
- Clean JSON serialization

---

### 4. Exception Handling

Custom exceptions with meaningful messages:

```java
throw new ResourceNotFoundException("Listener", listenerId);
throw new InvalidRequestException("Listener ID cannot be null");
```

**Benefits:**
- Controllers can handle different exception types
- Clear error messages for debugging
- Consistent error responses to frontend
- Separates business logic errors from system errors

---

### 5. Transaction Management

`@Transactional` ensures data consistency:

```java
@Transactional
public HistoryDTO create(HistoryDTO dto) {
    // Multiple database operations here
    // All succeed together or all fail together
}
```

**Benefits:**
- Atomic operations (all-or-nothing)
- Automatic rollback on exceptions
- Prevents inconsistent data states
- Handles database locking

---

## Top Service Layer Interview Questions & Answers

### 1. "Explain the role of the service layer in your architecture."
**Answer:** The service layer is the business logic center. It sits between controllers (HTTP boundary) and repositories (data access). Controllers handle HTTP concerns (parsing requests, building responses), services handle business rules (validation, transactions, entity relationships), and repositories handle database operations. This separation follows single responsibility principle and makes each layer testable independently.

**Why this matters:** Shows understanding of layered architecture and separation of concerns.

---

### 2. "Why do you use DTOs instead of passing entities directly?"
**Answer:** DTOs decouple the API from the database structure. If I change the database schema, I don't break API contracts. DTOs also prevent circular reference issues in JSON serialization (entities have bidirectional relationships), control what data is exposed (security), and allow me to aggregate data from multiple entities into one API response. The downside is mapping overhead, but the benefits outweigh the cost.

**Why this matters:** Demonstrates understanding of API design and data transfer patterns.

---

### 3. "How do you handle validation in your services?"
**Answer:** I use a multi-layer approach. First, basic null checks and blank string checks for required fields. Second, format validation (email format, URL format). Third, business rule validation (duration must be positive, listener must exist before creating history). Fourth, database-level constraints as last line of defense. This fails fast and gives clear error messages to the frontend.

**Why this matters:** Shows defense-in-depth approach to data integrity.

---

### 4. "Explain how transactions work in your History service."
**Answer:** When creating a history entry, I need to fetch the Listener entity and Song entity, then save the History entity. If any step fails (listener doesn't exist, song doesn't exist, database error), the entire operation should roll back - I don't want partial data. The @Transactional annotation creates a database transaction boundary. Spring automatically commits if the method completes successfully, or rolls back if an exception is thrown.

**Why this matters:** Tests understanding of ACID properties and transaction management.

---

### 5. "How would you handle updating a song if Spotify changes its metadata?"
**Answer:** Currently, I don't update existing songs. I would implement an upsert pattern: check if the song exists, and if it does, update the fields. I'd need to decide which fields to update (name, duration, album art) and which to preserve (like our internal statistics). I'd also need to consider timestamp tracking (when was this last synced) to avoid unnecessary updates.

**Why this matters:** Shows ability to identify improvements and think through implications.

---

### 6. "Why do you use Spotify IDs as primary keys?"
**Answer:** Using external IDs prevents duplicates during syncing. If I fetch the same song multiple times from Spotify, I want to recognize it's the same song, not create duplicates. It also makes correlation easy - I can quickly look up a song by its Spotify ID without a separate mapping table. The downside is coupling to Spotify's ID format, but since this is a Spotify-focused app, it's acceptable.

**Why this matters:** Demonstrates understanding of database design trade-offs.

---

### 7. "How do you prevent duplicate history entries?"
**Answer:** Currently, the SpotifySyncService checks for duplicates before calling the History service's create method. It queries for existing history entries with the same listener, song, and timestamp (within a small window). An improvement would be adding a unique constraint in the database on (listenerId, songId, playedAt) as a safety net, though we'd need to handle the constraint violation gracefully.

**Why this matters:** Shows understanding of data integrity across multiple layers.

---

### 8. "Explain the relationship between Song, Artist, and Album."
**Answer:** A Song belongs to one Album (many-to-one). A Song can have multiple Artists, and an Artist can have multiple Songs (many-to-many, implemented with a join table). An Album has many Songs (one-to-many). The tricky part is that a Song can have multiple artists (like featured artists), so we can't use a simple foreign key. JPA manages the join table automatically when we set up the relationship annotations.

**Why this matters:** Tests understanding of database relationships and JPA mapping.

---

### 9. "How do you handle errors in the service layer?"
**Answer:** I throw custom exceptions: ResourceNotFoundException when entities don't exist, InvalidRequestException for validation failures, and let system exceptions (like database errors) bubble up. Controllers catch these exceptions and convert them to appropriate HTTP responses (404 for not found, 400 for invalid input, 500 for system errors). This keeps error handling logic centralized in one place.

**Why this matters:** Demonstrates understanding of exception handling strategy and HTTP semantics.

---

### 10. "Why use constructor injection instead of field injection?"
**Answer:** Constructor injection makes dependencies explicit and required - you can't create the service without providing its dependencies. It also allows dependencies to be final, ensuring immutability. For testing, it's easier to provide mocks through constructor rather than using reflection to set private fields. Spring documentation also recommends constructor injection as best practice.

**Why this matters:** Shows awareness of best practices and testability.

---

### 11. "How would you test your service layer?"
**Answer:** I'd use unit tests with mocked repositories. For example, test ListenerService by mocking ListenerRepository to return expected entities, then verify the service correctly validates input, calls repository methods, and maps entities to DTOs. I'd also write integration tests using an in-memory H2 database to test actual database operations and transaction behavior. Key scenarios: successful creation, duplicate prevention, validation failures, not found cases.

**Why this matters:** Tests understanding of testing strategies and testability by design.

---

### 12. "What's the purpose of the Optional return type?"
**Answer:** Optional explicitly signals that a value might not be present, forcing callers to handle the not-found case. It's more expressive than returning null and prevents NullPointerExceptions. Controllers can check Optional.isEmpty() and return 404, or use Optional.orElseThrow() to convert to an exception. It makes the API contract clear: this method might not find anything.

**Why this matters:** Shows understanding of null safety and API design.

---

## Service Layer Summary

### Key Responsibilities
1. **Validation** - Ensure data integrity before database operations
2. **Business Logic** - Enforce application-specific rules
3. **Transaction Management** - Ensure atomic operations
4. **DTO Mapping** - Separate API from database structure
5. **Exception Handling** - Provide meaningful error messages

### Design Patterns Used
- **Dependency Injection** - Loose coupling, easy testing
- **Interface-Based Design** - Flexibility, clear contracts
- **DTO Pattern** - API stability, security, clean serialization
- **Transaction Pattern** - Data consistency, atomic operations
- **Repository Pattern** - Abstract data access layer

### Common Improvements to Discuss
1. **Caching** - Cache frequently accessed data (top artists, top songs)
2. **Batch Operations** - Update multiple records efficiently during sync
3. **Soft Deletes** - Mark as deleted instead of removing from database
4. **Audit Logging** - Track who changed what and when
5. **Validation Framework** - Use JSR-303 annotations for declarative validation
6. **Update Operations** - Implement upsert patterns for sync operations
7. **Pagination** - Add pagination support to list methods
8. **Search** - Implement search functionality across songs/artists/albums

---

## Final Interview Tips

### When Discussing Frontend:
1. **Start with the flow:** Walk through authentication → dashboard → features
2. **Highlight decisions:** Why two tokens? Why polling? Why lazy loading?
3. **Show awareness:** Mention what you'd improve (error handling, token refresh, WebSockets)
4. **Be specific:** Reference actual code patterns and why you chose them

### When Discussing Backend Services:
1. **Emphasize separation:** Controllers → Services → Repositories
2. **Explain validation:** Multi-layer approach, fail fast, clear messages
3. **Discuss transactions:** ACID properties, rollback behavior
4. **Show trade-offs:** External IDs, DTO overhead, validation placement

### General Strategy:
- **Be honest about limitations** - Shows maturity and self-awareness
- **Suggest improvements** - Shows growth mindset and forward thinking
- **Connect to real-world** - Relate to scalability, security, UX concerns
- **Ask questions back** - Shows curiosity and engagement

Good luck with your interview!
