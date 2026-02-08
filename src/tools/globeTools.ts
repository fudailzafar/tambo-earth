import { getViewer } from "./globeViewerRef";
import { Cartesian3, Math as CesiumMath } from "cesium";
import { defineTool } from "@tambo-ai/react";
import { z } from "zod";

export const flyToLocation = async (
    latitude: number,
    longitude: number,
    height: number = 10000
) => {
    console.log(`flyToLocation called: lat=${latitude}, lon=${longitude}, height=${height}`);
    const viewer = getViewer();
    if (!viewer) {
        console.error("Globe viewer not initialized");
        return "Globe not ready";
    }

    console.log("Viewer found, executing flyTo");
    viewer.camera.flyTo({
        destination: Cartesian3.fromDegrees(longitude, latitude, height),
        duration: 3,
    });

    return `Flying to ${latitude}, ${longitude}`;
};

export const globeTools = [
    defineTool({
        name: "flyTo",
        description: "Fly the camera to a specific location on the globe",
        inputSchema: z.object({
            latitude: z.number().describe("Latitude in degrees"),
            longitude: z.number().describe("Longitude in degrees"),
            height: z.number().default(10000).describe("Height in meters (default 10000)"),
        }),
        tool: async ({ latitude, longitude, height }) => {
            console.log("AI Tool 'flyTo' triggered");
            await flyToLocation(latitude, longitude, height);
            return { status: "flying", message: `Flying to ${latitude}, ${longitude}` };
        },
    }),
];
