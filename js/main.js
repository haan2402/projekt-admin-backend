"use strict";

//om det inte skickas med en token så stannar man på index och logga in
const token = localStorage.getItem("token");
if(!token) {
    window.location.href = "index.html"; 
} 

const api = 'http://localhost:3000/api/foodItems';
const menuList = document.getElementById("list-food");

//kontroll av token och laddar in data från api
document.addEventListener('DOMContentLoaded', () => {
    getMenu();

    const form = document.getElementById('add-Form');
    if(form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await registerDish();
        });
    }
});

//funktion för att lägga till ny maträtt från formulär
async function registerDish() {

    //gör variabler av inputfälten
    const name = document.getElementById('name').value;
    const description = document.getElementById('description').value;
    const category = document.getElementById('category').value;
    const price = document.getElementById('price').value;

    //till meddelande om det är ok eller om något blev fel
    const message = document.getElementById("message");
    
    //gör ett objekt av ny rätt
    const newFood = { name, description, category, price: parseFloat(price) };

    const form = document.getElementById('add-Form'); //hämtar formulär
    const idEdit = form.getAttribute('data-edit-id'); 
    const method = idEdit ? "PUT" : "POST"; //för att kunna använda PUT för att uppdatera och POST för att lägga till ny
    const apiUrl = idEdit ? `${api}/${idEdit}`: api; //väljer rätt api beroende på om det är uppdatera eller lägg till i formulär

    //kontroll att alla fält fylls i
    if(!name || !description ||!price || !category) {
        message.textContent = "Alla fält måste fyllas i";
        message.style.color = 'red';
        return;
    }

    try {
        const response = await fetch(apiUrl, {
            method: method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + token
            },
            body: JSON.stringify(newFood)
        });

        //om rätten har lagts till får man ett meddelande, byter meddelande beroende på uppdatera rätt eller lägga till
        if(response.ok) {
        message.textContent = idEdit ? "Maträtten är uppdaterad!" : "Maträtt tillagd i menyn!"
        message.style.color = 'green';
        form.reset(); //tömmer formulär efter knapp-tryckning
        form.removeAttribute('data-edit-id'); //tar bort attributet och då hamnar man i redigering
        form.querySelector('button[type="submit"]').textContent = 'Lägg till'; //ändrar sedan tillbaka knappen till lägg till
        getMenu();

        //om det inte går att lägga till
        } else {
            const errorFood = await response.json();
            message.textContent = errorFood.message || "Något gick fel..";
            message.style.color = 'red';
        }

    } catch (error) {
        console.error("Gick inte att lägga till rätten..", error);
        message.textContent = "Gick inte att lägga till rätten..";
        message.style.color = 'red'; 
    }
}

//hämtar in maträtterna som finns tillgängliga i menyn
async function getMenu() {
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
        <button class="edit-Btn">Ändra</button>
        <button class="delete-Btn">Ta bort</button>
        </div>
        </div> `;

        //eventlyssnare för ändra knappen
        const editButton = li.querySelector('.edit-Btn');
        editButton.addEventListener('click', () => editDish(item));

        //eventlyssnare för radera knappen
        const deleteButton = li.querySelector('.delete-Btn');
        deleteButton.addEventListener('click', () => removeDish(item._id));

        menuList.appendChild(li);
    });
}

//funktion för att radera en maträtt från meny
async function removeDish(id) {
    try {
        const response = await fetch(`${api}/${id}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + token
            }
        });

        //om radera är ok
        if(response.ok) {
            await getMenu();
        }

    } catch (err) {
        console.log("Gick inte att radera...", err);
    }
}

//funktion för att uppdatera befintlig maträtt i lista, scrollar upp till formuläret där man lägger till med befintlig info om rätt och sedan kan man uppdatera
function editDish(item) {

    //så att formuläret är ifylt med befintlig info om maträtt
    document.getElementById('name').value = item.name;
    document.getElementById('description').value = item.description;
    document.getElementById('category').value = item.category;
    document.getElementById('price').value = item.price;

    //spara ner id för maträtt för att kunna hämta maträtt för redigering i formuläret
    const form = document.getElementById('add-Form');
    form.setAttribute('data-edit-id', item._id);

    //ändrar så att knappen i formuläret säger uppdatera istället för lägg till
    form.querySelector('button[type="submit"]').textContent = 'Uppdatera';

    //så att man scrollas upp till formuläret när man klickar på ändra
    form.scrollIntoView({ behavior: 'smooth' });
}

//eventlyssnare för att kunna logga ut
document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "index.html";
});
