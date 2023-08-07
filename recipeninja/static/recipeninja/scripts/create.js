import { 
    getCuisines, 
    getDifficulties,
    validateImageType,
} from './utils.js';


import {
    MAX_DESCRIPTION_LENGTH,
    MAX_INSTRUCTIONS,
    MAX_INGREDIENTS,
    MAX_IMAGE_SIZE,
} from './const.js';


$(document).ready(() => {

    async function f() {

        const CUISINES = await getCuisines();
        const DIFFICULTIES = await getDifficulties();

        // Configure instruction and ingredient inputs
        $('#addInstructionButton').click(addNewInstruction);
        $('#addIngredientButton').click(addNewIngredient);
        $('#instruction1').on('focus keydown', event => dynamicInstructionsEditing(event));
        $('#ingredient1').on('focus keydown', event => dynamicIngredientsEditing(event));

        // Configure image preview on upload
        $('#imageInput').on('change', event => previewImage(event, $('#imageInput')));

        // Difficulty selection
        $('#difficultyButtons').find('button').each(function() {
            $(this).click(function() {
                // Get difficulty of clicked button 
                const difficulty = $(this).attr('id').replace('difficulty', '');
                if (!DIFFICULTIES.includes(difficulty)) {
                    return;
                }

                // If current difficulty is the selected value, deselect it
                if ($('#difficultyInput').val() === difficulty) {
                    $('#difficultyInput').val('');
                    $(this).attr('class', 'form-button-unselected');
                } 
                
                // Otherwise, select it
                else {
                    $('#difficultyInput').val(difficulty);
                    $(this).attr('class', 'form-button-selected');
                }

                // Deselect all other buttons
                $('#difficultyButtons').find('button').each(function() {
                    if (!$(this).attr('id').includes(difficulty)) {
                        $(this).attr('class', 'form-button-unselected');
                    }
                });
            });
        });

        // Cuisine selection
        $('#cuisinesButtons').find('button').each(function() {
            $(this).click(function() {
                // Get cuisine of clicked button
                const currentCuisine = $(this).attr('id').replace('cuisine', '');
                if (!CUISINES.includes(currentCuisine)) {
                    return;
                }

                // Get array of currently selected cuisines
                let selectedCuisines = 
                    $('#cuisinesInput').val().trim() === '' || !$('#cuisinesInput').val().trim() ?
                        [] : $('#cuisinesInput').val().trim().split(',');

                // If current cuisine is already selected, remove it
                if (selectedCuisines.includes(currentCuisine)) {
                    console.log("OLD")
                    $(this).attr('class', 'form-button-unselected');
                    selectedCuisines = selectedCuisines.filter(cuisine => cuisine !== currentCuisine);
                    $('#cuisinesInput').val(selectedCuisines.join(','));
                } 
                
                // Otherwise, add it
                else {
                    $(this).attr('class', 'form-button-selected');
                    $('#cuisinesInput').val(
                        selectedCuisines.length > 0 ? 
                            selectedCuisines.join(',').concat(`,${currentCuisine}`)
                            : currentCuisine
                    );
                }
            });
        });

        // Form submission
        $('#createRecipeForm').on('submit', event => {

            // For multiple instructions field generated, ensure at least one filled
            if ($('#recipeInstructionsCarousel').children().length > 1) {
                let atLeastOneFilled = false;
                for (let i = 1; i <= $('#recipeInstructionsCarousel').children().length; i++) {
                    if ($(`#instruction${i}`).val().trim()) {
                        atLeastOneFilled = true; 
                        break;      
                    }
                }
                if (!atLeastOneFilled) {
                    event.preventDefault();
                    console.error('At least 1 instruction is required');
                    if ($('#instructionErrorMessage').length === 0) {
                        $('#instructionHeader').after(`
                            <div id="instructionErrorMessage" class="text-invalid text-sm">
                                At least 1 instruction is required.
                            </div>
                        `);
                    } else {
                        $('#instructionErrorMessage').html('At least 1 instruction is required');
                    }
                } else {
                    $('#instructionErrorMessage').remove();
                }
            } 
            
            // If just one instruction field, ensure it is filled
            else {   
                if (!$('#instruction1').val().trim()) {
                    event.preventDefault();
                    console.error('At least 1 instruction is required');
                    if ($('#instructionErrorMessage').length === 0) {
                        $('#instructionHeader').after(`
                            <div id="instructionErrorMessage" class="text-invalid text-sm">
                                At least 1 instruction is required.
                            </div>
                        `);
                    } else {
                        $('#instructionErrorMessage').html('At least 1 instruction is required');
                    }
                } else {
                    $('#instructionErrorMessage').remove();
                }
            }

            // For multiple ingredients field generated, ensure at least one filled
            if ($('#recipeIngredientsCarousel').children().length > 1) { 
                let atLeastOneFilled = false;
                for (let i = 1; i <= $('#recipeIngredientsCarousel').children().length; i++) {
                    if ($(`#ingredient${i}`).val().trim()) {
                        atLeastOneFilled = true; 
                        break;      
                    }
                }
                if (!atLeastOneFilled) {
                    event.preventDefault();
                    console.error('At least 1 instruction is required');
                    if ($('#ingredientErrorMessage').length === 0) {
                        $('#ingredientsHeader').after(`
                            <div id="ingredientErrorMessage" class="text-invalid text-sm">
                                At least 1 ingredient is required.
                            </div>
                        `);
                    } else {
                        $('#ingredientErrorMessage').html('At least 1 ingredient is required');
                    }
                } else {
                    $('#ingredientErrorMessage').remove();
                }
            } 
            
            // If just one ingredient field, ensure it is filled
            else {
                if (!$('#ingredient1').val().trim()) {
                    event.preventDefault();
                    console.error('At least 1 ingredient is required');
                    if ($('#ingredientErrorMessage').length === 0) {
                        $('#ingredientsHeader').after(`
                            <div id="ingredientErrorMessage" class="text-invalid text-sm">
                                At least 1 ingredient is required.
                            </div>
                        `);
                    } else {
                        $('#ingredientErrorMessage').html('At least 1 ingredient is required');
                    }
                } else {
                    $('#ingredientErrorMessage').remove();
                }
            }

            // Ensure all other required fields are filled and all filled fields valid
            const validRecipeName = ($('#recipeNameInput').val().trim()) ? true : false;
            const validDescription = $('#descriptionInput').val().trim().length <= MAX_DESCRIPTION_LENGTH;
            const validImageType = validateImageType($('#imageInput'));
            const validServings = ($('#servingsInput').val().trim() ? true : false) && parseInt($('#servingsInput').val().trim()) >= 1;
            const validDuration = ($('#durationInput').val().trim() ? true : false) && parseInt($('#durationInput').val().trim()) >= 1;
            const validCarbs = !$('#carbsInput').val().trim() || ($('#carbsInput').val().trim() && parseInt($('#carbsInput').val().trim()) >= 1);
            const validProtein = !$('#proteinInput').val().trim() || ($('#proteinInput').val().trim() && parseInt($('#proteinInput').val().trim()) >= 1);
            const validFat = !$('#fatInput').val().trim() || ($('#fatInput').val().trim() && parseInt($('#fatInput').val().trim()) >= 1);
            const validDifficulty = ($('#difficultyInput').val().trim() ? true : false) && DIFFICULTIES.includes($('#difficultyInput').val().trim());
            const validCuisines = !$('#cuisinesInput').val().trim() || ($('#cuisinesInput').val().trim() && $('#cuisinesInput').val().trim().split(',').every(cuisine => CUISINES.includes(cuisine)));

            if (!validRecipeName
                || !validDescription
                || !validImageType
                || !validServings
                || !validDuration
                || !validCarbs
                || !validProtein
                || !validFat
                || !validDifficulty
                || !validCuisines) {
                
                // Prevent submission
                event.preventDefault();

                // Add error message to the invalid field
                if (!validRecipeName) {
                    const recipeNameError = 'Recipe name is required.';
                    console.error(recipeNameError);
                    if ($('#nameErrorMessage').length === 0) {
                        $('#nameHeader').after(`
                            <div id="nameErrorMessage" class="text-invalid text-sm">
                                ${recipeNameError}
                            </div>
                        `);
                    } else {
                        $('#nameErrorMessage').html(recipeNameError);
                    }
                } else {
                    $('#nameErrorMessage').remove();
                }

                if (!validDescription) {
                    const descriptionError = 'Description should be no more than 150 characters.';
                    console.error(descriptionError);
                    if ($('#descriptionErrorMessage').length === 0) {
                        $('#descriptionHeader').after(`
                            <div id="descriptionErrorMessage" class="text-invalid text-sm">
                                ${descriptionError}
                            </div>
                        `);
                    } else {
                        $('#descriptionErrorMessage').html(descriptionError);
                    }
                } else {
                    $('#descriptionErrorMessage').remove();
                }

                if (!validImageType) {
                    const imageError = 'Uploaded file should be an image file.';
                    console.error(imageError);
                    if ($('#imageErrorMessage').length === 0) {
                        $('#imageHeader').after(`
                            <div id="imageErrorMessage" class="text-invalid text-sm">
                                ${imageError}
                            </div>
                        `);
                    } else {
                        $('#imageErrorMessage').html(imageError);
                    }
                } else {
                    $('#imageErrorMessage').remove();
                }

                if (!validServings) {
                    const servingsError = $('#servingsInput').val().trim() ? 
                        'Servings must be at least 1.' 
                        : 'Servings is required.';
                    console.error(servingsError);
                    if ($('#servingsErrorMessage').length === 0) {
                        $('#servingsHeader').after(`
                            <div id="servingsErrorMessage" class="text-invalid text-sm">
                                ${servingsError}
                            </div>
                        `);
                    } else {
                        $('#servingsErrorMessage').html(servingsError);
                    }
                } else {
                    $('#servingsErrorMessage').remove();
                }

                if (!validDuration) {
                    const durationError = $('#durationInput').val().trim() ?
                        'Duration must be at least 1 minute.' 
                        : 'Duration is required.';
                    console.error(durationError);
                    if ($('#durationErrorMessage').length === 0) {
                        $('#durationHeader').after(`
                            <div id="durationErrorMessage" class="text-invalid text-sm">
                                ${durationError}
                            </div>
                        `);
                    } else {
                        $('#durationErrorMessage').html(durationError);
                    }
                } else {
                    $('#durationErrorMessage').remove();
                }
        
                if (!validCarbs || !validProtein || !validFat) {
                    const nutritionError = 'Nutrition must be a minimum of 1 unit.';
                    console.error(nutritionError);
                    if ($('#nutritionErrorMessage').length === 0) {
                        $('#nutritionHeader').after(`
                            <div id="nutritionErrorMessage" class="text-invalid text-sm">
                                ${nutritionError}
                            </div>
                        `);
                    } else {
                        $('#nutritionErrorMessage').html(nutritionError);
                    }
                } else {
                    $('#nutritionErrorMessage').remove();
                }

                if (!validDifficulty) {
                    const difficultyError = $('#difficultyInput').val().trim()
                        ? 'Invalid difficulty selected.'
                        : 'You must select a difficulty';
                    console.error(difficultyError);
                    if ($('#difficultyErrorMessage').length === 0) {
                        $('#difficultyHeader').after(`
                            <div id="difficultyErrorMessage" class="text-invalid text-sm">
                                ${difficultyError}
                            </div>
                        `);
                    } else {
                        $('#difficultyErrorMessage').html(difficultyError);
                    }
                } else {
                    $('#difficultyErrorMessage').remove();
                }

                if (!validCuisines) {
                    const cuisinesError = 'Invalid cuisine selected.';
                    console.error(cuisinesError);
                    if ($('#cuisinesErrorMessage').length === 0) {
                        $('#cuisinesHeader').after(`
                            <div id="cuisinesErrorMessage" class="text-invalid text-sm">
                                ${cuisinesError}
                            </div>
                        `);
                    } else {
                        $('#cuisinesErrorMessage').html(cuisinesError);
                    }
                } else {
                    $('#cuisinesErrorMessage').remove();
                }

                return;
            }

            // Proceed to post request
            console.log("Valid form submission!");

        });

        // Load main layout
        setTimeout(() => {
            $('#mainLayout').removeClass('opacity-0');
        }, 100)

    }

    f();

});


