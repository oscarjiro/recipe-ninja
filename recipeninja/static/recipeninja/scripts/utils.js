// Debouncer
export function debounce(func, timeout = 500) {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => {
            func.apply(this, args);
        }, timeout);
    };
}

// Get cuisine query
export function getCuisineQuery() {
    const currentUrl = new URL(window.location.href);
    const searchParams = new URLSearchParams(currentUrl.search);
    return searchParams.getAll("cuisine");
}

// Get all cuisines
export function getCuisines() {
    return fetch("/get_cuisines")
        .then((response) => response.json())
        .then((result) => {
            // Handle error
            if (result.hasOwnProperty("error")) {
                console.error("Error fetching cuisines!", result.error);
                throw new Error(result.error);
            }

            // Print result and return it
            console.log("Fetching all cuisines...", result);
            return result.cuisines;
        })
        .catch((error) => {
            console.error("Get cuisines request failed!", error);
            throw new Error(error);
        });
}

// Get all difficulties
export function getDifficulties() {
    return fetch("/get_difficulties")
        .then((response) => response.json())
        .then((result) => {
            // Handle error
            if (result.hasOwnProperty("error")) {
                console.error("Error fetching difficulties!", result.error);
                throw new Error(result.error);
            }

            // Print result and return it
            console.log("Fetching all difficulties...", result);
            return result.difficulties;
        })
        .catch((error) => {
            console.error("Get difficulties request failed!", error);
            throw new Error(error);
        });
}

// Load recipes
export async function loadRecipes(cuisines, query) {
    const cuisineParam = cuisines
        ? cuisines.length > 0
            ? cuisines.join(",")
            : "all"
        : "all";

    try {
        const response = await fetch(
            `/load_recipes/${cuisineParam}${
                query ? (query.trim() ? `/${query}` : "") : ""
            }`
        );
        const result = await response.json();

        // Anticipate error
        if (result.hasOwnProperty("error")) {
            console.error("Error fetching recipes!", result.error);
            throw new Error(result.error);
        }

        // Print result and return it
        console.log("Fetching recipes...", result);
        return result.recipes;
    } catch (error) {
        console.error("Load recipes request failed!", error);
        throw new Error(error);
    }
}

// Load user recipes
export async function loadUserRecipes(username, getSaved = false) {
    try {
        const response = await fetch(
            `/load_user_recipes/${username}/${getSaved ? 1 : 0}`
        );
        const result = await response.json();

        // Anticipate error
        if (result.hasOwnProperty("error")) {
            console.error("Error fetching user recipe!", result.error);
            throw new Error(result.error);
        }

        // Print result and return it
        console.log("Fetching recipes...", result);
        return result.recipes;
    } catch (error) {
        console.error("Load user recipes request failed!", error);
        throw new Error(error);
    }
}

// Load user's feed
export async function loadUserFeed() {
    try {
        const response = await fetch("/load_user_feed");
        const result = await response.json();

        // Anticipate error
        if (result.hasOwnProperty("error")) {
            console.error("Error fetching user feed!", result.error);
            throw new Error(result.error);
        }

        // Print result and return it
        console.log("Fetching feed...", result);
        return result.recipes;
    } catch (error) {
        console.error("Load user feed request failed!", error);
        throw new Error(error);
    }
}

// Load comments of a recipe
export function loadComments(recipeId) {
    return fetch(`/load_comments/${recipeId}`)
        .then((response) => response.json())
        .then((result) => {
            // Anticipate error
            if (result.hasOwnProperty("error")) {
                console.error("Error fetching comments!", result.error);
                throw new Error(result.error);
            }

            // Print result and return it
            console.log("Fetching comments...", result);
            return result.comments;
        })
        .catch((error) => {
            console.error("Load comments request failed!", error);
            throw new Error(error);
        });
}

