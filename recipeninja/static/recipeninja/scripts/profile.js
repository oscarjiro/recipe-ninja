import { 
    loadMainLayout,
    getUsername, 
    toggleFollow, 
    loadUserRecipes,
    createRecipeBox, 
    getFollowers,
    getFollowing,
    exitModal,
} from './utils.js';


$(document).ready(() => {

    async function f() {

        // Get the page's user's username
        const PAGE_USERNAME = getPageUsername();

        // Get current user's username
        const CURRENT_USERNAME = await getUsername();
    
        // Load user's recipes
        await loadUserRecipeCarousel(PAGE_USERNAME, CURRENT_USERNAME);
    
        // Load main layout
        loadMainLayout($('#mainLayout'));
    
        // Add follow functionality
        $('#toggleFollowButton').click(async () => await followUserAction(PAGE_USERNAME, CURRENT_USERNAME, $('#toggleFollowButton'), $('#followersCount')));

        // Add view followers and following functionality
        $('#followers').click(async () => await showFollowers(PAGE_USERNAME, CURRENT_USERNAME));
        $('#following').click(async () => await showFollowing(PAGE_USERNAME, CURRENT_USERNAME));

    }

    f();

});


// Get the page's user's username
function getPageUsername() {
    const currentPath = window.location.pathname;
    const username = currentPath.split('/').pop();
    return username;
}


// Follow user action
async function followUserAction(pageUsername, currentUsername, buttonElement, countElement, modal=false) {
    if (!currentUsername) {
        window.location.href = `/accounts/login/?next=${window.location.pathname}`;
        return;
    }
    try {
        const { isFollowing, newFollowersCount } = await toggleFollow(pageUsername);
        buttonElement
            .attr('class', `${modal ? 'modal' : 'profile'}${isFollowing ? '' : '-not' }-followed-button`)
            .html(`
                <span class="hidden min-[480px]:inline">
                    ${isFollowing ? 'Following' : 'Follow'}
                </span>
                <span class="min-[480px]:hidden">
                    +
                </span>
            `);
        if (countElement) {
            if (modal) {
                const prevCount = parseInt(countElement.text());
                const currentCount = isFollowing ? prevCount + 1 : prevCount - 1;
                countElement.text(currentCount);
                $('#modalFollowingCount').text(`${currentCount} following`);
            }
            countElement.text(newFollowersCount);
        }
    } catch (error) {
        console.error(error);
    }
}


// Get user's recipes
async function loadUserRecipeCarousel(pageUsername, currentUsername) {
    try {
        const recipes = await loadUserRecipes(pageUsername);
        if (recipes.length === 0) {
            $('#userRecipeCarousel').html(`
                <div class="w-full h-[120px] min-[1200px]:h-full flex items-center justify-center text-xl font-[500]">
                    No recipes yet.
                </div>
            `);
            return;
        }
        $('#userRecipeCarousel').html('');
        recipes.forEach(async recipe => {
            const recipeBox = await createRecipeBox(recipe, currentUsername, true);
            $('#userRecipeCarousel').append(recipeBox);
        });
    } catch (error) {
        console.error(error);
    }
}


// Show user's followers
async function showFollowers(pageUsername, currentUsername) {
    try {
        const followers = await getFollowers(pageUsername);

        // Create modal
        const modal = $('<div>')
            .attr('id', 'followersModal')
            .attr('class', 'modal-user-view opacity-0')
            .html(`
                <div class="uppercase tracking-widest">
                    ${followers.length} follower${followers.length > 1 ? 's' : ''}
                </div>
            `);

        // Create user carousel
        const userCarousel = $('<div>')
            .attr('class', 'flex flex-col items-center space-y-2 py-5 overflow-y-auto');

        // Add followers to modal
        followers.forEach(async follower => {
            // Create user box
            const userBox = await createUserBox(follower, currentUsername, pageUsername);
                
            // Append user box to modal
            userCarousel.append(userBox);
        }); 

        if (followers.length === 0) {
            modal.append(`
                <div class="w-full flex items-center justify-center min-[480px]:text-lg py-5">
                    No followers.
                </div>
            `);
        } else {
            modal.append(userCarousel);
        }

        // Create blackout
        const blackout = $('<div>')
            .attr('id', 'blackout')
            .attr('class', 'blackout opacity-0')
            .click(() => exitModal($('#followersModal'), $('#blackout')));

        // Append blackout and modal to body
        $('body')
            .append(blackout)
            .append(modal);
        setTimeout(() => {
            $('#followersModal').removeClass('opacity-0');
            $('#blackout').removeClass('opacity-0');
        }, 300);
    } catch (error) {
        console.error(error);
    }
}


