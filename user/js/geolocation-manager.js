/**
 * GeolocationManager - Handles browser Geolocation API and Reverse Geocoding
 * Powered by Google Maps API (with OpenStreetMap / Nominatim API as fallback)
 */
class GeolocationManager {
    constructor() {
        // ------------------------------------------------------------------
        // IMPORTANT: INSERT YOUR GOOGLE MAPS API KEY HERE
        // ------------------------------------------------------------------
        this.googleMapsApiKey = 'YOUR_GOOGLE_MAPS_API_KEY_HERE';
        this.nominatimUrl = 'https://nominatim.openstreetmap.org/reverse';
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            const gpsBtns = document.querySelectorAll('#gps-btn');
            gpsBtns.forEach(btn => {
                btn.addEventListener('click', () => this.handleLocationDetection(btn));
            });
        });
    }

    /**
     * Get coordinates from Browser Geolocation API
     */
    getCurrentPosition() {
        return new Promise((resolve, reject) => {
            if (!navigator.geolocation) {
                reject(new Error('Geolocation is not supported by your browser.'));
                return;
            }

            navigator.geolocation.getCurrentPosition(
                (position) => resolve(position.coords),
                (error) => {
                    let msg = 'Failed to get location.';
                    if (error.code === 1) msg = 'Location permission denied.';
                    else if (error.code === 2) msg = 'Location unavailable.';
                    else if (error.code === 3) msg = 'Location request timed out.';
                    reject(new Error(msg));
                },
                { enableHighAccuracy: true, timeout: 10000 }
            );
        });
    }

    /**
     * Reverse Geocode coordinates to Address using Google Maps API (Fallback to Nominatim)
     */
    async reverseGeocode(lat, lon) {
        try {
            // Try Google Maps Geocoding API First 
            if (this.googleMapsApiKey && this.googleMapsApiKey !== 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
                const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&key=${this.googleMapsApiKey}`;
                const response = await fetch(url);
                if (response.ok) {
                    const data = await response.json();
                    if (data.status === 'OK' && data.results && data.results.length > 0) {
                        return this.parseGoogleAddress(data.results[0]);
                    } else if (data.status === 'REQUEST_DENIED') {
                        console.warn("Google Maps API request denied. Validate your API Key. Falling back to Nominatim OSM API.");
                    } else {
                        console.warn("Google Maps returned status: " + data.status + ", falling back to Nominatim.");
                    }
                }
            } else {
                console.warn("No Google Maps API Key provided. Falling back to OpenStreetMap Nominatim API.");
            }

            // Fallback to nominatim OpenStreetMap
            return await this.fallbackNominatim(lat, lon);
        } catch (error) {
            console.error('Reverse Geocoding Error:', error);
            throw error;
        }
    }

    async fallbackNominatim(lat, lon) {
        const url = `${this.nominatimUrl}?format=jsonv2&lat=${lat}&lon=${lon}`;
        const response = await fetch(url, { headers: { 'Accept-Language': 'en' } });
        if (!response.ok) throw new Error('Geocoding service failed.');
        const data = await response.json();
        return data.address;
    }

    /**
     * Maps Google Geocoding result to OpenStreetMap equivalent format 
     * so it works flawlessly with the existing code layout.
     */
    parseGoogleAddress(result) {
        let addr = {
            house_number: '',
            road: '',
            suburb: '',
            city: '',
            state: '',
            postcode: '',
            country: '',
            full_address_google: result.formatted_address
        };

        result.address_components.forEach(component => {
            const types = component.types;
            if (types.includes('street_number')) addr.house_number = component.long_name;
            if (types.includes('route')) addr.road = component.long_name;
            if (types.includes('sublocality') || types.includes('sublocality_level_1')) addr.suburb = component.long_name;
            if (types.includes('locality') || types.includes('administrative_area_level_2')) addr.city = component.long_name;
            if (types.includes('administrative_area_level_1')) addr.state = component.long_name;
            if (types.includes('postal_code')) addr.postcode = component.long_name;
            if (types.includes('country')) addr.country = component.long_name;
        });

        // Ensure city is populated effectively if locality is missing
        if (!addr.city && addr.suburb) addr.city = addr.suburb;

        return addr;
    }

    /**
     * Main Handler: Coordinates Detection -> Reverse Geocoding -> Form Filling
     */
    async handleLocationDetection(btn) {
        const text = btn.querySelector('.gps-text');
        const icon = btn.querySelector('.gps-icon');
        const loader = btn.querySelector('.gps-loader');

        const originalText = text.textContent;

        try {
            // UI Loading state
            btn.disabled = true;
            text.textContent = 'Detecting...';
            if (icon) icon.classList.add('hidden');
            if (loader) loader.classList.remove('hidden');

            // 1. Get Coords
            const coords = await this.getCurrentPosition();

            // 2. Reverse Geocode
            text.textContent = 'Fetching address...';
            const address = await this.reverseGeocode(coords.latitude, coords.longitude);

            // 3. Populate Fields
            this.populateAddressFields(address);

            // Success Feedback
            text.textContent = 'Location Detected!';
            setTimeout(() => {
                text.textContent = originalText;
                if (icon) icon.classList.remove('hidden');
                if (loader) loader.classList.add('hidden');
                btn.disabled = false;
            }, 2000);

        } catch (error) {
            alert(error.message);
            text.textContent = originalText;
            if (icon) icon.classList.remove('hidden');
            if (loader) loader.classList.add('hidden');
            btn.disabled = false;
        }
    }

    /**
     * Map Address fields to Desi Chulha Fields
     */
    populateAddressFields(addr) {
        console.log('Geocoded Address Data:', addr);

        const road = addr.road || addr.pedestrian || addr.suburb || '';
        const houseNumber = addr.house_number || '';
        const neighborhood = addr.neighbourhood || addr.suburb || addr.residential || '';

        const streetParts = [houseNumber, road, neighborhood].filter(Boolean);
        const street = streetParts.join(', ');

        const city = addr.city || addr.town || addr.village || addr.state_district || addr.county || '';
        const pincode = addr.postcode || '';

        // Profile Page Filling
        const pfStreet = document.getElementById('addr-street');
        const pfCity = document.getElementById('addr-city');
        const pfPincode = document.getElementById('addr-pincode');

        if (pfStreet) pfStreet.value = street;
        if (pfCity) pfCity.value = city;
        if (pfPincode) pfPincode.value = pincode;

        // Cart Page Filling
        const cartDisplay = document.getElementById('addr-display');
        if (cartDisplay) {
            if (addr.full_address_google) {
                cartDisplay.textContent = addr.full_address_google;
            } else {
                const fullAddrParts = [street, city, addr.state, pincode].filter(Boolean);
                const fullAddr = fullAddrParts.join(', ');
                cartDisplay.textContent = fullAddr || 'Location detected, please verify.';
            }
        }
    }
}

// Instantiate globally
window.geolocationManager = new GeolocationManager();
