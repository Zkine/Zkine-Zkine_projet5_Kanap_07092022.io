/* Initialisation du local storage */
let produitLocalStorage = JSON.parse(localStorage.getItem("produit"));
let cart__items = document.getElementById("cart__items");

fetch("http://localhost:3000/api/products")
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function (values) {
    for (let value of values) {
      for (let i in produitLocalStorage) {
        if (value._id === produitLocalStorage[i][0]["produitid"]) {
          const article = document.createElement("article");
          article.classList.add("cart__item");
          article.setAttribute(
            "data-id",
            `${produitLocalStorage[i][0]["produitid"]}`
          );
          article.setAttribute(
            "data-color",
            `${produitLocalStorage[i][0]["produitcolors"]}`
          );
          cart__items.appendChild(article);

          const divimg = document.createElement("div");
          divimg.classList.add("cart__item__img");
          article.insertAdjacentElement("afterbegin", divimg);

          const img = document.createElement("img");
          img.setAttribute("src", `${value.imageUrl}`);
          img.setAttribute("alt", `${value.altTxt}`);
          divimg.appendChild(img);

          const divcontent = document.createElement("div");
          divcontent.classList.add("cart__item__content");
          article.insertAdjacentElement("beforeend", divcontent);

          const divdescription = document.createElement("div");
          divdescription.classList.add("cart__item__content__description");
          divcontent.insertAdjacentElement("afterbegin", divdescription);

          const h2 = document.createElement("h2");
          h2.textContent = `${value.name}`;
          divdescription.insertAdjacentElement("afterbegin", h2);

          const couleur = document.createElement("p");
          couleur.textContent = `${produitLocalStorage[i][0]["produitcolors"]}`;
          divdescription.insertAdjacentElement("beforeend", couleur);

          const prix = document.createElement("p");
          prix.textContent = `${value.price}`;
          divdescription.insertAdjacentElement("beforeend", prix);

          const divsettings = document.createElement("div");
          divsettings.classList.add("cart__item__content__settings");
          divcontent.insertAdjacentElement("beforeend", divsettings);

          const divquantity = document.createElement("div");
          divquantity.classList.add("cart__item__content__settings__quantity");
          divsettings.insertAdjacentElement("afterbegin", divquantity);

          const quantite = document.createElement("p");
          quantite.textContent = "Qté :";
          divquantity.insertAdjacentElement("afterbegin", quantite);

          const input = document.createElement("input");
          input.setAttribute("type", "number");
          input.classList.add("itemQuantity");
          input.setAttribute("name", `${value.name}`);
          input.setAttribute("min", "1");
          input.setAttribute("max", "100");
          input.setAttribute(
            "value",
            `${produitLocalStorage[i][0]["produitquantity"]}`
          );
          divquantity.insertAdjacentElement("beforeend", input);

          const divDelete = document.createElement("div");
          divDelete.classList.add("cart__item__content__settings__delete");
          divsettings.insertAdjacentElement("beforeend", divDelete);

          const deleteItem = document.createElement("p");
          deleteItem.classList.add("deleteItem");
          deleteItem.textContent = "Supprimer";
          divDelete.insertAdjacentElement("beforeend", deleteItem);
        }
      }
    }
  })
  .catch(function (err) {
    alert("Une erreur est survenue.");
  });
/* function qui permet que le DOM soit complétement chargé  */

