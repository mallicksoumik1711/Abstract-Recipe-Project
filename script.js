const showBtn = document.getElementById("show-all-recipes");
const addBtn = document.getElementById("add-new-recipe");

if (showBtn) {
  showBtn.addEventListener("click", () => {
    if (showBtn.disabled) return;
    showBtn.disabled = true;
    showBtn.dataset.orig = showBtn.innerHTML;
    showBtn.innerHTML = `<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Loading...`;
    // setTimeout(() => {
    //   window.location.href = "recipes.html";
    // }, 3000);
    window.location.href = "recipes.html";
  });
}

if (addBtn) {
  addBtn.addEventListener("click", () => {
    const el = document.getElementById("addRecipeModal");
    new bootstrap.Modal(el, { backdrop: false }).show();
  });
}
