
import Spoonacular from './spoonacular.js';

console.log("here");
const spoonacularInstance = new Spoonacular();
const queryString = window.location.search;
const params = new URLSearchParams(queryString);
const id = params.get("recipe");


async function main() {
  try {

    const recipeId = id;
    const recipe = await spoonacularInstance.get_recipe_by_id(recipeId);

    updateDetailPage(recipe);
  } catch (error) {
    console.error('Error fetching recipe by ID:', error);
  }
}

function updateDetailPage(recipe) {
  const detailImage = document.querySelector('.detail_image img');
  detailImage.src = recipe.image;
  detailImage.alt = recipe.title;

  const titleElement = document.querySelector('.title h1');
  titleElement.textContent = recipe.title;

  const ingredientsElement = document.querySelector('.ingridients');
  ingredientsElement.innerHTML = '<h3>Ingredients:</h3>';
  recipe.extendedIngredients.forEach((ingredient) => {
    const ingredientItem = document.createElement('p');
    ingredientItem.textContent = ingredient.original;
    ingredientsElement.appendChild(ingredientItem);
  });

  const stepsElement = document.querySelector('.steps');
  stepsElement.innerHTML = '<h3>Steps:</h3>';
  recipe.analyzedInstructions[0].steps.forEach((step) => {
    const stepItem = document.createElement('p');
    stepItem.textContent = step.step;
    stepsElement.appendChild(stepItem);
  });
}

main();
