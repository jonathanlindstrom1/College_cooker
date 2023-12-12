// main.js
import Spoonacular from './spoonacular.js';

const spoonacularInstance = new Spoonacular();
var selectedIngredients = [];
var ingridientsDisplayed = [];
var ingridientDisplayedIDS = [];

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
  
  retrieveFromLocalStorage();

// Define an async function to use await
async function main(query) {
    try {
        clearIngredients();
        for (var i = 0; i < selectedIngredients.length; i++) {
                fillIngredientCard(selectedIngredients[i]); 
        }
        const ingredients = await spoonacularInstance.search_ingredients(query);
        if(ingredients.length == 0){
            displayNoResults() 
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

function searchIngredients() {
    const query = document.getElementById("searchQuery").value;


    console.log("Searching for:", query);
    main(query);

}


function addToSelectedIngredients(ingredient) {
    console.log("Hello");

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


function saveToLocalStorage() {
    const ingredientsArrayString = JSON.stringify(selectedIngredients);
    localStorage.setItem('ingredients', ingredientsArrayString);
    console.log("Items in local Storage: ")
    console.log(selectedIngredients)
   
  }


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

function displayNoResults() {
    const contain = document.getElementById("no_results");
    contain.classList.remove("secret");
}

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
    

    
    overallCard.addEventListener('click', () => { addToSelectedIngredients(ingredient); });

    
}

// const search = document.querySelector("#search");
// console.log(search);
// search.addEventListener('click', () => { searchIngredients(); });

const searchQueryInput = document.getElementById("searchQuery");
searchQueryInput.addEventListener('keypress', function (e) {
   
    if (e.key === 'Enter') {
        e.preventDefault(); 
        searchIngredients(); 
    }
});
