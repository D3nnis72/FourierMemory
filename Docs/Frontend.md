## Frontend Architecture

Fourier Memory Web Application (Next.js, TypeScript, React)

This document describes a technical frontend architecture for a two player Fourier Memory web application, built with Next.js (App Router), React and TypeScript. The app connects to a separate backend that manages datasets and Fourier processing.

---

## 1. Tech Stack and Core Decisions

- Framework, **Next.js 14 App Router**
- Language, **TypeScript**
- Rendering model, **React Server Components** for data fetching and layout, **Client Components** for interactive views like the game board
- Styling, **Tailwind CSS** (optionally combined with a component library such as shadcn ui)
- State management,

  - local `useState` or `useReducer` for simple state
  - optional lightweight global store (for example Zustand) for cross page app state

- HTTP client,

  - standard `fetch` from Server Components to talk to the backend
  - small typed API client library in `/lib/api`

---

## 2. Folder Structure (Next.js App Router)

```text
frontend/
  app/
    layout.tsx
    page.tsx                     // Landing page
    datasets/
      page.tsx                   // Dataset gallery
    game/
      [datasetId]/
        page.tsx                 // Server entry
        GameClient.tsx           // Client component with game logic
    learn/
      [datasetId]/
        page.tsx                 // Learn mode
    upload/
      page.tsx                   // Dataset upload
  components/
    ui/                          // Generic reusable UI elements
    features/
      game/
      learn/
      datasets/
      upload/
  lib/
    api/                         // Backend HTTP clients
    types/                       // Shared TypeScript types
    utils/                       // Helpers, formatting, mapping functions
  styles/
    globals.css
  public/
    assets/                      // Static images and icons
```

Key idea, routes and data fetching live under `app`, domain specific UI logic is grouped under `components/features`, backend integration is encapsulated under `lib/api`.

---

## 3. Routing and Page Components

All routes use the App Router, each `page.tsx` can be a Server Component. Interactive parts are implemented as nested Client Components.

### 3.1 Landing page `app/page.tsx`

**Type**
Server Component with minimal client only elements.

**Responsibilities**

- Render entry points into the three main flows, Play, Learn, Upload
- Show a featured dataset preview (fetched from backend)

**Data fetching**

- Fetch list of datasets from backend with `getDatasets()` in a Server Component
- Pass featured entries to visual components

**Key children**

- `LandingHero` (feature component)
- `DatasetPreviewGrid`

---

### 3.2 Dataset gallery page `app/datasets/page.tsx`

**Type**
Server Component.

**Responsibilities**

- Fetch all datasets from backend
- Render a filterable and paginated gallery

**Data fetching**

- Use `await getDatasets()` directly in the Server Component
- Map backend response DTOs to internal `DatasetSummary` type in `/lib/types`

**Key children**

- `DatasetFilterBar` (Client Component, handles local filter state)
- `DatasetCard` (feature component for visualizing each dataset)

---

### 3.3 Two player game page `app/game/[datasetId]/page.tsx`

**Type**
Server Component that wraps a Client Component.

**Flow**

- Server Component

  - Reads `datasetId` from route params
  - Fetches dataset details from backend with `getDatasetDetails(datasetId)`
  - Passes prepared game configuration to `GameClient` as props

- `GameClient.tsx` (Client Component)

  - Contains full two player game logic
  - Uses hooks for game state, turn handling, pair matching and feedback

**GameClient responsibilities**

- Maintain state

  - list of cards (shuffled, with type, image or spectrum)
  - open cards (usually two at most)
  - matched pairs
  - active player
  - scores for both players
  - game over flag

- Implement game rules

  - When two cards are open, check if they form a valid image plus spectrum pair with the same pair id
  - If match, increment active player score and keep turn
  - If no match, flip cards back and switch player

- Trigger educational panel display on successful matches

**Key children under `components/features/game`**

- `GameBoard`

  - Pure layout, renders grid of cards
  - Accepts card list and callbacks

- `GameCard`

  - Client Component, displays card face or back
  - Triggers “select” events

- `ScorePanel`

  - Shows player names, scores, active turn

- `MatchInfoPanel`

  - Shows small explanation about the matched pair

- `GameToolbar`

  - Controls, restart, difficulty, back link

---

### 3.4 Learn mode page `app/learn/[datasetId]/page.tsx`

**Type**
Server Component with nested Client Component for interactions.

**Flow**

- Server Component

  - Fetches dataset details
  - Passes list of image pairs to a `LearnClient` component

- `LearnClient` (Client Component)

  **Responsibilities**

  - Maintain state for selected pair
  - Control overlays and sliders
  - Provide interactive explanations

**Key children under `components/features/learn`**

- `SideBySideViewer`

  - Left panel, original image
  - Right panel, Fourier spectrum image
  - Supports optional overlay layers for direction, frequency zones

- `LearnOverlayControls`

  - Toggle buttons and sliders for overlays and morphing

