async function getApiKey() {
    try {
        const response = await fetch('/api/config');
        const data = await response.json();
        console.log('Get key');
        return data.data;
    } catch (error) {
        console.error('Error fetching API key:', error);
    }
}

let map;
let currentLatLng;
let selectedPoint;
let userId = 1; // для тестирования, удалить при авторизации

function initMap() {
    const position = { lat: 32.0853, lng: 34.7818 };

    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 13,
        center: position,
        mapId: "DEMO_MAP_ID"
    });

    fetch('/api/map_points')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(points => {
            const infoWindow = new google.maps.InfoWindow();

            points.data.forEach(point => {
                const latitude = Number(point.latitude);
                const longitude = Number(point.longitude);

                if (isNaN(latitude) || isNaN(longitude)) {
                    console.error("Invalid coordinates:", latitude, longitude);
                    return;
                }

                const marker = new google.maps.marker.AdvancedMarkerElement({
                    position: { lat: latitude, lng: longitude },
                    map: map,
                    title: `${point.id}. ${point.name} number of cats at a point ${point.number_of_cats}`,
                    gmpClickable: true
                });

                marker.addListener("click", () => {
                    selectedPoint = point;
                    // infoWindow.close();
                    // infoWindow.setContent(marker.title);
                    // infoWindow.open(map, marker);
                    document.getElementById('addCatForm').style.display = 'block';
                });
            });
        })
        .catch(error => console.error('Error fetching map points:', error));

}

async function loadGoogleMaps() {
    try {
        const apiKey = await getApiKey();

        if (!apiKey) {
            console.error('API key is not available');
            return;
        }

        await new Promise((resolve, reject) => {
            var script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap&libraries=drawing,marker&language=en`;
            script.async = true;
            script.defer = true;
            script.onload = resolve;
            script.onerror = reject;

            document.head.appendChild(script);
        });

        console.log('Google Maps script loaded successfully');
    } catch (error) {
        console.error('Failed to load Google Maps script:', error);
    }
}

async function addCats(point, userId) {
    try {
        const description = document.getElementById('description').value;
        const health_issues = document.getElementById('health_issues').value;

        const response = await fetch('/api/addCats', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                point_id: selectedPoint.id,
                user_id: userId,
                feeding_timestamp,
            }),
        });

        if (response.ok) {
            alert('Feeding saved successfully!');
        } else {
            throw new Error('Failed to save feeding');
        }
    } catch (error) {
        alert('Failed to save feeding! Try again');
        console.error('Error saving feeding:', error);
    }
}



// lasr call
loadGoogleMaps();
