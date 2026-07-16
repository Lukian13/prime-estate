// Плавний скрол до розділу
function scrollToSection(id) {
    const element = document.getElementById(id);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Проста демонстрація збереження заявки
let requestCount = 0;

function handleFormSubmit(event) {
    event.preventDefault(); // Запобігаємо перезавантаженню сторінки

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    if (name && email && message) {
        // Збільшуємо лічильник заявок у шапці
        requestCount++;
        document.getElementById('cartCount').textContent = requestCount;

        alert(`Дякуємо, ${name}! Вашу заявку успішно надіслано. Наш менеджер незабаром зв'яжеться з вами.`);
        
        // Очищуємо форму
        document.getElementById('contactForm').reset();
    }
}

// Функція для показу заявок
function showCart() {
    if (requestCount === 0) {
        alert("У вас поки немає активних заявок.");
    } else {
        alert(`Кількість надісланих вами заявок за цю сесію: ${requestCount}`);
    }
}
// --- ФУНКЦІЇ ДЛЯ КНОПОК КУПІВЛІ ТА ОРЕНДИ ---

// Функція для купівлі
function buyProperty(propertyName) {
    alert(`Вітаємо! Ви розпочали процес купівлі об'єкта: "${propertyName}". Наш менеджер зв'яжеться з вами найближчим часом.`);
}

// Функція для оренди
function rentProperty(propertyName) {
    alert(`Дякуємо за інтерес! Запит на оренду об'єкта "${propertyName}" надіслано. Очікуйте на дзвінок.`);
}


// --- ФУНКЦІЇ ДЛЯ ФІЛЬТРАЦІЇ ТА ПОШУКУ ---

// Головна функція, яка об'єднує і пошук за текстом, і фільтр за типом нерухомості
function applyFilters() {
    const searchQuery = document.getElementById('search').value.toLowerCase().trim();
    const selectedType = document.getElementById('filterType').value;
    const cards = document.querySelectorAll('.cards .card');

    cards.forEach(card => {
        // Отримуємо назву та опис (місто, площа) для гнучкого пошуку
        const title = card.querySelector('h3').textContent.toLowerCase();
        const details = card.querySelector('p').textContent.toLowerCase();
        
        // Перевіряємо, до якого типу належить картка (house, apartment, commercial)
        const isCorrectType = selectedType === 'all' || card.classList.contains(selectedType);
        
        // Перевіряємо, чи є пошуковий запит у назві або деталях картки
        const matchesSearch = title.includes(searchQuery) || details.includes(searchQuery);

        // Якщо картка відповідає і типу, і пошуку — показуємо її, інакше — приховуємо
        if (isCorrectType && matchesSearch) {
            card.style.display = 'block'; // або 'flex', залежно від твоїх стилів CSS
        } else {
            card.style.display = 'none';
        }
    });
}

// Оскільки в HTML викликаються дві різні функції, ми просто перенаправляємо їх на спільний фільтр:
function searchProperties() {
    applyFilters();
}

function filterProperties() {
    applyFilters();
}
// --- КРОС-СТОРІНКОВА ІНІЦІАЛІЗАЦІЯ ---
document.addEventListener("DOMContentLoaded", () => {
    // Якщо сховища немає, створюємо порожній масив
    if (!localStorage.getItem('propertyApplications')) {
        localStorage.setItem('propertyApplications', JSON.stringify([]));
    }
    
    // Оновлюємо лічильник заявок у хедері на будь-якій сторінці
    updateCartCount();

    // Якщо ми перебуваємо на сторінці каталогу, рендеримо таблицю заявок
    if (document.getElementById('appsList')) {
        renderApplications();
    }
});

// Функція для оновлення цифри на кнопці "Заявки"
function updateCartCount() {
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        const applications = JSON.parse(localStorage.getItem('propertyApplications')) || [];
        cartCountElement.textContent = applications.length;
    }
}


// --- ФУНКЦІЇ ДЛЯ КНОПОК КУПІВЛІ ТА ОРЕНДИ (З КАТАЛОГУ) ---

function saveApplication(type, propertyName) {
    const newApplication = {
        id: Date.now(),
        type: type, // "Купівля" або "Оренда"
        property: propertyName,
        date: new Date().toLocaleString('uk-UA')
    };

    const applications = JSON.parse(localStorage.getItem('propertyApplications')) || [];
    applications.push(newApplication);
    localStorage.setItem('propertyApplications', JSON.stringify(applications));

    alert(`Заявку на ${type.toLowerCase()} об'єкта "${propertyName}" успішно додано!`);
    
    updateCartCount(); // Оновлюємо лічильник у хедері

    if (document.getElementById('appsList')) {
        renderApplications(); // Якщо таблиця на цій сторінці — оновлюємо її
    }
}

