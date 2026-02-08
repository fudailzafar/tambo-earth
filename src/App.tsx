import { TamboProvider } from "@tambo-ai/react";
import { Layout, MainContent, Sidebar } from "./components/Layout";
import { GlobeView } from "./components/GlobeView";
import { ChatSidebar } from "./components/ChatSidebar";
import { PathfinderStatus } from "./components/PathfinderStatus";
import { globeTools } from "./tools/globeTools";
import { LocationCard, LocationCardSchema } from "./components/LocationCard";

const components = [
  {
    name: "LocationCard",
    description: "Display information about a specific location or landmark",
    component: LocationCard,
    propsSchema: LocationCardSchema,
  }
];

function App() {
  const apiKey = import.meta.env.VITE_TAMBO_API_KEY;

  if (!apiKey) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-black text-white p-4 text-center">
        <div>
          <h1 className="text-2xl font-bold mb-4">Configuration Required</h1>
          <p className="mb-4">Please add <code className="bg-gray-800 px-2 py-1 rounded">VITE_TAMBO_API_KEY</code> to your <code className="bg-gray-800 px-2 py-1 rounded">.env</code> file.</p>
        </div>
      </div>
    );
  }

  return (
    <TamboProvider
      apiKey={apiKey}
      components={components}
      tools={globeTools}
    >
      <Layout>
        <MainContent>
          <GlobeView />
          <PathfinderStatus />

          {/* Back arrow placeholder to match design */}
          <div className="absolute top-6 left-6 z-10 flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-800">
              <path d="M19 12H5" />
              <path d="m12 19-7-7 7-7" />
            </svg>
            <span className="font-semibold text-gray-800">chatkit.world</span>
          </div>

        </MainContent>
        <Sidebar>
          <ChatSidebar />
        </Sidebar>
      </Layout>
    </TamboProvider>
  );
}

export default App;