// Add new instruction input
function addNewInstruction() {

    if ($('#recipeInstructionsCarousel').children().length >= MAX_INSTRUCTIONS) {
        if ($('#instructionErrorMessage').length === 0) {
            $('#instructionHeader').after(`
                <div id="instructionErrorMessage" class="text-invalid text-sm">
                    You can only include up to 15 instructions.
                </div>
            `);
        } else {
            $('#instructionErrorMessage').html('You can only include up to 15 instructions.');
        }
        return; 
    }

    if ($('#removeInstructionButton').length === 0) {
        const removeInstructionButton = $(`
            <svg id="removeInstructionButton" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 cursor-pointer">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15" />
            </svg>  
        `)
        .click(removeLastInstruction);

        $('#addInstructionButton').after(removeInstructionButton);
    } 

    const prevChild = $('#recipeInstructionsCarousel').children(':last-child');
    const prevIndex = parseInt(prevChild.attr('id').substring("instruction".length));

    const bulletPoint = $('<div>')
        .attr('class', 'recipe-bullet-point')
        .html(prevIndex + 1);

    const input = $('<input>')
        .attr('id', `instruction${prevIndex + 1}`)
        .attr('name', `instruction${prevIndex + 1}`)
        .attr('type', 'text')
        .attr('autocomplete', 'off')
        .attr('spellcheck', 'false')
        .attr('class', 'recipe-form-input')
        .on('focus keydown', event => dynamicInstructionsEditing(event));

    const container = $('<div>')
        .attr('id', `instruction${prevIndex + 1}Container`)
        .attr('class', 'flex items-center space-x-2');
    
    container
        .html(bulletPoint)
        .append(input);

    $('#recipeInstructionsCarousel')
        .append(container);

}


