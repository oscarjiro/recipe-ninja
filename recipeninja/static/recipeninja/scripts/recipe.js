import { 
    loadMainLayout,
    loadComments, 
    postComment, 
    getUsername, 
    deleteComment, 
    deleteRecipe,
    toggleLikeRecipe,
    toggleLikeComment, 
    toggleSaveRecipe,
    timeAgo,
    exitModal,
} from "./utils.js";


$(document).ready(() => {

    async function f() {
        // Get current username
        const USERNAME = await getUsername();

        // Get recipe ID
        const RECIPE_ID = getRecipeId();

        // Get current recipe name
        const RECIPE_NAME = $('#name').text().trim();

        // Load comments
        await loadReviewsCarousel(RECIPE_ID, USERNAME);
    
        // Startup page 
        startupPage();

        // Add comment functionality
        $('#postReviewButton')
            .click(async () => await createAndPostComment(RECIPE_ID, USERNAME));

        // Add delete recipe functionality
        if ($('#deleteRecipeButton').length > 0 && USERNAME === $('#recipePosterUsername').text().trim()) {
            $('#deleteRecipeButton').click(() => confirmDeleteRecipe(RECIPE_ID, RECIPE_NAME, USERNAME));
        };

        // Add like and save recipe functionality
        if (USERNAME) {
            $('#likeRecipeSvg').click(async () => await likeRecipeAction(RECIPE_ID));
            $('#saveRecipeSvg').click(async () => await saveRecipeAction(RECIPE_ID));
        } else {
            $('#likeRecipeSvg').click(() => window.location.href = `/accounts/login/?next=${window.location.pathname}`);
            $('#saveRecipeSvg').click(() => window.location.href = `/accounts/login/?next=${window.location.pathname}`); 
        }

        // Add copy link functionality
        $('#copyLinkButton').click(() => {
            // Use the Clipboard API to copy the text to the clipboard
            navigator.clipboard.writeText($('#shareLink').text().trim())
            .then(() => {
                console.log("Link copied to clipboard!");
                if ($('#sharedMessage').length === 0) {
                    $('#shareBox').after(`
                        <div id="sharedMessage" class="text-[var(--blue)] font-[500]">
                            Link copied to clipboard!
                        </div>
                    `);
                }
            })
            .catch((error) => {
                console.error("Failed to copy link!", error);
            });
        });
    }

    f();
    
});


// Get recipe ID
function getRecipeId() {
    const currentPath = window.location.pathname;
    const id = currentPath.split('/').pop();
    return id;
}


// Load comments into carousel
async function loadReviewsCarousel(recipeId, currentUsername) {
    try {

        // Get all comments from request
        const comments = await loadComments(recipeId);
        
        // If no comments, load carousel with empty message
        if (comments.length === 0) {
            $('#reviewsCarousel').html(`
                <div class="right-review-none">
                    No comments yet.
                </div>
            `);
            return;
        }

        // Otherwise, append all comments to the carousel
        $('#reviewsCarousel').html(`
            <div id="reviewsCount" class="right-review-count">
                ${comments.length} review${comments.length > 1 ? 's' : ''}
            </div>
        `);

        comments.forEach(comment => {
            // Create new comment
            const newComment = createComment(comment, currentUsername);

            // Append new comment to reviews carousel
            $('#reviewsCarousel').append(newComment);
        })

    } catch (error) {
        console.error(error);
    }
}


// Resize name to prevent cut off
function resizeName() {
    $('#name').removeClass('h-[60px]').removeClass('h-[68px]');
    if ($(window).innerWidth() > 1100) {
        if ($('#name').innerHeight() < 120) {
            $('#name').addClass('h-[68px]');
        }
    } else if ($(window).innerWidth() >= 450) {
        if ($('#name').innerHeight() < 96) {
            $('#name').addClass('h-[60px]');
        }
    }
}


// Startup page
function startupPage() {
    // Name resizer
    resizeName();
    $(window).on('resize', resizeName);

    // Set up mini navbar
    $('#miniNavbar').children().each(function() {
        // Get section name from button id
        const section = $(this).attr('id').replace('Button', '');

        // Add click event listener to button
        $(this).click(() => {
            $('#rightSide').children().map(function() {
                // Ignore navbar div 
                if ($(this).attr('id') === 'miniNavbarContainer') {
                    return;
                }

                // Show corresponding section
                if ($(this).attr('id') === `${section}Section`) {
                    $(this).addClass('opacity-0').removeClass('hidden');
                    setTimeout(() => {
                        $(this).removeClass('opacity-0');
                    }, 100);
                } 
                
                // Hide every other section
                else {
                    if (!$(this).attr('class').includes('hidden')) {
                        $(this).addClass('hidden');
                    }
                }
            })
        });
    });

    // Load main layout 
    loadMainLayout($('#mainLayout'));
}


