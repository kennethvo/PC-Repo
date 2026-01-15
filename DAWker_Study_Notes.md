# DAWker Frontend — Interview Deep Dive

This document is your comprehensive guide to DAWker's frontend architecture, core flows, and technical decision-making. It's organized to answer the questions interviewers will ask when you present your frontend.

---

## Executive Summary: What is DAWker?

**DAWker** is a web-based Digital Audio Workstation (DAW) with social features. Users can:
1. Process live audio input through a guitar amp simulation (distortion, EQ, reverb) using the **Web Audio API**
2. Save and load their custom amp presets to/from a Spring Boot backend
3. Browse community presets, rate/comment on them, and participate in forums

**Tech stack:**
- **Frontend:** React 18 + TypeScript, React Router, Tailwind CSS
- **Audio:** Native Web Audio API (browser-native, zero dependencies)
- **Backend communication:** Fetch API with DTOs (Data Transfer Objects)
- **State management:** React hooks (`useState`, `useEffect`, `useRef`) + localStorage for session persistence

**Key differentiator:** Real-time, low-latency audio processing happens entirely in the browser (no server round-trips), while preset management and social features use REST APIs for persistence.

---

## High-Level Frontend Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         App.jsx (Router)                         │
│  ┌────────────────┐  ┌──────────────────────────────────────┐  │
│  │  Public Routes │  │        Authenticated Routes          │  │
│  │  • Landing     │  │  ┌────────────────────────────────┐  │  │
│  │  • Login       │  │  │   Layout (Sidebar + Outlet)    │  │  │
│  │  • Register    │  │  │  • NativeAmpDemo (DAW UI)      │  │  │
│  └────────────────┘  │  │  • Search (browse presets)     │  │  │
│                      │  │  • Forums (community)          │  │  │
│                      │  │  • UserPage (profile)          │  │  │
│                      │  └────────────────────────────────┘  │  │
│                      └──────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                                    ↓
                    ┌───────────────────────────────┐
                    │    API Utilities              │
                    │  • dawAPI.ts (DAW CRUD)       │
                    │  • userAPI.ts (auth/session)  │
                    │  • dawUtils.ts (DTO builders) │
                    └───────────────────────────────┘
                                    ↓
                    ┌───────────────────────────────┐
                    │   Spring Boot Backend         │
                    │   (REST endpoints + DB)       │
                    └───────────────────────────────┘
```

---

## Core Flow 1: Application Bootstrap & Routing

### How the app starts (`App.jsx`)

**What happens on page load:**
1. React mounts `App` component
2. `BrowserRouter` initializes client-side routing
3. React Router evaluates the current URL and renders the matching route

**Route structure:**

```javascript
<BrowserRouter>
  <Routes>
    {/* Public routes (no auth required) */}
    <Route path="/" element={<Landing />} />
    <Route path="/login" element={<Loggin />} />
    <Route path="/create-account" element={<CreateAccount />} />

    {/* Protected routes (wrapped in Layout with sidebar) */}
    <Route element={<Layout />}>
      <Route path="/search" element={<Searchts />} />
      <Route path="/native-amp/:dawId?" element={<NativeAmpDemo />} />
      <Route path="/userpage" element={<UserPage />} />
      <Route path="/forums" element={<Forums />} />
      <Route path="/forums/:postId" element={<ForumPage />} />
      <Route path="/settings" element={<SettingsPage />} />
    </Route>
  </Routes>
</BrowserRouter>
```

**Key interview points:**

1. **Nested routing with `<Layout />`**: All authenticated pages share a common layout (sidebar + main content area). The `<Outlet />` component in `Layout.tsx` renders the child route.

2. **Optional route parameters**: `/native-amp/:dawId?` — the `?` makes `dawId` optional. If no ID is provided, the component loads a default preset. If an ID is present (e.g., from the search page), it loads that specific DAW.

3. **No protected route guard**: Currently, the app doesn't enforce authentication on protected routes. In production, you'd wrap `<Route element={<Layout />}>` with a `<PrivateRoute>` component that checks `userAPI.currentUser` and redirects to `/login` if null.

**Layout component (`Layout.tsx`):**

```typescript
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

