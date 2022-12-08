/* récupérer les paramètres d’URL  */
let url = new URL(window.location.href);
let id = url.searchParams.get("id");

/* requête API  */
fetch(`http://localhost:3000/api/products/${id}`)
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  /* création des éléments du DOM  */
  .then(function (value) {
    document.querySelector(
      ".item__img"
    ).innerHTML = `<img src="${value.imageUrl}" alt="${value.altTxt}">`;

    document.querySelector("#title").textContent = `${value.name}`;

    document.querySelector("#price").textContent = `${value.price}`;

    document.querySelector("#description").textContent = `${value.description}`;

    /* boucle qui parcourt les valeurs couleurs de la requête (objet) pour les intégrer dans la sélection du choix de l'utilisateur */
    for (let i in value.colors) {
      const option = document.createElement("option");
      option.setAttribute("value", `${value.colors[i]}`);
      option.textContent = `${value.colors[i]}`;
      colors.insertAdjacentElement("beforeend", option);
    }
  })
  .catch(function () {
    alert("Une erreur est survenue");
  });

/* Gestion du panier */
function addToCart() {
  /* On écoute la selection de l'utilisateur pour la quantité et la couleur */

  const quantity = document.getElementById("quantity");

  const colors = document.getElementById("colors");

  /* Initialisation du local storage */
  let produitLocalStorage = JSON.parse(localStorage.getItem("produit"));
  /* Initialisation d'un tableau objet */
  let produitchoisi = [
    {
      produitid: `${id}`,
      produitquantity: parseInt(quantity.value),
      produitcolors: `${colors.value}`,
    },
  ];

  /* Blouche qui pour incrémenter la quantité */
  for (let i = 0; i < produitchoisi.length; i++) {
    /* S'il ni à pas de produit enregistré, on enregistre le produit dans le local storage */
    if (
      !produitLocalStorage &&
      produitchoisi[i]["produitcolors"] &&
      produitchoisi[i]["produitquantity"] > 0 &&
      produitchoisi[i]["produitquantity"] <= 100
    ) {
      produitLocalStorage = [];
      produitLocalStorage.push(produitchoisi);
      localStorage.setItem("produit", JSON.stringify(produitLocalStorage));
      alert("Votre produit a bien été enregisté.");
      

      /* S'il y a un produit présent dans le local storage, on compare l'id et la couleur et on met à jour la quantité si les valeurs précédentes sont identiques */
    } else if (
      produitLocalStorage &&
      produitchoisi[i]["produitcolors"] &&
      produitchoisi[i]["produitquantity"] > 0 &&
      produitchoisi[i]["produitquantity"] <= 100 &&
      produitLocalStorage.find(
        (el) =>
          el[i]["produitid"] === produitchoisi[i]["produitid"] &&
          el[i]["produitcolors"] === produitchoisi[i]["produitcolors"]
      )
    ) {
      /* Recherche dans le localstorage que id soit égale à id du produit et que la couleur égale à la couleur du produit */
      let resultFind = produitLocalStorage.find(
        (el) =>
          el[i]["produitid"] === produitchoisi[i]["produitid"] &&
          el[i]["produitcolors"] === produitchoisi[i]["produitcolors"]
      );
      let newQuantite =
        produitchoisi[i]["produitquantity"] + resultFind[i]["produitquantity"];
      resultFind[i]["produitquantity"] = newQuantite;
      localStorage.setItem("produit", JSON.stringify(produitLocalStorage));
      alert(
        "La quantité choisie a bien été ajoutée au produit."
      );

      /* S'il y a un produit présent dans le local storage, qu'il n'a pas le même id et même couleur on rajoute le produit dans le local storage */
    } else if (
      produitLocalStorage &&
      produitchoisi[i]["produitcolors"] &&
      produitchoisi[i]["produitquantity"] > 0 &&
      produitchoisi[i]["produitquantity"] <= 100
    ) {
      produitLocalStorage.push(produitchoisi);
      localStorage.setItem("produit", JSON.stringify(produitLocalStorage));
      alert("Votre produit a bien été enregisté.");
      /* Sinon message d'alerte pour choisir une couleur et un nombre pour valider l'article */
    } else {
      alert(
        "Choisisser une couleur et un nombre d'article(s) compris entre 1 et 100 afin de valider l'ajout du produit"
      );
    }
  }
}
const btn = document.getElementById("addToCart");
btn.addEventListener("click", addToCart);