function buyProperty(propertyName) {
    saveApplication('Купівля', propertyName);
}

function rentProperty(propertyName) {
    saveApplication('Оренда', propertyName);
}


// --- ВІДОБРАЖЕННЯ ТА ВИДАЛЕННЯ ЗАЯВОК ---

function renderApplications() {
    const applications = JSON.parse(localStorage.getItem('propertyApplications')) || [];
    const appsListContainer = document.getElementById('appsList');
    const noAppsMessage = document.getElementById('noAppsMessage');
    const table = document.querySelector('.apps-table');

    if (!appsListContainer) return; // Якщо на сторінці немає таблиці, виходимо

    appsListContainer.innerHTML = '';

    if (applications.length === 0) {
        if (table) table.style.display = 'none';
        if (noAppsMessage) noAppsMessage.style.display = 'block';
    } else {
        if (table) table.style.display = 'table';
        if (noAppsMessage) noAppsMessage.style.display = 'none';

        applications.forEach((app, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${index + 1}</td>
                <td><span class="badge ${app.type === 'Купівля' ? 'badge-buy' : 'badge-rent'}">${app.type}</span></td>
                <td><strong>${app.property}</strong></td>
                <td>${app.date}</td>
                <td><button class="delete-btn" onclick="deleteApplication(${app.id})">Видалити</button></td>
            `;
            appsListContainer.appendChild(row);
        });
    }
}

function deleteApplication(id) {
    let applications = JSON.parse(localStorage.getItem('propertyApplications')) || [];
    applications = applications.filter(app => app.id !== id);
    localStorage.setItem('propertyApplications', JSON.stringify(applications));
    
    renderApplications();
    updateCartCount();
}


// --- НАВІГАЦІЯ ТА ВЗАЄМОДІЯ НА ГОЛОВНІЙ СТОРІНЦІ ---

// Плаве скролення до потрібного розділу (Консультація / Обрати житло)
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    } else {
        // Якщо користувач натиснув кнопку на сторінці каталогу, перенаправляємо на головну до форми
        window.location.href = `index.html#${sectionId}`;
    }
}

// Поведінка кнопки "Заявки" в хедері
function showCart() {
    if (document.getElementById('appsList')) {
        // Якщо ми вже в каталозі, плавно скролимо вниз до списку заявок
        const appSection = document.querySelector('.applications-section');
        if (appSection) appSection.scrollIntoView({ behavior: 'smooth' });
    } else {
        // Якщо ми на головній — переходимо в каталог, щоб подивитися заявки
        window.location.href = 'catalog.html';
    }
}

// Обробка відправки форми зворотного зв'язку
function handleFormSubmit(event) {
    event.preventDefault(); // Зупиняємо перезавантаження сторінки

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    // Створюємо окремий запит на консультацію
    const consultationApp = {
        id: Date.now(),
        type: 'Консультація',
        property: `Запит: "${message}" (Клієнт: ${name}, Email: ${email})`,
        date: new Date().toLocaleString('uk-UA')
    };

    // Зберігаємо його до загального списку заявок
    const applications = JSON.parse(localStorage.getItem('propertyApplications')) || [];
    applications.push(consultationApp);
    localStorage.setItem('propertyApplications', JSON.stringify(applications));

    // Дякуємо клієнту та очищуємо форму
    alert(`Дякуємо, ${name}! Вашу заявку на консультацію отримано. Менеджер зв'яжеться з вами протягом 15 хвилин.`);
    document.getElementById('contactForm').reset();
    
    updateCartCount();
}


// --- ФІЛЬТРАЦІЯ ТА ПОШУК (ДЛЯ КАТАЛОГУ) ---

function applyFilters() {
    const searchQuery = document.getElementById('search')?.value.toLowerCase().trim() || "";
    const selectedType = document.getElementById('filterType')?.value || "all";
    const cards = document.querySelectorAll('.cards .card');

    cards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const details = card.querySelector('p').textContent.toLowerCase();
        
        const isCorrectType = selectedType === 'all' || card.classList.contains(selectedType);
        const matchesSearch = title.includes(searchQuery) || details.includes(searchQuery);

        if (isCorrectType && matchesSearch) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

function searchProperties() { applyFilters(); }
function filterProperties() { applyFilters(); }