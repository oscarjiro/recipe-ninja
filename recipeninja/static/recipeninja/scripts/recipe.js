$(document).ready(() => {

    resizeName();
    $(window).on('resize', resizeName);

});


// Resize name to prevent cut off
function resizeName() {
  
    $('#name').toggleClass('h-[68px]', $('#name').innerHeight() < 120);


}