import { 
    getCuisines, 
    getCuisineQuery, 
    loadRecipes, 
    getUsername,
    createRecipeBox,
} from "./utils.js";


$(document).ready(() => {

    async function f() {
        // Get username
        const USERNAME = await getUsername();

        // Configure layout
        configureLayout();
        $(window).on('resize', configureLayout);

        // Add event listener for searchbar
        $('#recipeSearchBar').on('input', () => loadRecipeCarousel(USERNAME));

        // Load cuisine filters
        await loadCuisineFilters(USERNAME);
        
        // Load recipes into carousel
        await loadRecipeCarousel(USERNAME);
        
        $('#pageHeader').removeClass('opacity-0');
        $('#mainLayout').removeClass('opacity-0');
    }

    f();

});


// Configure layout
function configureLayout() {
    if ($(window).innerWidth() < 1100) {
        $('#mainLayout').append($('#searchbar')).append($('#recipeCarousel'));
        $('#innerLayout').addClass('hidden');
    } else {
        $('#innerLayout').append($('#searchbar')).append($('#recipeCarousel')).removeClass('hidden');
    }
}


// Load cuisine filters
async function loadCuisineFilters(currentUsername) {
    // Hide cuisine filters container
    $('#cuisineFilters').html('');

    // Fetch all existing cuisines
    try {
        const cuisines = await getCuisines();
        cuisines.forEach(cuisine => {

            // Create cuisine filter button
            const cuisineButton = $('<button>')
                .attr(
                        'class', 
                        getCuisineQuery().includes(cuisine) ?
                            'cuisine-filter-button-selected'
                            : 'cuisine-filter-button-unselected'
                )
                .attr('id', `filter${cuisine}`)
                .html(cuisine)
                .click(function() {
                    // Get all queries and set up new query
                    const currentQuery = getCuisineQuery();
                    let newQuery = '/explore?';

                    // If cuisine is already in query then remove it from query
                    if (currentQuery.includes(cuisine)) {
                        currentQuery.map(query => {
                            if (query !== cuisine) {
                                newQuery += `cuisine=${query}&`;
                            }
                        });
                        newQuery = newQuery.slice(0, -1);
                    } 
                    
                    // Otherwise add it to query
                    else {
                        if (currentQuery.length === 0) {
                            newQuery += `cuisine=${cuisine}`;
                        } else {
                            currentQuery.map(query => newQuery += `cuisine=${query}&`);
                            newQuery += `cuisine=${cuisine}`;
                        }
                    }

                    // Update cuisine query in path
                    history.pushState(null, '', newQuery);

                    // Reload recipes into carousel
                    loadRecipeCarousel(currentUsername);

                    // Toggle highlight selected button while rendering the rest unhighlighted
                    $(this).toggleClass('cuisine-filter-button-selected cuisine-filter-button-unselected');
                });

            // Append to cuisine filters container
            $('#cuisineFilters').append(cuisineButton);

        });
    } catch (error) {
        console.error(error);
    }
}


// Load recipes into recipe carousel
async function loadRecipeCarousel(currentUsername) {
    const query = $('#recipeSearchBar').val().trim();

    try {
        const recipes = await loadRecipes(getCuisineQuery(), query);
        if (recipes.length === 0) {
            $('#recipeCarousel')
                .attr('class', 'order-3 text-2xl font-[500] w-full h-full flex justify-center items-center smooth duration-500')
                .html('No results.');
            return;
        }

        $('#recipeCarousel')
            .attr('class', 'recipe-carousel')
            .html('');
        recipes.forEach(recipe => {
            // Create recipe box
            const recipeBox = createRecipeBox(recipe, currentUsername);

            // Append container to carousel
            $('#recipeCarousel').append(recipeBox);

        });
    } catch (error) {
        console.error(error);
    }
}