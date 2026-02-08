import { getViewer } from "./globeViewerRef";
import { defineTool } from "@tambo-ai/react";
import { z } from "zod";

export const flyToLocation = async (latitude: number, longitude: number, altitude: number = 2.5) => {
    const viewer = getViewer();
    if (!viewer) {
        console.warn("Globe viewer not initialized");
        return;
    }

    viewer.pointOfView({ lat: latitude, lng: longitude, altitude }, 2000);
};

export const globeTools = [
    defineTool({
        name: "flyTo",
        description: "Fly the globe camera to a specific location (latitude, longitude).",
        inputSchema: z.object({
            latitude: z.number().describe("Latitude of the destination"),
            longitude: z.number().describe("Longitude of the destination"),
            altitude: z.number().optional().describe("Altitude (zoom level, lower is closer, e.g. 0.5 to 3.0)"),
        }),
        tool: async ({ latitude, longitude, altitude }) => {
            console.log("AI Tool 'flyTo' triggered");
            await flyToLocation(latitude, longitude, altitude);
            return { status: "flying", message: `Flying to ${latitude}, ${longitude}` };
        },
    }),
    defineTool({
        name: "get_visited_countries",
        description: "Get the list of countries the user has visited in this session/pathfinder journey.",
        inputSchema: z.object({}),
        tool: async () => {
            const saved = localStorage.getItem('chat-earth-visited');
            const countries = saved ? JSON.parse(saved) : [];
            return { countries };
        }
    })
];