// Post a comment
export function postComment(recipeId, content) {
    return fetch(`/post_comment/${recipeId}`, {
        method: "POST",
        body: JSON.stringify({
            content: content.trim(),
        }),
    })
        .then((response) => response.json())
        .then((result) => {
            // Anticipate error
            if (result.hasOwnProperty("error")) {
                console.error("Error posting comment!", result.error);
                throw new Error(result.error);
            }

            // Print result and return it
            console.log("Posting comment...", result);
            return result;
        })
        .catch((error) => {
            console.error("Comment post request failed!", error);
            throw new Error(error);
        });
}

// Delete a recipe
export async function deleteRecipe(recipeId) {
    try {
        // Await response
        const response = await fetch(`/delete_recipe/${recipeId}`, {
            method: "DELETE",
        });
        const result = await response.json();

        // Anticipate error
        if (result.hasOwnProperty("error")) {
            console.error("Error deleting recipe!", result.error);
            throw new Error(result.error);
        }

        // Print result and return it
        console.log("Deleting recipe...", result);
        return result;
    } catch (error) {
        console.error("Recipe delete request failed!", error);
    }
}

// Delete a comment
export function deleteComment(commentId) {
    return fetch(`/delete_comment/${commentId}`, {
        method: "DELETE",
    })
        .then((response) => response.json())
        .then((result) => {
            // Anticipate error
            if (result.hasOwnProperty("error")) {
                console.error("Error deleting comment!", result.error);
                throw new Error(result.error);
            }

            // Print result and return it
            console.log("Deleting comment...", result);
            return result;
        })
        .catch((error) => {
            console.error("Comment delete request failed!", error);
            throw new Error(error);
        });
}

// Get current user
export function getUsername() {
    return fetch("/get_username")
        .then((response) => response.json())
        .then((result) => {
            // Anticipate error
            if (result.hasOwnProperty("error")) {
                console.error("Error fetching username!", result.error);
                throw new Error(result.error);
            }

            // Print result and return it
            console.log("Fetching username...", result);
            return result.username;
        })
        .catch((error) => {
            console.error("Get username request failed!", error);
            throw new Error(error);
        });
}

// Toggle like recipe
export async function toggleLikeRecipe(recipeId) {
    try {
        // Await response
        const response = await fetch(`/toggle_like_recipe/${recipeId}`, {
            method: "PUT",
        });
        const result = await response.json();

        // Anticipate error
        if (result.hasOwnProperty("error")) {
            console.error("Error toggle liking recipe!", result.error);
            throw new Error(result.error);
        }

        // Print result and return it
        console.log("Toggle liking recipe...", result);
        return result;
    } catch (error) {
        console.error("Recipe toggle like request failed!", error);
    }
}

// Toggle like comment
export async function toggleLikeComment(commentId) {
    try {
        // Await response
        const response = await fetch(`/toggle_like_comment/${commentId}`, {
            method: "PUT",
        });
        const result = await response.json();

        // Anticipate error
        if (result.hasOwnProperty("error")) {
            console.error("Error toggle liking comment!", result.error);
            throw new Error(result.error);
        }

        // Print result and return it
        console.log("Toggle liking comment...", result);
        return result;
    } catch (error) {
        console.error("Comment toggle like request failed!", error);
    }
}

// Toggle save recipe
export async function toggleSaveRecipe(recipeId) {
    try {
        // Await response
        const response = await fetch(`/toggle_save_recipe/${recipeId}`, {
            method: "PUT",
        });
        const result = await response.json();

        // Anticipate error
        if (result.hasOwnProperty("error")) {
            console.error("Error toggle saving recipe!", result.error);
            throw new Error(result.error);
        }

        // Print result and return it
        console.log("Toggle saving recipe...", result);
        return result;
    } catch (error) {
        console.error("Recipe toggle save request failed!", error);
    }
}