- `PairThumbnailStrip`

  - Horizontal list of thumbnails for each pair
  - Clicking a thumbnail updates selected pair in state

- `ExplanationPanel`

  - Renders textual explanations based on selected pair

---

### 3.5 Upload page `app/upload/page.tsx`

**Type**
Client Component or Server Component that wraps a Client Component, since file inputs require client side.

**Pattern**

- Server side wrapper for consistent layout
- Main upload logic in `UploadClient` (Client Component)

**UploadClient responsibilities**

- Manage local state for

  - dataset name input
  - selected files list
  - upload progress and status
  - resulting dataset summary

- Interact with backend

  - Use `uploadDataset(formData)` from `/lib/api` to send files
  - Handle loading, success and error states

- Navigate to newly created dataset game or learn page on success

**Key children under `components/features/upload`**

- `UploadDropzone`

  - Drag and drop support
  - File type and size validation

- `UploadFileList`

  - List of selected files with small file level status indicators

- `UploadStatusPanel`

  - Shows progress, errors or completion message

- `UploadResultActions`

  - Buttons, Play this dataset, Learn with this dataset

---

## 4. Components and Layers in `components/`

```text
components/
  ui/
    Button.tsx
    Card.tsx
    Dialog.tsx
    Tabs.tsx
    Tooltip.tsx
    Badge.tsx
    ProgressBar.tsx
  layout/
    AppHeader.tsx
    AppFooter.tsx
    PageContainer.tsx
  features/
    game/
      GameBoard.tsx
      GameCard.tsx
      ScorePanel.tsx
      MatchInfoPanel.tsx
      GameToolbar.tsx
    learn/
      SideBySideViewer.tsx
      LearnOverlayControls.tsx
      PairThumbnailStrip.tsx
      ExplanationPanel.tsx
    datasets/
      DatasetCard.tsx
      DatasetList.tsx
    upload/
      UploadDropzone.tsx
      UploadFileList.tsx
      UploadStatusPanel.tsx
      UploadResultActions.tsx
    landing/
      LandingHero.tsx
      LandingIntroSection.tsx
      LandingDatasetPreview.tsx
```

`ui` contains generic primitive components, feature folders combine those primitives into domain specific components.

---

## 5. Data Access Layer `/lib/api`

All communication with the backend is centralized under `/lib/api`. The goal is to keep page and feature components free from raw fetch calls.

### 5.1 Types `/lib/types`

Basic shared types for frontend:

- `DatasetSummary`

  - id, string
  - name, string
  - imageCount, number
  - createdAt, string or Date

- `ImagePair`

  - id, string
  - originalImageUrl, string
  - fourierImageUrl, string
  - label, string

- `DatasetDetails`

  - id, string
  - name, string
  - pairs, `ImagePair[]`

### 5.2 API clients `/lib/api/datasets.ts`

Functions:

- `getDatasets() : Promise<DatasetSummary[]>`
- `getDatasetDetails(datasetId: string) : Promise<DatasetDetails>`
- `uploadDataset(formData: FormData) : Promise<DatasetSummary>`

Each function:

- Calls the backend endpoint with `fetch`
- Validates and maps response JSON to the defined types
- Throws typed errors for use by UI components

For use in Server Components, these functions should be pure and only depend on environment configuration for backend base URL.

---

## 6. State Management

### 6.1 Global state

Global state is minimal:

- Optionally, the last selected dataset for quick resume
- UI configuration such as theme
- Not required for game logic itself

This can be managed with a React context provider under `app/layout.tsx` or a store library such as Zustand in `/lib/state`.

### 6.2 Local page and feature state

- `GameClient` manages all game state internally, or with a game specific store in `/lib/state/gameStore`.
- `LearnClient` keeps selected pair and overlay toggles in local state.
- `UploadClient` keeps upload related state in local component state.

Guideline, only promote state to global level if it is needed across pages, for example, recently used datasets, or a cross page audio toggle.

---

## 7. Rendering model and performance

- Static and server rendered content

  - Landing page and dataset gallery can use static generation or server side data fetching through Server Components.
  - This reduces client payload and improves initial load time.

- Client side interactivity

  - Game, Learn and Upload rely on Client Components for interactivity.
  - For `GameClient`, state and updates occur fully on the client, since game rules are local.

- Image optimization

  - Use Next.js `Image` component for original images and Fourier images.
  - Enable responsive sizes for mobile and desktop layouts.

---

## 8. Visual and Interaction principles

Even though architecture is technical, the UI remains colorful and educational.

- Use a consistent design system,

  - Tailwind utility classes with a small token system for colors, spacing and radii

- Clear color scheme for card categories,

  - one color family for original images,
  - another for spectrum cards,
  - additional highlight colors for correct and wrong matches

- Smooth animations,

  - card flip animation in `GameCard`
  - subtle transitions for overlay toggles in `SideBySideViewer`
