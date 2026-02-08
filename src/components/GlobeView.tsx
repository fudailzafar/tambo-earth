import React, { useEffect } from "react";
import { Viewer, useCesium } from "resium";
import { setViewer } from "../tools/globeViewerRef";

const ViewerInitializer = () => {
    const { viewer } = useCesium();

    useEffect(() => {
        if (viewer) {
            console.log("Viewer captured via useCesium:", viewer);
            setViewer(viewer);
        }
    }, [viewer]);

    return null;
};

export const GlobeView: React.FC<{ className?: string }> = ({ className = "" }) => {
    return (
        <div className={`relative w-full h-full ${className}`}>
            <Viewer
                full
                timeline={false}
                animation={false}
                baseLayerPicker={false}
                navigationHelpButton={false}
                homeButton={false}
                geocoder={false}
                sceneModePicker={false}
                infoBox={false}
                selectionIndicator={false}
                fullscreenButton={false}
            >
                <ViewerInitializer />
            </Viewer>
        </div>
    );
};
