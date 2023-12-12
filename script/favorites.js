
import Spoonacular from './spoonacular.js'

const ingredientsSearch = []; //Ingredients List
var favorites = new Set(); //Favorites set

//Gets ingredients list and set from local storage. Same as in the main.js 
function retrieveFromLocalStorage() {
  const ingredients = localStorage.getItem('ingredients');
  const ingredientsArray = JSON.parse(ingredients);
  if(ingredientsArray != null){
    for(var i = 0; i<ingredientsArray.length; i++){
      ingredientsSearch.push(ingredientsArray[i].name);
    }
  }

  const favoritesRecipes = localStorage.getItem('favorites');
  const favoritesArray = JSON.parse(favoritesRecipes);
  if(favoritesArray != null){
    favorites = new Set(favoritesArray);
  }
}

//Save to local storage, also the same as in main.js
function saveToLocalStorage() {
  const favoritesSet = JSON.stringify(Array.from(favorites));
  localStorage.setItem('favorites', favoritesSet);
  console.log("Items in local Storage: ")
  console.log(favorites);
}


retrieveFromLocalStorage();

//Main function that fills in ingredients card for everything that is in favorites
async function fillSelectedIngredients() {
    try {
        //Error handeling that will display a message and option if there are no favorites
        if(favorites.size == 0){
          displayNoResults("No Favorites Selected");
        }
        else{
          favorites.forEach((value) => {
            fillRecipeCard(value);
            hideNoResults();
          });
        }
      }
    
    catch (error) {
      console.error('Error fetching random recipes:', error);
    }
  }

//Function to fill up recipe cards with each favorite
function fillRecipeCard(recipe, tabIndex) {
    const template = document.getElementById("recipeCardTemplate");
    const recipe_selection = document.getElementById("recipes_selection");
    const templateContent = template.content.cloneNode(true);
  
    const link = templateContent.querySelector("a");
    link.href = "/RecipeDetail.html?recipe=" + recipe.id;
    link.tabIndex = tabIndex;


    const image = templateContent.querySelector("img");
    image.src = recipe.image;
    image.alt = recipe.title;

    const title = templateContent.querySelector(".card-title");
    title.textContent = recipe.title;

    const favorite = templateContent.querySelector(".heart");
    favorite.id = recipe.id;
    // console.log(favorite)
    favorite.addEventListener('click', () => { toggleHeart(recipe); })
    favorite.innerHTML = '<i class="fas fa-heart icon"></i>';
    favorite.classList.add('clicked')
   
    
    
    recipe_selection.appendChild(templateContent);

    
}



function toggleHeart(recipe) {
  console.log("here")
  const heart = document.getElementById(recipe.id)
  heart.classList.toggle('clicked');
  if(heart.classList.contains('clicked')){
    heart.innerHTML = '<i class="fas fa-heart icon"></i>';
    favorites.add(recipe)
  }
  else{
    heart.innerHTML = '<i class="far fa-heart icon"></i>';
    favorites.delete(recipe)
  }
  location.reload();
  saveToLocalStorage()
}

function displayNoResults(message = "") {
  const contain = document.getElementById("no_results");
  contain.classList.remove("secret")
  
  const message_header = document.querySelector("h2");
  message_header.innerHTML = message;

  const buttons = document.querySelectorAll('.button');


  buttons.forEach(button => {
    button.classList.remove('secret');
  });

  
}

function hideNoResults() {
  const contain = document.getElementById("no_results");
  contain.classList.add("secret");
  const buttons = document.querySelectorAll('.button');


  buttons.forEach(button => {
    button.classList.add('secret');
  });
}


 

fillSelectedIngredients()


