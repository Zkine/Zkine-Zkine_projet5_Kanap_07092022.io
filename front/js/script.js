const items = document.getElementById("items");

/* requête API  */

fetch("http://localhost:3000/api/products")
  .then(function (res) {
    if (res.ok) {
      return res.json();
    }
  })
  .then(function (values) {
    /* boucle qui permet d'utiliser les valeurs de la réponse  */
    for (let value of values) {
      const a = document.createElement("a");
      a.setAttribute("href", `./product.html?id=${value._id}`);
      a.setAttribute("alt", `${value.description[0]}`);
      items.appendChild(a);

      /* création de la balise article à l'intérieur'de la balise a */
      const article = document.createElement("article");
      a.insertAdjacentElement("afterbegin", article);

      /* création de la balise img à la suite de la balise article */
      const img = document.createElement("img");
      img.setAttribute("src", `${value.imageUrl}`);
      img.setAttribute("alt", `${value.altTxt}`);
      article.insertAdjacentElement("afterbegin", img);

      /* création de la balise h3 à la suite de la balise img */
      const h3 = document.createElement("h3");
      h3.classList.add("productName");
      h3.innerText = `${value.name}`;
      img.insertAdjacentElement("afterend", h3);

      /* création de la balise p à la suite de la balise h3 */
      const p = document.createElement("p");
      p.classList.add("productDescription");
      p.innerText = `${value.description}`;
      h3.insertAdjacentElement("afterend", p);
    }
  })
  .catch(function (err) {
    alert("Une erreur est survenue");
  });