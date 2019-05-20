$(document).ready(function() {
  $('.mobile-menu').click(function() {
    if (
      $(this)
        .siblings('.info-menu')
        .hasClass('current')
    ) {
      $(this)
        .siblings('.info-menu')
        .removeClass('current');
    } else {
      $(this)
        .siblings('.info-menu')
        .addClass('current');
    }
  });
});
