import { logout } from "./app.js";

document.addEventListener("DOMContentLoaded", async () => {
  const grid = document.querySelector(".doacoes-grid");
  const searchInput = document.getElementById("searchInput");
  const logoutBtn = document.querySelector(".logout");

  if (logoutBtn) logoutBtn.addEventListener("click", logout);

  const API = "https://doapiaui.onrender.com/api";

  async function listarDoacoes() {
    try {
      const res = await fetch(`${API}/doacoes`);
      const data = await res.json();
      grid.innerHTML = "";

      if (!data.doacoes || data.doacoes.length === 0) {
        grid.innerHTML = "<p>Nenhuma doação encontrada.</p>";
        return;
      }

      data.doacoes.forEach(d => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.innerHTML = `
          <img src="${d.imagem || 'https://via.placeholder.com/150'}" alt="${d.titulo}">
          <div class="card-content">
            <h3>${d.titulo}</h3>
            <span class="tag">${d.categoria || "Outros"}</span>
            <p class="local">${d.localizacao || "-"}</p>
            <p class="desc">${d.descricao || "-"}</p>
            <a href="detalhe.html?id=${d.id}" class="details-btn">Ver detalhes</a>
          </div>
        `;
        grid.appendChild(card);
      });
    } catch (err) {
      console.error(err);
      grid.innerHTML = "<p>Erro ao carregar doações.</p>";
    }
  }

  // O SEARCH FOI DESATIVADO PORQUE TEU BACKEND NÃO TEM BUSCA
  searchInput.addEventListener("input", () => {
    listarDoacoes();
  });

  listarDoacoes();
});
