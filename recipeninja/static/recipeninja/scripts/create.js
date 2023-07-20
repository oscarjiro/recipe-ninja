const MAX_INSTRUCTIONS = 15;
const MAX_INGREDIENTS = 30;
const MAX_DESCRIPTION_LENGTH = 150

$(document).ready(() => {

    // Configure instruction and ingredient inputs
    $('#addInstructionButton').click(addNewInstruction);
    $('#addIngredientButton').click(addNewIngredient);

    // Configure image preview on upload
    $('#imageInput').on('change', function() {

        // Ensure uploaded file is an image
        const uploadedImage = $(this).get(0).files[0];
        if (!uploadedImage.type.startsWith('image/')) {        
            console.error('Uploaded file should be an image file.');
            if ($('#imageErrorMessage').length === 0) {
                $('#imageHeader').after(`
                    <div id="imageErrorMessage" class="text-invalid text-sm">
                        Uploaded file should be an image file.
                    </div>
                `);
            } else {
                $('#imageErrorMessage').html('Uploaded file should be an image file.');
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

    });

    // Form submission
    $('#createRecipeForm').on('submit', (event) => {

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

        console.log("IMAGE HERE OR NO", $('#imageInput').get(0).files)

        // Ensure all other required fields are filled and all filled fields valid
        if (!$('#recipeNameInput').val().trim() || $('#descriptionInput').val().trim().length > MAX_DESCRIPTION_LENGTH
            || ($('#imageInput').get(0).files && !$('#imageInput').get(0).files[0].type.startsWith('image/'))) {
            
            // Prevent submission
            event.preventDefault();

            // Add error message to the invalid field
            if (!$('#recipeNameInput').val().trim()) {
                console.error("Recipe name is required.");
                if ($('#nameErrorMessage').length === 0) {
                    $('#nameHeader').after(`
                        <div id="nameErrorMessage" class="text-invalid text-sm">
                            Recipe name is required.
                        </div>
                    `);
                } else {
                    $('#nameErrorMessage').html('Recipe name is required.');
                }
            } else {
                $('#nameErrorMessage').remove();
            }

            if ($('#descriptionInput').val().trim().length > MAX_DESCRIPTION_LENGTH) {
                console.error("Description should be no more than 150 characters.");
                if ($('#descriptionErrorMessage').length === 0) {
                    $('#descriptionHeader').after(`
                        <div id="descriptionErrorMessage" class="text-invalid text-sm">
                            Description should be no more than 150 characters.
                        </div>
                    `);
                } else {
                    $('#descriptionErrorMessage').html('Description should be no more than 150 characters.');
                }
            } else {
                $('#descriptionErrorMessage').remove();
            }

            if ($('#imageInput').get(0).files && !$('#imageInput').get(0).files[0].type.startsWith('image/')) {
                console.error('Uploaded file should be an image file.');
                if ($('#imageErrorMessage').length === 0) {
                    $('#imageHeader').after(`
                        <div id="imageErrorMessage" class="text-invalid text-sm">
                            Uploaded file should be an image file.
                        </div>
                    `);
                } else {
                    $('#imageErrorMessage').html('Uploaded file should be an image file.');
                }
            } else {
                $('#imageErrorMessage').remove();
            }

            return;
        }

        // Proceed to post request
        console.log("Valid form submission!");

    });

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
        .attr('class', 'recipe-form-input');

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
       return;
    } 

    if ($('#recipeInstructionsCarousel').children().length === 2) {
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
        .attr('class', 'recipe-form-input');

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
       return;
    } 

    if ($('#recipeIngredientsCarousel').children().length === 2) {
        $(this).remove();
    }

    $('#recipeIngredientsCarousel').children(':last-child').remove();

}