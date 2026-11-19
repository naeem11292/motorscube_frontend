
import { useEffect, useRef, useState } from "react";
import "./LocationPicker.css";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

let googleMapsPromise = null;

const PAKISTAN_CENTER = {
  lat: 30.3753,
  lng: 69.3451,
};

function loadGoogleMaps() {
  if (window.google?.maps?.places) {
    return Promise.resolve(window.google);
  }

  if (!GOOGLE_MAPS_API_KEY) {
    return Promise.reject(
      new Error("Google Maps API key is missing from your frontend .env file.")
    );
  }

  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector(
      'script[data-google-maps="true"]'
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => {
        if (window.google?.maps?.places) {
          resolve(window.google);
        } else {
          reject(new Error("Google Maps Places library could not load."));
        }
      });

      existingScript.addEventListener("error", () => {
        reject(new Error("Failed to load Google Maps."));
      });

      return;
    }

    const script = document.createElement("script");

    script.dataset.googleMaps = "true";
    script.src =
      `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(
        GOOGLE_MAPS_API_KEY
      )}&libraries=places`;
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (window.google?.maps?.places) {
        resolve(window.google);
      } else {
        reject(new Error("Google Maps Places library could not load."));
      }
    };

    script.onerror = () => {
      googleMapsPromise = null;
      reject(new Error("Failed to load Google Maps. Check your API key."));
    };

    document.head.appendChild(script);
  });

  return googleMapsPromise;
}

function removePlusCode(address = "") {
  const parts = address.trim().split(",");

  if (parts.length > 1 && parts[0].includes("+")) {
    parts.shift();
  }

  return parts.join(",").trim();
}

function getBestAddressResult(results) {
  if (!results?.length) return null;

  const priorities = [
    "street_address",
    "premise",
    "establishment",
    "point_of_interest",
    "route",
    "locality",
    "sublocality",
    "administrative_area_level_3",
  ];

  for (const type of priorities) {
    const match = results.find((result) =>
      result.types?.includes(type)
    );

    if (match) return match;
  }

  return (
    results.find(
      (result) => !result.types?.includes("plus_code")
    ) || results[0]
  );
}

function getAddressData(result, allResults = []) {
  const components = result?.address_components || [];

  const address = {
    location: removePlusCode(result?.formatted_address || ""),
    city: "",
    state: "",
    zip_code: "",
    locality: "",
    latitude: "",
    longitude: "",
    country: "Pakistan",
  };

  const findComponent = (type) =>
    components.find((component) => component.types?.includes(type));

  address.city =
    findComponent("locality")?.long_name ||
    findComponent("administrative_area_level_2")?.long_name ||
    findComponent("administrative_area_level_3")?.long_name ||
    "";

  address.state =
    findComponent("administrative_area_level_1")?.long_name || "";

  address.locality =
    findComponent("sublocality")?.long_name ||
    findComponent("sublocality_level_1")?.long_name ||
    findComponent("sublocality_level_2")?.long_name ||
    "";

  address.zip_code =
    findComponent("postal_code")?.long_name || "";

  // Search all reverse-geocoding results if the selected
  // result does not contain a postal code.
  if (!address.zip_code) {
    for (const item of allResults) {
      const postal = item.address_components?.find((component) =>
        component.types?.includes("postal_code")
      );

      if (postal) {
        address.zip_code = postal.long_name;
        break;
      }
    }
  }

  const coordinates = result?.geometry?.location;

  if (coordinates) {
    address.latitude = String(coordinates.lat());
    address.longitude = String(coordinates.lng());
  }

  return address;
}

