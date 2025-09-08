async function addRecipe() {
    let form = document.getElementById("form");

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        let id = document.getElementById("id").value;
        let recipe = document.getElementById("recipe").value;
        let procedure = document.getElementById("procedure").value;

        if (!id || !recipe || !procedure) {
            alert("Please fill out data first");
            return;
        }

        let newRecipe = {
            id,
            recipe,
            procedure
        };

        try {
            let addedData = await fetch("http://localhost:3000/recipes", {
                method: "post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(newRecipe)
            });

            if (addedData.ok) {
                alert("Recipe added successfully")
            }
            else {
                alert("Something error");
            }
        }
        catch (e) {
            console.log(e);
        }
    });
}

addRecipe();