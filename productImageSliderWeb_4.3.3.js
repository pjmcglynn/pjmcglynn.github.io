function buildMobileSlider($){
	if ($(window).width() < 1025) {
        var _SlideshowTransitions = [{}];

        var options = {
			$FillMode:1,
            $AutoPlay: 0,
            $ArrowKeyNavigation: 1,
            $SlideDuration: 800,
			$MinDragOffsetToSlide:25,

            $SlideshowOptions: {         
                $Class: $JssorSlideshowRunner$,
                $Transitions: _SlideshowTransitions,
                $TransitionsOrder: 1,
                $ShowLink: false
            },
            
            $BulletNavigatorOptions: {
                $Class: $JssorBulletNavigator$,
                $ChanceToShow: 2
            },

            $ArrowNavigatorOptions: {
                $Class: $JssorArrowNavigator$, 
                $ChanceToShow: 2 
            }
        };
        
        var imageSize;
        
        $('#product-image-slider').find('img').each(function(){
        	if ($(window).width() < 401){
        		imageSize = "&wid=400&hei=289";
        	}
        	else if ($(window).width() < 768 && $(window).width() > 400){
        		imageSize = "&wid=767&hei=554";
        	}
        	else{
        		imageSize = "&wid=1024&hei=740";
        	}
        	var SRC = $(this).attr('data-src').replace('&wid=480&hei=347', imageSize);
        	$(this).attr('src', SRC);
        });
        
        var jssor_slider1 = new $JssorSlider$("product-image-slider", options);
        
        function hideBullets() {
        	if (jssor_slider1.$SlidesCount() < 2){
        		$('#product-slider-navigator').hide();
        	}
        }
        
        hideBullets();
        
        //responsive code begin
        //you can remove responsive code if you don't want the slider scales while window resizes
        function ScaleSlider() {
            var parentWidth = jssor_slider1.$Elmt.parentNode.clientWidth;
            if (parentWidth)
                jssor_slider1.$ScaleWidth((parentWidth));
            else
                window.setTimeout(ScaleSlider, 30);
        }

        ScaleSlider();
        $Jssor$.$AddEvent(window, "load", ScaleSlider);
        $Jssor$.$AddEvent(window, "resize", ScaleSlider);
        $Jssor$.$AddEvent(window, "orientationchange", ScaleSlider);
        ////responsive code end
        
        $('.zoom-mobile-image').parent('div').css('pointer-events', 'none');
	}
}
            
            