// Create a comment element
function createComment({ id, content, commenter, likers, timestamp }, currentUsername) {
    // Create profile picture element 
    let profilePicture;
    if (commenter.profile_picture) {
        profilePicture = $('<img>')
            .attr('src', commenter.profile_picture)
            .attr('alt', `${commenter.username} Profile Picture`)
            .attr('class', 'object-cover w-full h-full');
    } else {
        const userInitial = $('<div>')
            .attr('class', 'profile-picture-missing-text')
            .html(commenter.username[0].toUpperCase());
        profilePicture = $('<div>')
            .attr('class', 'profile-picture-missing-container')
            .html(userInitial);
    }

    // Append element to profile picture container
    const profilePictureContainer = $('<a>')
        .attr('href', `/profile/${commenter.username}`)
        .attr('class', 'profile-picture-container group')
        .html(profilePicture);

    // Create username element
    const usernameElement = $('<a>')
        .attr('href', `/profile/${commenter.username}`)
        .attr('class', 'right-review-username')
        .html(`<div>${commenter.username}</div>`);
    if (commenter.is_staff) {
        usernameElement.append(`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="right-review-username-checkmark">
                <path fill-rule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd" />
            </svg>
        `);
    }
    const headerElement = $('<div>')
        .attr('class', 'right-review-header')
        .html(usernameElement)
        .append(`<div class="right-review-timestamp">${timeAgo(timestamp)}</div>`);

    // Create content element
    const contentElement = $('<div>')
        .attr('class', 'right-review-content')
        .html(content);

    // Create like icon
    const likedByUser = likers.some(liker => liker.username === currentUsername);
    const likesCount = $('<div>')
        .attr('id', `comment${id}LikesCount`)
        .html(likers.length);
    const likeButton = $(likedByUser ? (`
        <div id="comment${id}LikeButton">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="right-review-icon text-[var(--red)]">
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
        </div>
    `) : (`
        <div id="comment${id}LikeButton">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.2" stroke="currentColor" class="right-review-icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
        </div>
    `))
    .click(async () => await likeCommentAction(id));;

    const likeContainer = $('<div>')
        .attr('class', 'right-review-icon-item')
        .html(likesCount)
        .append(likeButton);

    // Appen like icon to icons container
    const iconsContainer = $('<div>')
        .attr('class', 'right-review-icons-container')
        .html(likeContainer);

    // Append trash icon to icons container if commenter is current user
    if (commenter.username === currentUsername) {
        const trashButton = $(`
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.2" stroke="var(--red)" class="right-review-icon">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
            </svg>
        `).click(() => confirmDeleteComment(id));
        iconsContainer.append(trashButton);
    }

    // Create body container and append username, content, icons
    const body = $('<div>')
        .attr('class', 'right-review-body')
        .html(headerElement)
        .append(contentElement)
        .append(iconsContainer);
    
    // Create comment container and append profile picture and body
    const newComment = $('<div>')
        .attr('id', `comment${id}`)
        .attr('class', 'right-review-container')
        .html(profilePictureContainer)
        .append(body);
    
    // Return new comment
    return newComment;
}


// Post and create comment
async function createAndPostComment(recipeId, currentUsername) {
    // Ensure content has been filled
    const content = $('#reviewInput').val().trim();
    if (!content) {
        const reviewInputError = 'Review must not be empty.';
        console.error(reviewInputError);
        if ($('#reviewInputErrorMessage').length === 0) {
            $('#postReviewButton').after(`
                <div id="reviewInputErrorMessage" class="text-invalid mt-2">
                    ${reviewInputError}
                </div>
            `);
        } 
        return;
    }

    // Post comment
    try {
        // Get result of post comment
        const result = await postComment(recipeId, content);

        // Empty input and remove any error messages
        $('#reviewInput').val('');
        $('#reviewInputErrorMessage').remove();

        // Create new comment element
        const newComment = createComment(result.newComment, currentUsername);

        // If new total comments is 1, append reviews count then new comment
        if (result.newCount === 1) {
            $('#reviewsCarousel').html(`
                <div id="reviewsCount" class="text-2xl uppercase tracking-widest">
                    1 review
                </div>
            `);
            $('#reviewsCarousel').append(newComment);
        } 
        
        // Otherwise, update reviews count and add new comment
        else {
            const prevCount = parseInt($('#reviewsCount').text());
            $('#reviewsCount').html(`${prevCount + 1} reviews`);
            $('#reviewsCount').after(newComment);
        }
    } catch (error) {
        console.error(error);
    }
}


