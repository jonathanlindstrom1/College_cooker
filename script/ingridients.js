// main.js
import Spoonacular from './spoonacular.js';

const spoonacularInstance = new Spoonacular();
var selectedIngredients = []; //This is a list of the ingredients selected in local storage
var ingridientsDisplayed = []; //This is a list of the ingredients displayed
var ingridientDisplayedIDS = []; //This is a list of all the ingredients displayed IDS, Helps avoid duplicates

function retrieveFromLocalStorage() {
    const ingredients = localStorage.getItem('ingredients');
    const ingredientsArray = JSON.parse(ingredients);
   
    console.log(selectedIngredients);
    if(ingredientsArray != null){
        selectedIngredients = ingredientsArray
    for (var i = 0; i < selectedIngredients.length; i++) {
        fillIngredientCard(selectedIngredients[i]);
    }
  }
}
  //Gets the currently stored ingredients from local storage.
  retrieveFromLocalStorage();

// Main function that will display the ingredients based on the query inputted
async function main(query) {
    if(query == ""){
        displayNoResults("Search an Ingredient")
    }
    else{
    try {
        clearIngredients();
        for (var i = 0; i < selectedIngredients.length; i++) {
                fillIngredientCard(selectedIngredients[i]); 
        }
        const ingredients = await spoonacularInstance.search_ingredients(query);
        
        if(ingredients.length == 0){
            displayNoResults("No Ingredients found, please check your spelling") 
        }
        else{
            hideNoResults() 
        }

        for (var i = 0; i < ingredients.length; i++) {
            const isAlreadySelected = selectedIngredients.some(selected => selected.id === ingredients[i].id);
            if(!isAlreadySelected){
                fillIngredientCard(ingredients[i]);
            }
        }


    } catch (error) {
        console.error('Error fetching ingredients:', error);
    }
    }   
}

//Helps handle the search querying
function searchIngredients() {
    const query = document.getElementById("searchQuery").value;
    console.log("Searching for:", query);
    main(query);

}

//When an ingredient is clicked this handles changing its image and adding it to the list of selected ingrideints.
function addToSelectedIngredients(ingredient) {
    

    var id = ingredient.id;
    var selected = false;

    for (var i = 0; i < selectedIngredients.length; i++) {
        if (selectedIngredients[i].id === id) {
            selected = true;
            selectedIngredients.splice(i, 1);
            break; 
        }
    }

    for (var i = 0; i < ingridientsDisplayed.length; i++) {
        const ingredientDisplayed = ingridientsDisplayed[i];
        const displayedId = ingridientDisplayedIDS[i];

        if (displayedId === id) {
            if (!selected) {
                selectedIngredients.push(ingredient);
                ingredientDisplayed.classList.add('active');
            } else {
                ingredientDisplayed.classList.remove('active');
 
            }
        }
    }
    saveToLocalStorage()
    
    
}

//Saves the ingredients to local storage so other files can get the list
function saveToLocalStorage() {
    const ingredientsArrayString = JSON.stringify(selectedIngredients);
    localStorage.setItem('ingredients', ingredientsArrayString);
    console.log("Items in local Storage: ")
    console.log(selectedIngredients)
   
  }

//Clears all the ingredient cards currently being displayed that are not selected.
function clearIngredients() {
    const ingredientSelection = document.getElementById("ingredient_selection");
    console.log(selectedIngredients)

    for (var i = 0; i < ingridientsDisplayed.length; i++) {
        const ingredientToRemove = ingridientsDisplayed[i];

        if (ingredientToRemove.parentNode === ingredientSelection) {
            ingredientSelection.removeChild(ingredientToRemove);
        }
    }
    ingridientsDisplayed = [];
    ingridientDisplayedIDS = [];

}

function hideNoResults() {
    const contain = document.getElementById("no_results");
    contain.classList.add("secret");
}

//Error messaging for no Ingredients
function displayNoResults(message = "") {
    const contain = document.getElementById("no_results");
    contain.classList.remove("secret");

    const message_header = document.querySelector("h2");
    message_header.innerHTML = message;
}

//Fills up the ingredients cards with an image and text
function fillIngredientCard(ingredient) {
    

    const template = document.getElementById("ingredientCardTemplate");
    const ingredientSelection = document.getElementById("ingredient_selection");
    const templateContent = template.content.cloneNode(true);

    const overallCard = templateContent.querySelector(".selector");
    overallCard.id = ingredient.id
    ingridientsDisplayed.push(overallCard);
    ingridientDisplayedIDS.push(ingredient.id);

    const image = templateContent.querySelector("img");
    image.src = 'https://spoonacular.com/cdn/ingredients_500x500/' + ingredient.image;
    console.log(ingredient)
    image.alt = ingredient.name;

    const title = templateContent.querySelector(".card-title");
    title.textContent = ingredient.name;


    for(var i = 0; i<selectedIngredients.length; i++){
        if(ingredient.id == selectedIngredients[i].id){
            overallCard.classList.add('active');
        }
     }

    ingredientSelection.appendChild(templateContent);
    

    //Makes it so when each card is clicked it becomes a selected ingredient
    overallCard.addEventListener('click', () => { addToSelectedIngredients(ingredient); });

    
}

//Handles the search querying and gets ingridients when the user hits enter.
const searchQueryInput = document.getElementById("searchQuery");
searchQueryInput.addEventListener('keypress', function (e) {
   
    if (e.key === 'Enter') {
        e.preventDefault(); 
        searchIngredients(); 
    }
});
