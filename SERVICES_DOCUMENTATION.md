# Services Documentation

This document provides a comprehensive overview of all services in the Feedback.fm application, detailing their responsibilities, methods, and functionality.

## Table of Contents

1. [Core Entity Services](#core-entity-services)
   - [AlbumService](#albumservice)
   - [ArtistService](#artistservice)
   - [HistoryService](#historyservice)
   - [ListenerService](#listenerservice)
   - [PlaylistService](#playlistservice)
   - [SongService](#songservice)
2. [Spotify Integration Services](#spotify-integration-services)
   - [SpotifyApiService](#spotifyapiservice)
   - [SpotifyAuthService](#spotifyauthservice)
   - [SpotifySyncService](#spotifysyncservice)

---

## Core Entity Services

### AlbumService

**Purpose**: Manages album-related operations including CRUD operations, searching, and filtering.

**Interface**: `AlbumService`  
**Implementation**: `AlbumServiceImpl`

#### Methods

- **`getAllAlbums()`**: Returns a list of all albums in the database, converted to DTOs.

- **`getById(String id)`**: Retrieves a specific album by its ID.
  - Validates that the ID is not null or blank
  - Returns `Optional<AlbumDTO>` (empty if not found)

- **`searchByTitle(String titlePart)`**: Searches for albums by title (case-insensitive partial match).
  - Returns empty list if titlePart is null or blank

- **`findByReleaseYear(Integer releaseYear)`**: Finds all albums released in a specific year.
  - Validates year is between 1900 and 2100
  - Returns empty list if releaseYear is null

- **`findByArtistId(String artistId)`**: Finds all albums by a specific artist.
  - Verifies the artist exists before searching
  - Returns empty list if artistId is null or blank

- **`create(AlbumDTO dto)`**: Creates a new album.
  - Validates album data (ID, title required)
  - Checks for duplicate album IDs
  - Optionally associates album with an artist if artistId is provided
  - Validates artist exists if artistId is provided

- **`update(String id, AlbumDTO dto)`**: Updates an existing album.
  - Validates album exists
  - Updates title, release year, and href
  - Can update or clear artist association

- **`delete(String id)`**: Deletes an album by ID.
  - Validates album exists before deletion

#### Key Features
- Transaction management: Read operations are read-only, write operations are transactional
- Validation: Comprehensive input validation with meaningful error messages
- Relationship management: Handles artist-album relationships
- DTO conversion: Converts between entity and DTO objects, including related song IDs

---

### ArtistService

**Purpose**: Manages artist-related operations including CRUD operations and searching.

**Interface**: `ArtistService`  
**Implementation**: `ArtistServiceImpl`

#### Methods

- **`getAllArtists()`**: Returns a list of all artists in the database, converted to DTOs.

- **`getById(String id)`**: Retrieves a specific artist by its ID.
  - Validates that the ID is not null or blank
  - Returns `Optional<ArtistDTO>` (empty if not found)

- **`findByName(String name)`**: Finds artists with an exact name match.
  - Returns empty list if name is null or blank

- **`searchByName(String namePart)`**: Searches for artists by name (case-insensitive partial match).
  - Returns empty list if namePart is null or blank

- **`create(ArtistDTO dto)`**: Creates a new artist.
  - Validates artist data (ID and name required)
  - Checks for duplicate artist IDs

- **`update(String id, ArtistDTO dto)`**: Updates an existing artist.
  - Validates artist exists
  - Updates name and href

- **`delete(String id)`**: Deletes an artist by ID.
  - Validates artist exists before deletion

#### Key Features
- Transaction management: Read operations are read-only, write operations are transactional
- Validation: Ensures required fields are present
- DTO conversion: Includes related album IDs in the DTO

---

### HistoryService

**Purpose**: Manages listening history records, tracking when listeners played specific songs.

**Interface**: `HistoryService`  
**Implementation**: `HistoryServiceImpl`

#### Methods

- **`getAllHistory()`**: Returns all history records in the database.

- **`getById(Long id)`**: Retrieves a specific history record by its ID.
  - Validates that the ID is not null

- **`findByListenerId(String listenerId)`**: Finds all history records for a specific listener.
  - Returns empty list if listenerId is null or blank

- **`findBySongId(String songId)`**: Finds all history records for a specific song.
  - Returns empty list if songId is null or blank

- **`findByListenerIdAndSongId(String listenerId, String songId)`**: Finds history records matching both listener and song.
  - Returns empty list if either parameter is null or blank

- **`getRecentHistoryByListener(String listenerId, int limit)`**: Gets the most recent history records for a listener.
  - Default limit: 20 if limit <= 0
  - Maximum limit: 100 (to prevent performance issues)
  - Orders by playedAt descending

- **`findByDateRange(LocalDateTime start, LocalDateTime end)`**: Finds all history records within a date range.
  - Validates start is before end
  - Both dates are required

- **`findByListenerIdAndDateRange(String listenerId, LocalDateTime start, LocalDateTime end)`**: Finds history records for a listener within a date range.
  - Combines listener and date filtering

- **`create(HistoryDTO dto)`**: Creates a new history record.
  - Validates listener and song exist
  - Requires listenerId and songId
  - Sets playedAt to current time if not provided
  - Validates playedAt is not in the future

- **`update(Long id, HistoryDTO dto)`**: Updates an existing history record.
  - Allows partial updates (only updates provided fields)
  - Validates listener and song exist if IDs are provided

- **`delete(Long id)`**: Deletes a history record by ID.
  - Validates record exists before deletion

#### Key Features
- Transaction management: Read operations are read-only, write operations are transactional
- Validation: Ensures listener and song relationships are valid
- Date handling: Supports date range queries and validates timestamps
- Business rules: Prevents future-dated history entries

---

### ListenerService

**Purpose**: Manages listener (user) accounts, including profile information and listening statistics.

**Interface**: `ListenerService`  
**Implementation**: `ListenerServiceImpl`

#### Methods

- **`getAllListeners()`**: Returns a list of all listeners in the database.

- **`getById(String id)`**: Retrieves a specific listener by their ID.
  - Validates that the ID is not null or blank

- **`findByDisplayName(String displayName)`**: Finds listeners with an exact display name match.
  - Returns empty list if displayName is null or blank

- **`searchByDisplayName(String namePart)`**: Searches for listeners by display name (case-insensitive partial match).
  - Returns empty list if namePart is null or blank

- **`findByEmail(String email)`**: Finds a listener by their email address.
  - Validates email is not null or blank
  - Returns `Optional<ListenerDTO>` (empty if not found)

- **`create(ListenerDTO dto)`**: Creates a new listener account.
  - Validates listener data (ID required)
  - Validates email format if provided
  - Checks for duplicate listener IDs and email addresses
  - Initializes listening statistics (totalListeningTimeMs, totalSongsPlayed) to 0 if not provided

- **`update(String id, ListenerDTO dto)`**: Updates an existing listener's information.
  - Validates listener exists
  - Validates email format and checks for duplicate emails
  - Updates display name, email, country, and href
  - Optionally updates statistics (preserves existing if not provided)

- **`delete(String id)`**: Deletes a listener by ID.
  - Validates listener exists before deletion

#### Key Features
- Transaction management: Read operations are read-only, write operations are transactional
- Email validation: Validates email format (must contain @ and at least one dot after @)
- Email uniqueness: Ensures email addresses are unique across listeners
- Statistics tracking: Manages cumulative listening statistics (total time, songs played)
- Country validation: Validates country code length (max 10 characters)

---

### PlaylistService

**Purpose**: Manages playlists, including creation, updates, and searching by various criteria.

**Interface**: `PlaylistService`  
**Implementation**: `PlaylistServiceImpl`

#### Methods

- **`getAllPlaylists()`**: Returns a list of all playlists in the database.

- **`getById(String id)`**: Retrieves a specific playlist by its ID.
  - Validates that the ID is not null or blank

- **`findByName(String name)`**: Finds playlists with an exact name match.
  - Returns empty list if name is null or blank

- **`searchByName(String namePart)`**: Searches for playlists by name (case-insensitive partial match).
  - Returns empty list if namePart is null or blank

- **`findByOwnerId(String ownerId)`**: Finds all playlists owned by a specific listener.
  - Verifies owner exists before searching
  - Returns empty list if ownerId is null or blank

- **`findByOwnerEmail(String email)`**: Finds all playlists owned by a listener with a specific email.
  - Returns empty list if email is null or blank

- **`findPublicPlaylists()`**: Returns all public playlists (where isPublic is true).

- **`create(PlaylistDTO dto)`**: Creates a new playlist.
  - Validates playlist data (ID and name required)
  - Checks for duplicate playlist IDs
  - Defaults isPublic to false if not provided
  - Optionally associates playlist with an owner if ownerId is provided

- **`update(String id, PlaylistDTO dto)`**: Updates an existing playlist.
  - Validates playlist exists
  - Updates name, description, href, and isPublic
  - Can update or clear owner association

- **`delete(String id)`**: Deletes a playlist by ID.
  - Validates playlist exists before deletion

#### Key Features
- Transaction management: Read operations are read-only, write operations are transactional
- Privacy support: Handles public/private playlist visibility
- Owner management: Links playlists to listener owners
- DTO conversion: Includes related song IDs in the DTO

---

### SongService

**Purpose**: Manages song-related operations including CRUD operations, searching, and filtering by duration.

**Interface**: `SongService`  
**Implementation**: `SongServiceImpl`

#### Methods

- **`getAllSongs()`**: Returns a list of all songs in the database.

- **`getById(String id)`**: Retrieves a specific song by its ID.
  - Validates that the ID is not null or blank

- **`findByName(String name)`**: Finds songs with an exact name match.
  - Returns empty list if name is null or blank

- **`searchByName(String namePart)`**: Searches for songs by name (case-insensitive partial match).
  - Returns empty list if namePart is null or blank

- **`findByArtistName(String artistName)`**: Finds all songs by a specific artist name.
  - Returns empty list if artistName is null or blank

- **`findByDuration(Integer duration)`**: Finds songs with an exact duration (in milliseconds).
  - Returns empty list if duration is null or <= 0

- **`findByDurationRange(Integer minDuration, Integer maxDuration)`**: Finds songs within a duration range.
  - Validates both min and max are provided and positive
  - Validates min <= max

- **`create(SongDTO dto)`**: Creates a new song.
  - Validates song data (ID, name, and duration required)
  - Validates duration is positive and not exceeding 24 hours
  - Checks for duplicate song IDs

- **`update(String id, SongDTO dto)`**: Updates an existing song.
  - Validates song exists
  - Updates name, duration, and href

- **`delete(String id)`**: Deletes a song by ID.
  - Validates song exists before deletion

#### Key Features
- Transaction management: Read operations are read-only, write operations are transactional
- Duration validation: Ensures duration is positive and reasonable (max 24 hours)
- Artist filtering: Supports finding songs by artist name
- Duration range queries: Supports filtering by duration ranges
- DTO conversion: Includes related artist and album IDs in the DTO

---

## Spotify Integration Services

### SpotifyApiService

**Purpose**: Provides direct interaction with the Spotify Web API, handling HTTP requests and responses.

**Implementation**: `SpotifyApiService`

#### Methods

- **`getCurrentUser(String accessToken)`**: Retrieves the current authenticated user's profile from Spotify.
  - Endpoint: `/me`
  - Returns user information including ID, display name, email, country, etc.
  - Throws `SpotifyApiException` on failure

- **`getCurrentlyPlaying(String accessToken)`**: Gets the track currently being played by the user.
  - Endpoint: `/me/player/currently-playing`
  - Returns null if no song is currently playing (204 No Content)
  - Returns null on errors (graceful handling)

- **`getTopArtists(String accessToken, String timeRange)`**: Retrieves the user's top artists.
  - Endpoint: `/me/top/artists`
  - Time range options: `short_term`, `medium_term` (default), `long_term`
  - Limit: 50 artists
  - Throws `SpotifyApiException` on failure

- **`getTopTracks(String accessToken, String timeRange)`**: Retrieves the user's top tracks.
  - Endpoint: `/me/top/tracks`
  - Time range options: `short_term`, `medium_term` (default), `long_term`
  - Limit: 50 tracks
  - Throws `SpotifyApiException` on failure

- **`getRecentlyPlayed(String accessToken, int limit)`**: Gets the user's recently played tracks.
  - Endpoint: `/me/player/recently-played`
  - Limit: 1-50 (defaults to 50 if invalid)
  - Returns empty map if no tracks found or on error (graceful handling)

- **`getUserPlaylists(String accessToken, int limit, int offset)`**: Retrieves the user's playlists.
  - Endpoint: `/me/playlists`
  - Limit: 1-50 (defaults to 50 if invalid)
  - Offset: >= 0 (defaults to 0 if invalid)
  - Supports pagination
  - Throws `SpotifyApiException` on failure

- **`getPlaylistTracks(String accessToken, String playlistId)`**: Gets tracks from a specific playlist.
  - Endpoint: `/playlists/{playlistId}/tracks`
  - Throws `SpotifyApiException` on failure

#### Key Features
- Authentication: All methods require a valid access token
- Error handling: Throws `SpotifyApiException` for API errors, `AuthenticationException` for auth issues
- HTTP client: Uses Spring's `RestTemplate` for API calls
- Header management: Automatically sets Bearer token and JSON content type
- Configuration: Uses `spotify.api.base.url` from application properties

---

### SpotifyAuthService

**Purpose**: Handles Spotify OAuth 2.0 authentication flow, including authorization URL generation and token management.

**Implementation**: `SpotifyAuthService`

#### Methods

- **`getAuthorizationUrl()`**: Generates the Spotify authorization URL for OAuth flow.
  - Base URL: `https://accounts.spotify.com/authorize`
  - Includes required scopes: `user-read-private`, `user-read-email`, `user-read-recently-played`, `user-top-read`, `user-read-currently-playing`
  - URL-encodes parameters
  - Throws `SpotifyApiException` on encoding errors

- **`exchangeCodeForToken(String code)`**: Exchanges an authorization code for access and refresh tokens.
  - Endpoint: `https://accounts.spotify.com/api/token`
  - Uses Basic authentication with client ID and secret
  - Grant type: `authorization_code`
  - Returns token response (access_token, refresh_token, expires_in, etc.)
  - Throws `SpotifyApiException` on failure

- **`refreshToken(String refreshToken)`**: Refreshes an expired access token using a refresh token.
  - Endpoint: `https://accounts.spotify.com/api/token`
  - Uses Basic authentication with client ID and secret
  - Grant type: `refresh_token`
  - Validates refresh token is not null or blank
  - Returns new token response
  - Throws `SpotifyApiException` on failure

#### Key Features
- OAuth 2.0 flow: Implements standard OAuth 2.0 authorization code flow
- Token management: Handles both access and refresh tokens
- Security: Uses Base64-encoded Basic authentication for token requests
- Configuration: Uses `spotify.client.id`, `spotify.client.secret`, and `spotify.redirect.uri` from application properties
- Error handling: Throws `SpotifyApiException` for API errors, `InvalidRequestException` for invalid refresh tokens

---

### SpotifySyncService

**Purpose**: Orchestrates synchronization of Spotify data into the local database, managing relationships between entities and maintaining listening statistics.

**Implementation**: `SpotifySyncService`

#### Methods

- **`syncUserProfile(String accessToken)`**: Synchronizes the current user's Spotify profile.
  - Fetches user data from Spotify API
  - Creates or updates listener record with Spotify ID, display name, email, country, and href
  - Maps Spotify user ID to listener ID

- **`syncRecentlyPlayed(String accessToken, String listenerId)`**: Synchronizes recently played tracks.
  - Fetches up to 50 recently played tracks
  - For each track:
    - Syncs song, artists, and album entities
    - Creates history records with timestamps
    - Prevents duplicate history entries (checks within 1-minute tolerance)
  - Updates cumulative listener statistics (totalListeningTimeMs, totalSongsPlayed)
  - Logs sync progress and statistics

- **`syncTopArtists(String accessToken, String listenerId, String timeRange)`**: Synchronizes top artists.
  - Fetches top artists for specified time range
  - Syncs each artist to the database
  - Time ranges: `short_term`, `medium_term`, `long_term`

- **`syncTopTracks(String accessToken, String listenerId, String timeRange)`**: Synchronizes top tracks.
  - Fetches top tracks for specified time range
  - Syncs songs, artists, and albums for each track
  - Time ranges: `short_term`, `medium_term`, `long_term`

- **`syncUserPlaylists(String accessToken, String listenerId)`**: Synchronizes user's playlists.
  - Fetches up to 50 playlists (with pagination support)
  - Creates or updates playlist records
  - Associates playlists with the listener as owner
  - Note: Playlist tracks are not automatically synced (can be done separately)

- **`updateStatsFromCurrentlyPlaying(String listenerId, Map<String, Object> trackData)`**: Updates statistics from currently playing track.
  - Syncs the currently playing song
  - Creates a history entry if not recently recorded (within 1 minute)
  - Updates cumulative listener statistics
  - Prevents duplicate entries

- **`recalculateStatsFromHistory(String listenerId)`**: Recalculates listener statistics from all history records.
  - Useful for data integrity or after manual corrections
  - Sums all song durations from history records
  - Counts total history records
  - Updates listener's totalListeningTimeMs and totalSongsPlayed
  - Logs recalculation results

#### Private Helper Methods

- **`syncSong(Map<String, Object> track)`**: Syncs a song from Spotify track data.
  - Extracts song ID, name, duration, and href
  - Creates or updates song record

- **`syncArtistsForSong(Map<String, Object> track, String songId)`**: Syncs artists for a song.
  - Syncs each artist from the track
  - Establishes bidirectional relationship between song and artists

- **`syncArtist(Map<String, Object> artistData)`**: Syncs an artist from Spotify artist data.
  - Extracts artist ID, name, and href
  - Creates or updates artist record

- **`syncAlbumForSong(Map<String, Object> track, String songId)`**: Syncs album for a song.
  - Extracts album ID, title, release year, and href
  - Parses release date (handles YYYY, YYYY-MM, YYYY-MM-DD formats)
  - Syncs primary album artist
  - Establishes relationship between song and album

- **`parseSpotifyTimestamp(String timestamp)`**: Parses ISO 8601 timestamp from Spotify.
  - Converts to LocalDateTime
  - Returns current time if parsing fails

#### Key Features
- Transaction management: All sync operations are transactional
- Relationship management: Automatically creates and maintains relationships between songs, artists, albums, and playlists
- Duplicate prevention: Prevents duplicate history entries using timestamp tolerance
- Statistics tracking: Maintains cumulative listening statistics (total time, songs played)
- Data integrity: Supports recalculation of statistics from history
- Error handling: Gracefully handles missing or invalid data from Spotify API
- Logging: Provides detailed logging for sync operations and statistics updates
- Idempotency: Sync operations can be safely repeated (creates or updates as needed)

---

## Service Architecture Patterns

### Common Patterns Across Services

1. **DTO Pattern**: All services use Data Transfer Objects (DTOs) to separate API contracts from internal entity models.

2. **Repository Pattern**: Services delegate data access to Spring Data JPA repositories.

3. **Transaction Management**: 
   - Read operations are marked as `@Transactional(readOnly = true)`
   - Write operations use `@Transactional` for atomicity

4. **Validation**: Comprehensive input validation with meaningful error messages:
   - Null/blank checks
   - Business rule validation (e.g., date ranges, duration limits)
   - Relationship validation (e.g., ensuring referenced entities exist)

5. **Exception Handling**: Services throw domain-specific exceptions:
   - `InvalidRequestException`: For validation errors
   - `ResourceNotFoundException`: For missing resources
   - `SpotifyApiException`: For Spotify API errors
   - `AuthenticationException`: For authentication errors

6. **Entity-DTO Conversion**: Each service implements private methods to convert between entities and DTOs, including related entity IDs.

---

## Dependencies Between Services

- **SpotifySyncService** depends on all other services:
  - Uses `ListenerService`, `SongService`, `ArtistService`, `AlbumService`, `PlaylistService`, `HistoryService`
  - Uses `SpotifyApiService` for API calls
  - Directly uses repositories for relationship management and statistics updates

- **Core Entity Services** are independent of each other but may reference related entities through repositories.

- **SpotifyApiService** and **SpotifyAuthService** are independent utility services.

---

## Configuration Requirements

### Application Properties

Services require the following configuration:

```properties
# Spotify API Configuration
spotify.api.base.url=https://api.spotify.com/v1
spotify.client.id=<your-client-id>
spotify.client.secret=<your-client-secret>
spotify.redirect.uri=<your-redirect-uri>
```

---

## Usage Examples

### Example: Syncing User Data

```java
// 1. Get authorization URL
String authUrl = spotifyAuthService.getAuthorizationUrl();
// Redirect user to authUrl

// 2. Exchange code for token
Map<String, Object> tokenResponse = spotifyAuthService.exchangeCodeForToken(code);
String accessToken = (String) tokenResponse.get("access_token");

// 3. Sync user profile
spotifySyncService.syncUserProfile(accessToken);

// 4. Sync listening history
String listenerId = (String) spotifyApiService.getCurrentUser(accessToken).get("id");
spotifySyncService.syncRecentlyPlayed(accessToken, listenerId);
```

### Example: Querying History

```java
// Get recent history for a listener
List<HistoryDTO> recentHistory = historyService.getRecentHistoryByListener(listenerId, 20);

// Get history for a date range
LocalDateTime start = LocalDateTime.now().minusDays(7);
LocalDateTime end = LocalDateTime.now();
List<HistoryDTO> weekHistory = historyService.findByListenerIdAndDateRange(listenerId, start, end);
```

### Example: Managing Playlists

```java
// Create a playlist
PlaylistDTO newPlaylist = new PlaylistDTO(
    "playlist-id",
    "My Playlist",
    "Description",
    "https://open.spotify.com/playlist/...",
    false, // isPublic
    listenerId,
    new ArrayList<>() // songIds
);
playlistService.create(newPlaylist);

// Find public playlists
List<PlaylistDTO> publicPlaylists = playlistService.findPublicPlaylists();
```

---

## Notes

- All services use Spring's `@Service` annotation for dependency injection.
- Services follow the interface-implementation pattern for testability.
- The sync service is designed to be idempotent - running sync operations multiple times is safe.
- Statistics are maintained both incrementally (during syncs) and can be recalculated from history for data integrity.
