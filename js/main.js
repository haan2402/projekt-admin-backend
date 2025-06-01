"use strict";

const api = 'http://localhost:3000/api/foodItems';
const form = document.getElementById("add-Form");
const menuList = document.getElementById("list-food");

//kontroll av token och laddar in data från api
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem("token");
    if(!token) {
        window.location.href = "index.html"; //om det inte skickas med en token så stannar man på index och logga in
    } else {
        getMenu(token);
    }
});

//hämtar in maträtterna som finns tillgängliga i menyn
async function getMenu(token) {
    try {
        const response = await fetch(api, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            }
        });
        const data = await response.json();
        writeMenu(data);
    } catch (error) {
        console.error("Gick inte att hämta data..", error);
    }
}

//skriver ut menyn i listan och lägger till för att kunna ta bort eller ändra i en maträtt
function writeMenu(menu) {
    menuList.innerHTML = "";
    menu.forEach(item => {
        const li = document.createElement('li');
        li.classList.add("menu-item");

        li.innerHTML = `
        <div class="dish-info">
        <div class="dish-top">
        <h3 class="dish-name">${item.name}</h3>
        <span class="dish-price">${item.price} kr</span>
        </div>
        <p class="dish-desc">${item.description}</p>
        <div class="buttons">
        <button class="edit-Btn" data-id="('${item.id}')">Ändra</button>
        <button class="delete-Btn" data-id="('${item.id}')">Ta bort</button>
        </div>
        </div> `;

        menuList.appendChild(li);
    });
}



//eventlyssnare för att kunna logga ut
document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "index.html";
});
