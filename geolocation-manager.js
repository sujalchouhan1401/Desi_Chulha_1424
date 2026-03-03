/**
 * GeolocationManager - Handles browser Geolocation API and Reverse Geocoding
 * Powered by OpenStreetMap Nominatim API
 */
class GeolocationManager {
    constructor() {
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
     * Reverse Geocode coordinates to Address using Nominatim
     */
    async reverseGeocode(lat, lon) {
        try {
            const url = `${this.nominatimUrl}?format=jsonv2&lat=${lat}&lon=${lon}`;
            const response = await fetch(url, {
                headers: {
                    'Accept-Language': 'en'
                }
            });

            if (!response.ok) throw new Error('Geocoding service failed.');

            const data = await response.json();
            return data.address;
        } catch (error) {
            console.error('Reverse Geocoding Error:', error);
            throw error;
        }
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
     * Map OSM Address fields to Desi Chulha Fields
     */
    populateAddressFields(addr) {
        // addr keys include: house_number, road, suburb, city, state, postcode, country...

        const street = [
            addr.house_number,
            addr.road,
            addr.neighbourhood || addr.suburb
        ].filter(Boolean).join(', ');

        const city = addr.city || addr.town || addr.village || addr.state_district || '';
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
            const fullAddr = [street, city, addr.state, pincode].filter(Boolean).join(', ');
            cartDisplay.textContent = fullAddr;
        }
    }
}

// Instantiate globally
window.geolocationManager = new GeolocationManager();
