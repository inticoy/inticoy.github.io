# Project: Inticoy Archive

**Personal branding archive for Inticoy.**

## 1. Manifesto

**Who?** Identity as a person with clear taste and standards, beyond just a developer.

**Why?** Build a frictionless recording system with full ownership of data.

**What?** Record problem-solving context and thinking process, not just raw information.

**Where?** A curated digital “select shop”, not a cluttered library.

**How?** Keep the familiar Notion experience, refine visuals with Next.js.


## 2. Tech Stacks

### 2.1. Libraries
- **Next.js 15+**: App Router, SSG/ISR
- **notion-client**:  Notion API
- **react-notion-x**: Notion to React Rendering
- **framer-motion**: Card Interaction, Animation
- **Tailwind CSS**: Styling
- **shadcn/ui**: Form, Dialog, Card Components
- **Phosphor Icons**: Icon System

### 2.2. Flow
1. **Notion DB**  
2. **Fetcher**  
3. **Filter**  
4. **Renderer**

### 2.3. Render & Deploy
- **SSG + ISR**
- Vercel Deploy or Github Pages

## 3. Design & UX

### 3.1. Home: Draggable Bento

- **Style**  
  - Nev Flynn style + Rauno-like interactions + draggable layout.  
  - First view should feel like a designed poster, then become a playful desktop.


- **Cards**  
  - Profile card: short intro and photo  
  - Projects card: direct GitHub/live links  
  - Writing card: latest or pinned post  
  - SNS card: LinkedIn / GitHub / others  

- **Interaction**  
  - Subtle 3D tilt and spotlight hover, draggable position, gravity-like drop animation.  
  - On mobile, use a simple stacked layout without drag to keep it usable.

### 3.2. Post Detail: Clean Readability
- **Concept**  
  “Writing must be readable.” Prioritize readability over visual show-off.

- **Style**  
  - Notion-like experience + improved typography.  
  - Timeless, book-like layout that still feels right in 10 years.  
  - ~65–70ch content width, comfortable line-height, two-tone text for hierarchy.

- **Rendering**  
  - Render almost exactly as written in Notion, including headings, lists, quotes, callouts, code blocks, and math.  
  - Only adjust spacing (margins between blocks) and typography (font size, line-height).
