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
  Navigation2,
  CheckCircle2,
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
  const myLocationMarkerRef = useRef<L.Marker | null>(null);

  const [isMapReady, setIsMapReady] = useState(false);
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

  // Titik patokan awal (lokasi pengguna yang tersimpan/terdeteksi)
  const homeAnchorRef = useRef({ lat: initialLat, lng: initialLng });

  // Inisialisasi Peta Leaflet
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: [latitude, longitude],
      zoom: 15,
      zoomControl: false, // Gunakan kontrol zoom kustom yang lebih bersih
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
    setIsMapReady(true);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Update center peta jika koordinat di luar komponen berubah (misal dari form reset)
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
    if (!mapInstanceRef.current) return;
    setIsLocatingUser(true);

    if (typeof window !== "undefined" && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setIsLocatingUser(false);
          const userLat = Number(pos.coords.latitude.toFixed(6));
          const userLng = Number(pos.coords.longitude.toFixed(6));

          homeAnchorRef.current = { lat: userLat, lng: userLng };

          // Tambah atau perbarui marker titik biru GPS pengguna
          if (mapInstanceRef.current) {
            if (myLocationMarkerRef.current) {
              myLocationMarkerRef.current.setLatLng([userLat, userLng]);
            } else {
              const pulseDotIcon = L.divIcon({
                className: "user-gps-dot",
                html: `
                  <div style="position:relative; width:16px; height:16px;">
                    <div style="position:absolute; inset:-4px; border-radius:9999px; background:rgba(37,99,235,0.3); animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
                    <div style="position:relative; width:16px; height:16px; border-radius:9999px; background:#2563eb; border:2.5px solid white; box-shadow:0 1px 4px rgba(0,0,0,0.4);"></div>
                  </div>
                `,
                iconSize: [16, 16],
                iconAnchor: [8, 8],
              });

              myLocationMarkerRef.current = L.marker([userLat, userLng], {
                icon: pulseDotIcon,
                zIndexOffset: 500,
              }).addTo(mapInstanceRef.current);
            }

            mapInstanceRef.current.flyTo([userLat, userLng], 16, {
              duration: 1.2,
            });
          }

          toast.success("Peta diarahkan ke titik lokasi perangkat Anda", {
            position: "top-right",
          });
        },
        () => {
          // Fallback halus jika GPS perangkat gagal / timeout: kembali ke anchor awal pengguna
          setIsLocatingUser(false);
          const fallbackLat = homeAnchorRef.current.lat || initialLat;
          const fallbackLng = homeAnchorRef.current.lng || initialLng;

          if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([fallbackLat, fallbackLng], 16, {
              duration: 1.0,
            });
          }

          toast.info("Peta diarahkan kembali ke titik lokasi pengantaran Anda", {
            position: "top-right",
          });
        },
        { timeout: 10000, enableHighAccuracy: false, maximumAge: 60000 }
      );
    } else {
      setIsLocatingUser(false);
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([homeAnchorRef.current.lat, homeAnchorRef.current.lng], 16, {
          duration: 1.0,
        });
      }
      toast.info("Peta diarahkan kembali ke titik lokasi Anda", {
        position: "top-right",
      });
    }
  }, [initialLat, initialLng]);

  // Pencarian Lokasi
  const handleSearch = async () => {
    const q = searchQuery.trim();
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
        toast.info("Lokasi tidak ditemukan. Coba ketik nama jalan atau kelurahan lain.");
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
      {/* 1. Bar Pencarian Nama Jalan di Karawang */}
      <div className="space-y-1.5">
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
              placeholder="Cari nama jalan, perumahan, atau kelurahan di Karawang (misal: Galuh Mas, Unsika, Tuparev)..."
              className="pl-9 text-xs h-9 bg-white"
            />
          </div>
          <Button
            type="button"
            size="sm"
            onClick={handleSearch}
            disabled={isSearching}
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-9 px-4 shrink-0 font-medium"
          >
            {isSearching ? <Spinner className="w-3.5 h-3.5 mr-1" /> : <Search className="w-3.5 h-3.5 mr-1" />}
            Cari Lokasi
          </Button>
        </div>

        {/* Dropdown Hasil Pencarian */}
        {searchResults.length > 0 && (
          <div className="bg-white rounded-xl border border-emerald-300 p-2 space-y-1 shadow-md max-h-48 overflow-y-auto z-20 relative">
            <div className="text-[10px] font-semibold text-emerald-800 uppercase px-2 py-1">
              Pilih Titik Lokasi:
            </div>
            {searchResults.map((loc, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectSearchResult(loc)}
                className="w-full text-left p-2 rounded-lg hover:bg-emerald-50 transition-colors flex items-start gap-2 text-xs"
              >
                <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <span className="font-semibold text-foreground block truncate">{loc.name}</span>
                  <span className="text-[11px] text-muted-foreground line-clamp-1">{loc.display_name}</span>
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
