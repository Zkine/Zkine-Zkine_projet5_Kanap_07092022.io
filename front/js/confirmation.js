/* Affichage de le commande*/

function ConfirmationCommande() {
  let idCommande = document.getElementById("orderId");
  idCommande.innerText = localStorage.getItem("orderId");
  localStorage.clear();
}
ConfirmationCommande();
