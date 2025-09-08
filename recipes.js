async function showRecipes() {
    let data = await fetch("http://localhost:3000/recipes");
    let recipes = await data.json();

    let tableContainer = `
    <table class="table table-dark table-striped align-middle text-center">
        <thead class="table-light text-dark">
            <tr>
                <th>Id</th>
                <th>Recipe</th>
                <th>Procedure</th>
            </tr>
        </thead>
        <tbody>
            ${recipes.map(e => `
                <tr class="table-row" style="cursor:pointer;">
                    <td class="px-4 py-3 id">${e.id}</td>
                    <td class="px-4 py-3 recipe">${e.recipe}</td>
                    <td class="px-4 py-3 procedure">${e.procedure}</td>
                </tr>
            `).join("")}
        </tbody>
    </table>
`;


    document.getElementById("table-container").innerHTML = tableContainer;

    let rows = document.getElementsByClassName("table-row");
    for (let i = 0; i < rows.length; i++) {
        rows[i].addEventListener('click', () => {
            let id = rows[i].getElementsByClassName("id")[0].innerText;
            let recipe = rows[i].getElementsByClassName("recipe")[0].innerText;
            let procedure = rows[i].getElementsByClassName("procedure")[0].innerText;

            let details = document.getElementById("details") 
            details.style.display = "block";
            details.innerHTML = 
                `<h4>${recipe}</h4>
                    <p>${procedure}</p>`;
        });
    }
}

showRecipes();