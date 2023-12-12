import Spoonacular from './spoonacular.js';


const spoonacularInstance = new Spoonacular(); //Instance of API
const queryString = window.location.search; 
const params = new URLSearchParams(queryString);
const id = params.get("recipe");
//sets ID equal to the specific recipe that was clicked on


//main function, will make an API call to get all the info for a given recipe
async function main() {
  try {

    const recipeId = id;
    const recipe = await spoonacularInstance.get_recipe_by_id(recipeId);

    updateDetailPage(recipe);
  } catch (error) {
    console.error('Error fetching recipe by ID:', error);
  }
}

//will update all elements on the page based on the recipe info from the API call
function updateDetailPage(recipe) {
  //Sets the image and alt text
  const detailImage = document.querySelector('.detail_image img');
  detailImage.src = recipe.image;
  detailImage.alt = recipe.title;

  //Sets the title
  const titleElement = document.querySelector('.title h1');
  titleElement.textContent = recipe.title;

  //Sets the ingredients
  const ingredientsElement = document.querySelector('.ingridients');
  ingredientsElement.innerHTML = '<h3>Ingredients:</h3>';
  recipe.extendedIngredients.forEach((ingredient) => {
    const ingredientItem = document.createElement('p');
    ingredientItem.textContent = ingredient.original;
    ingredientsElement.appendChild(ingredientItem);
  });

  //Sets the steps 
  const stepsElement = document.querySelector('.steps');
  stepsElement.innerHTML = '<h3>Steps:</h3>';
  recipe.analyzedInstructions[0].steps.forEach((step) => {
    const stepItem = document.createElement('p');
    stepItem.textContent = step.step;
    stepsElement.appendChild(stepItem);
  });
}

//Calls main to fill the page
main();
