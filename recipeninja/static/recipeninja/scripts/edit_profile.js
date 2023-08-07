import { 
    validateImageType,
    loadMainLayout,
    exitModal,
 } from './utils.js';


import {
    MAX_BIO_LENGTH,
    MAX_IMAGE_SIZE,
} from './const.js';


$(document).ready(() => {

    // Form validation
    $('#saveProfileButton').click(event => validateProfileForm(event));
    
    // Load main layout
    loadMainLayout($('#mainLayout'));

    $('#profilePictureEditButton').click(() => {
        confirmImageEdit(
            $('#profilePicturePreview'),
            'profile picture',
        );
    });

    $('#bannerEditButton').click(() => {
        confirmImageEdit(
            $('#bannerPreview'),
            'banner',
        );
    });

    $('#profilePictureInput').on('change', () => {
        previewImage($('#profilePictureInput'), $('#profilePicturePreview'), 'profilePicture');
    });
    $('#bannerInput').on('change', () => {
        previewImage($('#bannerInput'), $('#bannerPreview'), 'banner');
    });

    $('#bioInput').on('input keypress paste', function(event) {
        if (event.type === 'paste') {
            // Get pasted text
            const clipboardData = event.originalEvent.clipboardData || window.clipboardData;
            const pastedText = clipboardData.getData('text');

            console.log(pastedText);
    
            // Combine pasted text with current input value
            const combinedValue = $(this).val() + pastedText;

            if (combinedValue.length > MAX_BIO_LENGTH) {
                event.preventDefault();
                return;
            }
        }

        const currentValue = $(this).val().trim();

        console.log(currentValue.length);

        if (currentValue.length > MAX_BIO_LENGTH) {
            $(this).val($(this).val().substring(0, MAX_BIO_LENGTH));
            return;
        }

        updateBioCounter();
    });

});


// Form validation
function validateProfileForm(clickEvent) {

    // Check if every field is valid
    const validFirstName = ($('#firstNameInput').val().trim()) ? true : false;
    const validLastName = ($('#lastNameInput').val().trim()) ? true : false;
    const validBio = $('#bioInput').val().trim().length <= MAX_BIO_LENGTH;
    const validBanner = validateImageType($('#bannerInput'));
    const validProfilePicture = validateImageType($('#profilePictureInput'));

    if (!validFirstName
        || !validLastName
        || !validBio
        || !validBanner
        || !validProfilePicture) {
        
        clickEvent.preventDefault();

        toggleErrorMessage(
            validFirstName,
            'firstNameError',
            'First name is required.',
            'firstNameLabel',
        );

        toggleErrorMessage(
            validLastName,
            'lastNameError',
            'Last name is required.',
            'lastNameLabel',
        );

        toggleErrorMessage(
            validBio,
            'bioError',
            'Bio cannot exceed 300 characters.',
            'bioLabel',
        );

        toggleImageErrorMessage(
            validBanner && validProfilePicture
        );
    } 
}


// Confirm image edit 
function confirmImageEdit(preview, type) {
    const name = type === 'banner' ? 'banner' : 'profilePicture';

    // Ask to edit or delete if there is already an existing image
    if (!preview.attr('class').includes('hidden') && preview.attr('src')) {
        // Create modal 
        const modal = $('<div>')
        .attr('id', `${name}ChangeModal`)
        .attr('class', 'modal opacity-0')
        .html(`
            <div class="text-center">
                Do you want to change or remove your ${type}?
            </div>
            <div class="flex items-center space-x-4 px-2">
                <button id="${name}ChangeButton" class="button tracking-widest uppercase text-xl">Change</button>
                <button id="${name}RemoveButton" class="button bg-[var(--red)] tracking-widest uppercase text-xl">Remove</button>
            </div>
        `);

        // Create blackout 
        const blackout = $('<div>')
            .attr('id', 'blackout')
            .attr('class', 'blackout opacity-0')
            .click(() => exitModal($(`#${name}ChangeModal`), $('#blackout')));

        // Blackout the whole view
        $('body')
            .append(blackout)
            .append(modal);
        setTimeout(() => {
            $(`#${name}ChangeModal`).removeClass('opacity-0');
            $('#blackout').removeClass('opacity-0');
        }, 300);

        // Proceed to preview image on change button
        $(`#${name}ChangeButton`)
            .click(() => {
                $(`#${name}Input`).click();
                exitModal($(`#${name}ChangeModal`), $('#blackout'));
            });

        // Activate hidden input
        $(`#${name}RemoveButton`).click(async () => {
            $(`#${name}RemoveInput`).val('y');
            $(`#${name}Input`).val('');
            preview.addClass('hidden').attr('src', '');
            exitModal($(`#${name}ChangeModal`), $('#blackout'));
        });
    }

    else {
        $(`#${name}Input`).click();
    }
}


// Preview image 
function previewImage(input, preview, name) {
    $(`#${name}RemoveInput`).val('');

    // Ensure uploaded file is an image
    const uploadedImage = input.get(0).files[0];

    toggleImageErrorMessage(
        uploadedImage.type.startsWith('image/'),
        uploadedImage.size <= MAX_IMAGE_SIZE,
        preview,
    );

    if (!uploadedImage.type.startsWith('image/') || uploadedImage.size > MAX_IMAGE_SIZE) {
        $(`#${name}Input`).val('');
        return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(uploadedImage);
    reader.onload = () => {
        preview.attr('src', reader.result);
        preview.removeClass('hidden');
    }
}


// Toggle error message 
function toggleErrorMessage(valid, error, message, label) {
    if (!valid) {
        if ($(`#${error}`).length === 0) {
            $(`#${label}`).after(`
                <div id="${error}" class="text-invalid text-sm">
                    ${message}
                </div>
            `);
        } else {
            $(`#${error}`).html(message);
        }
    } else {
        $(`#${error}`).remove();
    }
}


// Toggle image error message
function toggleImageErrorMessage(validImageType, validImageSize, preview) {
    if (!validImageType || !validImageSize) {
        const error = !validImageType ? 
                        'Uploaded file should be an image file.'
                        : 'Uploaded image should not exceed 2 MB.';  
        console.error(error);
        if ($('#imageErrorMessage').length === 0) {
            $('#imageErrorContainer')
                .removeClass('hidden')
                .html(`
                    <div id="imageErrorMessage" class="text-invalid text-sm">
                        ${error}
                    </div>
                `);
        } else {
            $('#imageErrorMessage').html(error);
        }

        preview.attr('src', '');
        if (!preview.attr('class').includes('hidden')) {
            preview.addClass('hidden');
        }

    } else {
        $('#imageErrorMessage').remove();
        if (!$('#imageErrorContainer').attr('class').includes('hidden')) {
            $('#imageErrorContainer').addClass('hidden');
        }
    }
}


// Update bio counter
function updateBioCounter() {
    const count = $('#bioInput').val().trim().length;
    $('#bioCounter').text(count);
}
