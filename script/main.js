
import Spoonacular from './spoonacular.js'

const spoonacularInstance = new Spoonacular(); //Instance of spoonacular API
const ingredientsSearch = []; //List of Ingredients that have been selected
var favorites = new Set(); //A set of all the favorited recipes

//--------------Storage--------------------//

//Gets Ingredients and favorites from local storage
//Ensures it only sets these if the lists exist in local storage
function retrieveFromLocalStorage() {
  //Get Ingredients
  const ingredients = localStorage.getItem('ingredients');
  const ingredientsArray = JSON.parse(ingredients);
  if(ingredientsArray != null){
    for(var i = 0; i<ingredientsArray.length; i++){
      ingredientsSearch.push(ingredientsArray[i].name);
    }
  }
  //Get favorites
  const favoritesRecipes = localStorage.getItem('favorites');
  const favoritesArray = JSON.parse(favoritesRecipes);
  if(favoritesArray != null){
    favorites = new Set(favoritesArray);
  }
}

//Saves value of favorites to local storage when called
function saveToLocalStorage() {
  const favoritesSet = JSON.stringify(Array.from(favorites));
  localStorage.setItem('favorites', favoritesSet);
  console.log("Items in local Storage: ")
  console.log(favorites);
}

//Sets the values before everything below
retrieveFromLocalStorage();


//--------------------MAIN PAGE FUNCTIONS---------------------//

//Async function to make the api call and decided what to be displaying right now
async function fillSelectedIngredients() {
    try {
      const recipe = await spoonacularInstance.include_ingridients(ingredientsSearch);

        //Edge case of no Ingredients searched
        if(ingredientsSearch.length == 0){
          displayNoResults("No ingredients selected");
        }
        else{
           //API returns a list of recipes
          for (var i = 0; i < recipe.length; i++) {
            fillRecipeCard(recipe[i], true);
          }
          //Edge case of the list the API returning being empty
          if(recipe.length == 0){
            displayNoResults("Looks like there are no recipes with those ingredients");
          }
          //Hiding error messaging and buttons if the List is not empty.
          else{
            hideNoResults();
          }
        }
      }
    //Error handeling if the API key is wrong, the API is down, etc
    catch (error) {
      console.error('Error fetching random recipes:', error);
    }
  }

  
//Function that takes the card template and fills it with a given recipes info
async function fillRecipeCard(recipe, percents) {
  getPercentMatch(recipe)
    //duplicate the template
    const template = document.getElementById("recipeCardTemplate");
    const recipe_selection = document.getElementById("recipes_selection");
    const templateContent = template.content.cloneNode(true);

    //Set the link to a detail page of that recipes_id
    const link = templateContent.querySelector("a");
    link.href = "/RecipeDetail.html?recipe=" + recipe.id;

    //Set the image/alt text of the card to the recipe image
    const image = templateContent.querySelector("img");
    image.src = recipe.image;
    image.alt = recipe.title;

    //Set the title of the card
    const title = templateContent.querySelector(".card-title");
    title.textContent = recipe.title;

    //Adding favorite icons. If the card is in favorites than it will set the heart to clicked
    const favorite = templateContent.querySelector(".heart");
    favorite.id = recipe.id;
    favorite.addEventListener('click', () => { toggleHeart(recipe); })
    favorites.forEach((value) => {
      if (value.id === recipe.id) {
        favorite.innerHTML = '<i class="fas fa-heart icon"></i>';
        favorite.classList.add('clicked')
      }
    });
   
    //Fills the % of ingreidents that match for a given card
    const percentMatch = templateContent.querySelector(".percentMatch");
    if(percents){
      percentMatch.textContent = getPercentMatch(recipe) + "%";
    }
    //Sets it to 0% when calling random recipes
    else{
      percentMatch.textContent =  "0%";
    }

    //Attaches card to DOM
    recipe_selection.appendChild(templateContent);   
}

//async function to allow to make an API call for random recipes
async function setRandomRecipes(){
  hideNoResults()
  try {
    const recipe = await spoonacularInstance.random_recipes();
    for(var i = 0; i<recipe.length; i++){
      fillRecipeCard(recipe[i], false)
    }
  }
  
  catch (error) {
    console.error('Error fetching random recipes:', error);
  }
}

//----------HELPER FUNCTIONS-----------//

//Will return the % of ingreidents that match for a given recipe
function getPercentMatch(recipe){
  var recipeIngredients = recipe.extendedIngredients;
  return (Math.round((ingredientsSearch.length / recipeIngredients.length) * 100)) 
}

//Used to handle favoriting recipes and ensuring no duplicates
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
  //after every click resaves favorites
  saveToLocalStorage()
}

//Simple boolean function to tell if a recipe is already in favorites. Checks with ids to avoid different instances of objects
//with the same IDs being added.
function inFavorites(recipe) {
  return Array.from(favorites).some((value) => value.id === recipe.id);
}

//Used to display a feedback message and give the user options
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

//Used to hide the error message and options
function hideNoResults() {
  const contain = document.getElementById("no_results");
  contain.classList.add("secret");
  const buttons = document.querySelectorAll('.button');


  buttons.forEach(button => {
    button.classList.add('secret');
  });
}

//Sets an event listner to the random recipes button
const random = document.querySelector("#random_recipes");
console.log(random)
random.addEventListener('click', () => { setRandomRecipes(); })
 
//Calls the main function to make the API call and fill ingreidents
fillSelectedIngredients()