// Show user's following
async function showFollowing(pageUsername, currentUsername) {
    try {
        const followings = await getFollowing(pageUsername);

        // Create modal
        const modal = $('<div>')
            .attr('id', 'followingModal')
            .attr('class', 'modal-user-view opacity-0')
            .html(`
                <div id="modalFollowingCount" class="uppercase tracking-widest">
                    ${followings.length} following
                </div>
            `);

        // Create user carousel
        const userCarousel = $('<div>')
            .attr('class', 'flex flex-col items-center space-y-2 py-5 overflow-y-auto');

        // Add followers to modal
        followings.forEach(async following => {
            // Create user box
            const userBox = await createUserBox(following, currentUsername, pageUsername);
                
            // Append user box to modal
            userCarousel.append(userBox);
        }); 

        if (followings.length === 0) {
            modal.append(`
                <div class="w-full flex items-center justify-center text-lg py-5">
                    No following.
                </div>
            `);
        } else {
            modal.append(userCarousel);
        }

        // Create blackout
        const blackout = $('<div>')
            .attr('id', 'blackout')
            .attr('class', 'blackout opacity-0')
            .click(() => exitModal($('#followingModal'), $('#blackout')));

        // Append blackout and modal to body
        $('body')
            .append(blackout)
            .append(modal);
        setTimeout(() => {
            $('#followingModal').removeClass('opacity-0');
            $('#blackout').removeClass('opacity-0');
        }, 300);
    } catch (error) {
        console.error(error);
    }
}


// Create user box
async function createUserBox(user, currentUsername, pageUsername) {
    // Destructure user
    const { id, username, is_staff, profile_picture } = user;

    // Create profile picture element 
    let profilePicture;
    if (profile_picture) {
        profilePicture = $('<img>')
            .attr('src', profile_picture)
            .attr('alt', `${username} Profile Picture`)
            .attr('class', 'object-cover w-full h-full');
    } else {
        const userInitial = $('<div>')
            .attr('class', 'modal-profile-picture-missing-text')
            .html(username[0].toUpperCase());
        profilePicture = $('<div>')
            .attr('class', 'modal-profile-picture-missing-container')
            .html(userInitial);
    }

    // Append element to profile picture container
    const profilePictureContainer = $('<a>')
        .attr('href', `/profile/${username}`)
        .attr('class', 'modal-profile-picture-container group')
        .html(profilePicture);

    // Create username element
    const usernameElement = $('<a>')
        .attr('href', `/profile/${username}`)
        .attr('class', 'modal-username')
        .html(`<div>${username}</div>`);
    if (is_staff) {
        usernameElement.append(`
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="text-[var(--blue)] w-5 h-5 min-[320px]:w-6 min-[320px]:h-6 mt-1">
                <path fill-rule="evenodd" d="M8.603 3.799A4.49 4.49 0 0112 2.25c1.357 0 2.573.6 3.397 1.549a4.49 4.49 0 013.498 1.307 4.491 4.491 0 011.307 3.497A4.49 4.49 0 0121.75 12a4.49 4.49 0 01-1.549 3.397 4.491 4.491 0 01-1.307 3.497 4.491 4.491 0 01-3.497 1.307A4.49 4.49 0 0112 21.75a4.49 4.49 0 01-3.397-1.549 4.49 4.49 0 01-3.498-1.306 4.491 4.491 0 01-1.307-3.498A4.49 4.49 0 012.25 12c0-1.357.6-2.573 1.549-3.397a4.49 4.49 0 011.307-3.497 4.49 4.49 0 013.497-1.307zm7.007 6.387a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd" />
            </svg>
        `);
    }   

    // Create main info element
    const mainInfo = $('<div>')
        .attr('class', 'modal-main-info')
        .html(profilePictureContainer)
        .append(usernameElement);

    // Check if current user is this user
    const sameUser = currentUsername === username;

    // Build user box
    const userBox = $('<div>')
        .attr('class', 'modal-user-box')
        .html(mainInfo);

    // Not same user
    if (!sameUser && currentUsername) {
        try {
            // Check if current user is following this user
            const currentFollowings = await getFollowing(currentUsername);
            const isFollowing = currentFollowings.some(following => following.username === username);
            
            // Create follow button element accordingly
            const followButton = $('<button>')
                .attr('id', `toggleFollow${id}`)
                .attr('class', `modal${isFollowing ? '' : '-not' }-followed-button`)
                .html(`
                    <span class="hidden min-[480px]:inline">
                        ${isFollowing ? 'Following' : 'Follow'}
                    </span>
                    <span class="min-[480px]:hidden">
                        +
                    </span>
                `)
                .click(async () => {
                    await followUserAction(
                            username, 
                            currentUsername, 
                            $(`#toggleFollow${id}`), 
                            currentUsername === pageUsername ? $('#followingCount') : null, 
                            true
                    )
                }); 

            // Append button to user
            userBox.append(followButton);
        } catch (error) {
            console.error(error);
        }
    } 
    
    // Not signed in
    else if (!sameUser && !currentUsername) {
        const followButton = $('<button>')
            .attr('id', `toggleFollow${id}`)
            .attr('class', 'modal-not-followed-button')
            .html('Follow')
            .click(() => window.location.href = `/accounts/login/?next=${window.location.pathname}`);
        userBox.append(followButton);
    }

    // Return user box
    return userBox;
}