function Layout() {
  return (
    <div className="flex h-screen w-full bg-zinc-900">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Outlet />  {/* Child route renders here */}
      </div>
    </div>
  );
}
```

**Why this matters:**
- **Single sidebar instance**: The sidebar doesn't re-mount when navigating between pages (better performance, preserves scroll state).
- **Flex layout**: `flex h-screen` ensures the sidebar and content fill the viewport. `overflow-auto` on the content area allows scrolling without breaking the layout.

---

## Core Flow 2: User Authentication & Session Management

### Login flow (`userAPI.ts`)

**Sequence:**
1. User enters email/password in `Loggin.tsx`
2. Component calls `userAPI.login(email, password)`
3. `userAPI` sends POST to `/api/User/auth`
4. Backend validates credentials, returns `userDTO` (or 401/404)
5. If successful, `userAPI` stores user in:
   - **In-memory cache** (`_currentUser`) for fast access during the session
   - **localStorage** (`dawker_session_user`) for persistence across page refreshes

**Code walkthrough:**

```typescript
class UserApiService {
  private _currentUser: userDTO | null = null;
  private readonly STORAGE_KEY = 'dawker_session_user';

  constructor() {
    // On startup, restore session from localStorage
    const savedSession = localStorage.getItem(this.STORAGE_KEY);
    if (savedSession) {
      try {
        this._currentUser = JSON.parse(savedSession);
      } catch (e) {
        // If JSON is corrupted, clear it
        localStorage.removeItem(this.STORAGE_KEY);
      }
    }
  }

  public get currentUser(): userDTO | null {
    return this._currentUser;
  }

