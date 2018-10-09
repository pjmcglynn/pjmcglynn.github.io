$(document).ready(function(){ 
	
	$('body').addClass('noFocus');
	
	$(document).on('keydown', function(e) {
		  if(e.which === 9){
			 $('body').removeClass('noFocus').addClass('keyboardFocus');
		  }
	});
	
	$(document).on('mousedown', '.keyboardFocus', function(){
		$('body').removeClass('keyboardFocus').addClass('noFocus');
	});
	
	
	
  //If a keyboard is used to navigate to the main menu items
  $('.top-menu-item').on('focusin', function() {
	  openDropdown($(this));
  });
  
  //If the main menu no longer has keyboard focus
  $('.keyboardFocus #main-menu-wrapper').on('focusout', function() {
	  var self = $(this);
	  setTimeout(function() {
	    if (self.has($(document.activeElement)).length == 0) {
	    	closeDropdown();
	    }
	  }, 0);
  });
  
  //If the "Skip Menu" option is selected
  $(document).on("focus", "#skip-menu", function(){
	  $(this).keydown(function(e){
		  if(e.which === 13){
			  setTimeout(function(){
				  $('html,body').animate({
			          scrollTop: $('#mainContent').offset().top
			        }, 200);
				  $('#mainContent').attr('tabindex', '0').focus();
		      }, 1);
		  }
	  });
  });
  
  //Give the ability to destroy flexsliders and present the slides as static images
  $(document).on("focus", ".showAllSlides", function(){
	  var flexSlider = $(this).parent('.flexslider');
	  var flexSliderContainer = flexSlider.parent();
	  $(this).keydown(function(e){
		  if(e.which === 13){
			  setTimeout(function(){
				  var flexSliderClone = flexSlider.clone().removeAttr('id').removeClass('flexslider').addClass('destroySlider');
				  flexSliderClone.find('.flex-direction-nav').remove();
				  flexSliderClone.find('ul').removeClass().attr('style', '');
				  flexSliderClone.find('.flex-viewport').removeClass();
				  flexSliderClone.find('.clone').remove();
				  flexSliderClone.find('.showAllSlides').remove();
				  flexSliderContainer.append(flexSliderClone);
				  flexSlider.remove();
				  $('.destroySlider').find('a').attr('tabindex', '0');
				  $('.destroySlider').find('.product_info a').attr('tabindex', '-1');
				  flexSliderClone.find('img').each(function(){
							var dataSrc = $(this).attr('data-src');
							var scene7URL = "https://havertys.scene7.com/is/image/Havertys/"+dataSrc;
							$(this).attr('data-src', scene7URL);
							if ($(this).parent().siblings().hasClass("mobile-main-slide")) {
								var mobileDataSrc = $(this).parent().siblings('.mobile-main-slide').find('.responsiveImage').attr('data-src');
								var mobileScene7URL = "Havertys/"+mobileDataSrc;
								$(this).attr('data-breakpoints', '400:src='+mobileScene7URL+', 767:src='+mobileScene7URL+', 1023, 1200');
							}
							else{
								$(this).attr('data-breakpoints', '400, 767, 1023, 1200');
							}
							s7responsiveImage(this);
				  });
		      }, 1);
		  }
	  });
  });
  
  //If an element gets focus, and the ENTER key is pressed, simulate a click
  $(document).on("focus", "*", function(){
	  $(this).keydown(function(e){
		  if(e.which === 13){
			  $(this).click();
			  e.stopImmediatePropagation();
		  }
	  });
  });
  
  
  //If a popup is opened, prevent autofocus from highlighting focused element.
  var autoFocusedEl = ".dijitDialog, .dijitSelectMenu, .store_message, .ui-dialog"
  $(document).on("focusin", autoFocusedEl, function(){
	  if (!$(this).find("*").hasClass("focusFix")) {
		  $(this).find("*").addClass('noFocus focusFix');
	  }
	  $(this).keydown(function(){
		  $(this).find("*").removeClass('noFocus');
	  });
  }).on("focusout", autoFocusedEl, function(){
	  var self = $(this);
	  setTimeout(function() {
		//If no child elements of this popup have focus, remove the focus classes and prevent the refocus feature from highlighting the focused link on the page
	    if (self.has($(document.activeElement)).length == 0) {
	    	$(document.activeElement).blur();
	    	$(autoFocusedEl).find(".focusFix").removeClass('focusFix').find(".noFocus").removeClass('noFocus');
	    }
	  }, 0);
  });

  
  //If "My Design Center" quicklink is focused
  $('#myDesignCenterQuickLink').on('focusin', function() {
	  $('.myDesignCenterRollover').show();
  });
  //If "My Design Center" quicklink is not focused
  $('.design-center').on('focusout', function() {
	  var self = $(this);
	  setTimeout(function() {
	    if (self.has($(document.activeElement)).length == 0) {
	    	$('.myDesignCenterRollover').hide();
	    }
	  }, 0);
  });
  
}); //End Document Ready

