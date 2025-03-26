# ENGO651_Lab6

## Overview
This project is a web-based application that demonstrates line simplification using Leaflet.js and Turf.js. Users can draw a polyline on an interactive map by clicking on the map, and after adding at least 5 points, they can simplify the polyline using a "Simplify Polyline" button. The original polyline is displayed in blue, and the simplified polyline is shown in red. A summary of the number of points before and after simplification is displayed at the bottom of the page.

## Features
- Interactive map powered by Leaflet.js with OpenStreetMap tiles.
- Draw polylines by clicking on the map, with markers indicating each point.
- Simplify polylines using Turf.js with a configurable tolerance value.
- Visual feedback with original (blue) and simplified (red) polylines.
- Summary of points before and after simplification.
- Reset functionality to clear the map and start over.

## Technologies Used
- **HTML5:** For the structure of the web page.
- **CSS3:** For styling the UI, including the heading, buttons, and summary message.
- **JavaScript:** For the core functionality and interactivity.
- **Leaflet.js (v1.9.4):** For rendering the interactive map and drawing polylines.
- **Turf.js (v6):** For performing line simplification.
- **Google Fonts (Poppins):** For the heading font.

## Project Structure
├── index.html
├── styles.css
├── script.js
└── README.md

## Usage
- Click on the map to add points and draw a polyline. Each click adds a point, marked by a small dark circle, and connects the points with a blue line (original polyline).
- Once you have added at least 5 points, the "Simplify Polyline" button will enable.
- Click the "Simplify Polyline" button to simplify the polyline using Turf.js. The simplified polyline will be displayed in red.
- A summary message will appear at the bottom, showing the number of points before and after simplification (e.g., "Simplification Summary: Points before simplification: 21, Points after simplification: 10").
- Click the "Reset Polyline" button to clear the map, remove all polylines and markers, and start over. The summary message will also be cleared.

## Expecte Output

![image](https://github.com/user-attachments/assets/6de1bd9b-2a64-4da1-9a25-527d29fd6789)