// Time ago converter
export function timeAgo(timestamp) {
    const currentDate = new Date();
    const date = new Date(timestamp);

    const secondsAgo = Math.floor((currentDate - date) / 1000);

    if (secondsAgo < 3) {
        return "Just now";
    }

    if (secondsAgo < 60) {
        return `${secondsAgo} second${secondsAgo === 1 ? "" : "s"} ago`;
    }

    const minutesAgo = Math.floor(secondsAgo / 60);
    if (minutesAgo < 60) {
        return `${minutesAgo} minute${minutesAgo === 1 ? "" : "s"} ago`;
    }

    const hoursAgo = Math.floor(minutesAgo / 60);
    if (hoursAgo < 24) {
        return `${hoursAgo} hour${hoursAgo === 1 ? "" : "s"} ago`;
    }

    const daysAgo = Math.floor(hoursAgo / 24);
    if (daysAgo < 30) {
        return `${daysAgo} day${daysAgo === 1 ? "" : "s"} ago`;
    }

    const monthsAgo = Math.floor(daysAgo / 30);
    if (monthsAgo < 12) {
        return `${monthsAgo} month${monthsAgo === 1 ? "" : "s"} ago`;
    }

    const yearsAgo = Math.floor(monthsAgo / 12);
    return `${yearsAgo} year${yearsAgo === 1 ? "" : "s"} ago`;
}

// Minutes formatter
export function formatMinutes(minutes) {
    if (minutes < 60) {
        return `${minutes} minute${minutes !== 1 ? "s" : ""}`;
    } else if (minutes < 1440) {
        const hours = Math.floor(minutes / 60);
        return `${hours} hour${hours !== 1 ? "s" : ""}`;
    } else if (minutes < 10080) {
        const days = Math.floor(minutes / 1440);
        return `${days} day${days !== 1 ? "s" : ""}`;
    } else if (minutes < 43829) {
        const weeks = Math.floor(minutes / 10080);
        return `${weeks} week${weeks !== 1 ? "s" : ""}`;
    } else {
        const years = Math.floor(minutes / 525948.7666);
        return `${years} year${years !== 1 ? "s" : ""}`;
    }
}

// Toggle follow user
export async function toggleFollow(username) {
    try {
        // Await response
        const response = await fetch(`/toggle_follow/${username}`, {
            method: "PUT",
        });
        const result = await response.json();

        // Anticipate error
        if (result.hasOwnProperty("error")) {
            console.error(`Error toggle following ${username}!`, result.error);
            throw new Error(result.error);
        }

        // Print result and return it
        console.log(`Toggle following ${username}...`, result);
        return result;
    } catch (error) {
        console.error(`Toggle follow ${username} request failed!`, error);
    }
}

// Load main layout
export function loadMainLayout(mainLayout) {
    setTimeout(() => {
        mainLayout.removeClass("opacity-0");
    });
}