  login = async (userEmail: string, userPassword: string): Promise<userDTO | null> => {
    const response = await fetch(`${API_BASE_URL}/User/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: userEmail, userPassword })
    });

    // Handle auth failure
    if (response.status === 404 || response.status === 401) return null;

    const loggedIn = await response.json();
    if (loggedIn) {
      // Update both cache and localStorage
      this._currentUser = loggedIn;
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(loggedIn));
    }
    return loggedIn;
  }
}

export const userAPI = new UserApiService();  // Singleton instance
```

**Key interview points:**

1. **Singleton pattern**: `userAPI` is instantiated once and exported. Every component that imports `userAPI` shares the same instance, so `currentUser` is globally accessible.

2. **Dual-layer caching**: 
   - **Memory cache** (`_currentUser`) is fast but lost on page refresh.
   - **localStorage** persists across sessions, so users stay logged in even if they close the tab.

3. **Why not use Context API or Redux?** For a small app, a singleton service is simpler and avoids prop drilling. If the app grew to dozens of components needing user state, you'd refactor to Context.

4. **Security concern**: Storing user data in localStorage is vulnerable to XSS attacks. In production, you'd use **httpOnly cookies** for tokens and only store non-sensitive user metadata in localStorage.

5. **Error handling**: If localStorage contains malformed JSON (e.g., user manually edited it), the `catch` block clears it instead of crashing the app.

---

## Core Flow 3: Loading & Saving DAW Presets

This is the most complex flow and the one interviewers will dig into. It involves:
1. Fetching a DAW DTO from the backend
2. Converting DTO parameters into UI state (slider values)
3. Building a Web Audio graph from those values
4. Capturing user changes to sliders
5. Converting UI state back into a DTO
6. Saving the DTO to the backend

### Step 1: Fetching a DAW (`dawAPI.ts`)

**When it happens:**
- User navigates to `/native-amp/:dawId` (e.g., from search results)
- `NativeAmpDemo` component mounts and calls `dawAPI.getDawById(dawId)` in `useEffect`

**Code:**

```typescript
export const dawAPI = {
  getDawById: async (dawId: string): Promise<DawDTO> => {
    const response = await fetch(`${API_BASE_URL}/search/daw?dawId=${dawId}`);
    if (!response.ok) {
      throw new Error(`Failed to load DAW: ${response.statusText}`);
    }
    return await response.json();
  }
};
```

**What the backend returns (DawDTO structure):**

```typescript
{
  dawId: "587990d4-ede8-475a-a0a6-ee10c067f433",
  userId: 1,
  name: "Heavy Metal Crunch",
  description: "High-gain amp with scooped mids",
  createdAt: "2026-01-10T15:30:00",
  exportCount: 42,
  listOfConfigs: [
    {
      id: 1,
      name: "Default Config",
      components: [
        {
          id: 1,
          instanceId: "amp-123456",
          name: "Amp",
          type: "distortion",
          settings: {
            id: 1,
            Technology: "TONEJS",
            export_name: "amp-simulation",
            parameters: {
              inputGain: 5.0,
              directMode: false,
              distortionAmount: 0.8,
              bassValue: 3.0,
              midValue: -2.0,
              trebleValue: 4.0,
              reverbAmount: 0.3,
              volumeValue: -6.0
            }
          }
        }
      ]
    }
  ]
}
```

**Key interview points:**

1. **Hierarchical DTO structure**: DAW → configs → components → settings → parameters. This mirrors the backend entity graph (JPA relationships with `@OneToMany`).

2. **Why configs is an array?** In the future, users could have multiple signal chain configurations (e.g., "Clean", "Crunch", "Lead") and switch between them. Currently, DAWker only uses the first config (`listOfConfigs[0]`).

3. **Why components is an array?** Each component is an audio processor (amp, pedal, cabinet). They're processed in array order to build the signal chain. This design supports adding more components later (e.g., delay, chorus).

4. **Separation of concerns**: The DTO only describes the audio settings—it doesn't contain audio processing logic. That lives in `NativeAmpDemo.tsx`.

### Step 2: Converting DTO → UI State (`NativeAmpDemo.tsx` + `dawUtils.ts`)

**What happens:**
1. `NativeAmpDemo` receives the `DawDTO` from the API
2. Extracts `daw.listOfConfigs[0].components` (the component array)
3. Calls `applyNativeAmpStateFromComponentDTOs(components, setters)` to update slider values

**Code in `NativeAmpDemo.tsx`:**

```typescript
useEffect(() => {
  // Load DAW on component mount
  let { dawId } = useParams<{ dawId: string }>();
  if (dawId == null) {
    dawId = SEEDED_DAW_ID;  // Fallback to default preset
  }

  dawAPI.getDawById(dawId)
    .then((daw: DawDTO) => {
      // Store full DAW state for later save
      setDawState(daw);
      setDawName(daw.name);
      setDescription(daw.description);
      setConfigName(daw.listOfConfigs?.[0]?.name || '');

      // Extract first config's components
      const firstConfig = daw.listOfConfigs?.[0];
      if (firstConfig?.components && firstConfig.components.length > 0) {
        const components = firstConfig.components;

        // Apply component parameters to UI sliders
        const success = applyNativeAmpStateFromComponentDTOs(components, {
          setInputGain,
          setDirectMode,
          setDistortionAmount,
          setBassValue,
          setMidValue,
          setTrebleValue,
          setReverbAmount,
          setVolumeValue,
        });

        if (!success) {
          console.warn('Failed to apply preset');
        }
      }
    })
    .catch((error) => {
      console.error('Error loading DAW:', error);
    });
}, []);  // Empty dependency array = run once on mount
```

**Code in `dawUtils.ts` (the conversion logic):**

```typescript
export function applyNativeAmpStateFromComponentDTOs(
  components: ComponentDTO[],
  setters: {
    setInputGain: (v: number) => void;
    setDirectMode: (v: boolean) => void;
    setDistortionAmount: (v: number) => void;
    setBassValue: (v: number) => void;
    setMidValue: (v: number) => void;
    setTrebleValue: (v: number) => void;
    setReverbAmount: (v: number) => void;
    setVolumeValue: (v: number) => void;
  }
): boolean {
  // Find the "Amp" component in the array
  const ampComponent = components.find(c => c.name === 'Amp');
  if (!ampComponent) return false;

  const params = ampComponent.settings?.parameters;
  if (!params) return false;

  // Call React state setters with parameter values
  setters.setInputGain(params.inputGain ?? 5.0);
  setters.setDirectMode(params.directMode ?? false);
  setters.setDistortionAmount(params.distortionAmount ?? 0.5);
  setters.setBassValue(params.bassValue ?? 0);
  setters.setMidValue(params.midValue ?? 0);
  setters.setTrebleValue(params.trebleValue ?? 0);
  setters.setReverbAmount(params.reverbAmount ?? 0.3);
  setters.setVolumeValue(params.volumeValue ?? -6);

  return true;
}
```

**Key interview points:**

1. **Why pass setters as an object?** It's a clean way to pass multiple state setters without 8 individual function parameters. It also makes the function testable (you can mock the setters).

2. **Nullish coalescing (`??`)**: If a parameter is missing from the DTO, use a sensible default. This prevents the UI from breaking if the backend sends incomplete data.

3. **Why return boolean?** To signal success/failure to the caller. If `applyNativeAmpStateFromComponentDTOs` returns `false`, `NativeAmpDemo` logs a warning instead of silently failing.

4. **Why `useEffect` with empty deps?** We only want to load the DAW **once** when the component mounts. If we omitted the dependency array, it would run on every render (infinite loop). If we included state variables, it would re-fetch on every state change.

5. **Trade-off: storing full `dawState`**: We store the entire `DawDTO` in state (`setDawState(daw)`) even though we only need `parameters` for the UI. Why? Because when the user saves, we need to preserve the original `dawId`, `userId`, `createdAt`, and entity IDs. If we only stored `parameters`, we'd lose that metadata.

---

## Core Flow 4: Building the Web Audio Graph

This is the most technically impressive part of the frontend. You're using the **Web Audio API**—a low-level browser API—to process live audio in real time.

### What is the Web Audio API?

- A powerful, low-latency audio processing framework built into modern browsers
- Allows you to build **audio graphs**: chains of audio nodes (sources, effects, destinations)
- Used by professional web DAWs like Soundtrap, Bandlab, and Ableton Live (web version)

### Audio graph structure in DAWker

```
┌──────────────┐
│ Microphone   │  (MediaStreamSource)
│ Input        │
└──────┬───────┘
       │
       v
┌──────────────┐
│ Input Gain   │  (Amplify mic signal 5x for hot pickups)
└──────┬───────┘
       │
       v
┌──────────────┐
│ Distortion   │  (WaveShaper with custom curve)
└──────┬───────┘
       │
       v
┌──────────────┐
│ Bass EQ      │  (Biquad lowshelf filter @ 250 Hz)
└──────┬───────┘
       │
       v
┌──────────────┐
│ Mid EQ       │  (Biquad peaking filter @ 1000 Hz)
└──────┬───────┘
       │
       v
┌──────────────┐
│ Treble EQ    │  (Biquad highshelf filter @ 4000 Hz)
└──────┬───────┘
       │
       ├─────────────────────────┐
       │                         │
       v                         v
┌──────────────┐         ┌──────────────┐
│ Dry Signal   │         │ Reverb       │  (Convolver with IR)
│ (Gain)       │         │ (Convolver)  │
└──────┬───────┘         └──────┬───────┘
       │                         │
       │                         v
       │                  ┌──────────────┐
       │                  │ Wet Signal   │
       │                  │ (Gain)       │
       │                  └──────┬───────┘
       │                         │
       v                         v
┌────────────────────────────────────┐
│     Channel Merger (L/R split)     │
└──────────────┬─────────────────────┘
               │
               v
        ┌──────────────┐
        │ Master Volume│
        └──────┬───────┘
               │
               ├─────────────────────┐
               v                     v
        ┌──────────┐         ┌──────────────┐
        │ Analyser │         │ Destination  │
        │ (for VU) │         │ (Speakers)   │
        └──────────┘         └──────────────┘
```

### Code walkthrough (`NativeAmpDemo.tsx`)

**When audio starts:**
1. User clicks "Power On" button
2. `togglePower()` is called
3. Browser prompts for microphone permission
4. Audio context and graph are built

```typescript
const togglePower = async () => {
  if (!isOn) {
    try {
      // 1. Create audio context (Safari needs webkit prefix)
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      const context = new AudioContextClass();
      audioContextRef.current = context;

      // 2. Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: false,  // Disable processing for guitar
          noiseSuppression: false,
          autoGainControl: false
        }
      });
      mediaStreamRef.current = stream;

      // 3. Create source node from microphone
      const source = context.createMediaStreamSource(stream);
      sourceNodeRef.current = source;

      // 4. Create input gain (boost weak guitar pickups)
      const inputGainNode = context.createGain();
      inputGainNode.gain.value = inputGain;  // Default: 5.0 (14dB boost)
      inputGainNodeRef.current = inputGainNode;

      // 5. Create analyser for VU meter
      const analyser = context.createAnalyser();
      analyser.fftSize = 256;
      analyserRef.current = analyser;

      // 6. Build effect chain
      if (directMode) {
        // Clean signal (bypass effects)
        source.connect(inputGainNode);
        inputGainNode.connect(analyser);
        inputGainNode.connect(context.destination);
      } else {
        // Full amp simulation
        
        // Distortion (WaveShaper with custom curve)
        const distortion = context.createWaveShaper();
        distortion.curve = makeDistortionCurve(distortionAmount * 100);
        distortion.oversample = '4x';  // Anti-aliasing
        distortionNodeRef.current = distortion;

        // Bass EQ (lowshelf @ 250 Hz)
        const bassFilter = context.createBiquadFilter();
        bassFilter.type = 'lowshelf';
        bassFilter.frequency.value = 250;
        bassFilter.gain.value = bassValue;  // -12 to +12 dB
        bassFilterRef.current = bassFilter;

        // Mid EQ (peaking @ 1000 Hz)
        const midFilter = context.createBiquadFilter();
        midFilter.type = 'peaking';
        midFilter.frequency.value = 1000;
        midFilter.Q.value = 1;
        midFilter.gain.value = midValue;
        midFilterRef.current = midFilter;

        // Treble EQ (highshelf @ 4000 Hz)
        const trebleFilter = context.createBiquadFilter();
        trebleFilter.type = 'highshelf';
        trebleFilter.frequency.value = 4000;
        trebleFilter.gain.value = trebleValue;
        trebleFilterRef.current = trebleFilter;

        // Reverb (convolution with generated impulse response)
        const reverbIR = generateReverbIR(context, 0.7);  // 0.7s room size
        const reverbConvolver = context.createConvolver();
        reverbConvolver.buffer = reverbIR;
        reverbConvolverRef.current = reverbConvolver;

        // Wet/dry mix for reverb
        const reverbGain = context.createGain();
        reverbGain.gain.value = reverbAmount;  // 0-1 (wet signal level)
        reverbGainRef.current = reverbGain;

        const dryGain = context.createGain();
        dryGain.gain.value = 1 - reverbAmount;  // Inverse (dry signal level)
        dryGainRef.current = dryGain;

        // Master volume (dB to linear gain conversion)
        const masterVolume = context.createGain();
        masterVolume.gain.value = Math.pow(10, volumeValue / 20);  // -6dB = 0.5x
        masterVolumeRef.current = masterVolume;

        // Connect the graph
        source.connect(inputGainNode);
        inputGainNode.connect(distortion);
        distortion.connect(bassFilter);
        bassFilter.connect(midFilter);
        midFilter.connect(trebleFilter);

        // Split to dry and wet paths
        trebleFilter.connect(dryGain);
        trebleFilter.connect(reverbConvolver);
        reverbConvolver.connect(reverbGain);

        // Merge wet/dry into stereo
        const merger = context.createChannelMerger(2);
        dryGain.connect(merger, 0, 0);   // Dry to left
        reverbGain.connect(merger, 0, 1); // Wet to right

        // Final output
        merger.connect(masterVolume);
        masterVolume.connect(analyser);
        masterVolume.connect(context.destination);
      }

      setIsOn(true);
    } catch (error) {
      console.error('Failed to start audio:', error);
      alert('Microphone access denied or not available');
    }
  } else {
    // Power off: disconnect and clean up
    if (audioContextRef.current) {
      await audioContextRef.current.close();
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    setIsOn(false);
  }
};
```

### Key interview points: Web Audio API

1. **Why use `useRef` for audio nodes?**
   - Audio nodes are **not React state**—they don't trigger re-renders when changed.
   - Storing them in `useRef` keeps them alive across renders without causing unnecessary updates.
   - When you change a slider, you directly mutate the node (e.g., `bassFilterRef.current.gain.value = newValue`) instead of re-building the entire graph.

2. **Why disable echo cancellation/noise suppression?**
   - These browser features are designed for voice calls, not music.
   - They introduce latency and distort guitar signals.
   - For music production, you want the raw mic input.

3. **What is a WaveShaper?**
   - A non-linear distortion effect that maps input samples to output samples using a curve (lookup table).
   - `makeDistortionCurve(amount)` generates a sigmoid-like curve that soft-clips the signal.
   - Higher `amount` = more aggressive clipping = more distortion.

4. **Why `oversample = '4x'`?**
   - Distortion creates high-frequency harmonics that can alias (fold back into audible range).
   - Oversampling runs the effect at 4x sample rate, then downsamples, reducing aliasing artifacts.

5. **What is convolution reverb?**
   - Reverb simulates sound bouncing in a space (room, hall, cathedral).
   - **Convolution reverb** uses an **impulse response** (IR): a recording of a space's acoustic signature.
   - `generateReverbIR()` creates a synthetic IR with exponential decay and resonance.
   - Real-world DAWs use pre-recorded IRs (e.g., Abbey Road Studio 2).

6. **Why split wet/dry signals?**
   - Gives user control over reverb intensity without changing the effect itself.
   - 100% dry = no reverb, 100% wet = only reverb, 50/50 = balanced.
   - The `ChannelMerger` routes dry to left and wet to right for stereo width.

7. **dB to linear gain conversion (`Math.pow(10, dB / 20)`)**:
   - Audio levels are measured in **decibels (dB)**, which is logarithmic.
   - Web Audio API expects **linear gain** (0.0 to 1.0+).
   - Formula: `gain = 10^(dB/20)`
   - Examples:
     - 0 dB = 1.0x (unity gain)
     - -6 dB = 0.5x (half volume)
     - +6 dB = 2.0x (double volume)

8. **Latency considerations:**
   - Web Audio API is **sample-accurate**: effects are applied in real time at 44.1/48 kHz.
   - Typical latency on modern hardware: 10-20ms (acceptable for live monitoring).
   - For comparison, hardware guitar amps have ~5ms latency, most guitarists can't perceive <20ms.

---

## Core Flow 5: Real-Time Slider Updates

**What happens when a user moves a slider:**

```typescript
// Example: Bass slider
<input
  type="range"
  min="-12"
  max="12"
  step="0.1"
  value={bassValue}
  onChange={(e) => {
    const newValue = parseFloat(e.target.value);
    setBassValue(newValue);  // Update React state (for UI display)
    
    // Directly update the audio node (no re-render needed)
    if (bassFilterRef.current) {
      bassFilterRef.current.gain.value = newValue;
    }
  }}
/>
```

**Key interview points:**

1. **Dual update pattern:**
   - `setBassValue(newValue)` updates React state → UI displays new value
   - `bassFilterRef.current.gain.value = newValue` updates audio node → sound changes immediately

2. **Why not just use state?**
   - If we only updated state, the audio wouldn't change until the next render (too slow for real-time audio).
   - If we only updated the audio node, the UI wouldn't reflect the change.

3. **No debouncing needed:**
   - Audio parameter changes are cheap (just setting a number).
   - Updating the node 60 times/second (during a slider drag) is fine.

---

## Core Flow 6: Saving Presets (UI State → DTO)

**When the user clicks "Save Preset":**

```typescript
const handleSavePreset = async () => {
  if (!dawName.trim() || !configName.trim()) {
    alert('Please enter DAW name and Config name');
    return;
  }

  try {
    // Build DTO from current UI state
    const dawDTO = buildDawDTOFromNativeAmpState(
      dawState?.dawId,           // Preserve existing ID (for update)
      dawName,
      description,
      dawState?.exportCount,
      dawState?.createdAt,
      userAPI.currentUser?.id,   // Current user
      configName,
      dawState?.listOfConfigs?.[0]?.id,  // Preserve config ID
      dawState?.listOfConfigs?.[0]?.components?.[0]?.id,  // Preserve component ID
      dawState?.listOfConfigs?.[0]?.components?.[0]?.instanceId,
      dawState?.listOfConfigs?.[0]?.components?.[0]?.name,
      dawState?.listOfConfigs?.[0]?.components?.[0]?.type,
      dawState?.listOfConfigs?.[0]?.components?.[0]?.settings?.id,
      dawState?.listOfConfigs?.[0]?.components?.[0]?.settings?.Technology,
      dawState?.listOfConfigs?.[0]?.components?.[0]?.settings?.export_name,
      {
        // Current slider values
        inputGain,
        directMode,
        distortionAmount,
        bassValue,
        midValue,
        trebleValue,
        reverbAmount,
        volumeValue
      }
    );

    // Send to backend
    const savedDaw = await dawAPI.saveDaw(dawDTO);
    
    // Update local state with response (may include new IDs)
    setDawState(savedDaw);
    
    alert('Preset saved successfully!');
  } catch (error) {
    console.error('Save failed:', error);
    alert('Failed to save preset');
  }
};
```

**The builder function (`dawUtils.ts`):**

```typescript
export function buildDawDTOFromNativeAmpState(
  dawId: string | undefined,
  dawName: string,
  description: string,
  exportCount: number | undefined,
  createdAt: string | undefined,
  userId: number | undefined,
  configName: string,
  configId: number | undefined,
  componentId: number | undefined,
  instanceId: string | undefined,
  componentName: string | undefined,
  componentType: string | undefined,
  settingsId: number | undefined,
  technology: string | undefined,
  exportName: string | undefined,
  ampState: {
    inputGain: number;
    directMode: boolean;
    distortionAmount: number;
    bassValue: number;
    midValue: number;
    trebleValue: number;
    reverbAmount: number;
    volumeValue: number;
  }
): DawDTO {
  return {
    dawId: dawId || `daw-${Date.now()}`,  // Generate ID for new DAW
    userId: userId || 1,
    name: dawName,
    description,
    createdAt: createdAt || new Date().toISOString(),
    exportCount: exportCount || 0,
    listOfConfigs: [
      {
        id: configId || 0,
        name: configName,
        components: [
          {
            id: componentId || 0,
            instanceId: instanceId || `amp-${Date.now()}`,
            name: componentName || 'Amp',
            type: componentType || 'distortion',
            settings: {
              id: settingsId || 0,
              Technology: technology || 'TONEJS',
              export_name: exportName || 'amp-simulation',
              parameters: ampState  // <-- Current slider values
            }
          }
        ]
      }
    ]
  };
}
```

**Key interview points:**

1. **Why preserve so many IDs?**
   - The backend uses IDs to distinguish between **create** (new preset) and **update** (modify existing).
   - If `dawId` is provided, the backend finds and updates that entity.
   - If `dawId` is `null`, the backend creates a new entity.
   - Same for `configId`, `componentId`, `settingsId`.

2. **Why generate IDs on the frontend (`daw-${Date.now()}`)?**
   - For new presets, the backend will replace this with a UUID.
   - But having a client-side ID helps with debugging (you can see in the network tab what was sent).

3. **Why return the saved DTO from the backend?**
   - The backend may set additional fields (e.g., `createdAt`, `exportCount`, generated IDs).
   - By returning the full DTO, the frontend stays in sync with the database.

4. **What if the user closes the tab before saving?**
   - Their changes are lost—there's no auto-save.
   - In production, you'd add a `beforeunload` event listener to warn: "You have unsaved changes."

---

## Common Interview Questions & Answers

### Q1: "Why use Web Audio API instead of a library like Tone.js?"

**Answer:**
I originally considered Tone.js (you'll see it mentioned in the project name "TONEJS" in DTOs—that's legacy). I switched to raw Web Audio API because:

1. **Lower latency**: No abstraction overhead, direct access to audio nodes.
2. **Full control**: I wanted to understand audio graph routing deeply, not rely on a black box.
3. **Bundle size**: Zero dependencies means faster page loads.
4. **Learning opportunity**: Demonstrates I can work with low-level browser APIs, not just npm packages.

For a production app with complex routing (50+ tracks, automation, etc.), I'd use Tone.js or Superpowered.js. For a single-channel amp sim, Web Audio API is perfect.

---

### Q2: "How do you handle microphone permissions on different browsers?"

**Answer:**
- **Chrome/Edge**: `getUserMedia` prompts once, permission persists per origin.
- **Firefox**: Same as Chrome, but users can revoke permission more easily.
- **Safari**: Requires user interaction (button click) before calling `getUserMedia`—you can't auto-start audio on page load.

In my code, the "Power On" button triggers `getUserMedia`, satisfying Safari's requirement. If permission is denied, I catch the error and show an alert. In production, I'd:
- Detect permission status with `navigator.permissions.query({ name: 'microphone' })`
- Show a friendly "Allow mic access" banner before the user clicks "Power On"
- Handle iOS Safari specifically (it has tighter restrictions)

---

### Q3: "What happens if two users edit the same preset simultaneously?"

**Answer:**
Currently, **last write wins**—no conflict resolution. If User A and User B both load preset `123`, modify it, and save, the second save overwrites the first.

To fix this in production, I'd implement **optimistic locking**:
1. Backend adds a `version` field to the DAW entity.
2. When User A saves, they send `version: 1` in the DTO.
3. Backend checks: "Is the database version still 1?"
4. If yes → save succeeds, increment to `version: 2`.
5. If no → return `409 Conflict`, tell User A to reload and merge changes.

Alternatively, treat presets as **immutable**: saving creates a new version instead of overwriting. Users could then browse version history.

---

### Q4: "How would you add undo/redo for slider changes?"

**Answer:**
I'd implement a **command pattern** with a history stack:

```typescript
interface Command {
  execute: () => void;
  undo: () => void;
}

class SetBassCommand implements Command {
  constructor(
    private oldValue: number,
    private newValue: number,
    private setter: (v: number) => void,
    private ref: React.MutableRefObject<BiquadFilterNode | null>
  ) {}

  execute() {
    this.setter(this.newValue);
    if (this.ref.current) this.ref.current.gain.value = this.newValue;
  }

  undo() {
    this.setter(this.oldValue);
    if (this.ref.current) this.ref.current.gain.value = this.oldValue;
  }
}

// Global stacks
const undoStack: Command[] = [];
const redoStack: Command[] = [];

// When user changes bass slider:
const oldValue = bassValue;
const newValue = parseFloat(e.target.value);
const cmd = new SetBassCommand(oldValue, newValue, setBassValue, bassFilterRef);
cmd.execute();
undoStack.push(cmd);
redoStack.length = 0;  // Clear redo stack on new action

// Ctrl+Z handler:
const undo = () => {
  const cmd = undoStack.pop();
  if (cmd) {
    cmd.undo();
    redoStack.push(cmd);
  }
};
```

This scales to complex multi-parameter changes (e.g., "Load Preset" is one undoable command).

---

### Q5: "Why store session in localStorage instead of sessionStorage?"

**Answer:**
- **`localStorage`**: Persists across tabs and browser restarts. User stays logged in until they explicitly log out.
- **`sessionStorage`**: Cleared when the tab closes.

I chose `localStorage` for better UX—most music production sessions last hours, and users might close tabs accidentally. The trade-off is security: `localStorage` is accessible to XSS attacks. In production, I'd:
1. Store only non-sensitive data (user ID, name) in `localStorage`.
2. Use **httpOnly cookies** for auth tokens (can't be accessed by JavaScript).
3. Implement token refresh every 15 minutes to limit exposure.

---

### Q6: "How would you test the audio processing code?"

**Answer:**
Web Audio API is tricky to test because it requires a real audio context. I'd use:

1. **Unit tests (Jest + mocking)**:
   - Mock `AudioContext` and nodes.
   - Test that `buildDawDTOFromNativeAmpState` produces correct DTO structure.
   - Test that `applyNativeAmpStateFromComponentDTOs` calls setters with right values.

2. **Integration tests (Playwright/Cypress)**:
   - Use `page.evaluate()` to access `AudioContext` in the browser.
   - Create an `OfflineAudioContext`, render the graph to a buffer, assert output properties (e.g., distortion increases RMS level).

3. **Manual QA**:
   - Test with real guitar input (Line 6 Helix, Focusrite interface).
   - Verify latency with loopback (play a click, record output, measure delay).

---

### Q7: "What's the biggest performance bottleneck in your frontend?"

**Answer:**
**Audio processing is not a bottleneck**—Web Audio runs on a separate real-time thread with guaranteed priority.

The actual bottleneck is **React re-renders**:
- Every slider change triggers a state update → re-render.
- The `NativeAmpDemo` component is large (~500 lines) with many state variables.

To optimize, I'd:
1. **Split into smaller components**: Extract sliders into `<Slider name="Bass" value={bassValue} onChange={...} />` and memoize with `React.memo()`.
2. **Batch state updates**: Use `useReducer` instead of 8 separate `useState` calls.
3. **Debounce save operations**: Don't hit the backend on every slider tweak—wait 500ms after user stops.

For the audio graph itself, the only expensive operation is building the reverb IR (happens once on power-on). Everything else is negligible.

---

## Frontend Features Checklist (for interview demos)

When presenting DAWker, highlight these points:

### ✅ **1. Client-side audio processing**
- Show live guitar/mic input, adjust sliders in real time
- Explain Web Audio graph structure
- Mention latency (~15ms on your machine)

### ✅ **2. Persistent user sessions**
- Log in, close tab, reopen → still logged in
- Show `localStorage` in devtools

### ✅ **3. RESTful API integration**
- Show network tab while loading/saving preset
- Explain DTO structure
- Mention error handling (try loading a non-existent DAW ID)

### ✅ **4. Client-side routing**
- Navigate through app without page reloads
- Show URL changing with React Router

### ✅ **5. Responsive UI (Tailwind CSS)**
- Resize browser, show layout adapts
- Mention `flex`, `grid`, utility-first CSS

### ✅ **6. TypeScript safety**
- Show IntelliSense in VS Code (DTO types)
- Mention how TypeScript caught bugs during development

---

## What You'd Add in Production

To show forward thinking, mention:

1. **Automated testing**: Jest unit tests, Playwright E2E, Lighthouse CI for performance regression.
2. **Accessibility**: ARIA labels on sliders, keyboard shortcuts (spacebar to bypass, Tab navigation).
3. **PWA features**: Service worker for offline mode, Web MIDI API to control sliders with a MIDI controller.
4. **Audio export**: Capture audio to `.wav` using `MediaRecorder` API.
5. **Real-time collaboration**: WebRTC for multi-user jams, CRDT for conflict-free preset editing.
6. **Analytics**: Track which presets are most popular, A/B test UI changes.

---

## Final Tips for the Interview

1. **Run the app live**: Nothing beats showing working code. Have it open, play guitar through it.
2. **Prepare a bug story**: "I spent 3 hours debugging reverb phase cancellation—turned out I was connecting nodes twice." Shows problem-solving.
3. **Know your trade-offs**: Why Web Audio over Tone.js? Why fetch over Axios? Interviewers love trade-off discussions.
4. **Draw diagrams**: Sketch the audio graph or data flow on a whiteboard—visual aids are powerful.
5. **Show enthusiasm**: "This was my favorite part of the project—learning convolution reverb was like unlocking a secret level."

Good luck! 🎸
