let showBtn = document.getElementById("show-all-recipes");
let addBtn = document.getElementById("add-new-recipe");

showBtn.addEventListener('click', showData);
addBtn.addEventListener('click', addData);

async function showData() {
    window.location.href = "recipes.html";
}

async function addData(){
    window.location.href = "addRecipe.html";
}