setTimeout(function() {

  const itemQuantity = document.querySelectorAll(".itemQuantity");
  const deleteItem = document.querySelectorAll(".deleteItem");
  const totalQuantity = document.getElementById("totalQuantity");
  const totalPrice = document.getElementById("totalPrice");



  let priceCanape = document.querySelectorAll(
    ".cart__item__content__description :nth-child(3)"
  );

  let calculQuantity = [];
  let calculPrix = [];
  /* Modification de la qantité d'un produit dans le localstorage */
  function modifquantite() {
    itemQuantity.forEach((el) =>
      el.addEventListener("change", function (event) {
        event.preventDefault();
        event.stopPropagation();
        const newValeur = parseInt(event.target.value);
        const article = event.target.closest("article");
        const idProduit = article.dataset.id;
        const colorsProduit = article.dataset.color;

        if (newValeur === 0 || newValeur > 100) {
          alert(
            "Choisisser une quantité comprise entre 1 et 100 afin de valider la commande"
          );
        } else {
          let resultatFind = produitLocalStorage.find(
            (el) =>
              el[0]["produitid"] === idProduit &&
              el[0]["produitcolors"] === colorsProduit
          );

          resultatFind[0]["produitquantity"] = newValeur;
          produitLocalStorage[0]["produitquantity"] =
            resultatFind[0]["produitquantity"];
          localStorage.setItem("produit", JSON.stringify(produitLocalStorage));
        }
      })
    );
  }
  modifquantite();

  /* Suppression d'un produit dans le localstorage */
  function suppressionProduit() {
    deleteItem.forEach((el) =>
      el.addEventListener("click", function (event) {
        event.stopPropagation();
        const article = event.target.closest("article");
        let produitId = article.dataset.id;
        let produitColors = article.dataset.color;
        produitLocalStorage = produitLocalStorage.filter(
          (el) =>
            el[0]["produitid"] !== produitId ||
            el[0]["produitcolors"] !== produitColors
        );
        localStorage.setItem("produit", JSON.stringify(produitLocalStorage));

        el.parentNode.parentNode.parentNode.parentNode.remove(
          article.firstChild
        );
      })
    );
  }
  suppressionProduit();

  /* Calcule de la quantité global */
  function calculeQuantite() {
    for (let i = 0; i < produitLocalStorage.length; i++) {
      calculQuantity.push(produitLocalStorage[i][0].produitquantity);

      const initialValue = 0;
      const somme = calculQuantity.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        initialValue
      );

      totalQuantity.innerText = somme;
      itemQuantity.forEach((element) =>
        element.addEventListener("change", function (event) {
          event.stopPropagation();
          calculQuantity.length = 0;
          for (let e = 0; e < produitLocalStorage.length; e++) {
            calculQuantity.push(produitLocalStorage[e][0].produitquantity);
            const initialValue = 0;
            const somme = calculQuantity.reduce(
              (accumulator, currentValue) => accumulator + currentValue,
              initialValue
            );
            totalQuantity.innerText = somme;
          }
        })
      );
    }
  }
  calculeQuantite();

  /* Calcule de la quantité global après suppression d'un article */
  function calculeQuantiteSup() {
    for (let h = 0; h < deleteItem.length; h++) {
      deleteItem[h].addEventListener("click", function (event) {
        event.stopPropagation();
        calculQuantity.length = 0;

        if (produitLocalStorage.length === 0) {
          const somme = calculQuantity;
          totalQuantity.innerText = somme;
        } else {
          for (let e = 0; e < produitLocalStorage.length; e++) {
            calculQuantity.push(produitLocalStorage[e][0].produitquantity);
            const initialValue = 0;
            const somme = calculQuantity.reduce(
              (accumulator, currentValue) => accumulator + currentValue,
              initialValue
            );
            totalQuantity.innerText = somme;
          }
        }
      });
    }
  }
  calculeQuantiteSup();

  /* Calcule du prix global */
  function calculePrixGlobal() {
    priceCanape.forEach(function (element) {
      const prixTotal = element.firstChild.data;
      const priceCanapeId = element.parentNode.parentNode.parentNode.dataset.id;
      const priceCanapeColor =
        element.parentNode.parentNode.parentNode.dataset.color;
      let resultatFind = produitLocalStorage.find(
        (el) =>
          el[0]["produitid"] === priceCanapeId &&
          el[0]["produitcolors"] === priceCanapeColor
      );

      const prixProduit = prixTotal * resultatFind[0]["produitquantity"];
      calculPrix.push(prixProduit);
      const initialValue = 0;
      const somme = calculPrix.reduce(
        (accumulator, currentValue) => accumulator + currentValue,
        initialValue
      );
      totalPrice.innerText = somme;
    });
  }
  calculePrixGlobal();

  /* Calcule du prix global après modification de la quantité */
  function PrixGlobalMifQuantite() {
    for (let j = 0; j < itemQuantity.length; j++) {
      itemQuantity[j].addEventListener("change", function (event) {
        event.preventDefault();
        event.stopPropagation();
        calculPrix.length = 0;

        priceCanape = Array.from(
          document.querySelectorAll(
            ".cart__item__content__description :nth-child(3)"
          )
        );
        priceCanape.filter((item) => {
          item !== undefined;
        });

        priceCanape.forEach(function (element) {
          prixTotal = element.firstChild.data;
          let priceCanapeId =
            element.parentNode.parentNode.parentNode.dataset.id;
          let priceCanapeColor =
            element.parentNode.parentNode.parentNode.dataset.color;

          let resultatFind = produitLocalStorage.find(
            (el) =>
              el[0]["produitid"] === priceCanapeId &&
              el[0]["produitcolors"] === priceCanapeColor
          );

          let prixProduit = prixTotal * resultatFind[0]["produitquantity"];

          calculPrix.push(prixProduit);
          const initialValue = 0;
          const somme = calculPrix.reduce(
            (accumulator, currentValue) => accumulator + currentValue,
            initialValue
          );
          totalPrice.innerText = somme;
        });
      });
    }
  }
  PrixGlobalMifQuantite();

  /* Calcule prix global après suppression d'un produit  */
  function PrixGlobalSup() {
    for (let r = 0; r < deleteItem.length; r++) {
      deleteItem[r].addEventListener("click", function (event) {
        event.stopPropagation();
        calculPrix.length = 0;

        const priceCanapeSup = document.querySelectorAll(
          ".cart__item__content__description :nth-child(3)"
        );

        if (priceCanapeSup.length === 0) {
          const somme = calculPrix;
          totalPrice.innerText = somme;
        } else {
          priceCanapeSup.forEach(function (element) {
            let prixTotal = element.firstChild.data;
            let priceCanapeId =
              element.parentNode.parentNode.parentNode.dataset.id;
            let priceCanapeColor =
              element.parentNode.parentNode.parentNode.dataset.color;

            let resultatFind = produitLocalStorage.find(
              (el) =>
                el[0]["produitid"] === priceCanapeId &&
                el[0]["produitcolors"] === priceCanapeColor
            );

            const prixProduit = prixTotal * resultatFind[0]["produitquantity"];
            calculPrix.push(prixProduit);
            const initialValue = 0;
            const somme = calculPrix.reduce(
              (accumulator, currentValue) => accumulator + currentValue,
              initialValue
            );
            totalPrice.innerText = somme;
          });
        }
      });
    }
  }
  PrixGlobalSup();
}, 600);