// Remove last instruction
function removeLastInstruction() {

    $('#instructionErrorMessage').remove();

    if ($('#recipeInstructionsCarousel').children().length <= 1) {
        $('#removeInstructionButton').remove();
        return;
    } 

    if ($('#recipeInstructionsCarousel').children().length === 2) {
        $('#removeInstructionButton').remove();
        $(this).remove();
    }

    $('#recipeInstructionsCarousel').children(':last-child').remove();

}


// Add new ingredient input
function addNewIngredient() {

    if ($('#recipeIngredientsCarousel').children().length >= MAX_INGREDIENTS) {
        if ($('#ingredientErrorMessage').length === 0) {
            $('#ingredientsHeader').after(`
                <div id="ingredientErrorMessage" class="text-invalid text-sm">
                    You can only include up to 30 ingredients.
                </div>
            `);
        } else {
            $('#ingredientErrorMessage').html('You can only include up to 30 ingredients.');
        }
        return; 
    }

    if ($('#removeIngredientButton').length === 0) {
        const removeIngredientButton = $(`
            <svg id="removeIngredientButton" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-4 h-4 cursor-pointer">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 12h-15" />
            </svg>  
        `)
        .click(removeLastIngredient);

        $('#addIngredientButton').after(removeIngredientButton);
    } 

    const prevChild = $('#recipeIngredientsCarousel').children(':last-child');
    const prevIndex = parseInt(prevChild.attr('id').substring("ingredient".length));

    const bulletPoint = $('<div>')
        .attr('class', 'recipe-bullet-point')
        .html(prevIndex + 1);

    const input = $('<input>')
        .attr('id', `ingredient${prevIndex + 1}`)
        .attr('name', `ingredient${prevIndex + 1}`)
        .attr('type', 'text')
        .attr('autocomplete', 'off')
        .attr('spellcheck', 'false')
        .attr('class', 'recipe-form-input')
        .on('focus keydown', event => dynamicIngredientsEditing(event));

    const container = $('<div>')
        .attr('id', `ingredient${prevIndex + 1}Container`)
        .attr('class', 'flex items-center space-x-2');
    
    container
        .html(bulletPoint)
        .append(input);

    $('#recipeIngredientsCarousel')
        .append(container);

}


