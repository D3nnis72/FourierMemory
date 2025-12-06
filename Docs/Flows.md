# 0. Core Vision:

A colorful, two player Fourier Memory Arena\*\*

The platform has three pillars:

1. **The Game** — a competitive two player memory match (image vs Fourier spectrum)
2. **The Learning Arena** — where players explore how images turn into spectra
3. **The Dataset Studio** — upload your own images, generate spectra, play with them

Everything is wrapped in a bright, visually engaging UI.

---

# **1. User Experience Flow**

### **Entry Point**

User arrives on the landing page and sees:

- Big visual hero: left an original image, right its spectrum
- Button:
  **“Play Two Player Game”**
- Button:
  **“Learn Fourier”**
- Button:
  **“Upload Dataset”**

The site feels like an arcade meets a science museum.

---

### **Flow 1, Two Players Game**

1. Both players choose a dataset

2. They select game mode (difficulty)

3. Game begins:

   - A grid of cards, half original images, half spectra
   - Players alternate turns
   - When Player A matches a correct pair (image + its spectrum), they earn points and continue their turn
   - When they fail, turn switches to Player B

4. After every correct match:

   - An **education panel** pops up for 2 seconds
     “This diagonal edge causes these bright points in the diagonal frequency direction”

5. Round ends when all pairs are matched

6. Summary screen:

   - Player scores
   - Stats like accuracy, average time per match
   - Educational takeaway per image

---

### **Flow 2, Learning Mode**

This is optional but enriches the game.

- Side by side view: original vs Fourier
- Interactive overlays (orientation lines, frequency intensity, etc)
- A slider to morph between image and spectrum
- Small mini quizzes:
  “Which spectrum belongs to this?”
- Players can explore datasets before playing

---

### **Flow 3, Upload Dataset**

Players can upload a folder or ZIP of images.

Backend automatically:

- Extracts images
- Computes Fourier transformations
- Stores dataset
- Makes it selectable for the game

---

# **2. Frontend Architecture**

Built with **Next.js** and a modern component system (Tailwind + a playful design language).

---

## **2.1 Pages Overview**

### **1. Landing Page (`/`)**

Colorful, bold, inviting.
Contains:

- Hero animations
- Three big buttons
- A quick “What is Fourier?” hint
- Dataset gallery preview

Tone: "Welcome to the Fourier Arcade!"

---

### **2. Dataset Gallery (`/datasets`)**

Shows:

- Prebuilt example datasets
- Player uploaded datasets

Each dataset card has:

- Thumbnail image
- Corresponding Fourier spectrum preview
- Number of pairs
- Buttons:

  - “Play Two Player Game”
  - “Learn”

---

### **3. Two Player Game Page (`/game`)**

#### **Game sections:**

1. **Top Bar**

   - Player 1 name and score
   - Player 2 name and score
   - Turn indicator, glowing bright on active player
   - Timer (optional)
   - Dataset name

2. **Grid Board**

   - N cards face down
   - On flip:

     - If image card: displays original
     - If spectrum card: displays Fourier plot

3. **Match Feedback Panel**

   - If correct match:

     - Green highlight
     - Short educational popover:
       “Horizontal repetition → vertical frequency spike”

   - If incorrect:

     - Red pulse
     - Turn switches

4. **End Screen**

   - Winner display
   - Total matches
   - Skill breakdown:

     - “Best at spotting textures”
     - “Fastest matcher”

   - “Play again” / “Try a harder mode”

---

### **4. Learning Arena (`/learn/[datasetId]`)**

A deeply visual page with:

- Left: Image
- Right: Fourier spectrum
- Controls:

  - Frequency highlight toggle
  - Orientation overlay toggle
  - A slider to morph between spaces

- A small explanation box:
  “This texture repeats every 32 pixels. Repetition → bright discrete peaks.”

The tone is simple, visual, non mathematical.

---

### **5. Upload Page (`/upload`)**

A drag and drop interface:

- Upload area
- Dataset name input
- Preview of uploaded files
- Colorful “Generate Fourier Dataset” button

After generation, shows:

- Dataset summary
- Buttons:

  - “Play Two Player Game”
  - “Open in Learn Mode”

---

# **2.2 Component Architecture (no code)**

### **Game Components**

1. **GameBoard**

   - Renders grid
   - Keeps track of selected cards

2. **Card**

   - Has state: faceUp, matched
   - Two types: `original` or `spectrum`

3. **ScorePanel**

   - Displays players, points, turn

4. **MatchInfoPopover**

   - Small educational snippet after matching

5. **GameController**

   - Turn handling
   - Pair validation
   - Difficulty settings

---

### **Learning Components**

1. **SideBySideViewer**

   - Image left
   - Fourier right

2. **OverlayControls**

   - Toggle various visual aids

3. **ExplanationCard**

   - Short intuition with icons

---

### **Upload Components**

1. **Dropzone**
2. **DatasetProgress**
3. **DatasetSummaryCard**

---

# **3. Backend Architecture**

Backend should stay minimal and robust.

### **3.1 Core Responsibilities**

- Handle uploads
- Process Fourier spectra
- Store datasets
- Provide dataset metadata
- Provide URLs to static assets

---

### **3.2 Backend Endpoints**

1. **POST /datasets**

   - Accept images or ZIP
   - Store dataset
   - Return datasetId

2. **GET /datasets**

   - List all datasets

3. **GET /datasets/{id}**

   - Returns all image and spectrum pairs

4. **Static files**

   - Original image files
   - Fourier spectrum files

---

### **3.3 Dataset Storage Layout**

```
/data
  /dataset_001
    meta.json
    /original
       img_001.png
       img_002.png
    /fourier
       img_001_fft.png
       img_002_fft.png
```

---

# **4. Game Logic Architecture (two player)**

### **4.1 State tracked on frontend**

- activePlayer
- scores[player1, player2]
- revealedCards[]
- matchedPairs[]
- gameOver flag

### **4.2 Game Flow**

1. Player flips a first card
2. Player flips second card
3. Game checks:

   - Same pair ID
   - One is image, one is spectrum

4. If **match**:

   - MatchInfoPopover appears
   - Player continues playing

5. If **no match**:

   - Cards flip back
   - Turn changes to next player

6. Game ends when all pairs matched

---

# **5. Visual Style Principles**

We go for **colorful, educational, joyful**, like a science center for digital images.

### **Colors**

- Gradients: pink, blue, purple
- Bright card highlights
- Soft glows for matched pairs

### **Shapes**

- Rounded tiles
- Smooth card flip animations
- Soft opacity overlays

### **Typography**

- Friendly, simple, approachable
- No heavy math symbols
- Emphasis on intuition

### **Educational Design**

- Tiny info snippets (max 2 sentences each)
- Icons for orientation, frequency, repetition
- Clear cause and effect
  “Repetition → bright peaks”
  “Strong edges → high frequencies”

---

# **6. Summary**

You now have a full, clean architecture for a:

- **Two Player Fourier Memory Game**
- **Dataset Upload Studio**
- **Fourier Learning Arena**
- **Colorful and didactic UI theme**
- **Separation of concerns** between frontend (UI), backend (processing), and storage

This blueprint is enough to build the entire system cleanly.
