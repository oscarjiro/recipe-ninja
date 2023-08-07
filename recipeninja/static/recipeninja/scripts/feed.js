import { 
    loadMainLayout,
    getUsername,
    loadUserFeed,
    toggleSaveRecipe,
    toggleLikeRecipe,
    timeAgo,
} from "./utils.js";


$(document).ready(() => {

    async function f() {
        // Get current username
        const USERNAME = await getUsername();

        if (!USERNAME) {
            window.location.href = '/accounts/login/?next=/feed';
        }

        // Load feed
        await loadFeed(USERNAME);

        // Load main layout
        loadMainLayout($('#mainLayout'));
    }

    f();

});


// Load feed
async function loadFeed(currentUsername) {
    try {
        const recipes = await loadUserFeed();
        if (recipes.length === 0) {
            $('#feedRecipesCarousel')
                .attr('class', 'feed-recipes-carousel-none')
                .html(`
                    <div>
                        No recipes in your timeline.
                    </div>
                    <a href="/explore" class="tracking-widest uppercase link">
                        Back to explore
                    </a>
                `);
            return;
        }
        $('#feedRecipesCarousel')
            .attr('class', 'feed-recipes-carousel')
            .html('');
        recipes.forEach(recipe => {
            $('#feedRecipesCarousel').append(createRecipeFeedBox(recipe, currentUsername));
        });
    } catch (error) {
        console.error(error);
    }
}


// Create recipe feed box
function createRecipeFeedBox(recipe, currentUsername) {
    // Destructure recipe
    const { id, name, poster, image, description, difficulty, duration, likers, savers, timestamp } = recipe;

    // Create profile picture element
    let profilePicture;
    if (poster.profile_picture) {
        profilePicture = $('<img>')
            .attr('src', poster.profile_picture)
            .attr('alt', `${poster.username} Profile Picture`)
            .attr('class', 'object-cover w-full h-full');
    } else {
        profilePicture = $('<div>')
            .html(`<span class="feed-profile-initial">${poster.username[0]}</span>`);
    }
    const profilePictureContainer = $('<div>')
        .attr('class', 'feed-profile-picture-container')
        .html(profilePicture);

    // Create username element
    const usernameElement = $('<a>')
        .attr('href', `/profile/${poster.username}`)
        .attr('class', 'feed-username')
        .html(poster.username);

    // Append profile picture and username to poster element
    const posterElement = $('<div>')
        .attr('class', 'feed-poster-container')
        .html(profilePictureContainer)
        .append(usernameElement);

    // Create image element
    let imageElement;
    if (image) {
        imageElement = $('<img>')
            .attr('loading', 'lazy')
            .attr('src', image);
    } else {
        imageElement = $('<div>')
            .html('No image provided.');
    }
    imageElement.attr('class', 'recipe-image');

    // Append tags element
    const tagsElement = $('<div>')
        .attr('class', 'feed-tags-container smooth opacity-0 group-hover:opacity-100')
        .html(`
            <div class="feed-tag-item">
                <span class="feed-tag-text">${duration}</span>
            </div>
        `)
        .append(`
            <div class="feed-tag-item">
                <span class="feed-tag-text">${difficulty}</span>
            </div>
        `)
        .append(`
            <div class="feed-tag-item">
                <span class="feed-tag-text">Click to view more</span>
            </div>
        `);

    // Append image and tags to image container
    const imageContainer = $('<div>')
        .attr('class', 'feed-image-container')
        .html(imageElement)
        .append(tagsElement);

    // Create description element
    const nameElement = $('<div>')
        .attr('class', 'feed-name')
        .html(name);

    // Create description element
    const descriptionElement = $('<div>')
        .attr('class', 'feed-description')
        .html(description);

    // Create timestamp element
    const timestampElement = $('<div>')
        .attr('class', 'feed-timestamp')
        .html(timeAgo(timestamp));

    // Check if current user has liked and saved the recipe
    const likedByUser = likers.some(liker => liker.username === currentUsername);
    const savedByUser = savers.some(saver => saver.username === currentUsername);
    
    // Create likes element
    const likeButton = $(likedByUser ? (`
        <div id="toggleLikeRecipe${id}Button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--red)" class="feed-icon-button">
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
        </div>
    `) : (`
        <div id="toggleLikeRecipe${id}Button">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="feed-icon-button">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>  
        </div>                
    `))
    .click(async event => {
        event.preventDefault();

        if (currentUsername === null || currentUsername === undefined) {
            window.location.href = window.location.href = `/accounts/login/?next=${window.location.pathname}`;
        }

        try {
            // Make toggle like request
            const { newLikesCount, isLiked } = await toggleLikeRecipe(id);

            // Change button state
            $(`#toggleLikeRecipe${id}Button`).html(isLiked ? (`
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--red)" class="feed-icon-button">
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                </svg>
            `) : (`
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="feed-icon-button">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg> 
            `));

            // Update likes count 
            $(`#recipe${id}LikesCount`).text(newLikesCount);
        } catch (error) {
            console.error(error);
        }
    });
    const likesCount = $('<div>')
        .attr('id', `recipe${id}LikesCount`)
        .html(likers.length);
    const likesElement = $('<div>')
        .attr('class', 'feed-icon-item')
        .html(likeButton)
        .append(likesCount);

    // Create saves element
    const saveButton = $(savedByUser ? (`
        <div id="toggleSaveRecipe${id}Button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="feed-icon-button">
                <path fill-rule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clip-rule="evenodd" />
            </svg>
        </div>
    `) : (`
        <div id="toggleSaveRecipe${id}Button">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="feed-icon-button">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
            </svg>
        </div>
    `))
    .click(async event => {
        event.preventDefault();

        if (currentUsername === null || currentUsername === undefined) {
            window.location.href = window.location.href = `/accounts/login/?next=${window.location.pathname}`;
        }

        try {
            // Make toggle like request
            const { newSavesCount, isSaved } = await toggleSaveRecipe(id);
            
            // Update likes count 
            $(`#recipe${id}SavesCount`).text(newSavesCount);

            // Change button state
            $(`#toggleSaveRecipe${id}Button`).html(isSaved ? (`
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="feed-icon-button">
                    <path fill-rule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clip-rule="evenodd" />
                </svg>
            `) : (`
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="feed-icon-button">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                </svg>
            `));
        } catch (error) {
            console.error(error);
        }
    });
    const savesCount = $('<div>')
        .html(savers.length)
        .attr('id', `recipe${id}SavesCount`);
    const savesElement = $('<div>')
        .attr('class', 'feed-icon-item')
        .html(saveButton)
        .append(savesCount);

    // Append likes and saves to icons container
    const iconsContainer = $('<div>')
        .attr('class', 'feed-icons-container')
        .html(likesElement)
        .append(savesElement);

    // Append timestamp and icons to footer
    const footerElement = $('<div>')
        .attr('class', 'feed-footer-container')
        .html(timestampElement)
        .append(iconsContainer);

    // Build and return recipe box
    const recipeBox = $('<a>')
        .attr('href', `/recipe/${id}`)
        .attr('class', 'feed-recipe-container group')
        .html(posterElement)
        .append(imageContainer)
        .append(nameElement)
        .append(descriptionElement)
        .append(footerElement);
    return recipeBox;
}