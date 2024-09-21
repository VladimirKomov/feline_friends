
let map; // Declare a variable to hold the map instance
let currentLatLng; // Store the current latitude and longitude of the clicked location
let selectedPoint; // Store the current point for add the feeding
let userId = 1; // для тестирования, когда будет авторизация - удалить

async function initMap() {
    // The location of Tel Aviv
    const position = { lat: 32.0853, lng: 34.7818 };

    // Request needed libraries for the Google Maps API
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    // Create a new map instance, centered at Tel Aviv
    map = new Map(document.getElementById("map"), {
        zoom: 13, // Set the initial zoom level
        center: position, // Set the center of the map
        mapId: "DEMO_MAP_ID" // Replace with your actual Map ID if needed
    });

    // Add a click event listener to the map
    // Fetch the map points from the API
    const response = await fetch('/api/map_points'); // Ensure this path is correct
    if (!response.ok) { // Check if the response is successful
        throw new Error('Network response was not ok ' + response.statusText);
    }
    const points = await response.json(); // Parse the response as JSON
    // console.log("Type of points:", typeof points); // Log the type of points data
    // console.log("Points data:", points); // Log the points data

    // Create an InfoWindow instance to display marker information
    const infoWindow = new google.maps.InfoWindow();

    // Loop through each point in the points data
    points.data.forEach(point => {
        const latitude = Number(point.latitude); // Convert latitude to a number
        const longitude = Number(point.longitude); // Convert longitude to a number

        // Check if the coordinates are valid
        if (isNaN(latitude) || isNaN(longitude)) {
            console.error("Invalid coordinates:", latitude, longitude); // Log error for invalid coordinates
            return; // Skip to the next point if coordinates are invalid
        }

        // Create a new marker for the current point
        const marker = new google.maps.marker.AdvancedMarkerElement({
            position: { lat: latitude, lng: longitude }, // Set the marker's position
            map: map, // Associate the marker with the map
            title: `${point.id}. ${point.name} number of cats at a point ${point.number_of_cats}`, // Set the marker's title
            gmpClickable: true // Make the marker clickable
        });

        // Add a click event listener to the marker
        marker.addListener("click", ({ domEvent, latLng }) => {
            const { target } = domEvent; // Get the target of the event
            selectedPoint = point;
            infoWindow.close(); // Close the info window if it's open
            infoWindow.setContent(marker.title); // Set the content of the info window to the marker's title
            infoWindow.open(marker.map, marker); // Open the info window on the marker
            document.getElementById('feedingFormModal').style.display = 'block'
        });
    });

    map.addListener("click", (event) => {
        currentLatLng = event.latLng; // Get the latitude and longitude of the clicked location
        document.getElementById('markerFormModal').style.display = 'block'; // Display the form modal
    });
}

async function saveMarker(latLng, name, number_of_cats) {
    // Send a POST request to save the marker in the database
    const response = await fetch('/api/add_point', {
        method: 'POST', // Use POST method
        headers: {
            'Content-Type': 'application/json', // Specify JSON content type
        },
        body: JSON.stringify({
            latitude: latLng.lat(), // Send the latitude
            longitude: latLng.lng(), // Send the longitude
            name, // Send the name of the marker
            number_of_cats // Send the number of cats at the point
        }),
    });
}

async function addFeeding(point, userId) {
    const feeding_timestamp = document.getElementById('feeding_date').value;
    // Send a POST request to save the marker in the database
    const response = await fetch('/api/feedings', {
        method: 'POST', // Use POST method
        headers: {
            'Content-Type': 'application/json', // Specify JSON content type
        },
        body: JSON.stringify({
            point_id: selectedPoint.id, // Send the point id
            user_id: userId, // Send the user id
            feeding_timestamp, // Send the time of feeding
        }),
    });

    // Check if the request was successful
    if (response.ok) {
        alert('Feeding saved successfully!'); // Alert the user
    } else {
        alert('Failed to save feeding! Try again'); // Alert the user in case of failure
    }
}

// Handle form submission
document.getElementById('markerForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    const name = document.getElementById('name').value; // Get the name from the form
    const number_of_cats = document.getElementById('number_of_cats').value; // Get the number of cats from the form

    // Save the marker with the entered data
    await saveMarker(currentLatLng, name, number_of_cats);

    // Hide the form modal after saving
    document.getElementById('markerFormModal').style.display = 'none';
});

// Handle form cancellation
document.getElementById('cancelButton').addEventListener('click', () => {
    // Hide the form modal when the cancel button is clicked
    document.getElementById('markerFormModal').style.display = 'none';
});

document.getElementById('feedingForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    await addFeeding(selectedPoint, userId); // Add feeding using the selected point and user ID

    // Hide the form modal after saving
    document.getElementById('feedingFormModal').style.display = 'none';
});

// Handle form cancellation for adding feeding
document.getElementById('cancelFeedingButton').addEventListener('click', () => {
    // Hide the feeding form modal when the cancel button is clicked
    document.getElementById('feedingFormModal').style.display = 'none';
});

// Initialize the map
initMap();// Call the initMap function to set up the map
