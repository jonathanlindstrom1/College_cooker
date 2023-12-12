
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
      const recipe = await spoonacularInstance.include_ingridients(ingredientsSearch);
  
        if(ingredientsSearch.length == 0){
          displayNoResults("No ingredients selected");
        }
        else{
          
          for (var i = 0; i < recipe.length; i++) {
            fillRecipeCard(recipe[i]);
            //fillFavorites(recipe[i])
            
          }
          if(recipe.length == 0){
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

  
  
  
  

async function fillRecipeCard(recipe) {
  getPercentMatch(recipe)
    const template = document.getElementById("recipeCardTemplate");
    const recipe_selection = document.getElementById("recipes_selection");
    const templateContent = template.content.cloneNode(true);
    //templateContent.id = recipe.id

    const link = templateContent.querySelector("a");
    link.href = "/RecipeDetail.html?recipe=" + recipe.id;
    // link.tabIndex = tabIndex;


    const image = templateContent.querySelector("img");
    image.src = recipe.image;
    image.alt = recipe.title;

    const title = templateContent.querySelector(".card-title");
    title.textContent = recipe.title;

    const favorite = templateContent.querySelector(".heart");
    favorite.id = recipe.id;
    // console.log(favorite)
    favorite.addEventListener('click', () => { toggleHeart(recipe); })
    favorites.forEach((value) => {
      if (value.id === recipe.id) {
        console.log("MATCH");
        favorite.innerHTML = '<i class="fas fa-heart icon"></i>';
        favorite.classList.add('clicked')
      }
    });
    // console.log(favorites)
   
    

    const percentMatch = templateContent.querySelector(".percentMatch");
    percentMatch.textContent = getPercentMatch(recipe) + "%";
    
    recipe_selection.appendChild(templateContent);

    
}

function fillFavorites(recipe){
  
 
}

function getPercentMatch(recipe){
  var recipeIngredients = recipe.extendedIngredients;
  return (Math.round((ingredientsSearch.length / recipeIngredients.length) * 100)) 
}

function toggleHeart(recipe) {
  const heart = document.getElementById(recipe.id)
  console.log(inFavorites(recipe))
  if(inFavorites(recipe)){
    heart.innerHTML = '<i class="far fa-heart icon"></i>';
    heart.style.color = "black";
    heart.classList.remove("clicked")
    favorites.delete(Array.from(favorites).find(fav => fav.id === recipe.id));
    console.log(favorites)
  }
  else{
    console.log("Exists")
    heart.classList.toggle('clicked')
    if(heart.classList.contains('clicked')){
      heart.innerHTML = '<i class="fas fa-heart icon"></i>';
      if(!inFavorites(recipe)){
        console.log('New_recipe')
        console.log(inFavorites(recipe))
        favorites.add(recipe)
      } 
    }
    else{
      heart.innerHTML = '<i class="far fa-heart icon"></i>';
      favorites.delete(recipe)
    }
  }
  saveToLocalStorage()

}

function inFavorites(recipe) {
  return Array.from(favorites).some((value) => value.id === recipe.id);
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

async function setRandomRecipes(){
  hideNoResults()
  try {
    const recipe = await spoonacularInstance.random_recipes();
    for(var i = 0; i<recipe.length; i++){
      fillRecipeCard(recipe[i])
    }
  }
  
  catch (error) {
    console.error('Error fetching random recipes:', error);
  }
}

const random = document.querySelector("#random_recipes");
console.log(random)
random.addEventListener('click', () => { setRandomRecipes(); })
 

fillSelectedIngredients()


