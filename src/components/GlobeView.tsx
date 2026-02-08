import React, { useEffect, useRef, useState } from 'react';
import Globe, { type GlobeMethods } from 'react-globe.gl';
import { usePathfinder } from '../context/CountryContext';
import { setViewer } from '../tools/globeViewerRef';


interface CountryProperties {
    ADMIN?: string;
    NAME?: string;
    name?: string;
    ISO_A2?: string;
    ISO_A3?: string;
}

interface CountryFeature {
    type: string;
    properties: CountryProperties;
    geometry: {
        type: string;
        coordinates: any[];
    };
}

export const GlobeView: React.FC<{ className?: string, onCountrySelect?: (countryName: string) => void }> = ({ className = "", onCountrySelect }) => {
    const globeEl = useRef<GlobeMethods | undefined>(undefined);
    const { isVisited, visitCountry } = usePathfinder();
    const [countries, setCountries] = useState({ features: [] });
    const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
    const [selectedMarker, setSelectedMarker] = useState<{ lat: number, lng: number, code: string, name: string } | null>(null);

    useEffect(() => {
        // Load country data
        fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
            .then(res => res.json())
            .then(setCountries);
    }, []);

    useEffect(() => {
        if (globeEl.current) {
            setViewer(globeEl.current);
            globeEl.current.pointOfView({ altitude: 2.0 });

            // Auto-rotate setup
            const controls = globeEl.current.controls();
            controls.autoRotate = true;
            controls.autoRotateSpeed = -1.0;

            // Stop rotation on user interaction
            const stopRotation = () => {
                controls.autoRotate = false;
            };

            controls.addEventListener('start', stopRotation);

            // Cleanup
            return () => {
                controls.removeEventListener('start', stopRotation);
            };
        }
    }, []);

    const getPolygonColor = (d: CountryFeature) => {
        const name = d.properties.ADMIN || d.properties.NAME || d.properties.name;
        if (name && isVisited(name)) return 'rgba(74, 222, 128, 0.6)'; // Green
        if (name === hoveredCountry) return 'rgba(255, 255, 255, 0.1)';
        return 'rgba(255, 255, 255, 0)'; // Transparent
    };

    const handlePolygonClick = (d: CountryFeature) => {
        // Stop rotation immediately
        if (globeEl.current) {
            globeEl.current.controls().autoRotate = false;
        }

        const name = d.properties.ADMIN || d.properties.NAME || d.properties.name;
        const code = d.properties.ISO_A2 || d.properties.ISO_A3 || "UN"; // Fallback

        if (!name) return;

        // Calculate centroid
        let lat = 0, lng = 0;
        if (d.geometry && d.geometry.type === 'Polygon') {
            const coords = d.geometry.coordinates[0];
            coords.forEach((c: any) => { lng += c[0]; lat += c[1]; });
            lng /= coords.length;
            lat /= coords.length;
        } else if (d.geometry && d.geometry.type === 'MultiPolygon') {
            // Provide safe fallback for MultiPolygon: use the first polygon's centroid
            const coords = d.geometry.coordinates[0][0];
            coords.forEach((c: any) => { lng += c[0]; lat += c[1]; });
            lng /= coords.length;
            lat /= coords.length;
        }

        console.log("Clicked:", name, code);
        visitCountry({ name, code, lat, lng });
        setSelectedMarker({ lat: lat, lng: lng, code: String(code), name: String(name) }); // Set marker

        if (onCountrySelect) {
            onCountrySelect(name);
        }

        if (globeEl.current) {
            globeEl.current.pointOfView({ lat, lng, altitude: 0.6 }, 1000);
        }
    };

    return (
        <div className={`relative w-full h-full ${className} bg-black -translate-x-44`}>
            <Globe
                ref={globeEl}
                // Use a day texture - Blue Marble is often dark, let's try a lighter one or standard map
                globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"

                // Atmosphere for better look
                atmosphereColor="white"
                atmosphereAltitude={0.15}

                polygonsData={countries.features}
                polygonAltitude={0.01}
                polygonCapColor={getPolygonColor as any}
                polygonSideColor={() => 'rgba(0, 0, 0, 0)'}
                polygonStrokeColor={() => '#111'}
                polygonLabel={(obj: any) => {
                    const d = obj.properties as CountryProperties;
                    const name = d.ADMIN || d.NAME || d.name;
                    const code = d.ISO_A2 || d.ISO_A3 || "UN";
                    const flagUrl = `https://flagcdn.com/w40/${code?.toLowerCase()}.png`;

                    return `
                        <div style="background: transparent; color: white; display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 24px; text-shadow: 0 1px 3px rgba(0,0,0,0.8);">
                            <img src="${flagUrl}" style="width: 24px; height: auto; border-radius: 2px; box-shadow: 0 1px 2px rgba(0,0,0,0.5);" onError="this.style.display='none'"/>
                            <span style="font-weight: 500; font-family: system-ui;">${name}</span>
                        </div>
                    `;
                }}
                onPolygonHover={(d: any) => {
                    const name = d ? (d.properties.ADMIN || d.properties.NAME || d.properties.name) : null;
                    setHoveredCountry(name || null);
                }}
                onPolygonClick={handlePolygonClick as any}

                htmlElementsData={selectedMarker ? [selectedMarker] : []}
                htmlElement={(d: any) => {
                    const el = document.createElement('div');
                    el.innerHTML = `
                        <div style="transform: translate(-50%, -100%); display: flex; flex-direction: column; align-items: center; pointer-events: none;">
                            <img src="https://flagcdn.com/w80/${d.code.toLowerCase()}.png" style="width: 40px; border-radius: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.5); border: 2px solid white;" />
                            <div style="width: 2px; height: 20px; bg: white; background: white; margin-top: -2px;"></div>
                            <div style="width: 8px; height: 8px; background: white; border-radius: 50%; margin-top: -1px;"></div>
                        </div>
                    `;
                    return el;
                }}
            />
            {/* Reset selection button if needed, but clicking empty space clears it usually? */}
        </div>
    );
};