// Remove last ingredient
function removeLastIngredient() {

    $('#ingredientErrorMessage').remove();

    if ($('#recipeIngredientsCarousel').children().length <= 1) {
        $('#removeIngredientButton').remove();
        return;
    } 

    if ($('#recipeIngredientsCarousel').children().length === 2) {
        $('#removeIngredientButton').remove();
        $(this).remove();
    }

    $('#recipeIngredientsCarousel').children(':last-child').remove();

}


// Preview uploaded image
function previewImage(event, input) {
    // Ensure uploaded file is an image
    const uploadedImage = input.get(0).files[0];
    if (!uploadedImage.type.startsWith('image/') || uploadedImage.size > MAX_IMAGE_SIZE) {
        event.preventDefault();
        const error = !uploadedImage.type.startsWith('image/') ? 
                        'Uploaded file should be an image file.'
                        : 'Uploaded image should not exceed 2 MB.';        
        console.error(error);
        
        if ($('#imageErrorMessage').length === 0) {
            $('#imageHeader').after(`
                <div id="imageErrorMessage" class="text-invalid text-sm">
                    ${error}
                </div>
            `);
        } else {
            $('#imageErrorMessage').html(error);
        }

        // Hide
        $('#previewImage').attr('src', '');
        if (!$('#previewImage').attr('class').replace('overflow-hidden', '').includes('hidden')) {
            $('#previewImage').addClass('hidden');
        }
        $('#imageName').html('');
        if (!$('#imageName').attr('class').replace('overflow-hidden', '').includes('hidden')) {
            $('#imageName').addClass('hidden');
        }

        return;
    }

    // Remove any error message if all good and proceed reading file
    $('#imageErrorMessage').remove();
    const reader = new FileReader();
    reader.readAsDataURL(uploadedImage);
    reader.onload = () => {
        $('#previewImage').attr('src', reader.result);
        $('#previewImage').removeClass('hidden');
    }
    $('#imageName')
        .removeClass('hidden')
        .html(uploadedImage.name);
}


