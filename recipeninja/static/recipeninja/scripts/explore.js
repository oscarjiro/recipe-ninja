import { getCuisineQuery, loadRecipes } from "./utils.js";


$(document).ready(() => {

    // Configure layout
    configureLayout();
    $(window).on('resize', configureLayout);

    // Add event listener for searchbar
    $('#recipeSearchBar').on('input', loadRecipeCarousel);

    async function f() {
        // Load cuisine filters
        await loadCuisineFilters();
        
        // Load recipes into carousel
        await loadRecipeCarousel();
        
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
function loadCuisineFilters() {
    // Hide cuisine filters container
    $('#cuisineFilters')
        .html('');

    // Fetch all existing cuisines
    fetch('/get_cuisines')
        .then(response => response.json())
        .then(result => {

            // Handle error
            if (!result.hasOwnProperty('cuisines')) {
                console.error("Error fetching cuisines!", result);
                return;
            }

            // Print result            
            console.log("Fetching all cuisines...", result);

            // Map each cuisine as a button
            result.cuisines.map(cuisine => {

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
                        loadRecipeCarousel();

                        // Toggle highlight selected button while rendering the rest unhighlighted
                        $(this).toggleClass('cuisine-filter-button-selected cuisine-filter-button-unselected');
                    });

                // Append to cuisine filters container
                $('#cuisineFilters').append(cuisineButton);

            });
        
        })  
        .catch(error => console.error(error));      
}


// Load recipes into recipe carousel
function loadRecipeCarousel() {

    let query = $('#recipeSearchBar').val().trim();
    console.log("QUERY", query);

    loadRecipes(getCuisineQuery(), query)
        .then(recipes => {

            if (recipes.length === 0) {
                $('#recipeCarousel')
                    .attr('class', 'order-3 text-2xl font-[500] w-full h-full flex justify-center items-center smooth duration-500')
                    .html('No results.');
                return;
            }

            $('#recipeCarousel')
                .attr('class', 'recipe-carousel')
                .html('');
            recipes.map(({ id, name, poster, image, description, ingredients, comments, likers, savers, timestamp }) => {

                // Create image element
                let imageElement;
                if (image) {
                    imageElement = $('<img>')
                        .attr('src', image);
                } else {
                    imageElement = $('<div>')
                        .html('No image provided.');
                }
                imageElement.attr('class', 'recipe-container-image');

                // Create footer element   
                const nameElement = $('<div>')
                    .attr('class', 'font-[500] text-2xl truncate left-[20px] bottom-[40px]')
                    .html(name);

                const posterElement = $('<div>')
                    .html(`by <a href="" class="link">${poster.username}</a>`);

                let descriptionElement;
                if (description) {
                    descriptionElement = $('<div>')
                        .attr('class', 'text-sm truncate')
                        .html(description);
                }

                const likeButtonElement = $(`
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="var(--red)" class="w-4 h-4 mt-[0.8px] ml-1 smooth hover:scale-125">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                    </svg>                  
                `)
                .click(function() {
                    $(this).html(`
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--red)" class="w-4 h-4 mt-[0.8px] ml-1 smooth hover:scale-125">
                            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                        </svg>
                    `);
                });

                const likesElement = $('<div>')
                    .attr('class', 'flex items-center font-[500]')
                    .html(likers.length)
                    .append(likeButtonElement);

                const iconsElement = $('<div>')
                    .attr('class', 'flex space-x-4')
                    .html(likesElement);

                const detailsElement = $('<div>')
                    .attr('class', 'flex items-center justify-between')
                    .html(posterElement)
                    .append(iconsElement);
                
                const footerElement = $('<div>')
                    .attr('class', 'flex flex-col')
                    .html(nameElement);

                if (descriptionElement) {
                    footerElement.append(descriptionElement);
                }

                footerElement.append(detailsElement);

                // Create container and append all elements
                const containerElement = $('<a>')
                    .attr('id', `recipe${id}`)
                    .attr('href', `recipe/${id}`)
                    .attr('class', 'recipe-container')
                    .html(imageElement)
                    .append(footerElement);

                // Append container to carousel
                $('#recipeCarousel').append(containerElement);

            });
        })
        .catch(error => console.error(error));

}