
import Spoonacular from './spoonacular.js'

const spoonacularInstance = new Spoonacular();
const ingredientsSearch = [];
var favorites = new Set();
// var recipesPresent = false;

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
  favorites = new Set(favoritesArray);

  
}

function saveToLocalStorage() {
  const favoritesSet = JSON.stringify(Array.from(favorites));
  localStorage.setItem('favorites', favoritesSet);
  console.log("Items in local Storage: ")
  console.log(favorites);
  //console.log(localStorage.getItem('favorites'));
 
}


retrieveFromLocalStorage();

async function fillSelectedIngredients() {
    try {
      // const recipe = await spoonacularInstance.include_ingridients(ingredientsSearch);
  
        if(favorites.size == 0){
          displayNoResults("No Favorites Selected");
        }
        else{
          let tabIndex = 1;
          favorites.forEach((value) => {
            fillRecipeCard(value);
            //fillFavorites(recipe[i])
            //tabIndex += 1; 
          });
          if(favorites.size == 0){
            displayNoResults("Looks like there are no recipes with those ingredients");
          }
          else{
            hideNoResults();
          }
        }
      }
    
    catch (error) {
      console.error('Error fetching random recipes:', error);
    }
  }

  
  
  
  

async function fillRecipeCard(recipe, tabIndex) {
  getPercentMatch(recipe)
    const template = document.getElementById("recipeCardTemplate");
    const recipe_selection = document.getElementById("recipes_selection");
    const templateContent = template.content.cloneNode(true);
    //templateContent.id = recipe.id

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
   
    

    const percentMatch = templateContent.querySelector(".percentMatch");
    percentMatch.textContent = getPercentMatch(recipe) + "%";
    
    recipe_selection.appendChild(templateContent);

    
}

// function fillFavorites(recipe){
  
//   favorites.forEach((value) => {
//     if (value.id === recipe.id) {
//       console.log("MATCH");
//       toggleHeart(recipe);
//     }
//   });
// }

function getPercentMatch(recipe){
  var recipeIngredients = recipe.extendedIngredients;
  return (Math.round((ingredientsSearch.length / recipeIngredients.length) * 100)) 
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
  //console.log(favorites)
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


