// Initialize the map
const map = L.map('map').setView([51.505, -0.09], 13);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

// Array to store clicked coordinates
let coordinates = [];
let originalPolyline = null;
let simplifiedPolyline = null;

// Function to draw the original polyline
function drawPolyline() {
    if (originalPolyline) {
        map.removeLayer(originalPolyline);
    }
    originalPolyline = L.polyline(coordinates, { color: 'blue' }).addTo(map);
}

// Handle map clicks to draw polyline
map.on('click', function (e) {
    coordinates.push([e.latlng.lat, e.latlng.lng]);
    drawPolyline();
});

// Simplify button logic
document.getElementById('simplifyBtn').addEventListener('click', function () {
    if (coordinates.length < 2) {
        alert('Please draw a polyline with at least 2 points.');
        return;
    }

    // Convert coordinates to GeoJSON format for Turf.js
    const line = turf.lineString(coordinates);

    // Simplify the line using Turf.js
    const simplified = turf.simplify(line, { tolerance: 0.01, highQuality: false });

    // Extract simplified coordinates
    const simplifiedCoords = simplified.geometry.coordinates.map(coord => [coord[1], coord[0]]);

    // Remove previous simplified polyline if it exists
    if (simplifiedPolyline) {
        map.removeLayer(simplifiedPolyline);
    }

    // Draw the simplified polyline in a different color
    simplifiedPolyline = L.polyline(simplifiedCoords, { color: 'red' }).addTo(map);
});

// Reset button logic
document.getElementById('resetBtn').addEventListener('click', function () {
    if (originalPolyline) {
        map.removeLayer(originalPolyline);
    }
    if (simplifiedPolyline) {
        map.removeLayer(simplifiedPolyline);
    }
    coordinates = [];
    originalPolyline = null;
    simplifiedPolyline = null;
});