import type { GlobeMethods } from "react-globe.gl";

let globeViewer: GlobeMethods | null = null;

export const setViewer = (viewer: GlobeMethods) => {
    globeViewer = viewer;
};

export const getViewer = () => {
    return globeViewer;
};