export default function LocationPicker({ value = {}, onChange }) {
  const mapElementRef = useRef(null);
  const searchInputRef = useRef(null);

  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const geocoderRef = useRef(null);
  const autocompleteRef = useRef(null);
  const onChangeRef = useRef(onChange);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    let cancelled = false;
    let mapClickListener;
    let autocompleteListener;
    let markerDragListener;

    const publishLocation = (result, allResults = []) => {
      if (!result?.geometry?.location) return;

      const locationData = getAddressData(result, allResults);

      onChangeRef.current?.(locationData);
    };

    const placeMarker = (position) => {
      if (!markerRef.current) {
        markerRef.current = new window.google.maps.Marker({
          position,
          map: mapRef.current,
          draggable: true,
        });

        markerDragListener = markerRef.current.addListener(
          "dragend",
          (event) => {
            geocoderRef.current.geocode(
              {
                location: event.latLng,
                region: "pk",
              },
              (results, status) => {
                if (status !== "OK" || !results?.length) return;

                const bestResult = getBestAddressResult(results);
                publishLocation(bestResult, results);
              }
            );
          }
        );
      } else {
        markerRef.current.setPosition(position);
        markerRef.current.setMap(mapRef.current);
      }
    };

    const reverseGeocode = (position) => {
      geocoderRef.current.geocode(
        {
          location: position,
          region: "pk",
        },
        (results, status) => {
          if (status !== "OK" || !results?.length) {
            setError("No address could be found for this location.");
            return;
          }

          const bestResult = getBestAddressResult(results);

          publishLocation(bestResult, results);
          setError("");
        }
      );
    };

    const geocodeAddress = (address) => {
      if (!address.trim()) return;

      geocoderRef.current.geocode(
        {
          address,
          componentRestrictions: { country: "PK" },
          region: "pk",
        },
        (results, status) => {
          if (status !== "OK" || !results?.length) {
            setError(
              "Could not find this location. Select a suggestion or try another address."
            );
            return;
          }

          const bestResult = getBestAddressResult(results);
          const position = bestResult.geometry.location;

          publishLocation(bestResult, results);

          mapRef.current.setCenter(position);
          mapRef.current.setZoom(16);

          placeMarker(position);
          setError("");
        }
      );
    };

    const initializeMap = async () => {
      try {
        await loadGoogleMaps();

        if (cancelled) return;

        const google = window.google;

        mapRef.current = new google.maps.Map(mapElementRef.current, {
          center: PAKISTAN_CENTER,
          zoom: 6,
          mapTypeControl: true,
          streetViewControl: false,
          fullscreenControl: true,
        });

        geocoderRef.current = new google.maps.Geocoder();

        autocompleteRef.current =
          new google.maps.places.Autocomplete(
            searchInputRef.current,
            {
              componentRestrictions: { country: "PK" },
              fields: [
                "geometry",
                "formatted_address",
                "address_components",
                "name",
              ],
            }
          );

        autocompleteListener =
          autocompleteRef.current.addListener("place_changed", () => {
            const place = autocompleteRef.current.getPlace();

            if (!place.geometry?.location) {
              geocodeAddress(searchInputRef.current.value);
              return;
            }

            const position = place.geometry.location;

            publishLocation(place);

            mapRef.current.setCenter(position);
            mapRef.current.setZoom(16);

            placeMarker(position);
            setError("");
          });

        mapClickListener = mapRef.current.addListener(
          "click",
          (event) => {
            const position = event.latLng;

            placeMarker(position);
            reverseGeocode(position);
          }
        );

        searchInputRef.current.addEventListener(
          "keydown",
          handleEnter
        );

        setLoading(false);
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Google Maps could not be initialized.");
          setLoading(false);
        }
      }
    };

    function handleEnter(event) {
      if (event.key === "Enter") {
        event.preventDefault();
        geocodeAddress(searchInputRef.current.value);
      }
    }

    initializeMap();

    return () => {
      cancelled = true;

      if (mapClickListener) {
        window.google?.maps?.event?.removeListener(mapClickListener);
      }

      if (autocompleteListener) {
        window.google?.maps?.event?.removeListener(autocompleteListener);
      }

      if (markerDragListener) {
        window.google?.maps?.event?.removeListener(markerDragListener);
      }

      searchInputRef.current?.removeEventListener(
        "keydown",
        handleEnter
      );

      markerRef.current?.setMap(null);

      mapRef.current = null;
      markerRef.current = null;
      geocoderRef.current = null;
      autocompleteRef.current = null;
    };
  }, []);

  const fields = [
    { label: "City", name: "city" },
    { label: "Province / State", name: "state" },
    { label: "Postal / ZIP Code", name: "zip_code" },
    { label: "Locality / Area", name: "locality" },
    { label: "Latitude", name: "latitude" },
    { label: "Longitude", name: "longitude" },
  ];

  return (
    <section className="location-picker-section">
      <h3>Vehicle Location</h3>

      <p className="location-picker-description">
        Search for your vehicle location or click directly on the map
        to select it.
      </p>

      <div className="location-picker-search">
        <input
          ref={searchInputRef}
          type="text"
          placeholder="Search city, area, street or address..."
          defaultValue={value.location || ""}
          autoComplete="off"
        />
      </div>

      {error && (
        <p className="location-picker-error">{error}</p>
      )}

      {loading && (
        <p className="location-picker-loading">
          Loading Google Maps...
        </p>
      )}

      <div
        ref={mapElementRef}
        className="location-picker-map"
      />

      <div className="location-picker-selected">
        <label htmlFor="selected-location">
          Selected Address
        </label>

        <input
          id="selected-location"
          type="text"
          value={value.location || ""}
          readOnly
          placeholder="Your selected address will appear here"
        />
      </div>

      <div className="location-picker-details">
        {fields.map((field) => (
          <div className="location-picker-field" key={field.name}>
            <label htmlFor={`location-${field.name}`}>
              {field.label}
            </label>

            <input
              id={`location-${field.name}`}
              type="text"
              value={value[field.name] || ""}
              readOnly
              placeholder={field.label}
            />
          </div>
        ))}
      </div>
    </section>
  );
}
