# 🌍 Chat Earth

**Chat Earth** is an interactive, AI-powered 3D globe application that allows users to explore the world through natural language conversations. It combines the visual immersion of a 3D globe with the intelligence of a generative AI assistant, creating a seamless educational and exploratory experience.

## ✨ About the Project

The goal of Chat Earth is to reimagine how we interact with geographical data. Instead of static maps or search bars, users can ask questions like *"Show me a culinary tour of Italy"* or *"Where should I go for a tropical vacation?"*. The AI not only answers but controls the globe to fly you there, displaying rich, interactive content.

### Key Features

*   **Interactive 3D Globe**: Powered by `react-globe.gl`, featuring a realistic day/night cycle, atmosphere, and interactive country polygons.
*   **AI Pathfinder**: Integrated with `@tambo-ai/react`, the AI assistant acts as your guide, generating custom UI components on the fly.
*   **Generative UI**: The chat interface renders interactive components like:
    *   `LocationCard`: Details and photos of visited places.
    *   `FunFact`: Interesting trivia about locations.
    *   `JourneyList`: Curated travel itineraries with clickable destinations.
*   **Seamless Navigation**:
    *   **Click-to-Fly**: Click any location in the chat to instantly fly the globe there.
    *   **Smart Zoom**: Interactive zoom levels for selection (1.5) and visiting (0.5).
    *   **Label Interaction**: Persistent country labels act as "back buttons" to zoom out.
*   **Gamification**: Track your "Visited Countries" and unlock ranks from *Wanderer* to *World Class*.

## 🛠️ Tech Stack

*   **Frontend**: [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/)
*   **Styling**: [Tailwind CSS](https://tailwindcss.com/)
*   **3D Visualization**: [react-globe.gl](https://github.com/vasturiano/react-globe.gl) (Three.js wrapper)
*   **AI & GenUI**: [@tambo-ai/react](https://tambo.ai/), @modelcontextprotocol/sdk
*   **Markdown Rendering**: `react-markdown`, `remark-gfm`
*   **Icons**: `lucide-react`
*   **Validation**: `zod`

## 🏗️ Architecture

The application is built around a centralized context and event-driven architecture to sync the 3D view with the AI chat.

*   **Context (`CountryContext`)**: Manages global state such as:
    *   `visitedCountries`: List of visited locations for gamification.
    *   `targetCountry`: A signal used to trigger globe navigation from arbitrary components (like chat).
    *   `flyToCountry()`: Function exposed to components to control the globe camera.
*   **Components**:
    *   `GlobeView.tsx`: Handles the 3D rendering, camera controls, and polygon interactions. It listens to `targetCountry` changes to animate flight.
    *   `ChatSidebar.tsx`: Manages the AI thread. It renders Markdown and custom "Tools" (Generative UI components) called by the AI.
    *   `App.tsx`: The main layout that orchestrates the tool registration and initial prompt handling.

## 🚀 Getting Started

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/your-username/chat-earth.git
    cd chat-earth
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    # or
    pnpm install
    ```

3.  **Set up Environment**:
    Create a `.env` file and add your Tambo AI logic and token:
    ```env
    VITE_TAMBO_LOGIC_ID=your_logic_id
    VITE_TAMBO_TOKEN=your_token
    ```

4.  **Run Development Server**:
    ```bash
    npm run dev
    ```

## 📈 Learning & Growth

Developing Chat Earth presented several unique challenges:
*   **Streaming Stability**: Handling streaming AI responses with complex tool calls required robust schema definitions using `zod`. We moved from loose `z.any()` types to strict `z.string().nullish()` to ensure reliability.
*   **3D-2D Sync**: Synchronizing React state (2D UI) with the imperative Three.js camera (3D Globe) required careful use of `refs` and `useEffect` hooks to bridge the gap.
*   **UX Refinement**: We iterated significantly on the "Visit" flow, moving from simple clicks to a sophisticated "Select -> Visit -> Persist Label" model that feels natural and keeps the view uncluttered.

## 🔮 Future Roadmap

*   **User Accounts**: Persist `visitedCountries` to a database.
*   **Richer Data**: Integrate real-time weather or flight data.
*   **VR Support**: Explore WebXR for an immersive VR experience.
