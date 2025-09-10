async function showLatestId(){
    try{
        let data = await fetch("http://localhost:3000/recipes");
        let recipeData = await data.json();

        if(recipeData.length > 0){
            let latestId = recipeData[recipeData.length-1].id;
            document.getElementById("latest-id").innerText = latestId;
        }
        else{
            document.getElementById("latest-id").innerText = "No Recipes yet.";
        }
    }
    catch(e){
        console.log(e);
    }
}

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

showLatestId();
addRecipe();