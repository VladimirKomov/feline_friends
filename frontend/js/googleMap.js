// async function getApiKey() {
//     try {
//         const response = await fetch('/api/config');
//         const data = await response.json();
//         console.log('Get key:', data.data);
//         return data.data;
//     } catch (error) {
//         console.error('Error fetching API key:', error);
//     }
// }
//
//
// (g => {
//     var h, a, k, p = "The Google Maps JavaScript API", c = "google", l = "importLibrary", q = "__ib__", m = document,
//         b = window;
//     b = b[c] || (b[c] = {});
//     var d = b.maps || (b.maps = {}), r = new Set, e = new URLSearchParams,
//         u = () => h || (h = new Promise(async (f, n) => {
//             await (a = m.createElement("script"));
//             e.set("libraries", [...r] + "");
//             for (k in g) e.set(k.replace(/[A-Z]/g, t => "_" + t[0].toLowerCase()), g[k]);
//             // e.set("callback", c + ".maps." + q);
//             e.set("callback", "initMap");
//             a.src = `https://maps.${c}apis.com/maps/api/js?` + e;
//             d[q] = f;
//             a.onerror = () => h = n(Error(p + " could not load."));
//             a.nonce = m.querySelector("script[nonce]")?.nonce || "";
//             m.head.append(a)
//         }));
//     d[l] ? console.warn(p + " only loads once. Ignoring:", g) : d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n))
// })({
//     key: "AIzaSyAUu1QWJo1RO-amirXAKXbyX_xJRWKWzwE",
//     v: "weekly",
//     libraries: "drawing, marker",
//     language: "en" // Add this line to specify the language
//     // Use the 'v' parameter to indicate the version to use (weekly, beta, alpha, etc.).
//     // Add other bootstrap parameters as needed, using camel case.
// });
//
//
////////////////////////////////////////////////////////////

async function getApiKey() {
    try {
        const response = await fetch('/api/config');
        const data = await response.json();
        console.log('Get key:', data.data);
        return data.data;
    } catch (error) {
        console.error('Error fetching API key:', error);
    }
}

// Получите API ключ и затем инициализируйте Google Maps с ним
getApiKey().then(apiKey => {
    (g => {
        var h, a, k, p = "The Google Maps JavaScript API", c = "google", l = "importLibrary", q = "__ib__", m = document,
            b = window;
        b = b[c] || (b[c] = {});
        var d = b.maps || (b.maps = {}), r = new Set, e = new URLSearchParams,
            u = () => h || (h = new Promise(async (f, n) => {
                await (a = m.createElement("script"));
                e.set("libraries", [...r] + "");
                for (k in g) e.set(k.replace(/[A-Z]/g, t => "_" + t[0].toLowerCase()), g[k]);
                // e.set("callback", c + ".maps." + q);
                e.set("callback", "initMap");
                a.src = `https://maps.${c}apis.com/maps/api/js?` + e;
                d[q] = f;
                a.onerror = () => h = n(Error(p + " could not load."));
                a.nonce = m.querySelector("script[nonce]")?.nonce || "";
                m.head.append(a)
            }));
        d[l] ? console.warn(p + " only loads once. Ignoring:", g) : d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n))
    })({
        key: apiKey,
        v: "weekly",
        libraries: "drawing, marker",
        language: "en" // Add this line to specify the language
        // Use the 'v' parameter to indicate the version to use (weekly, beta, alpha, etc.).
        // Add other bootstrap parameters as needed, using camel case.
    });
}).catch(error => {
    console.error('Failed to initialize Google Maps:', error);
});
