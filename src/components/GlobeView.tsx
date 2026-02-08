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
    // Listen for fly requests from context
    const { isVisited, visitCountry, targetCountry } = usePathfinder();
    const [countries, setCountries] = useState({ features: [] });
    const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
    const [selectedMarker, setSelectedMarker] = useState<{ lat: number, lng: number, code: string, name: string, visited?: boolean } | null>(null);
    const [focusedCountry, setFocusedCountry] = useState<string | null>(null);

    useEffect(() => {
        // Load country data
        fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson')
            .then(res => res.json())
            .then(setCountries);
    }, []);

    useEffect(() => {
        if (targetCountry && countries.features.length > 0) {
            const country = countries.features.find((f: any) => {
                const props = f.properties as CountryProperties;
                const name = props.ADMIN || props.NAME || props.name;
                return name?.toLowerCase() === targetCountry.toLowerCase();
            });

            if (country) {
                flyToRegion(country as CountryFeature);
            }
        }
    }, [targetCountry, countries]);

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

    const flyToRegion = (d: CountryFeature) => {
        const name = d.properties.ADMIN || d.properties.NAME || d.properties.name;
        const code = d.properties.ISO_A2 || d.properties.ISO_A3 || "UN";

        if (!name) return;

        // Calculate centroid
        let lat = 0, lng = 0;
        if (d.geometry && d.geometry.type === 'Polygon') {
            const coords = d.geometry.coordinates[0];
            coords.forEach((c: any) => { lng += c[0]; lat += c[1]; });
            lng /= coords.length;
            lat /= coords.length;
        } else if (d.geometry && d.geometry.type === 'MultiPolygon') {
            const coords = d.geometry.coordinates[0][0];
            coords.forEach((c: any) => { lng += c[0]; lat += c[1]; });
            lng /= coords.length;
            lat /= coords.length;
        }

        setFocusedCountry(String(name));
        setSelectedMarker({ lat: lat, lng: lng, code: String(code), name: String(name), visited: false });

        if (globeEl.current) {
            globeEl.current.controls().autoRotate = false;
            globeEl.current.pointOfView({ lat, lng, altitude: 1.5 }, 1000);
        }
    };

    const handlePolygonClick = (d: CountryFeature) => {
        const name = d.properties.ADMIN || d.properties.NAME || d.properties.name;
        if (!name) return;

        if (focusedCountry === name) {
            // Deselect / Zoom Out
            setFocusedCountry(null);
            setSelectedMarker(null);
            if (globeEl.current) {
                globeEl.current.pointOfView({ altitude: 2.0 }, 1000);
            }
        } else {
            // Select / Zoom In
            flyToRegion(d);
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
                polygonLabel={() => ""}
                onPolygonHover={(d: any) => {
                    const name = d ? (d.properties.ADMIN || d.properties.NAME || d.properties.name) : null;
                    setHoveredCountry(name || null);
                }}
                onPolygonClick={handlePolygonClick as any}

                htmlElementsData={selectedMarker ? [selectedMarker] : []}
                htmlElement={(d: any) => {
                    const el = document.createElement('div');
                    el.style.transform = 'translate(-50%, -100%)';
                    el.style.display = 'flex';
                    el.style.flexDirection = 'column';
                    el.style.alignItems = 'center';
                    el.style.pointerEvents = 'auto'; // allow clicks
                    el.style.cursor = 'default';

                    // Label: Flag + Name
                    const label = document.createElement('div');
                    label.style.display = 'flex';
                    label.style.alignItems = 'center';
                    label.style.gap = '8px';
                    label.style.padding = '8px 16px';
                    label.style.background = 'rgba(20, 20, 20, 0.9)';
                    label.style.borderRadius = '24px';
                    label.style.boxShadow = '0 4px 12px rgba(0,0,0,0.5)';
                    label.style.marginBottom = '8px';
                    label.style.border = '1px solid rgba(255,255,255,0.1)';
                    label.style.backdropFilter = 'blur(4px)';
                    label.style.cursor = 'pointer'; // Make label clickable
                    label.style.transition = 'transform 0.1s, background 0.2s';

                    label.onmouseenter = () => {
                        label.style.transform = 'scale(1.05)';
                        label.style.background = 'rgba(40, 40, 40, 0.95)';
                    };
                    label.onmouseleave = () => {
                        label.style.transform = 'scale(1.0)';
                        label.style.background = 'rgba(20, 20, 20, 0.9)';
                    };

                    // Label Click -> Zoom Out
                    label.onclick = (e) => {
                        e.stopPropagation();
                        setFocusedCountry(null);
                        setSelectedMarker(null);
                        if (globeEl.current) {
                            globeEl.current.pointOfView({ altitude: 2.0 }, 1000);
                        }
                    };

                    label.innerHTML = `
                        <img src="https://flagcdn.com/w40/${d.code.toLowerCase()}.png" style="width: 20px; height: 15px; object-fit: cover; border-radius: 2px;" />
                        <span style="color: white; font-weight: 500; font-family: system-ui; white-space: nowrap;">${d.name}</span>
                    `;
                    el.appendChild(label);

                    // Visit Button - Only show if NOT visited yet
                    if (!d.visited) {
                        const btn = document.createElement('button');
                        btn.textContent = "Visit";
                        btn.style.padding = '8px 20px';
                        btn.style.background = 'white';
                        btn.style.color = 'black';
                        btn.style.borderRadius = '20px';
                        btn.style.border = 'none';
                        btn.style.fontWeight = '600';
                        btn.style.fontSize = '14px';
                        btn.style.boxShadow = '0 4px 12px rgba(0,0,0,0.3)';
                        btn.style.cursor = 'pointer';
                        btn.style.transition = 'transform 0.1s';

                        btn.onmouseenter = () => btn.style.transform = 'scale(1.05)';
                        btn.onmouseleave = () => btn.style.transform = 'scale(1.0)';

                        // Click handler for Visit
                        btn.onclick = (e) => {
                            e.stopPropagation();
                            // Zoom in closer
                            if (globeEl.current) {
                                globeEl.current.pointOfView({ lat: d.lat, lng: d.lng, altitude: 0.5 }, 1200);
                            }

                            // Mark as visited locally for UI update
                            setSelectedMarker({ ...d, visited: true });

                            // Register visit
                            visitCountry({ name: d.name, code: d.code, lat: d.lat, lng: d.lng });

                            // Trigger AI Chat
                            if (onCountrySelect) {
                                onCountrySelect(d.name);
                            }
                        };
                        el.appendChild(btn);
                    }

                    return el;
                }}
            />
            {/* Reset selection button if needed, but clicking empty space clears it usually? */}
        </div>
    );
};
