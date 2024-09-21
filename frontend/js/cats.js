async function fetchCats() {
    try {
        const response = await fetch('/img/cats');
        // if (!response.ok) {
        //     throw new Error('Network response was not ok');
        // }
        const data = await response.json();
        console.log('Get data image', data.data);
        await displayCats(data.data);
    } catch (error) {
        console.error('Error fetching cats:', error);
    }
}

async function displayCats(cats) {
    console.log("+");
    const container = document.getElementById('catsContainer');
    if (!container) {
        console.error('Cats container not found');
        return;
    }

    container.innerHTML = ''; // Clear the container before adding
    cats.forEach(cat => {
        const card = document.createElement('div');
        card.classList.add('card');

        const img = document.createElement('img');

        img.src = cat.image_url;
        img.alt = `Cat ${cat.id}`;
        card.appendChild(img);

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        const cardTitle = document.createElement('h5');
        cardTitle.classList.add('card-title');
        cardTitle.innerText = `Cat ${cat.id}`;

        const cardText = document.createElement('p');
        cardText.classList.add('card-text');
        cardText.innerText = cat.description || 'Without description';

        const healthInfo = document.createElement('p');
        healthInfo.classList.add('card-text');
        healthInfo.innerText = `Health issues: ${cat.health_issues || 'No'}`;

        cardBody.appendChild(cardTitle);
        cardBody.appendChild(cardText);
        cardBody.appendChild(healthInfo);

        card.appendChild(cardBody);
        container.appendChild(card);


    });
}

// Создаем и вызываем асинхронную функцию для выполнения кода
(async function() {
    await fetchCats();
})();
