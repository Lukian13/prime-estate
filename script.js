// Плавна прокрутка

function scrollToSection(id){

    document
    .getElementById(id)
    .scrollIntoView({
        behavior:"smooth"
    });

}

// Відправка форми

function sendForm(){

    alert(
        "Дякуємо! Ваша заявка успішно відправлена."
    );

}

// Пошук нерухомості

function searchProperties(){

    let input =
    document
    .getElementById("search")
    .value
    .toLowerCase();

    let cards =
    document
    .querySelectorAll(".card");

    cards.forEach(card => {

        let text =
        card.innerText.toLowerCase();

        if(text.includes(input)){
            card.style.display = "block";
        }
        else{
            card.style.display = "none";
        }

    });

}

// Фільтр

function filterProperties(){

    let filter =
    document
    .getElementById("filterType")
    .value;

    let cards =
    document
    .querySelectorAll(".card");

    cards.forEach(card => {

        if(filter === "all"){
            card.style.display = "block";
        }
        else if(card.classList.contains(filter)){
            card.style.display = "block";
        }
        else{
            card.style.display = "none";
        }

    });

}

// Кошик заявок

let cart =
JSON.parse(
localStorage.getItem("cart")
) || [];

updateCart();

// Купити

function buyProperty(name){

    cart.push({
        type:"Купівля",
        property:name
    });

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    updateCart();

    alert(
        "Об'єкт \"" +
        name +
        "\" додано до заявок на купівлю."
    );

}

// Орендувати

function rentProperty(name){

    cart.push({
        type:"Оренда",
        property:name
    });

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    updateCart();

    alert(
        "Об'єкт \"" +
        name +
        "\" додано до заявок на оренду."
    );

}

// Оновлення кошика

function updateCart(){

    const counter =
    document.getElementById("cartCount");

    if(counter){
        counter.innerText = cart.length;
    }

}

// Показати кошик

function showCart(){

    if(cart.length === 0){

        alert(
            "Кошик порожній."
        );

        return;
    }

    let text =
    "Ваші заявки:\n\n";

    cart.forEach((item,index)=>{

        text +=
        (index+1) +
        ". " +
        item.type +
        ": " +
        item.property +
        "\n";

    });

    alert(text);

}

// Очистити кошик

function clearCart(){

    if(confirm(
        "Очистити всі заявки?"
    )){

        cart = [];

        localStorage.removeItem("cart");

        updateCart();

        alert(
            "Кошик очищено."
        );

    }

}