// Ініціалізація збережених заявок з localStorage
let cart = JSON.parse(localStorage.getItem('estateCart')) || [];

// --- 1. ЗАГАЛЬНА ЛОГІКА ТА СИНХРОНІЗАЦІЯ КОШИКА ---

// Функція плавного скролу до секцій
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Збереження даних та оновлення інтерфейсу
function saveCart() {
    localStorage.setItem('estateCart', JSON.stringify(cart));
    updateCartCount();
}

// Оновлення цифри на кнопці "Заявки"
function updateCartCount() {
    const cartCountEl = document.getElementById('cartCount');
    if (cartCountEl) {
        cartCountEl.textContent = cart.length;
    }
}

// Функція для показу вікна зі збереженими заявками (Модальне вікно)
function showCart() {
    let modal = document.getElementById('cartModal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'cartModal';
        modal.className = 'modal-overlay';
        document.body.appendChild(modal);
    }

    let itemsHtml = '';
    if (cart.length === 0) {
        itemsHtml = '<p class="empty-cart-msg">У вас немає збережених заявок.</p>';
    } else {
        cart.forEach((item, index) => {
            // Перевіряємо тип заявки (форма або конкретний об'єкт)
            const title = item.type === 'form' 
                ? `Запит з форми №${index + 1}` 
                : `Нерухомість: ${item.title} (${item.action === 'buy' ? 'Купівля' : 'Оренда'})`;

            itemsHtml += `
                <div class="cart-item-card">
                    <div class="cart-item-header">
                        <strong>${title}</strong>
                        <button class="delete-item-btn" onclick="deleteCartItem(${item.id})">❌</button>
                    </div>
                    ${item.type === 'form' ? `
                        <p><strong>Ім'я:</strong> ${item.name}</p>
                        <p><strong>Email:</strong> ${item.email}</p>
                        <p><strong>Запит:</strong> ${item.message}</p>
                    ` : `
                        <p><strong>Локація/Площа:</strong> ${item.details}</p>
                        <p><strong>Ціна:</strong> ${item.price}</p>
                    `}
                    <small style="color: #999; display:block; margin-top:5px;">Створено: ${item.date}</small>
                </div>
            `;
        });
    }

    modal.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h2>Збережені заявки</h2>
                <button class="close-modal-btn" onclick="closeCart()">✕</button>
            </div>
            <div class="modal-body">
                ${itemsHtml}
            </div>
            ${cart.length > 0 ? '<button class="clear-all-btn" onclick="clearCart()">Очистити все</button>' : ''}
        </div>
    `;

    modal.classList.add('active');
}

function closeCart() {
    const modal = document.getElementById('cartModal');
    if (modal) {
        modal.classList.remove('active');
    }
}

function deleteCartItem(id) {
    cart = cart.filter(item => item.id !== id);
    saveCart();
    showCart();
}

function clearCart() {
    if (confirm('Ви впевнені, що хочете видалити всі заявки?')) {
        cart = [];
        saveCart();
        showCart();
    }
}

// --- 2. ЛОГІКА ГОЛОВНОЇ СТОРІНКИ (ФОРМА КОНТАКТІВ) ---

function handleFormSubmit(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const message = document.getElementById('message').value;

    const newApplication = {
        id: Date.now(),
        type: 'form',
        date: new Date().toLocaleDateString('uk-UA'),
        name: name,
        email: email,
        message: message
    };

    cart.push(newApplication);
    saveCart();

    document.getElementById('contactForm').reset();
    alert('Заявку успішно збережено!');
}

// --- 3. ЛОГІКА СТОРІНКИ КАТАЛОГУ (ДОДАВАННЯ ОБ'ЄКТІВ) ---

// Допоміжна функція для пошуку даних картки за назвою об'єкта
function getPropertyData(title, actionType) {
    const cards = document.querySelectorAll('.card');
    let details = "Не вказано";
    let price = "Не вказано";

    cards.forEach(card => {
        const cardTitle = card.querySelector('h3').textContent.trim();
        if (cardTitle === title) {
            details = card.querySelector('p').textContent.trim();
            price = card.querySelector('.price').textContent.trim();
        }
    });

    return {
        id: Date.now() + Math.random(), // Гарантія унікальності id
        type: 'property',
        action: actionType, // 'buy' або 'rent'
        title: title,
        details: details,
        price: price,
        date: new Date().toLocaleDateString('uk-UA')
    };
}

function buyProperty(title) {
    const propertyData = getPropertyData(title, 'buy');
    cart.push(propertyData);
    saveCart();
    alert(`Заявку на купівлю об'єкта "${title}" додано в кошик!`);
}

function rentProperty(title) {
    const propertyData = getPropertyData(title, 'rent');
    cart.push(propertyData);
    saveCart();
    alert(`Заявку на оренду об'єкта "${title}" додано в кошик!`);
}

// --- 4. ПОШУК ТА ФІЛЬТРАЦІЯ В КАТАЛОЗІ ---

function filterProperties() {
    const filterValue = document.getElementById('filterType').value;
    const searchValue = document.getElementById('search').value.toLowerCase();
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        const title = card.querySelector('h3').textContent.toLowerCase();
        const text = card.querySelector('p').textContent.toLowerCase();
        
        // Перевірка відповідності фільтру категорій
        const matchesFilter = (filterValue === 'all' || card.classList.contains(filterValue));
        // Перевірка відповідності пошуковому запиту
        const matchesSearch = (title.includes(searchValue) || text.includes(searchValue));

        if (matchesFilter && matchesSearch) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Пошук викликає ту саму функцію фільтрації для комбінування умов
function searchProperties() {
    filterProperties();
}

// Запуск при завантаженні сторінки
document.addEventListener('DOMContentLoaded', updateCartCount);
