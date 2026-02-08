import { Viewer } from "cesium";

let viewerInstance: Viewer | null = null;

export const setViewer = (viewer: Viewer) => {
    viewerInstance = viewer;
};

export const getViewer = () => {
    return viewerInstance;
};
