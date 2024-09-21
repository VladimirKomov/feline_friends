import { checkAuthorization, refreshAccessToken } from './script.js';

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

async function initMap() {
    const position = { lat: 32.0853, lng: 34.7818 };

    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 13,
        center: position,
        mapId: "DEMO_MAP_ID"
    });

    try {
        const response = await fetch('/api/map_points');
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const points = await response.json();
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

            // addFeedingListener(marker, infoWindow);
            marker.addListener("click", async () => {
                selectedPoint = point;
                infoWindow.close();
                infoWindow.setContent(marker.title);
                infoWindow.open(map, marker);
                const isAuthorized = await checkAuthorization(); // Проверяем авторизацию
                if (isAuthorized) {
                    document.getElementById('feedingFormModal').style.display = 'block';
                }
            });
        });
    } catch (error) {
        console.error('Error fetching map points:', error);
    }

    map.addListener("click", async (event) => {
        const isAuthorized = await checkAuthorization();
        currentLatLng = event.latLng;

        if (isAuthorized) {
            document.getElementById('markerFormModal').style.display = 'block';
        } else {
            document.getElementById('loginWarningModal').style.display = 'block';
        }
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
            const script = document.createElement('script');
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

async function fetchWithToken(url, options) {
    let token = localStorage.getItem('accessToken');
    options.headers = {
        ...options.headers,
        'Authorization': `Bearer ${token}`
    };

    let response = await fetch(url, options);

    // If the token is expired, refresh and retry
    if (response.status === 401 || response.status === 403) {
        token = await refreshAccessToken();
        if (token) {
            options.headers['Authorization'] = `Bearer ${token}`;
            response = await fetch(url, options);
        } else {
            alert('Something went wrong!');
            console.error('Failed to refresh token, logging out');
            return null;
        }
    }

    return response;
}

// Save a marker for registered users
async function saveMarker(latLng, name, number_of_cats) {
    const isAuthorized = await checkAuthorization();
    if (!isAuthorized) return;

    try {
        const response = await fetchWithToken('/api/add_point', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                latitude: latLng.lat(),
                longitude: latLng.lng(),
                name,
                number_of_cats
            })
        });

        if (!response.ok) {
            throw new Error('Failed to save marker');
        }

        const newMarker = new google.maps.Marker({
            position: latLng,
            map: map,
            title: `${name} number of cats at a point ${number_of_cats}`,
            gmpClickable: true
        });
        const infoWindow = new google.maps.InfoWindow();

        newMarker.addListener("click", async () => {
            infoWindow.close();
            infoWindow.setContent(newMarker.title);
            infoWindow.open(map, newMarker);
            const isAuthorized = await checkAuthorization(); // Проверяем авторизацию
            if (isAuthorized) {
                document.getElementById('feedingFormModal').style.display = 'block';
            }
        });
    } catch (error) {
        console.error('Error saving marker:', error);
    }
}

// Add feeding for registered users
async function addFeeding() {
    const isAuthorized = await checkAuthorization();
    if (!isAuthorized) return;

    try {
        const feeding_timestamp = document.getElementById('feeding_date').value;
        const response = await fetchWithToken('/api/feedings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                point_id: selectedPoint.id,
                feeding_timestamp
            })
        });

        if (!response.ok) {
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

document.getElementById('cancelButtonWarningModal').addEventListener('click', () => {
    document.getElementById('loginWarningModal').style.display = 'none';
});

document.getElementById('feedingForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    await addFeeding();
    document.getElementById('feedingFormModal').style.display = 'none';
});

document.getElementById('cancelFeedingButton').addEventListener('click', () => {
    document.getElementById('feedingFormModal').style.display = 'none';
});

window.initMap = initMap;
loadGoogleMaps();
