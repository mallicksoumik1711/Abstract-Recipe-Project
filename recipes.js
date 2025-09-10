(function () {
  const tableContainer = document.getElementById("table-container");

  function escapeHtml(s) {
    if (s === null || typeof s === "undefined") return "";
    return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  }

  async function showRecipes() {
    if (!tableContainer) return;
    tableContainer.innerHTML = `<div class="text-center py-4">Loading... <div class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></div></div>`;

    try {
      const res = await fetch("http://localhost:3000/recipes");
      if (!res.ok) throw new Error("Fetch failed");
      const recipes = await res.json();

      const tableHTML = `
      <div class="card shadow-sm rounded-4 overflow-hidden">
        <div class="table-responsive">
          <table class="table table-bordered table-hover align-middle text-center mb-0">
            <thead class="table-light">
              <tr>
                <th style="width: 60px;">ID</th>
                <th style="width: 150px;">Recipe</th>
                <th>Procedure</th>
                <th style="width: 100px;">Action</th>
              </tr>
            </thead>
            <tbody>
              ${recipes.map(r => `
                <tr>
                  <td>${escapeHtml(r.id)}</td>
                  <td class="fw-semibold text-truncate" style="max-width: 500px;">${escapeHtml(r.recipe)}</td>
                  <td class="text-truncate" style="max-width: 250px;">${escapeHtml(r.procedure)}</td>
                  <td>
                    <button class="btn primary-cta btn-sm view-btn" data-id="${escapeHtml(r.id)}" data-recipe="${escapeHtml(r.recipe)}" data-procedure="${escapeHtml(r.procedure)}">View</button>
                  </td>
                </tr>
              `).join("")}
            </tbody>
          </table>
        </div>
      </div>
      `;

      tableContainer.innerHTML = tableHTML;

      document.querySelectorAll(".view-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const id = btn.dataset.id;
          const recipe = btn.dataset.recipe;
          const procedure = btn.dataset.procedure;

          document.getElementById("recipeModalLabel").textContent = recipe;
          document.getElementById("recipeModalBody").innerHTML = `<p><strong>ID:</strong> ${escapeHtml(id)}</p><p><strong>Procedure:</strong></p><p>${escapeHtml(procedure)}</p>`;
          new bootstrap.Modal(document.getElementById("recipeModal"), { backdrop: false }).show();
        });
      });
    } catch (err) {
      tableContainer.innerHTML = `<div class="alert alert-danger">Failed to load recipes. Make sure json-server is running on http://localhost:3000</div>`;
    }
  }

  const deleteForm = document.getElementById("deleteRecipeForm");
  const deleteAlert = document.getElementById("deleteModalAlert");
  if (deleteForm) {
    deleteForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (deleteAlert) deleteAlert.innerHTML = "";
      const id = (document.getElementById("deleteRecipeId").value || "").trim();
      if (!id) {
        if (deleteAlert) deleteAlert.innerHTML = `<div class="alert alert-warning">Please enter a recipe ID.</div>`;
        return;
      }

      try {
        const check = await fetch(`http://localhost:3000/recipes/${encodeURIComponent(id)}`);
        if (check.status === 404) {
          if (deleteAlert) deleteAlert.innerHTML = `<div class="alert alert-danger">No recipe with ID ${id} found.</div>`;
          return;
        }
        if (!check.ok) throw new Error("check failed");

        const del = await fetch(`http://localhost:3000/recipes/${encodeURIComponent(id)}`, { method: "DELETE" });
        if (del.ok) {
          if (deleteAlert) deleteAlert.innerHTML = `<div class="alert alert-success">Recipe deleted.</div>`;
          setTimeout(() => {
            const modalEl = document.getElementById("deleteRecipeModal");
            const instance = bootstrap.Modal.getInstance(modalEl);
            if (instance) instance.hide();
            showRecipes();
          }, 700);
        } else {
          if (deleteAlert) deleteAlert.innerHTML = `<div class="alert alert-danger">Failed to delete recipe.</div>`;
        }
      } catch (err) {
        if (deleteAlert) deleteAlert.innerHTML = `<div class="alert alert-danger">Server error or cannot connect.</div>`;
      }
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    showRecipes();
  });

  window.showRecipes = showRecipes;
})();