/* Sécurisation des donnés ajoutés */

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

/* validation du prenom */
const regExpPrenom = new RegExp("^[a-zA-Z]{2,}$");
const regExpNom = new RegExp("^[a-zA-Z]{2,}$");
const regExpAdresse = new RegExp("^[0-9A-Za-z\\s]{3,}$");
const regExpVille = new RegExp("^[a-zA-Z]{2,}$");
const regExpEmail = new RegExp(
  "^[a-z0-9.-_]+[@]{1}[a-z0-9.-_]+[.]{1}[a-z]{2,4}$"
);

const inputPrenom = document.getElementById("firstName");
inputPrenom.addEventListener("input", (e) => {
  e.stopPropagation();
  const testPrenom = regExpPrenom.test(inputPrenom.value);
  const messageErreur = document.getElementById("firstNameErrorMsg");
  if (testPrenom) {
    messageErreur.innerText = "";
  } else {
    messageErreur.innerText =
      "Votre prénom ne doit pas comporter de numéros ou de caractères spéciaux.";
  }
});

/* validation du nom */
const inputNom = document.getElementById("lastName");
inputNom.addEventListener("input", (e) => {
  e.stopPropagation();
  const testNom = regExpNom.test(inputNom.value);
  const messageErreur = document.getElementById("lastNameErrorMsg");
  if (testNom) {
    messageErreur.innerText = "";
  } else {
    messageErreur.innerText =
      "votre nom ne doit pas comporter de numéros ou de caractères spéciaux.";
  }
});

/* validation du adresse postale*/
const inputAdresse = document.getElementById("address");
inputAdresse.addEventListener("input", (e) => {
  e.stopPropagation();
  const testAdresse = regExpAdresse.test(inputAdresse.value);
  const messageErreur = document.getElementById("addressErrorMsg");
  if (testAdresse) {
    messageErreur.innerText = "";
  } else {
    messageErreur.innerText = "Veuillez entrer une adresse valide.";
  }
});

/* validation de la ville*/
const inputVille = document.getElementById("city");
inputVille.addEventListener("input", (e) => {
  e.stopPropagation();
  const testAdresse = regExpVille.test(inputVille.value);
  const messageErreur = document.getElementById("cityErrorMsg");
  if (testAdresse) {
    messageErreur.innerText = "";
  } else {
    messageErreur.innerText = "Veuillez entrer une ville valide.";
  }
});

/* validation de l'email*/
const inputEmail = document.getElementById("email");
inputEmail.addEventListener("input", (e) => {
  e.stopPropagation();
  const testEmail = regExpEmail.test(inputEmail.value);
  const messageErreur = document.getElementById("emailErrorMsg");
  if (testEmail) {
    messageErreur.innerText = "";
  } else {
    messageErreur.innerText = "Veuillez entrer une adresse mail valide.";
  }
});

/* validation de la commande*/
function Commande() {
  let btnCommande = document.getElementById("order");
  btnCommande.addEventListener("click", (event) => {
    event.preventDefault();
    event.stopPropagation();
    let productId = [];
    for (let i = 0; i < produitLocalStorage.length; i++) {
      productId.push(produitLocalStorage[i][0]["produitid"]);
    }

    const order = {
      contact: {
        firstName: inputPrenom.value,
        lastName: inputNom.value,
        address: inputAdresse.value,
        email: inputVille.value,
        city: inputEmail.value,
      },
      products: productId,
    };

    // test de validation formulaire
    const validName = regExpPrenom.test(inputPrenom.value);
    const validLastName = regExpNom.test(inputNom.value);
    const validAddress = regExpAdresse.test(inputAdresse.value);
    const validCity = regExpVille.test(inputVille.value);
    const validMail = regExpEmail.test(inputEmail.value);

    if (validName && validLastName && validAddress && validCity && validMail) {
      const options = {
        method: "POST",
        body: JSON.stringify(order),
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      };

      fetch("http://localhost:3000/api/products/order", options)
        .then((response) => response.json())
        .then((data) => {
          localStorage.setItem("orderId", data.orderId);

          document.location.href = "confirmation.html";
        })
        .catch((err) => {
          alert("Problème avec fetch : " + err.message);
        });
    } else if (validName === false) {
      alert("le champ Prénom doit être rempli.");
    } else if (validLastName === false) {
      alert("le champ Nom doit être rempli.");
    } else if (validAddress === false) {
      alert("le champ Addresse doit être rempli.");
    } else if (validCity === false) {
      alert("le champ Ville doit être rempli.");
    } else if (validMail === false) {
      alert("le champ Email doit être rempli.");
    }
  });
}
Commande();
