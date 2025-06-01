"use strict";
//om det inte skickas med en token så stannar man på index och logga in
document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem("token");
    if(!token) {
        window.location.href = "index.html";
    }
});