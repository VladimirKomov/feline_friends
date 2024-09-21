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
                    infoWindow.close();
                    infoWindow.setContent(marker.title);
                    infoWindow.open(map, marker);
                    document.getElementById('feedingFormModal').style.display = 'block';
                });
            });
        })
        .catch(error => console.error('Error fetching map points:', error));

    map.addListener("click", (event) => {
        currentLatLng = event.latLng;
        document.getElementById('markerFormModal').style.display = 'block';
    });
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

//добавить только для зарегестрированных пользоватлей
async function saveMarker(latLng, name, number_of_cats) {
    try {
        const response = await fetch('/api/add_point', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                latitude: latLng.lat(),
                longitude: latLng.lng(),
                name,
                number_of_cats
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to save marker');
        }
    } catch (error) {
        console.error('Error saving marker:', error);
    }
}

//добавить только для зарегестрированных пользоватлей
async function addFeeding(point, userId) {
    try {
        const feeding_timestamp = document.getElementById('feeding_date').value;
        const response = await fetch('/api/feedings', {
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

document.getElementById('markerForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const number_of_cats = document.getElementById('number_of_cats').value;
    await saveMarker(currentLatLng, name, number_of_cats);
    document.getElementById('markerFormModal').style.display = 'none';
});

document.getElementById('cancelButton').addEventListener('click', () => {
    document.getElementById('markerFormModal').style.display = 'none';
});

document.getElementById('feedingForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    await addFeeding(selectedPoint, userId);
    document.getElementById('feedingFormModal').style.display = 'none';
});

document.getElementById('cancelFeedingButton').addEventListener('click', () => {
    document.getElementById('feedingFormModal').style.display = 'none';
});

loadGoogleMaps();