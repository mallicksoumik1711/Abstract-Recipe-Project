function AddRecipeForm() {
  const form = document.getElementById("addRecipeForm");
  const modalAlert = document.getElementById("modalAlert");
  if (!form) return;

  function showModalAlert(message, type = "danger") {
    if (!modalAlert) return;
    modalAlert.innerHTML = `<div class="alert alert-${type} alert-dismissible" role="alert">
      ${message}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>`;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    modalAlert.innerHTML = "";

    const id = (document.getElementById("recipeId").value || "").trim();
    const recipe = (document.getElementById("recipeTitle").value || "").trim();
    const procedure = (document.getElementById("recipeProcedure").value || "").trim();

    if (!id || !recipe || !procedure) {
      showModalAlert("Please fill out all fields.", "warning");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/recipes");
      if (!res.ok) throw new Error("fetch failed");
      const existing = await res.json();

      const dup = existing.find(r =>
        String(r.id) === id || String(r.recipe).trim().toLowerCase() === recipe.toLowerCase()
      );

      if (dup) {
        showModalAlert("A recipe with the same ID already exists.", "danger");
        return;
      }

      const newRecipe = { id: String(id), recipe: recipe, procedure: procedure };
      const post = await fetch("http://localhost:3000/recipes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRecipe)
      });

      if (post.ok) {
        showModalAlert("Recipe added successfully!", "success");
        form.reset();
        setTimeout(() => {
          const modalEl = document.getElementById("addRecipeModal");
          const instance = bootstrap.Modal.getInstance(modalEl);
          if (instance) instance.hide();
          if (typeof showRecipes === "function") showRecipes();
        }, 700);
      } else {
        showModalAlert("Server error while adding recipe.", "danger");
      }
    } catch (err) {
      console.error(err);
      showModalAlert("Could not connect to server. Make sure json-server is running.", "danger");
    }
  });
}

AddRecipeForm();