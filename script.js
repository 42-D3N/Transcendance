const titre = document.getElementById("titre");
console.log(`Changing "${titre.textContent}" by "Modif"`);
titre.textContent = "Modif";
titre.style.color = "blue";
console.log(`New : "${titre.textContent}"`);
