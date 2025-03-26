// Ensure the script runs after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // Initialize the map
    const map = L.map('map').setView([51.505, -0.09], 13);

    // Add OpenStreetMap tiles
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap'
    }).addTo(map);

    // Variables to store coordinates, polylines, and markers
    let coordinates = [];
    let originalPolyline = null;
    let simplifiedPolyline = null;
    let markers = []; // Array to store markers

    // Minimum points required for simplification
    const MIN_POINTS = 5;

    // References to DOM elements
    const messageDiv = document.getElementById('message');
    const simplifyBtn = document.getElementById('simplifyBtn');
    const summaryDiv = document.getElementById('summary');

    // Function to update the instructional message and button state
    function updateMessage() {
        if (!messageDiv) {
            console.error('Message div not found in the DOM');
            return;
        }
        if (coordinates.length < MIN_POINTS) {
            messageDiv.textContent = `Click on the map to add points. You need at least ${MIN_POINTS} points to simplify, but you can add more for better results (current: ${coordinates.length}).`;
            simplifyBtn.disabled = true;
        } else {
            messageDiv.textContent = `You have enough points! Click "Simplify Polyline" to see the result (current: ${coordinates.length}).`;
            simplifyBtn.disabled = false;
        }
    }

    // Function to display the simplification summary
    function displaySummary(before, after) {
        if (!summaryDiv) {
            console.error('Summary div not found in the DOM');
            return;
        }
        summaryDiv.textContent = `Simplification Summary: Points before simplification: ${before}, Points after simplification: ${after}`;
    }

    // Function to clear the summary
    function clearSummary() {
        if (summaryDiv) {
            summaryDiv.textContent = '';
        }
    }

    // Function to draw the original polyline
    function drawPolyline() {
        if (originalPolyline) {
            map.removeLayer(originalPolyline);
        }
        originalPolyline = L.polyline(coordinates, { color: 'blue', weight: 4 }).addTo(map);
    }

    // Handle map clicks to draw polyline and add markers
    map.on('click', function (e) {
        coordinates.push([e.latlng.lat, e.latlng.lng]);
        
        // Add a marker at the clicked point
        const marker = L.circleMarker([e.latlng.lat, e.latlng.lng], {
            radius: 5,
            color: '#333',
            fillColor: '#333',
            fillOpacity: 1
        }).addTo(map);
        markers.push(marker);

        drawPolyline();
        updateMessage();
    });

    // Simplify button logic
    simplifyBtn.addEventListener('click', function () {
        try {
            if (coordinates.length < MIN_POINTS) {
                alert(`Please draw a polyline with at least ${MIN_POINTS} points. You currently have ${coordinates.length}.`);
                return;
            }

            console.log('Original coordinates:', coordinates);
            console.log('Number of points before simplification:', coordinates.length);

            // Convert coordinates to GeoJSON LineString (Turf expects [lng, lat])
            const turfCoords = coordinates.map(coord => [coord[1], coord[0]]);
            const line = turf.lineString(turfCoords);

            // Simplify the line with a lower tolerance to retain more points
            const simplified = turf.simplify(line, { tolerance: 0.005, highQuality: false });
            console.log('Simplified GeoJSON:', simplified);

            // Extract simplified coordinates and convert back to [lat, lng] for Leaflet
            const simplifiedCoords = simplified.geometry.coordinates.map(coord => [coord[1], coord[0]]);
            console.log('Number of points after simplification:', simplifiedCoords.length);
            console.log('Simplified polyline drawn with coordinates:', simplifiedCoords);

            // Remove previous simplified polyline if it exists
            if (simplifiedPolyline) {
                map.removeLayer(simplifiedPolyline);
            }

            // Draw the simplified polyline
            simplifiedPolyline = L.polyline(simplifiedCoords, { color: 'red', weight: 4 }).addTo(map);

            // Display the simplification summary
            displaySummary(coordinates.length, simplifiedCoords.length);
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
        // Remove all markers
        markers.forEach(marker => map.removeLayer(marker));
        markers = [];
        coordinates = [];
        originalPolyline = null;
        simplifiedPolyline = null;
        updateMessage();
        clearSummary(); // Clear the summary on reset
    });

    // Clear the summary on page refresh
    window.addEventListener('beforeunload', clearSummary);

    // Initialize the message on page load
    updateMessage();
});