// Confirm delete post
function confirmDeleteRecipe(recipeId, recipeName, recipePoster) {
    if ($('#blackout').length > 0) {
        return;
    }

    // Create modal 
    const modal = $('<div>')
        .attr('id', 'confirmModal')
        .attr('class', 'modal opacity-0')
        .html(`
            <div class="text-center">
                Are you sure you want to delete your <strong class="font-[900] text-[var(--red)]">${recipeName}</strong> recipe?
            </div>
            <div class="flex items-center space-x-4 px-2">
                <button id="cancelDeleteRecipeButton" class="button tracking-widest uppercase text-xl">No</button>
                <button id="confirmDeleteRecipeButton" class="button bg-[var(--red)] tracking-widest uppercase text-xl">Yes</button>
            </div>
        `);

     // Create blackout 
     const blackout = $('<div>')
        .attr('id', 'blackout')
        .attr('class', 'blackout opacity-0')
        .click(() => exitModal($('#confirmModal'), $('#blackout')));

     // Blackout the whole view
     $('body')
        .append(blackout)
        .append(modal);
    setTimeout(() => {
        $('#confirmModal').removeClass('opacity-0');
        $('#blackout').removeClass('opacity-0');
    }, 300);

    // Close blackout and modal on cancellation
    $('#cancelDeleteRecipeButton')
        .click(() => exitModal($('#confirmModal'), $('#blackout')));

    // Close blackout and delete comment on confirmation
    $('#confirmDeleteRecipeButton').click(async () => {
        try {
            await deleteRecipe(recipeId);

            // Close blackout
            exitModal($('#confirmModal'), $('#blackout'));
    
            // Redirect to index page
            window.location.href = recipePoster.trim() ? `/profile/${recipePoster}` : '/';
        } catch (error) {
            console.error(error);
        }
    });
}


// Confirm delete comment
function confirmDeleteComment(commentId) {
    if ($('#blackout').length > 0) {
        return;
    }

    // Create modal 
    const modal = $('<div>')
        .attr('id', 'confirmModal')
        .attr('class', 'modal opacity-0')
        .html(`
            <div>
                Are you sure you want to delete this comment?
            </div>
            <div class="flex items-center space-x-4 px-2">
                <button id="cancelDeleteCommentButton" class="button tracking-widest uppercase text-xl">No</button>
                <button id="confirmDeleteCommentButton" class="button bg-[var(--red)] tracking-widest uppercase text-xl">Yes</button>
            </div>
        `);

     // Create blackout 
     const blackout = $('<div>')
        .attr('id', 'blackout')
        .attr('class', 'blackout opacity-0')
        .click(() => exitModal($('#confirmModal'), $('#blackout')));

     // Blackout the whole view
     $('body')
        .append(blackout)
        .append(modal);
    setTimeout(() => {
        $('#confirmModal').removeClass('opacity-0');
        $('#blackout').removeClass('opacity-0');
    }, 300);

    // Close blackout and modal on cancellation
    $('#cancelDeleteCommentButton')
        .click(() => exitModal($('#confirmModal'), $('#blackout')));

    // Close blackout and delete comment on confirmation
    $('#confirmDeleteCommentButton').click(async () => {
        try {
            const result = await deleteComment(commentId);
            const newCount = result.newCount;

            // Close blackout
            exitModal($('#confirmModal'), $('#blackout'));
    
            // If total comments is now 0, replace carousel with empty message
            if (newCount === 0) {
                $('#reviewsCarousel').html(`
                    <div class="right-review-none">
                        No comments yet.
                    </div>
                `);
            }
    
            // Otherwise, delete comment from DOM and update count
            $(`#comment${commentId}`).remove();
            const prevCount = parseInt($('#reviewsCount').text());
            $('#reviewsCount').text(`${prevCount - 1} review${newCount > 1 ? 's' : ''}`);
        } catch (error) {
            console.error(error);
        }
    });
}


// Like recipe action
async function likeRecipeAction(recipeId) {
    try {
        const { isLiked, newLikesCount } = await toggleLikeRecipe(recipeId);
        $('#recipeLikesCount').text(newLikesCount);
        $('#likeRecipeSvg').html(
            isLiked ? (`
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="left-icon-button text-[var(--red)]">
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                </svg>
            `) : (`
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="left-icon-button">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
            `)
        );
    } catch (error) {
        console.error(error);
    }
}


// Like comment action
async function likeCommentAction(commentId) {
    try {
        const { isLiked, newLikesCount } = await toggleLikeComment(commentId);
        $(`#comment${commentId}LikesCount`).text(newLikesCount);
        $(`#comment${commentId}LikeButton`).html(
            isLiked ? (`
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="right-review-icon text-[var(--red)]">
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                </svg>
            `) : (`
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="right-review-icon">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
            `)
        );
    } catch (error) {
        console.error(error);
    }
}


// Save recipe action
async function saveRecipeAction(recipeId) {
    try {
        const { isSaved, newSavesCount } = await toggleSaveRecipe(recipeId);
        $('#recipeSavesCount').text(newSavesCount);
        $('#saveRecipeSvg').html(
            isSaved ? (`
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="left-icon-button">
                    <path fill-rule="evenodd" d="M6.32 2.577a49.255 49.255 0 0111.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 01-1.085.67L12 18.089l-7.165 3.583A.75.75 0 013.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93z" clip-rule="evenodd" />
                </svg>
            `) : (`
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="left-icon-button">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                </svg>
            `)
        );
    } catch (error) {
        console.error(error);
    }
}