// Create a recipe box element
export function createRecipeBox(
    recipe,
    currentUsername,
    addDelete = false,
    isSavedRecipes = false
) {
    // Destructure recipe
    const {
        id,
        name,
        poster,
        image,
        description,
        difficulty,
        duration,
        likers,
        savers,
    } = recipe;

    // Create image element
    let imageElement;
    if (image) {
        imageElement = $("<img>").attr("loading", "lazy").attr("src", image);
    } else {
        imageElement = $("<div>").html("No image provided.");
    }
    imageElement.attr("class", "recipe-image");

    // Create tags element
    const tagsElement = $("<div>")
        .attr("class", "recipe-tags-container")
        .html(
            `<div class="recipe-tag-item"><span class="recipe-tag-text">${duration}</span></div>`
        )
        .append(
            `<div class="recipe-tag-item"><span class="recipe-tag-text">${difficulty}</span></div>`
        );

    // Append image element and difficulty tag to image container
    const imageContainer = $("<div>")
        .attr("class", "recipe-container-image")
        .html(imageElement)
        .append(tagsElement);

    // Create footer element
    const nameElement = $("<div>")
        .attr("class", "recipe-name-container")
        .html(name);

    const posterUsername = $("<a>")
        .attr("href", `/profile/${poster.username}`)
        .attr("class", "recipe-poster-username")
        .html(`<div>${poster.username}</div>`);

    if (poster.is_staff) {
        posterUsername.append(`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="recipe-username-verified">
                <path fill-rule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd" />
            </svg>
        `);
    }

    const posterElement = $("<div>")
        .attr("class", "recipe-poster-container")
        .html("<div>by</div>")
        .append(posterUsername);

    let descriptionElement;
    if (description) {
        descriptionElement = $("<div>")
            .attr("class", "recipe-description-container")
            .html(description);
    }

    // Check if current user has liked and saved the recipe
    const likedByUser = likers.some(
        (liker) => liker.username === currentUsername
    );
    const savedByUser = savers.some(
        (saver) => saver.username === currentUsername
    );

    // Create like button
    const likeButtonElement = $(
        likedByUser
            ? `
        <div id="toggleLikeRecipe${id}Button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--red)" class="recipe-icon-button">
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
        </div>
    `
            : `
        <div id="toggleLikeRecipe${id}Button">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="recipe-icon-button">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>  
        </div>                
    `
    ).click(async (event) => {
        // Prevent being redirected
        event.preventDefault();

        if (currentUsername === null || currentUsername === undefined) {
            window.location.href =
                window.location.href = `/accounts/login/?next=${window.location.pathname}`;
        }

        try {
            // Make toggle like request
            const { newLikesCount, isLiked } = await toggleLikeRecipe(id);

            // Change button state
            $(`#toggleLikeRecipe${id}Button`).html(
                isLiked
                    ? `
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="var(--red)" class="recipe-icon-button">
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                </svg>
            `
                    : `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="recipe-icon-button">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg> 
            `
            );

            // Update likes count
            $(`#recipe${id}LikesCount`).text(newLikesCount);
        } catch (error) {
            console.error(error);
        }
    });
    const likesElement = $("<div>")
        .attr("class", "flex items-center font-[500]")
        .html(`<div id="recipe${id}LikesCount">${likers.length}</div>`)
        .append(likeButtonElement);

    // Create save element
    const saveButtonElement = $(
        savedByUser
            ? `
        <div id="toggleSaveRecipe${id}Button">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="recipe-icon-button">
                <path fill-rule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clip-rule="evenodd" />
            </svg>
        </div>
    `
            : `
        <div id="toggleSaveRecipe${id}Button">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="recipe-icon-button">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
            </svg>
        </div>
    `
    ).click(async (event) => {
        // Prevent being redirected
        event.preventDefault();

        if (currentUsername === null || currentUsername === undefined) {
            window.location.href =
                window.location.href = `/accounts/login/?next=${window.location.pathname}`;
        }

        try {
            // Make toggle like request
            const { newSavesCount, isSaved } = await toggleSaveRecipe(id);

            // Update likes count
            $(`#recipe${id}SavesCount`).text(newSavesCount);

            // Change button state
            if (!isSavedRecipes) {
                $(`#toggleSaveRecipe${id}Button`).html(
                    isSaved
                        ? `
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="recipe-icon-button">
                        <path fill-rule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clip-rule="evenodd" />
                    </svg>
                `
                        : `
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="recipe-icon-button">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                    </svg>
                `
                );
            }

            // If dealing with saved recipes, remove element
            if (isSavedRecipes) {
                $(`#recipe${id}`).remove();
                if (!$("#savedRecipesCarousel").html()) {
                    $("#savedRecipesCarousel")
                        .attr("class", "saved-recipes-carousel-none")
                        .html("No saved recipes.");
                }
            }
        } catch (error) {
            console.error(error);
        }
    });
    const savesElement = $("<div>")
        .attr("class", "flex items-center font-[500]")
        .html(`<div id="recipe${id}SavesCount">${savers.length}</div>`)
        .append(saveButtonElement);

    const trashButtonElement = $(`
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="var(--red)" class="recipe-icon-button">
            <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
        </svg>  
    `).click(async (event) => {
        event.preventDefault();
        try {
            await confirmDeleteCarouselRecipe(id, name);
        } catch (error) {
            console.error(error);
        }
    });

    const iconsElement = $("<div>")
        .attr("class", "flex space-x-4")
        .html(likesElement)
        .append(savesElement);

    const detailsElement = $("<div>").attr(
        "class",
        "flex items-center justify-between"
    );
    if (addDelete && currentUsername === poster.username) {
        detailsElement.html(iconsElement).append(trashButtonElement);
    } else {
        detailsElement.html(posterElement).append(iconsElement);
    }

    const footerElement = $("<div>")
        .attr("class", "flex flex-col text-base")
        .html(nameElement);

    if (descriptionElement) {
        footerElement.append(descriptionElement);
    }

    footerElement.append(detailsElement);

    // Create container and append all elements
    const recipeBox = $("<a>")
        .attr("id", `recipe${id}`)
        .attr("href", `/recipe/${id}`)
        .attr("class", "recipe-container group")
        .html(imageContainer)
        .append(footerElement);

    // Return recipe box
    return recipeBox;
}