// Dynamic instructions editing
function dynamicInstructionsEditing(event) {
    const current = $(event.target);
    const currentId = parseInt(current.attr('id').replace('instruction', ''));

    // Enter to add new input
    if (event.type === 'keydown' && event.keyCode === 13) {
        event.preventDefault();
        addNewInstruction();
        $(`#instruction${currentId + 1}`).focus();
    }
    
    // Backspace at empty input to remove last input
    else if (event.type === 'keydown' && event.keyCode === 8 && !$(event.target).val().trim()) {
        event.preventDefault();
        removeLastInstruction();
        if ($('#recipeInstructionsCarousel').children().length === currentId - 1) {
            $(`#instruction${currentId - 1}`).focus();
        };
    }

    // Arrow up to move to input upwards
    else if (event.type === 'keydown' && event.keyCode === 38) {
        if ($(`#instruction${currentId - 1}`)) {
            $(`#instruction${currentId - 1}`).focus();
        }
    }

    // Arrow down to move to input below
    else if (event.type === 'keydown' && event.keyCode === 40) {
        if ($(`#instruction${currentId + 1}`)) {
            $(`#instruction${currentId + 1}`).focus();
        }
    }
}


// Dynamic ingredients editing
function dynamicIngredientsEditing(event) {
    const current = $(event.target);
    const currentId = parseInt(current.attr('id').replace('ingredient', ''));

    // Enter to add new input
    if (event.type === 'keydown' && event.keyCode === 13) {
        event.preventDefault();
        addNewIngredient();
        $(`#ingredient${currentId + 1}`).focus();
    }

    // Backspace at empty input to remove last input
    else if (event.type === 'keydown' && event.keyCode === 8 && !current.val().trim()) {
        removeLastIngredient();
        if ($('#recipeIngredientsCarousel').children().length === currentId - 1) {
            $(`#ingredient${currentId - 1}`).focus();
        };
    }

    // Arrow up to move to input upwards
    else if (event.type === 'keydown' && event.keyCode === 38) {
        if ($(`#ingredient${currentId - 1}`)) {
            $(`#ingredient${currentId - 1}`).focus();
        }
    }

    // Arrow down to move to input below
    else if (event.type === 'keydown' && event.keyCode === 40) {
        if ($(`#ingredient${currentId + 1}`)) {
            $(`#ingredient${currentId + 1}`).focus();
        }
    }
}