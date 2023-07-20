$(document).ready(() => {

    // Expand sidebar
    $('#expandSidebarButton').click(() => {
        $('body').addClass('overflow-hidden');
        $('#sidebarContent').removeClass('z-[-999] w-[0px]').addClass('z-[999] w-screen sm:w-[50%]');
        setTimeout(() => {
            $('#sidebarContent').find('div').map(function() {
                $(this).removeClass('opacity-0').addClass('opacity-100');
            });
        }, 500);
    });
    
    // Collapse sidebar 1
    $('#collapseSidebarButton1').click(() => {
        $('body').removeClass('overflow-hidden');
        $('#sidebarContent').removeClass('z-[999] w-screen sm:w-[50%]').addClass('z-[-999] w-[0px]');
        $('#sidebarContent').find('div').map(function() {
            $(this).removeClass('opacity-100').addClass('opacity-0');
        });
    });

    // Collapse sidebar 1
    $('#collapseSidebarButton2').click(() => {
        $('body').removeClass('overflow-hidden');
        $('#sidebarContent').removeClass('z-[999] w-screen sm:w-[50%]').addClass('z-[-999] w-[0px]');
        $('#sidebarContent').find('div').map(function() {
            $(this).removeClass('opacity-100').addClass('opacity-0');
        });
    });

    // Profile picture dropdown
    $('#profilePicture').click(() => {
        if ($('#profilePictureDropdown').attr('class').includes('h-0')) {
            $('#profilePicture').addClass('shadow-[#121212]/30 shadow-lg');
            $('#profilePictureDropdown').removeClass('h-0').addClass('h-[90px]');
            $('#profilePictureDropdown').find('div').map(function() {
                $(this).removeClass('hidden');
            });
            setTimeout(() => {
                $('#profilePictureDropdown').removeClass('opacity-0');
            }, 200);
        } else {
            $('#profilePicture').removeClass('shadow-[#121212]/30 shadow-lg');
            $('#profilePictureDropdown').addClass('opacity-0');
            setTimeout(() => {
                $('#profilePictureDropdown').removeClass('h-[90px]').addClass('h-0');
                $('#profilePictureDropdown').find('div').map(function() {
                    $(this).addClass('hidden');
                });
            }, 200);
        }
    });

});