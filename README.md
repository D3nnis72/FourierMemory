# **Fourier Memory**

A Two Player Visual Learning Game for Exploring the Frequency Domain

---

## **Overview**

Fourier Memory is an interactive, educational web application that turns the relationship between images and their Fourier spectra into a playful two player memory game.
Players flip cards, match original images with their computed Fourier transforms and learn, intuitively and visually, how patterns, edges and textures translate into frequency structures.

The platform also includes a Learn Mode for guided exploration and a Dataset Studio where users can upload their own images and automatically generate a custom Fourier dataset.

---

## **Project Goals**

### **1. Teach Fourier Transform Concepts Visually**

Instead of starting with formulas or theory, the app uses visual intuition.
Players _see_ how patterns in images become peaks, lines and structures in the spectrum.

### **2. Provide a Competitive, Fun Game Format**

Two players compete to match pairs correctly.
Correct matches display short explanations, reinforcing understanding through gameplay.

### **3. Support Custom Data Exploration**

Users can upload their own images and generate a new playable dataset in seconds.
Perfect for courses, creative experiments or quick intuition-building exercises.

### **4. Deliver a Clean, Modular Architecture**

The project is structured with a modern stack and clear separation of concerns, including:

- **Frontend:** Next.js (App Router), React, TypeScript, Tailwind
- **Backend:** Python FastAPI for dataset handling and Fourier processing
- **Storage:** File based dataset storage with metadata and generated spectra

---

## **Features**

### 🎮 **Two Player Memory Game**

- Match image cards with their corresponding Fourier spectrum cards
- Turn based gameplay
- Scoring system and match feedback
- Educational explanations after each successful match

### 📚 **Learn Mode**

- Side by side image and spectrum viewer
- Interactive overlays for orientation and frequency regions
- Explanations for edges, patterns, textures and noise
- Thumbnail navigation of all dataset items

### 📤 **Dataset Upload Studio**

- Upload individual images or ZIP archives
- Backend processes and generates Fourier spectra
- New datasets appear instantly in the game and Learn Mode
- Useful for custom experiments or coursework

### 🎨 **Colorful, Clear and Educational UI**

- Bright, friendly visuals
- Smooth animations for card flipping and transitions
- Simple explanations designed for non experts

---

## **How It Works**

1. **Upload or select a dataset**
2. **Start a two player session**
3. **Flip two cards each turn**
4. If image and spectrum match:

   - Score a point
   - View a short explanation

5. If not, next player takes the turn
6. Continue until all pairs are matched

Learn Mode provides deeper, guided exploration for students, educators or anyone curious about frequency analysis.

---

## **Use Cases**

- Teaching image processing or computer vision fundamentals
- Interactive demos for university courses
- Personal learning about FFT and frequency domain concepts
- Creative exploration of image patterns
- Fun two player challenge for visually minded people

---

## **Technology Stack**

### **Frontend**

- Next.js 14
- React
- TypeScript
- Tailwind CSS
- Client Components for interactive features
- Server Components for data fetching and SSR

### **Backend**

- Python FastAPI
- NumPy / Pillow for Fourier transform
- File based dataset storage

---

## **Project Structure**

```
frontend/
  app/
    ... Next.js routes
  components/
    ui/
    features/
  lib/
    api/
    types/
backend/
  app/
    domain/
    application/
    infrastructure/
    interfaces/
```

---

## **Roadmap**

- Multiplayer online mode (WebSockets)
- Per card hints and difficulty levels
- More overlays in Learn Mode
- Sound design and animations
- Public dataset gallery

---

## **License**

MIT License unless specified otherwise.

---

## **Contributions**

Pull requests are welcome, especially for:

- new datasets
- UI improvements
- educational content
- bug fixes
