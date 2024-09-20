// import { initMap } from './InitMaptest.js'
// let KEY_GOOGLEAPI = "";
//
// async function getConfig() {
//     try {
//         const response = await fetch('/api/config');
//         if (!response.ok) { // Проверяем успешность запроса
//             throw new Error('Ошибка сети: ' + response.statusText);
//         }
//         const res = await response.json();
//         console.log(res); // Логируем ответ для проверки структуры
//         KEY_GOOGLEAPI = res.data; // Устанавливаем API ключ
//         console.log("API Key:", KEY_GOOGLEAPI);
//
//         // Инициализация карты после загрузки ключа
//     } catch (error) {
//         console.error('Ошибка загрузки API ключа:', error);
//     }
// }
//
// getConfig().then();

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
    key: "AIzaSyAUu1QWJo1RO-amirXAKXbyX_xJRWKWzwE",
    v: "weekly",
    libraries: "drawing, marker",
    language: "en" // Add this line to specify the language
    // Use the 'v' parameter to indicate the version to use (weekly, beta, alpha, etc.).
    // Add other bootstrap parameters as needed, using camel case.
});


