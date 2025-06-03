"use strict";

//hanterar formuläret för inloggning till adminsidan
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('login-form');
    if(form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await loginUser();
        });
    }
});

//funktion för att logga in personal användare
async function loginUser() {
    const usernameLogin = document.getElementById('username').value;
    const passwordLogin = document.getElementById('password').value;
    const message = document.getElementById("message");

    //gör kontroll att både användarnamn och lösenord är ifyllt
    if(!usernameLogin || !passwordLogin) {
        message.textContent = "Du måste fylla i alla fält!";
        message.style.color = 'red';
        return;
    }

    try {
        const response = await fetch("https://projekt-backend-databas-production.up.railway.app/api/auth/login", {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({username: usernameLogin, password: passwordLogin})
        });

        const usersData = await response.json();

        //kontroll att om inloggnings uppgifter är ok, så skickas användaren till admin sidan
        if(response.ok) {
            console.log(usersData);
            localStorage.setItem("token", usersData.response.token);
            window.location.href = "admin.html";
        }
        
    } catch(error) {
        console.error("Gick inte att logga in - försök igen om en stund!", error);
        message.textContent = "Gick inte att logga in - försök igen om en stund!";
        message.style.color = 'red';
    }
}