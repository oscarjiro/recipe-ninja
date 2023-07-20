// Debouncer
export function debounce(func, timeout=500) {
    let timer;
    return (...args) => {
    clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, timeout);
    }
}


// Get cuisine query 
export function getCuisineQuery() {
    const currentUrl = new URL(window.location.href);
    const searchParams = new URLSearchParams(currentUrl.search);
    return searchParams.getAll('cuisine');
}


// Load recipes
export function loadRecipes(cuisines, query) {

    const cuisineParam = cuisines ? (
                            cuisines.length > 0 ? 
                                cuisines.join(',') 
                                : 'all'
                         ) : 'all';

    return fetch(`load_recipes/${cuisineParam}${query ? ( query.trim() ? `/${query}` : '' ) : ''}`)
        .then(response => response.json())
        .then(result => {
            // Anticipate error
            if (result.hasOwnProperty('error')) {
                console.error("Error fetching recipes!", result.error);
                throw new Error(result.error);
            }

            // Print result and return it
            console.log("Fetching recipes...", result);
            return result.recipes;
        })
        .catch(error => {
            console.error(error);
            throw new Error(error);
        });

}