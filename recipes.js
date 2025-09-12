function showRecipes() {
  const tableContainer = document.getElementById("table-container");
  const deleteForm = document.getElementById("deleteRecipeForm");
  const deleteAlert = document.getElementById("deleteModalAlert");

  async function showRecipes() {
    if (!tableContainer) return;

    tableContainer.innerHTML = `
      <div class="text-center py-4">
        Loading... 
        <div class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></div>
      </div>`;

    try {
      const res = await fetch("http://localhost:3000/recipes");
      if (!res.ok) throw new Error("Fetch failed");
      const recipes = await res.json();

      tableContainer.innerHTML = `
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
                    <td>${r.id}</td>
                    <td class="fw-semibold text-truncate" style="max-width: 500px;">${r.recipe}</td>
                    <td class="text-truncate" style="max-width: 250px;">${r.procedure}</td>
                    <td>
                      <button class="btn primary-cta btn-sm view-btn"
                        data-id="${r.id}"
                        data-recipe="${r.recipe}"
                        data-procedure="${r.procedure}">
                        View
                      </button>
                    </td>
                  </tr>
                `).join("")}
              </tbody>
            </table>
          </div>
        </div>`;

      document.querySelectorAll(".view-btn").forEach(btn => {
        btn.addEventListener("click", () => {
          const { id, recipe, procedure } = btn.dataset;
          document.getElementById("recipeModalLabel").textContent = recipe;
          document.getElementById("recipeModalBody").innerHTML = `
            <p><strong>ID:</strong> ${id}</p>
            <p><strong>Procedure:</strong></p>
            <p>${procedure}</p>`;
          new bootstrap.Modal(document.getElementById("recipeModal"), { backdrop: false }).show();
        });
      });

    } catch (err) {
      tableContainer.innerHTML = `
        <div class="alert alert-danger">
          Failed to load recipes. Make sure json-server is running on http://localhost:3000
        </div>`;
    }
  }

  async function handleDelete(e) {
    e.preventDefault();
    if (deleteAlert) deleteAlert.innerHTML = "";

    const id = (document.getElementById("deleteRecipeId").value || "").trim();
    if (!id) {
      if (deleteAlert) deleteAlert.innerHTML = `<div class="alert alert-warning">Please enter a recipe ID.</div>`;
      return;
    }

    try {
      const check = await fetch(`http://localhost:3000/recipes/${id}`);
      if (check.status === 404) {
        if (deleteAlert) deleteAlert.innerHTML = `<div class="alert alert-danger">No recipe with ID ${id} found.</div>`;
        return;
      }
      if (!check.ok) throw new Error("Check failed");

      const del = await fetch(`http://localhost:3000/recipes/${id}`, { method: "DELETE" });
      if (del.ok) {
        if (deleteAlert) deleteAlert.innerHTML = `<div class="alert alert-success">Recipe deleted.</div>`;
        setTimeout(() => {
          const modalEl = document.getElementById("deleteRecipeModal");
          const instance = bootstrap.Modal.getInstance(modalEl);
          if (instance) instance.hide();
          showRecipes();
        }, 3000);
      } else {
        if (deleteAlert) deleteAlert.innerHTML = `<div class="alert alert-danger">Deleted recipe ${id}.</div>`;
      }
    } catch (err) {
      if (deleteAlert) deleteAlert.innerHTML = `<div class="alert alert-danger">Server error or cannot connect.</div>`;
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    showRecipes();
    if (deleteForm) {
      deleteForm.addEventListener("submit", handleDelete);
    }
  });

  window.showRecipes = showRecipes;
}

showRecipes();
