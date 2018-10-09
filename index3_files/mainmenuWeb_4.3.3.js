/* ---------------------------------------Begin JQuery for controlling the main menu--------------------------------------- */
function openDropdown(thisMenu){
	$("#searchDropdown").hide();
	$('#autoSuggest_Result_div').hide();
	$("#searchFilterMenu").removeClass("active");
	$("#searchFilterButton").removeClass("selected");
	
	if ($(window).width() > 1024) {
		
		//Load espot images in dropdown
		thisMenu.find('img').each(function(){
			var SRC = $(this).attr('data-src');
			$(this).attr('src', SRC).removeAttr('data-src');
		});
		
		//Hide any visible menus
		$('.main-submenu').hide();
		
		// Calculate the horizontal position of the dropdown based on the horizontal position of the top menu item
		var windowWidth = $(window).width();
		var menuItemPosition = thisMenu.offset().left;
		if (menuItemPosition < (windowWidth / 2)) {
			thisMenu.children('.main-submenu').show();
			thisMenu.children('.main-submenu').css('left', '0px');
		} else{
			thisMenu.children('.main-submenu').show();
			thisMenu.children('.main-submenu').css('right', '0px');
		}
	}
}
function closeDropdown(){
	if ($(window).width() > 1024) {
		$('.main-submenu').hide();
	}
}
function toggleMobileMenu(){
	$('#main-menu').slideDown(500, function(){lockBodyScroll();});
}

$(document).ready(function(){ 
	
	// Begin desktop menu actions
	$('.top-menu-item').mouseover(function() {
		openDropdown($(this));   
	});
	//If the user is no longer hovering over any menu items, hide any visible dropdown menus
	$('#main-menu-wrapper').mouseleave(function() {
		closeDropdown();
	});
	// End desktop menu actions
	  	
	// Begin mobile menu actions
	$('.showSubmenu').click(function() {
		$(this).toggleClass('openedSubmenu');
		$(this).closest('.top-menu-item').find('.main-submenu').slideToggle();
	});
	
	$('.crossMark').click(function(){
		unlockBodyScroll();
		$(this).closest('.popupWrapper').slideUp();
	});
	// End mobile menu actions

});

/* ----------------If the browser is resized---------------- */

var originalWidth = $(window).width(); //Get the original Width of the browser window.  This will be used for the resize function below.

$(window).resize(function(){
   var newWidth = $(window).width();
   if(newWidth == originalWidth){
	   // Do nothing.  This prevents the resize function from firing when browser is scrolled.
   }
   else{
      	if ($(this).width() > 1024) {
			$('#main-menu').show();
			$('.main-submenu').hide();
			originalWidth = $(this).width(); //reset the originalWidth variable value
			}
      	else if ($(this).width() < 1025) {
			$('#main-menu').hide();
			originalWidth = $(this).width(); //reset the originalWidth variable value
    	}
   }
});


/* ---------------------------------------End JQuery for controlling the main menu--------------------------------------- */
