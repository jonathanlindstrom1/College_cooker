//Pulls the apikey that was inputted 
function retrieveFromLocalStorage() {
    const key = localStorage.getItem('api');
    const apiKey = JSON.parse(key);
   
    return apiKey;
    
}


class Spoonacular {
    constructor() {
        //sets APIkey equal to whatever was stored in local storage
        this.API = retrieveFromLocalStorage()
    }

    //API call for 18 random recipes
    async random_recipes(number = 18) {
        const url = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/random?&number=${number}`;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': this.API,
                'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
            }
        };
    
        try {
            const response = await fetch(url, options);
            const result = await response.json();
            const recipesArray = result.recipes;
            console.log(recipesArray)
            return recipesArray;
        } catch (error) {
            console.error(error);
            return [];
        }
    }
    
    //API call for searching recipes by keywords, didn't end up using this one in final implementation
    async recipes_query(query = "pasta", number = "8") {
        const url = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch?addRecipeInformation=true&query=${query}&number=${number}`;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': this.API,
                'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            const recipesArray = result.results;
            console.log(recipesArray);
            return recipesArray
        } catch (error) {
            console.error(error);
        }
    }

    //API call for searching recipes by a list of ingredients
    async include_ingridients(ingridients = []){
        var include = ""
        for(var i = 0; i< ingridients.length-1; i++){
            include += ingridients[i] + "%2C" 
        }
        include += ingridients[ingridients.length-1]
        const url = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/complexSearch?addRecipeInformation=true&fillIngredients=true&includeIngredients=${include}&number=18`;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': this.API,
                'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            const recipesArray = result.results;
            console.log(recipesArray);
            return recipesArray
        } catch (error) {
            console.error(error);
        }
    }

    //API call for getting all the info for a recipe based on its ID, used for the details page
    async get_recipe_by_id(id){
        const url = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/recipes/${id}/information`;
        // console.log(url)
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': this.API,
                'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            // console.log(result);
            return result
        } catch (error) {
            console.error(error);
        }
    }

    //API call for searching for ingredients by keywords. Returns 20 results
    async search_ingredients(query = "pepper"){
        const url = `https://spoonacular-recipe-food-nutrition-v1.p.rapidapi.com/food/ingredients/search?query=${query}&number=20`;
        const options = {
            method: 'GET',
            headers: {
                'X-RapidAPI-Key': this.API,
                'X-RapidAPI-Host': 'spoonacular-recipe-food-nutrition-v1.p.rapidapi.com'
            }
        };

        try {
            const response = await fetch(url, options);
            const result = await response.json();
            console.log(result);
            const ingridientsArray = result.results;
            console.log(ingridientsArray);
            return ingridientsArray
        } catch (error) {
            console.error(error);
        }
    }
};

//exports it so other JS files can access it
export default Spoonacular;

