let map;

async function initMap() {
    // The location of Tel Aviv
    const position = { lat: 32.0853, lng: 34.7818 };

    // Request needed libraries.
    const { Map } = await google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");

    // The map, centered at Tel Aviv
    map = new Map(document.getElementById("map"), {
        zoom: 12,
        center: position,
        mapId: "DEMO_MAP_ID" // Replace with your actual Map ID if needed
    });

    // The marker, positioned at Tel Aviv
    const marker = new AdvancedMarkerElement({
        map: map,
        position: position,
        title: "Tel Aviv"
    });
}

// Initialize the map
initMap();
