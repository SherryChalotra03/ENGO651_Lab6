// Initialize the map
const map = L.map('map').setView([51.505, -0.09], 13);

// Add OpenStreetMap tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

// Variables to store coordinates and polylines
let coordinates = [];
let originalPolyline = null;
let simplifiedPolyline = null;

// Minimum points required for simplification
const MIN_POINTS = 5;

// Reference to the message element
const messageDiv = document.getElementById('message');

// Function to update the instructional message
function updateMessage() {
    if (!messageDiv) {
        console.error('Message div not found in the DOM');
        return;
    }
    if (coordinates.length < MIN_POINTS) {
        messageDiv.textContent = `Click on the map to add points. You need at least ${MIN_POINTS} points to simplify (current: ${coordinates.length}).`;
    } else {
        messageDiv.textContent = 'You have enough points! Click "Simplify Polyline" to see the result.';
    }
}

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
    updateMessage();
});

// Simplify button logic
document.getElementById('simplifyBtn').addEventListener('click', function () {
    try {
        if (coordinates.length < MIN_POINTS) {
            alert(`Please draw a polyline with at least ${MIN_POINTS} points. You currently have ${coordinates.length}.`);
            return;
        }

        console.log('Original coordinates:', coordinates);

        // Convert coordinates to GeoJSON LineString (Turf expects [lng, lat])
        const turfCoords = coordinates.map(coord => [coord[1], coord[0]]);
        const line = turf.lineString(turfCoords);

        // Simplify the line with a higher tolerance for more noticeable effect
        const simplified = turf.simplify(line, { tolerance: 0.05, highQuality: false });
        console.log('Simplified GeoJSON:', simplified);

        // Extract simplified coordinates and convert back to [lat, lng] for Leaflet
        const simplifiedCoords = simplified.geometry.coordinates.map(coord => [coord[1], coord[0]]);

        // Remove previous simplified polyline if it exists
        if (simplifiedPolyline) {
            map.removeLayer(simplifiedPolyline);
        }

        // Draw the simplified polyline
        simplifiedPolyline = L.polyline(simplifiedCoords, { color: 'red' }).addTo(map);
        console.log('Simplified polyline drawn with coordinates:', simplifiedCoords);
    } catch (error) {
        console.error('Error in simplification:', error);
        alert('An error occurred while simplifying the polyline. Check the console for details.');
    }
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
    updateMessage();
});

// Initialize the message on page load
updateMessage();