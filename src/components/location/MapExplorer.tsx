import React, { useState, useMemo } from 'react';
import { MapPin, Navigation, ZoomIn, ZoomOut, ShieldCheck, ExternalLink, Layers, Compass } from 'lucide-react';
import type { Listing } from '../../types';
import { CITY_COORDINATES } from '../../domain/location/geo';

interface MapExplorerProps {
  listings: Listing[];
  activeCity?: string;
  selectedListing?: Listing | null;
  onSelectListing: (listing: Listing) => void;
  onOpenListingDetail: (listing: Listing) => void;
  radiusKm?: number;
  onRadiusChange?: (km: number) => void;
  className?: string;
}

export const MapExplorer: React.FC<MapExplorerProps> = ({
  listings,
  activeCity = 'Noida',
  selectedListing,
  onSelectListing,
  onOpenListingDetail,
  radiusKm = 15,
  onRadiusChange,
  className = ''
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [mapStyle, setMapStyle] = useState<'blueprint' | 'satellite'>('blueprint');

  // Center coordinate determination
  const centerCoords = useMemo(() => {
    return CITY_COORDINATES[activeCity] || CITY_COORDINATES['Noida'];
  }, [activeCity]);

  // Compute bounding box and normalizations for listings
  const projectedPins = useMemo(() => {
    // 0.25 degree latitude span ~ 28km
    const latSpan = 0.35 / zoomLevel;
    const lngSpan = 0.35 / zoomLevel;

    return listings
      .filter(l => l.location && l.location.lat && l.location.lng)
      .map(listing => {
        const dLat = listing.location.lat - centerCoords.lat;
        const dLng = listing.location.lng - centerCoords.lng;

        // Convert to percentage coordinates inside the SVG canvas (50% is center)
        const x = 50 + (dLng / lngSpan) * 40 + panOffset.x;
        const y = 50 - (dLat / latSpan) * 40 + panOffset.y;

        return {
          listing,
          x: Math.max(5, Math.min(95, x)),
          y: Math.max(5, Math.min(95, y))
        };
      });
  }, [listings, centerCoords, zoomLevel, panOffset]);

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    const dx = ((e.clientX - dragStart.x) / 300) * 10;
    const dy = ((e.clientY - dragStart.y) / 300) * 10;
    setPanOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    setDragStart({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const resetView = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  return (
    <div
      className={`relative w-full h-[520px] rounded-3xl overflow-hidden border border-navy-900/15 shadow-trust select-none ${
        mapStyle === 'satellite' ? 'bg-[#0F1E28]' : 'bg-[#0B132B]'
      } ${className}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Map Background Grid (Styled like architectural GIS blueprint) */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#FAF7F2" strokeWidth="0.5" />
          </pattern>
          <pattern id="majorGrid" width="160" height="160" patternUnits="userSpaceOnUse">
            <rect width="160" height="160" fill="none" stroke="#F79A00" strokeWidth="1" opacity="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
        <rect width="100%" height="100%" fill="url(#majorGrid)" />

        {/* Metro line arterial curves */}
        <path d="M 0 350 Q 250 280 500 320 T 1000 240" fill="none" stroke="#10B981" strokeWidth="3" strokeDasharray="6 4" opacity="0.4" />
        <path d="M 200 0 Q 300 300 450 600" fill="none" stroke="#F79A00" strokeWidth="2.5" opacity="0.3" />
      </svg>

      {/* Radius Circle Indicator around active city center */}
      <div
        className="absolute rounded-full border border-orange-500/30 bg-orange-500/5 pointer-events-none transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300"
        style={{
          left: `${50 + panOffset.x}%`,
          top: `${50 + panOffset.y}%`,
          width: `${radiusKm * 18 * zoomLevel}px`,
          height: `${radiusKm * 18 * zoomLevel}px`
        }}
      >
        <span className="absolute top-2 left-1/2 -translate-x-1/2 text-[10px] font-bold text-orange-400 bg-navy-950/80 px-2 py-0.5 rounded-full border border-orange-500/30">
          {radiusKm} km search radius around {activeCity}
        </span>
      </div>

      {/* City Center Benchmark Pin */}
      <div
        className="absolute transform -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none z-10"
        style={{ left: `${50 + panOffset.x}%`, top: `${50 + panOffset.y}%` }}
      >
        <div className="w-4 h-4 rounded-full bg-orange-500 flex items-center justify-center ring-4 ring-orange-500/20 animate-pulse">
          <Navigation className="w-2.5 h-2.5 text-white" />
        </div>
        <span className="text-[11px] font-bold text-cream-100 bg-navy-950/90 px-2 py-0.5 rounded-md border border-navy-800 shadow">
          {activeCity} Center
        </span>
      </div>

      {/* Property Pins */}
      {projectedPins.map(({ listing, x, y }) => {
        const isSelected = selectedListing?.id === listing.id;
        const isHighTrust = listing.trustScore.overallScore >= 80;

        return (
          <button
            key={listing.id}
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onSelectListing(listing);
            }}
            className={`absolute transform -translate-x-1/2 -translate-y-full transition-all duration-200 cursor-pointer z-20 group ${
              isSelected ? 'scale-125 z-30' : 'hover:scale-110'
            }`}
            style={{ left: `${x}%`, top: `${y}%` }}
            title={listing.title}
          >
            <div
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-extrabold shadow-lg transition-colors border ${
                isSelected
                  ? 'bg-orange-500 text-white border-white ring-4 ring-orange-500/40'
                  : 'bg-navy-900 text-white border-navy-700 hover:bg-orange-600'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${isHighTrust ? 'bg-trust-green' : 'bg-orange-400'}`} />
              <span>{listing.formattedPrice}</span>
            </div>

            {/* Downward triangle arrow */}
            <div
              className={`w-0 h-0 mx-auto border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent ${
                isSelected ? 'border-t-[6px] border-t-orange-500' : 'border-t-[6px] border-t-navy-900'
              }`}
            />
          </button>
        );
      })}

      {/* Selected Listing Floating Popover Card */}
      {selectedListing && (
        <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-sm bg-cream-50 rounded-2xl p-4 border border-navy-900/15 shadow-2xl z-30 animate-in fade-in slide-in-from-bottom-2 duration-200 text-navy-900">
          <div className="flex items-start gap-3">
            <img
              src={selectedListing.images[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80'}
              alt={selectedListing.title}
              className="w-20 h-20 rounded-xl object-cover border border-navy-900/10 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 text-[11px] text-orange-500 font-bold uppercase tracking-wider">
                <ShieldCheck className="w-3.5 h-3.5 text-trust-green" />
                <span>Score {selectedListing.trustScore.overallScore}/100</span>
              </div>
              <h4 className="font-extrabold text-sm text-navy-900 truncate mt-0.5">
                {selectedListing.title}
              </h4>
              <p className="text-xs text-navy-700 truncate">
                {selectedListing.location.locality}, {selectedListing.location.city}
              </p>
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-navy-900/10">
                <span className="font-extrabold text-base text-navy-900">
                  {selectedListing.formattedPrice}
                </span>
                <button
                  type="button"
                  onClick={() => onOpenListingDetail(selectedListing)}
                  className="px-3 py-1 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <span>Details</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Top Map Controls: Zoom, Pan, Radius, Style */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
        <div className="flex flex-col bg-navy-950/90 backdrop-blur rounded-2xl border border-navy-800 shadow-trust overflow-hidden text-cream-50">
          <button
            type="button"
            onClick={() => setZoomLevel(prev => Math.min(prev + 0.3, 3))}
            className="p-2.5 hover:bg-navy-800 transition-colors cursor-pointer"
            title="Zoom In"
            aria-label="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <div className="h-px bg-navy-800" />
          <button
            type="button"
            onClick={() => setZoomLevel(prev => Math.max(prev - 0.3, 0.6))}
            className="p-2.5 hover:bg-navy-800 transition-colors cursor-pointer"
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <div className="h-px bg-navy-800" />
          <button
            type="button"
            onClick={resetView}
            className="p-2.5 hover:bg-navy-800 transition-colors cursor-pointer text-orange-400"
            title="Reset to City Center"
            aria-label="Reset View"
          >
            <Compass className="w-4 h-4" />
          </button>
        </div>

        {/* Style toggle */}
        <button
          type="button"
          onClick={() => setMapStyle(prev => prev === 'blueprint' ? 'satellite' : 'blueprint')}
          className="p-2.5 bg-navy-950/90 backdrop-blur hover:bg-navy-800 text-cream-100 rounded-2xl border border-navy-800 shadow-trust transition-colors cursor-pointer flex items-center justify-center"
          title="Toggle GIS Blueprint / Dark Satellite"
          aria-label="Toggle Map Theme"
        >
          <Layers className="w-4 h-4 text-orange-400" />
        </button>
      </div>

      {/* Top Left City & Count Pill */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
        <div className="px-3.5 py-1.5 bg-navy-950/90 backdrop-blur text-cream-50 rounded-full border border-navy-800 shadow-trust text-xs font-extrabold flex items-center gap-2">
          <MapPin className="w-3.5 h-3.5 text-orange-500" />
          <span>{activeCity} GIS View</span>
          <span className="w-1.5 h-1.5 rounded-full bg-trust-green" />
          <span className="text-cream-300 font-medium">{projectedPins.length} pins mapped</span>
        </div>

        {onRadiusChange && (
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 bg-navy-950/90 backdrop-blur text-cream-50 rounded-full border border-navy-800 text-xs">
            <span className="text-gray-400">Radius:</span>
            {[5, 10, 15, 25].map(km => (
              <button
                key={km}
                type="button"
                onClick={() => onRadiusChange(km)}
                className={`px-1.5 py-0.5 rounded text-[11px] font-bold cursor-pointer ${
                  radiusKm === km ? 'bg-orange-500 text-white' : 'text-cream-300 hover:text-white'
                }`}
              >
                {km}km
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Right Privacy & Source Attribution */}
      <div className="absolute bottom-2 right-4 z-10 pointer-events-none">
        <span className="text-[10px] text-gray-400 bg-navy-950/80 px-2 py-0.5 rounded border border-navy-800">
          Geocoded Precision: Locality Level · Owner Privacy Protected
        </span>
      </div>
    </div>
  );
};
