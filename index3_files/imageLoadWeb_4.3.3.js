//Get the initial width of the window.  This will be important if the browser is resized.
var initialWidth = $(window).width();
	
function imageLoad(thisObj){
	//All images which use this function must have a "data-src" attribute rather than a "src" attribute, in order to prevent the browser from automatically downloading the image on page load.
	var SRC = thisObj.attr('data-src');
	
	//The "data-src" attribute must become "data-original" so that it can be used by the lazyload jQuery plugin
	thisObj.attr('data-original', SRC).removeAttr('data-src');
}

$(document).ready(function(){
	
	//If the same image file is to be used on both desktop and mobile sizes, then it must have both "desktopImg" and "phoneImg" classes.
	$('.desktopImg.phoneImg').each(function(){
		$(this).addClass('lazyload').removeClass('desktopImg').removeClass('phoneImg');
		imageLoad($(this));
	});
	
	$('.desktopImg:not(".phoneImg")').each(function(){
		$(this).addClass('lazyload hide-on-phones');
		
		//Test if the browser is currently a "desktop" size (i.e. greater than 767px).  Tablet sizes are included in this range as well (i.e. 768px - 1024px).
		//Run this function for all images which are only used on desktops (and tablets).
		if (initialWidth > 767) {
			imageLoad($(this));
			$(this).removeClass('desktopImg');
		}
	});
	
	$('.phoneImg:not(".desktopImg")').each(function(){
		$(this).addClass('lazyload hide-on-desktops hide-on-tablets');
		
		//Test if the browser is currently a "phone" size (i.e. less than 768px).
		//Run this function for all images which are only used on phones.
		if (initialWidth < 768) {
			imageLoad($(this));
			$(this).removeClass('phoneImg');
		}
	});
	
	$('.lazyload').each(function(){
		$(this).lazyload({
			threshold : 500
		});
	});
});

//After the lazyload images are ready, load the ones which are partially-visible inside the viewport
$(window).on('load', function(){
    $('img.lazyload').each(function(){
        var SRC = $(this).attr('data-original');
        var elementTop = $(this).offset().top;
        var viewportHeight = $(window).height();
        if (elementTop < viewportHeight){
            $(this).attr('src', SRC);
        }
    });
});


//If a user resizes the window, load both desktop and phone images accordingly.
//Each image will use the "hide-on-desktop" and "hide-on-phones" classes to determine which should be displayed.
$(window).resize(function(){
	var newWidth = $(window).width();
	if(newWidth == initialWidth){
		// Do nothing.  This prevents the resize function from firing when browser is scrolled.
	}
	else if ($(this).width() > 767) {
		$('.desktopImg:not(".phoneImg")').each(function(){
			var SRC = $(this).attr('data-src');
			$(this).attr('src', SRC).removeAttr('data-src').removeClass('desktopImg');
		});
	}
	else if ($(this).width() < 768) {
		$('.phoneImg:not(".desktopImg")').each(function(){
			var SRC = $(this).attr('data-src');
			$(this).attr('src', SRC).removeAttr('data-src').removeClass('phoneImg');
		});
	}
});