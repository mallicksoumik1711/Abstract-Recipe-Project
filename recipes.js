async function showRecipes() {
  try {
    let res = await fetch("http://localhost:3000/recipes");
    let recipes = await res.json();

    // Build styled table with a "View" button
   // Inside your tableHTML template
let tableHTML = `
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
          ${recipes
            .map(
              (r) => `
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
            `
            )
            .join("")}
        </tbody>
      </table>
    </div>
  </div>
`;


    document.getElementById("table-container").innerHTML = tableHTML;

    // Add click listener to all "View" buttons
    const buttons = document.querySelectorAll(".view-btn");
    buttons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const recipe = btn.dataset.recipe;
        const procedure = btn.dataset.procedure;

        // Fill modal content
        document.getElementById("recipeModalLabel").textContent = recipe;
        document.getElementById("recipeModalBody").innerHTML = `
          <p><strong>ID:</strong> ${id}</p>
          <p><strong>Procedure:</strong></p>
          <p>${procedure}</p>
        `;

        const modal = new bootstrap.Modal(document.getElementById("recipeModal"));
        modal.show();
      });
    });

  } catch (err) {
    console.error("Error fetching recipes:", err);
    document.getElementById("table-container").innerHTML =
      `<p class="text-danger">Failed to load recipes. Check console.</p>`;
  }
}

showRecipes();
