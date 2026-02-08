import { TamboProvider, useTamboThread } from "@tambo-ai/react";
import { Layout, MainContent, Sidebar } from "./components/Layout";
import { GlobeView } from "./components/GlobeView";
import { ChatSidebar } from "./components/ChatSidebar";
import { PathfinderStatus } from "./components/PathfinderStatus";
import { globeTools } from "./tools/globeTools";
import { PathfinderProvider } from "./context/CountryContext";
import { LocationCard, LocationCardSchema } from "./components/LocationCard";
import { MobileWarning } from "./components/MobileWarning";

import { JourneyPicker, JourneyPickerSchema } from "./components/JourneyPicker";
import { JourneyList, JourneyListSchema } from "./components/JourneyList";
import { FunFact, FunFactSchema } from "./components/FunFact";

const components = [
  {
    name: "LocationCard",
    description: "Display information about a specific location or landmark",
    component: LocationCard,
    propsSchema: LocationCardSchema,
  },
  {
    name: "JourneyPicker",
    description: "Display a menu of journey themes for the user to choose from when they want to plan a trip.",
    component: JourneyPicker,
    propsSchema: JourneyPickerSchema,
  },
  {
    name: "JourneyList",
    description: "Display a planned journey with a list of destinations and details. Use this whenever suggesting a list of countries to visit for a theme.",
    component: JourneyList,
    propsSchema: JourneyListSchema,
  },
  {
    name: "FunFact",
    description: "Display a fun or interesting fact about a location. Use this whenever asked to tell a fun fact or interesting trivia.",
    component: FunFact,
    propsSchema: FunFactSchema,
  }
];

const AppContent = () => {
  const { sendThreadMessage } = useTamboThread();
  console.log("AppContent rendered. sendThreadMessage available:", !!sendThreadMessage);

  const handleCountrySelect = (countryName: string) => {
    console.log("Country selected:", countryName);
    if (sendThreadMessage) {
      sendThreadMessage(`Tell me about ${countryName}. First, use the LocationCard to show what you know. Then, use the FunFact tool to share one unique or surprising fact.`);
    } else {
      console.error("sendThreadMessage is not available");
    }
  };

  return (
    <PathfinderProvider>
      <MobileWarning />
      <div className="hidden md:block h-full w-full">
        <Layout>
          <MainContent>
            <GlobeView onCountrySelect={handleCountrySelect} />
            <PathfinderStatus />

            {/* Back arrow placeholder to match design */}
            <div className="absolute top-6 left-6 z-10 flex items-center gap-6">
              <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
                <img src="/octo-white-background-rounded.png" alt="Logo" className="w-6 h-6" />
                <span className="font-semibold text-gray-200">TamboEarth</span>
              </div>
              <div className="flex items-center gap-4 border-l border-white/10 pl-6">
                <a
                  href="https://github.com/fudailzafar/tambo-earth"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
                >
                  GitHub
                </a>
                <a
                  href="https://youtu.be/cwZmLdoYegc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-gray-400 hover:text-white transition-colors"
                >
                  YouTube
                </a>
              </div>
            </div>

          </MainContent>
          <Sidebar>
            <ChatSidebar />
          </Sidebar>
        </Layout>
      </div>
    </PathfinderProvider>
  );
};

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
      <AppContent />
    </TamboProvider>
  );
}

export default App;
