
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
                    document.getElementById('addCat').style.display = 'flex';
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

// async function addCats(point, userId) {
//     try {
//         const description = document.getElementById('description').value;
//         const health_issues = document.getElementById('health_issues').value;
//
//         const response = await fetch('/api/addCats', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({
//                 point_id: selectedPoint.id,
//                 user_id: userId,
//                 feeding_timestamp,
//             }),
//         });
//
//         if (response.ok) {
//             alert('Feeding saved successfully!');
//         } else {
//             throw new Error('Failed to save feeding');
//         }
//     } catch (error) {
//         alert('Failed to save feeding! Try again');
//         console.error('Error saving feeding:', error);
//     }
// }

//
const inputImage = document.getElementById('inputImage');
const image = document.getElementById('image');
const cropButton = document.getElementById('cropButton');
const croppedResult = document.getElementById('croppedResult');
const urlOutput = document.getElementById('url');
const addCat = document.getElementById('addCat');
const addCatBD = document.getElementById('addCatBD');
let cropper;

const file = inputImage.files[0];
if (file) {
    console.log('File selected:', file.name);
}


inputImage.addEventListener('change', function(event) {
    event.preventDefault();
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            image.src = e.target.result;
            image.style.display = 'block';
            if (cropper) {
                cropper.destroy();
            }
            cropper = new Cropper(image, {
                aspectRatio: 1, // Пропорция обрезки 1:1
                viewMode: 1
            });
        };
        reader.readAsDataURL(file);
    }
});

cropButton.addEventListener('click', async function() {
    if (!cropper) return;
    try {
        const canvas = cropper.getCroppedCanvas();
        const blob = await new Promise((resolve) => canvas.toBlob(resolve));
        const formData = new FormData();
        formData.append('image', blob);
        const response = await fetch('img/uploadImg', {
            method: 'POST',
            body: formData
        });
        if (!response.ok) {
            throw new Error(`Network response was not ok ${response.statusText}`);
        }
        const data = await response.json();
        console.log(data.data);
        urlOutput.value = data.data;
        resultDownload.value = "Photo uploaded"
    } catch (error) {
        console.error('Error:', error);
    }
});

addCat.addEventListener('click',  async function() {
    document.getElementById('cropImage').style.display = 'block';
    document.getElementById('data').style.display = 'block';
    document.getElementById('addCat').style.display = 'none';
});

addCat.addEventListener('click',  async function() {
    document.getElementById('cropImage').style.display = 'block';
    document.getElementById('data').style.display = 'block';
    document.getElementById('addCat').style.display = 'none';
});

addCatBD.addEventListener('click', async function(event) {
    event.preventDefault();
    const description = document.getElementById('description').value;
    const health_issues = document.getElementById('healthIssues').value;
    const image_url = document.getElementById('url').value;
    console.log(selectedPoint)
    const formData = {
        description,
        health_issues,
        image_url,
        point_id: selectedPoint.id
    };

    try {
        // Send request to the server
        const response = await fetch('/img/addCatBD', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });

        // Process server response
        const result = await response.json();
        if (response.ok) {
            alert("Success! We have a new cat");
            document.getElementById('cropImage').style.display = 'none';
            document.getElementById('data').style.display = 'none';
            document.getElementById('addCat').style.display = 'block';
        } else {
            // If the server returned an error
        }
    } catch (error) {
        console.error('Error during added cat:', error);
    }
});

// lasr call
loadGoogleMaps();
