"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import L from "leaflet";
import {
  Compass,
  MapPin,
  Search,
  Crosshair,
  ExternalLink,
  Plus,
  Minus,
  CheckCircle2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import delivery, { ILocationSearchResult } from "@/services/delivery.service";
import { toast } from "sonner";

interface DeliveryMapPickerProps {
  latitude: number;
  longitude: number;
  onChange: (lat: number, lng: number, addressHint?: string) => void;
  onAddressSelect?: (addressText: string) => void;
  initialLat?: number;
  initialLng?: number;
}

const POPULAR_KARAWANG_LANDMARKS = [
  "Mall KCP",
  "Resinda Park Mall",
  "Galuh Mas",
  "Grand Taruma",
  "UNSIKA",
  "Pasar Johar",
  "Pasar Baru Karawang",
  "Alun-Alun Karawang",
];

export default function DeliveryMapPicker({
  latitude,
  longitude,
  onChange,
  onAddressSelect,
  initialLat = -6.3262,
  initialLng = 107.3045,
}: DeliveryMapPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const userLocationMarkerRef = useRef<L.Marker | null>(null);

  const [isDragging, setIsDragging] = useState(false);
  const [currentCenter, setCurrentCenter] = useState({ lat: latitude, lng: longitude });

  // Input koordinat manual
  const [manualLat, setManualLat] = useState<string>(latitude.toString());
  const [manualLng, setManualLng] = useState<string>(longitude.toString());

  // Pencarian nama jalan di Karawang
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<ILocationSearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLocatingUser, setIsLocatingUser] = useState(false);

  // Titik patokan lokasi pengguna asli yang terdeteksi
  const detectedUserPosRef = useRef<{ lat: number; lng: number } | null>(null);

  // Fungsi menempatkan atau memperbarui marker titik pengguna (Pulsing Dot)
  const renderUserMarker = useCallback((lat: number, lng: number, title: string = "Lokasi Anda") => {
    if (!mapInstanceRef.current) return;

    if (userLocationMarkerRef.current) {
      userLocationMarkerRef.current.setLatLng([lat, lng]);
    } else {
      const pulseDotIcon = L.divIcon({
        className: "user-gps-pulse-marker",
        html: `
          <div style="position:relative; width:20px; height:20px; cursor:pointer;" title="${title}">
            <div style="position:absolute; inset:-6px; border-radius:9999px; background:rgba(16,185,129,0.35); animation:ping 1.8s cubic-bezier(0,0,0.2,1) infinite;"></div>
            <div style="position:relative; width:20px; height:20px; border-radius:9999px; background:#059669; border:3px solid white; box-shadow:0 2px 6px rgba(0,0,0,0.45); display:flex; align-items:center; justify-content:center;">
              <div style="width:6px; height:6px; border-radius:9999px; background:white;"></div>
            </div>
          </div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      });

      userLocationMarkerRef.current = L.marker([lat, lng], {
        icon: pulseDotIcon,
        zIndexOffset: 800,
      }).addTo(mapInstanceRef.current);
    }
  }, []);

  // Multi-tier location detection: Browser Geolocation -> IP Geolocation -> Karawang center
  const detectUserLocation = useCallback(
    async (isUserTriggered: boolean = false) => {
      setIsLocatingUser(true);

      const applyLocation = (lat: number, lng: number, label: string) => {
        detectedUserPosRef.current = { lat, lng };
        setCurrentCenter({ lat, lng });
        setManualLat(lat.toString());
        setManualLng(lng.toString());

        if (mapInstanceRef.current) {
          renderUserMarker(lat, lng, label);
          mapInstanceRef.current.flyTo([lat, lng], 16, { duration: 1.2 });
        }

        onChange(lat, lng, label);
        setIsLocatingUser(false);

        if (isUserTriggered) {
          toast.success(`Titik lokasi Anda berhasil dikunci: ${label}`, {
            position: "top-right",
          });
        }
      };

      // 1. Coba browser Geolocation (timeout 3.5 detik)
      if (typeof window !== "undefined" && navigator.geolocation) {
        try {
          const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 3500,
              enableHighAccuracy: false,
              maximumAge: 60000,
            });
          });

          const userLat = Number(pos.coords.latitude.toFixed(6));
          const userLng = Number(pos.coords.longitude.toFixed(6));
          applyLocation(userLat, userLng, "Lokasi GPS Perangkat");
          return;
        } catch {
          // Gagal atau timeout, lanjut otomatis ke IP Geolocation
        }
      }

      // 2. Fallback otomatis ke IP Geolocation (BE / External)
      try {
        const res = await delivery.detectLocation();
        if (res.data?.success && res.data.latitude && res.data.longitude) {
          const ipLat = Number(res.data.latitude.toFixed(6));
          const ipLng = Number(res.data.longitude.toFixed(6));
          const name = res.data.name || "Lokasi Jaringan Internet";
          applyLocation(ipLat, ipLng, name);
          return;
        }
      } catch {
        // Fallback terakhir
      }

      // 3. Fallback ke titik default Karawang (Unsika)
      const fallbackLat = initialLat || -6.3262;
      const fallbackLng = initialLng || 107.3045;
      applyLocation(fallbackLat, fallbackLng, "Pusat Wilayah Karawang");
    },
    [initialLat, initialLng, onChange, renderUserMarker]
  );

  // Inisialisasi Peta Leaflet
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [latitude, longitude],
      zoom: 15,
      zoomControl: false,
      attributionControl: false,
    });

    // Tile Layer: OpenStreetMap Standard
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
    }).addTo(map);

    // Marker Hub Logistik Pasar Johar Karawang
    const hubIcon = L.divIcon({
      className: "custom-hub-marker",
      html: `
        <div style="background:#065f46; color:white; font-size:10px; font-weight:700; padding:3px 7px; border-radius:9999px; box-shadow:0 2px 6px rgba(0,0,0,0.3); white-space:nowrap; border:1.5px solid white; display:flex; align-items:center; gap:4px;">
          <span style="width:6px; height:6px; border-radius:9999px; background:#34d399;"></span>
          Hub Pasar Johar
        </div>
      `,
      iconSize: [110, 24],
      iconAnchor: [55, 12],
    });

    L.marker([-6.3032, 107.3105], { icon: hubIcon, interactive: false }).addTo(map);

    // Event gerak peta (Gojek / Grab pan style)
    map.on("movestart", () => {
      setIsDragging(true);
    });

    map.on("move", () => {
      const center = map.getCenter();
      setCurrentCenter({
        lat: Number(center.lat.toFixed(6)),
        lng: Number(center.lng.toFixed(6)),
      });
    });

    map.on("moveend", () => {
      setIsDragging(false);
      const center = map.getCenter();
      const newLat = Number(center.lat.toFixed(6));
      const newLng = Number(center.lng.toFixed(6));
      setCurrentCenter({ lat: newLat, lng: newLng });
      setManualLat(newLat.toString());
      setManualLng(newLng.toString());
      onChange(newLat, newLng);
    });

    mapInstanceRef.current = map;

    // Deteksi lokasi pengguna pertama kali saat peta siap
    detectUserLocation(false);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update center peta jika koordinat di luar komponen berubah
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    const center = mapInstanceRef.current.getCenter();
    const diffLat = Math.abs(center.lat - latitude);
    const diffLng = Math.abs(center.lng - longitude);

    if (diffLat > 0.0001 || diffLng > 0.0001) {
      mapInstanceRef.current.setView([latitude, longitude], mapInstanceRef.current.getZoom(), {
        animate: true,
      });
      setCurrentCenter({ lat: latitude, lng: longitude });
      setManualLat(latitude.toString());
      setManualLng(longitude.toString());
    }
  }, [latitude, longitude]);

  // Tombol Kompas / Recenter: mengembalikan peta ke titik lokasi asli pengguna
  const handleRecenterToMyLocation = useCallback(() => {
    if (detectedUserPosRef.current && mapInstanceRef.current) {
      const { lat, lng } = detectedUserPosRef.current;
      setCurrentCenter({ lat, lng });
      setManualLat(lat.toString());
      setManualLng(lng.toString());
      renderUserMarker(lat, lng, "Lokasi Anda");
      mapInstanceRef.current.flyTo([lat, lng], 16, { duration: 1.0 });
      onChange(lat, lng);
      toast.success("Peta diarahkan kembali ke titik lokasi Anda", { position: "top-right" });
    } else {
      detectUserLocation(true);
    }
  }, [detectUserLocation, onChange, renderUserMarker]);

  // Pencarian Lokasi
  const handleSearch = async (overrideQuery?: string) => {
    const q = (overrideQuery ?? searchQuery).trim();
    if (q.length < 2) {
      toast.info("Ketik minimal 2 karakter untuk mencari lokasi.");
      return;
    }

    setIsSearching(true);
    try {
      const res = await delivery.searchLocation(q);
      const results = res.data?.data || [];
      setSearchResults(results);
      if (results.length === 0) {
        toast.info(`Lokasi "${q}" tidak ditemukan di Karawang.`);
      }
    } catch {
      toast.error("Gagal mencari lokasi.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSearchResult = (loc: ILocationSearchResult) => {
    setSearchResults([]);
    setSearchQuery(loc.name);
    setManualLat(loc.latitude.toString());
    setManualLng(loc.longitude.toString());

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([loc.latitude, loc.longitude], 16, {
        duration: 1.2,
      });
    }

    onChange(loc.latitude, loc.longitude, loc.name);
    if (onAddressSelect) {
      onAddressSelect(loc.name);
    }

    toast.success(`Titik dipindahkan ke: ${loc.name}`, { position: "top-right" });
  };

  // Terapkan koordinat manual
  const handleApplyManualCoords = () => {
    const lat = parseFloat(manualLat);
    const lng = parseFloat(manualLng);

    if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      toast.error("Format koordinat tidak valid (Lat: -90 s/d 90, Lng: -180 s/d 180)");
      return;
    }

    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], 16, { duration: 1.0 });
    }

    onChange(lat, lng);
    toast.success("Koordinat berhasil diperbarui");
  };

  return (
    <div className="space-y-3">
      {/* 1. Bar Pencarian Nama Jalan & Landmark di Karawang */}
      <div className="space-y-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
            <Input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSearch();
                }
              }}
              placeholder="Cari mall, pasar, jalan, atau perumahan (misal: Mall KCP, Resinda, Galuh Mas)..."
              className="pl-9 pr-8 text-xs h-9 bg-white"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSearchResults([]);
                }}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <Button
            type="button"
            size="sm"
            onClick={() => handleSearch()}
            disabled={isSearching}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-9 px-4 shrink-0 font-medium"
          >
            {isSearching ? <Spinner className="w-3.5 h-3.5 mr-1" /> : <Search className="w-3.5 h-3.5 mr-1" />}
            Cari Lokasi
          </Button>
        </div>

        {/* Saran Cepat Landmark Karawang */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar text-[11px]">
          <span className="text-muted-foreground shrink-0 font-medium text-[10px] uppercase tracking-wider">
            Saran:
          </span>
          {POPULAR_KARAWANG_LANDMARKS.map((landmark) => (
            <button
              key={landmark}
              type="button"
              onClick={() => {
                setSearchQuery(landmark);
                handleSearch(landmark);
              }}
              className="px-2 py-0.5 rounded-md bg-muted/60 hover:bg-emerald-50 hover:text-emerald-800 text-muted-foreground border border-border/80 shrink-0 transition-colors"
            >
              {landmark}
            </button>
          ))}
        </div>

        {/* Dropdown Hasil Pencarian */}
        {searchResults.length > 0 && (
          <div className="bg-white rounded-xl border border-emerald-300 p-2 space-y-1 shadow-md max-h-56 overflow-y-auto z-20 relative">
            <div className="flex items-center justify-between px-2 py-1 border-b border-neutral-100">
              <span className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wider">
                Ditemukan {searchResults.length} Lokasi:
              </span>
              <button
                type="button"
                onClick={() => setSearchResults([])}
                className="text-[10px] text-muted-foreground hover:text-foreground"
              >
                Tutup
              </button>
            </div>
            {searchResults.map((loc, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSearchResult(loc)}
                className="w-full text-left p-2 rounded-lg hover:bg-emerald-50 transition-colors flex items-start gap-2.5 text-xs group"
              >
                <div className="w-6 h-6 rounded-md bg-emerald-100 group-hover:bg-emerald-200 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div className="min-w-0">
                  <span className="font-semibold text-foreground block truncate group-hover:text-emerald-900">
                    {loc.name}
                  </span>
                  <span className="text-[11px] text-muted-foreground line-clamp-1">
                    {loc.display_name}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. Container Peta Interaktif (Grab/Gojek Map Picker) */}
      <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-border shadow-xs bg-muted/20">
        {/* Wadah Leaflet Map */}
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Pin Tetap di Tengah Peta (Gojek / Grab Center Pin Dropper) */}
        <div
          className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full pointer-events-none z-[1000] flex flex-col items-center transition-transform duration-150 ${
            isDragging ? "-translate-y-[120%] scale-105" : ""
          }`}
        >
          {/* Badge Petunjuk Pin */}
          <div className="mb-1 bg-neutral-900/90 text-white text-[10px] font-semibold px-2 py-0.5 rounded-full shadow-md whitespace-nowrap flex items-center gap-1 border border-neutral-700">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            Titik Pengantaran
          </div>

          {/* Ikon Pin Utama */}
          <div className="relative">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-lg border-2 border-white">
              <MapPin className="w-4 h-4 fill-white" />
            </div>
            {/* Titik Jarum Bawah */}
            <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-emerald-600 mx-auto -mt-0.5"></div>
          </div>

          {/* Bayangan Pin di Permukaan Peta */}
          <div
            className={`w-3.5 h-1 bg-black/30 rounded-full blur-[1px] transition-all duration-150 ${
              isDragging ? "w-2 opacity-40 scale-75" : "opacity-80"
            }`}
          />
        </div>

        {/* Kontrol Kustom Melayang di Atas Peta */}
        {/* Tombol Kompas / Recenter ke Lokasi Saya */}
        <div className="absolute right-3 bottom-3 z-[1000] flex flex-col gap-2">
          <Button
            type="button"
            size="icon"
            onClick={handleRecenterToMyLocation}
            disabled={isLocatingUser}
            className="w-10 h-10 rounded-xl bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 shadow-md transition-all active:scale-95"
            title="Arahkan kembali ke titik lokasi Anda (Kompas)"
          >
            {isLocatingUser ? (
              <Spinner className="w-4 h-4 text-emerald-600" />
            ) : (
              <Compass className="w-5 h-5 text-emerald-600" />
            )}
          </Button>

          {/* Tombol Zoom In / Out */}
          <div className="bg-white rounded-xl border border-neutral-300 shadow-md overflow-hidden flex flex-col">
            <button
              type="button"
              onClick={() => mapInstanceRef.current?.zoomIn()}
              className="w-10 h-8 flex items-center justify-center text-neutral-700 hover:bg-neutral-100 transition-colors border-b border-neutral-200"
              title="Perbesar Peta"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => mapInstanceRef.current?.zoomOut()}
              className="w-10 h-8 flex items-center justify-center text-neutral-700 hover:bg-neutral-100 transition-colors"
              title="Perkecil Peta"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Petunjuk Operasional Menggeser Peta */}
        <div className="absolute left-3 top-3 z-[1000] bg-white/95 backdrop-blur-xs text-neutral-800 text-[11px] font-medium px-2.5 py-1.5 rounded-lg border border-neutral-200/80 shadow-xs pointer-events-none flex items-center gap-1.5">
          <Crosshair className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          <span>Geser peta untuk menentukan posisi kurir</span>
        </div>
      </div>

      {/* 3. Panel Setting & Verifikasi Koordinat Manual */}
      <div className="p-3.5 rounded-xl border border-border bg-card space-y-2.5 shadow-2xs">
        <div className="flex items-center justify-between text-xs font-semibold text-foreground">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Koordinat Pengantaran Terkunci</span>
          </div>

          <a
            href={`https://www.google.com/maps/dir/?api=1&destination=${currentCenter.lat},${currentCenter.lng}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-[11px] text-emerald-700 hover:underline font-semibold"
          >
            <ExternalLink className="w-3 h-3" />
            Buka di Google Maps
          </a>
        </div>

        {/* Input Koordinat Manual (Bisa di-setting langsung) */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 items-center">
          <div className="sm:col-span-2">
            <label className="text-[10px] text-muted-foreground block mb-0.5 font-medium">Latitude</label>
            <Input
              type="text"
              value={manualLat}
              onChange={(e) => setManualLat(e.target.value)}
              className="h-8 text-xs font-mono bg-background"
              placeholder="-6.326200"
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-[10px] text-muted-foreground block mb-0.5 font-medium">Longitude</label>
            <Input
              type="text"
              value={manualLng}
              onChange={(e) => setManualLng(e.target.value)}
              className="h-8 text-xs font-mono bg-background"
              placeholder="107.304500"
            />
          </div>
          <div className="sm:col-span-1 pt-3.5">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleApplyManualCoords}
              className="w-full h-8 text-xs font-medium"
            >
              Terapkan
            </Button>
          </div>
        </div>

        <p className="text-[10px] text-muted-foreground leading-normal">
          Menggeser peta otomatis menyesuaikan koordinat dan menghitung ulang ongkir jalan raya Karawang (OSRM). Anda juga dapat mengetik koordinat angka secara manual lalu klik <strong>Terapkan</strong>.
        </p>
      </div>
    </div>
  );
}