// Close blackout and modal
export function exitModal(modal, blackout) {
    modal.addClass("opacity-0");
    blackout.addClass("opacity-0");
    setTimeout(() => {
        modal.remove();
        blackout.remove();
    }, 300);
}

// Confirm delete recipe from carousel
function confirmDeleteCarouselRecipe(recipeId, recipeName) {
    if ($("#blackout").length > 0) {
        return;
    }

    // Create modal
    const modal = $("<div>")
        .attr("id", "confirmModal")
        .attr("class", "modal opacity-0").html(`
            <div class="text-center">
                Are you sure you want to delete your <strong class="font-[900] text-[var(--red)]">${recipeName}</strong> recipe?
            </div>
            <div class="flex items-center space-x-4 px-2">
                <button id="cancelDeleteRecipeButton" class="button tracking-widest uppercase text-xl">No</button>
                <button id="confirmDeleteRecipeButton" class="button bg-[var(--red)] tracking-widest uppercase text-xl">Yes</button>
            </div>
        `);

    // Create blackout
    const blackout = $("<div>")
        .attr("id", "blackout")
        .attr("class", "blackout opacity-0")
        .click(() => exitModal($("#confirmModal"), $("#blackout")));

    // Blackout the whole view
    $("body").append(blackout).append(modal);
    setTimeout(() => {
        $("#confirmModal").removeClass("opacity-0");
        $("#blackout").removeClass("opacity-0");
    }, 300);

    // Close blackout and modal on cancellation
    $("#cancelDeleteRecipeButton").click(() =>
        exitModal($("#confirmModal"), $("#blackout"))
    );

    // Close blackout and delete comment on confirmation
    $("#confirmDeleteRecipeButton").click(async () => {
        try {
            await deleteRecipe(recipeId);

            // Remove recipe from carousel
            $(`#recipe${recipeId}`).remove();

            // Update recipe count
            let prevCount = parseInt($("#recipesCount").text());
            prevCount = prevCount > 0 ? prevCount : 1;
            $("#recipesCount").text(
                `${prevCount - 1} recipe${prevCount - 1 > 1 ? "s" : ""}`
            );

            // Close blackout
            exitModal($("#confirmModal"), $("#blackout"));
        } catch (error) {
            console.error(error);
        }
    });
}

// Get followers
export async function getFollowers(username) {
    try {
        const response = await fetch(`/get_followers/${username}`);
        const result = await response.json();

        // Anticipate error
        if (result.hasOwnProperty("error")) {
            console.error("Error fetching followers!", result.error);
            throw new Error(result.error);
        }

        // Print result and return it
        console.log("Fetching followers...", result);
        return result.followers;
    } catch (error) {
        console.error("Get followers request failed!", error);
        throw new Error(error);
    }
}

// Get following
export async function getFollowing(username) {
    try {
        const response = await fetch(`/get_following/${username}`);
        const result = await response.json();

        // Anticipate error
        if (result.hasOwnProperty("error")) {
            console.error("Error fetching following!", result.error);
            throw new Error(result.error);
        }

        // Print result and return it
        console.log("Fetching following...", result);
        return result.following;
    } catch (error) {
        console.error("Get following request failed!", error);
        throw new Error(error);
    }
}

// Ensure valid image type
export function validateImageType(input) {
    const submittedFile = input.get(0).files;
    if (!submittedFile) {
        return false;
    }
    return (
        submittedFile.length === 0 ||
        (submittedFile.length > 0 && submittedFile[0].type.startsWith("image/"))
    );
}
