import { 
    loadMainLayout,
    getUsername,
    loadUserRecipes,
    createRecipeBox,
} from "./utils.js";


$(document).ready(() => {

    async function f() {
        // Get current username
        const USERNAME = await getUsername();

        // Load recipe carousel
        await loadUserRecipeCarousel(USERNAME);

        // Load main layout
        loadMainLayout($('#mainLayout'));
    }

    f();

});


// Load user's saved recipes
async function loadUserRecipeCarousel(currentUsername) {
    try {
        const recipes = await loadUserRecipes(currentUsername, true);
        if (recipes.length === 0) {
            $('#savedRecipesCarousel')
                .attr('class', 'saved-recipes-carousel-none')
                .html('No saved recipes.');
            return;
        }
        $('#savedRecipesCarousel')
            .attr('class', 'saved-recipes-carousel')
            .html('');
        recipes.forEach(recipe => {
            const recipeBox = createRecipeBox(recipe, currentUsername, false, true);
            $('#savedRecipesCarousel').append(recipeBox);
        });
    } catch (error) {
        console.error(error);
    }
}