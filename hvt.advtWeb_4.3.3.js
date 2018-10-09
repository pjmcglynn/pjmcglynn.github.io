var accordion;
var hvt = hvt || {};
hvt.advt = hvt.advt || {};

hvt.advt.galleryImage = hvt.advt.galleryImage || {};
hvt.advt.galleryImage.width = 0;
hvt.advt.galleryImage.height = 0;
hvt.advt.zoomOn = false;
hvt.advt.videoOn = false;
hvt.advt.emailFriendOn = false;

$(window).on("load", function () {
//$(window).load( function() {
	hvt.advt.scrollToAnchor();
	hvt.advt.initGallery();
	// hvt.advt.initQuickLook();
	});


hvt.advt.enlargePhoto = function() {
	"use strict";
	var container = "<div class='hvtadvt-photoContainer'><img /></div>";
	$("body").append(container);
	hvt.advt.bodyClearFix();

	$(".lightbox a")
			.click( function(e) {
				e.preventDefault();

				// Display/enlarge the image that the <a> links to.
					var imgsrc = $(this).attr('href'), myContainer = $(".hvtadvt-photoContainer"), myImg = $(".hvtadvt-photoContainer img");
                  
					// Centering the container div
					$(myImg)
							.load(
									function() {
										var imgWidth = myImg.width(), imgHeight = myImg
												.height();
										myContainer.css("width", imgWidth);
										myContainer.css("height", imgHeight);
										myContainer.css("margin-left",
												-(imgWidth / 2));
										myContainer.css("margin-top",
												-(imgHeight / 2));
									});

					// Some browsers cache the image, causing the load not to
					// trigger - hence the uniqueid.
					myImg.attr('src', imgsrc + "?random="
							+ hvt.advt.requestUniqueID());

					// Display/hide graphic
					$(".hvtadvt-photoContainer").fadeIn('fast');
					$(".hvtadvt-photoContainer").click( function() {
						$(".hvtadvt-photoContainer").fadeOut('fast');
					});

					return false;
				});
};

// The layout of havertys.com needs a clearfix to get the proper height
hvt.advt.bodyClearFix = function() {
	"use strict";
	var clearDiv = "<div class='hvtadvt-clearFix'>&nbsp;</div>";
	$("body").append(clearDiv);
};

// Used to force the browser not to request a cached item.
hvt.advt.requestUniqueID = function() {
	"use strict";
	var timestamp = Number(new Date()).toString(), random = Math.random()
			* (Math.random() * 100000 * Math.random()), unique = "";
	unique = timestamp + random;
	return unique;
};

// Retrieves GET variables
hvt.advt.gup = function(name) {
	"use strict";
	name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
	var regexS = "[\\?&]" + name + "=([^&#]*)", regex = new RegExp(regexS), results = regex
			.exec(window.location.href);
	if (results === null) {
		return "";
	} else {
		return results[1];
	}
};

// Sets up tabs that have their content/html loaded as it is clicked on (instead
// of displaying/hiding content)
hvt.advt.HTMLtabs = function() {
	"use strict";

	// Sets the css for the selected tab and loads the content.
	$(".tabs #tabnav li").click( function(e) {
		e.preventDefault();
		$(".tabs .tab").hide();
		$(".tabs #tabnav .selected").removeClass('selected');
		$(".tabs .tab h2").removeClass('selected');
		$(this).addClass('selected');

		var index = $("a", this).attr('index');
		$(".tabs .tab[index=" + index + "]").show();

		if (index == 2) {
			accordion = new TINY.accordion.slider('accordion');
			accordion.init('acc1', 'h2', 1, 0, 'selected');
		}
	});

	// If specified in the URL, opens the selected tab. (URL format:
	// http://www.havertys.com/View_findyourstyle/?tab=1)
	// tab uses 1 as the first index, not 0.
	var selectedTab = hvt.advt.gup('tab');

	// Loads the specified tab or the first one if it's not specified.
	if (selectedTab != "" && !isNaN(selectedTab)) {
		$(".tabs #tabnav .selected").removeClass('selected');
		$("#tabnav li a[index='" + selectedTab + "']").addClass('selected');
		$(".tabs .tab[index='" + selectedTab + "']").show();

		// If snippets tab, initialize accordion
		if (selectedTab == 2) {
			accordion = new TINY.accordion.slider('accordion');
			accordion.init('acc1', 'h2', 0, 0, 'selected');
		}
	} else {
		selectedTab = 1;
		$(".tabs #tabnav .selected").removeClass('selected');
		$("#tabnav li a[index='1']").addClass('selected');
		$(".tabs .tab[index='1']").show();
	}
};

hvt.advt.openTab = function(index) {
	// Index starts at 1
	var currentlySelected = $(".tabs #tabnav .selected");
	if (currentlySelected.attr("index") != index) {
		// Hide currently selected tab
		$(".tabs #tabnav .selected").removeClass('selected');
		$(".tabs .tab[index='" + currentlySelected.attr('index') + "']").hide();

		// Show requested tab
		$("#tabnav li a[index='" + index + "']").addClass('selected');
		$(".tabs .tab[index='" + index + "']").show();
	}
};

hvt.advt.scrollToAnchor = function() {
	// Function provided by:
	// http://beski.wordpress.com/2009/04/21/scroll-effect-with-local-anchors-jquery/
	$('.productPage a[href*="#"]').click( function(event) {
		event.preventDefault();
		var offset = $($(this).attr('href')).offset().top;
		$('html, body').animate( {
			scrollTop : offset
		}, 500);
		location.hash = $(this).attr("href");
	});
};

hvt.advt.displayMoreProductInfo = function() {
	$(".productInfo .description .more").fadeIn("slow");
	$(".productInfo .description .moreLink").remove();
};

hvt.advt.initGallery = function() {
	hvt.advt.initThumbs();
	hvt.advt.initSwatch();
	$("#gallery .photo img").click( function() {
		hvt.advt.zoomImage();
	});

	$("#gallery .zoom img").click( function() {
		hvt.advt.zoomImage();
	});

	hvt.advt.initSliderArrows();
};

hvt.advt.initSliderArrows = function(){
	var thumbsContainer = $("#additional-views-container .thumbsContainer");
	$(".arrow-left").css("opacity", ".5");

	var sliderLength = hvt.advt.getSliderLength();
	if(sliderLength < 428){
		$(".arrow-right").css("opacity", ".5");		
		return;
	}

	$(".arrow-right", thumbsContainer).click(function(){
		var leftMargin = parseInt($(".slider", thumbsContainer).css("margin-left"), 10);
		var itemsInSlider = $(".slider img", thumbsContainer).length;
		
		var sliderLength = hvt.advt.getSliderLength();
		console.log(leftMargin + " " + sliderLength);

		if(hvt.advt.needSlider() && Math.abs(leftMargin)+428 <= sliderLength){
			$(".slider", thumbsContainer).animate({marginLeft:leftMargin-70}, 500);
			$(".arrow-left").css("opacity", "1").removeAttr("disabled");

			if((Math.abs(leftMargin) + 35)+428 >= sliderLength){
				$(this).css("opacity", ".5");
			}
		} else {
			$(this).css("opacity", ".5");
		}
	});

	$(".arrow-left", thumbsContainer).click(function(){
		var leftMargin = parseInt($(".slider", thumbsContainer).css("margin-left"), 10);
		var itemsInSlider = $(".slider img", thumbsContainer).length;
		var sliderLength = hvt.advt.getSliderLength();
		console.log(leftMargin + " " + sliderLength);

		if(hvt.advt.needSlider() && leftMargin<0){
			$(".slider", thumbsContainer).animate({marginLeft:leftMargin+70}, 500);
			$(".arrow-right").css("opacity", "1");

			if((Math.abs(leftMargin)-70) <= 0){
				$(this).css("opacity", ".5");
			}
		} else {
			$(this).css("opacity", ".5");
		}
	});

};

hvt.advt.initThumbs = function() {
	var galleryThumbs = $("#additional-views-container .thumbsContainer .thumbs img");
	galleryThumbs.click( function() {
		var jqObj = $(this);
		hvt.advt.loadImageToGallery(false, jqObj);
		var displayImage = $(this).attr("displayImage");
		$("#gallery .photo img").attr("displayImage", displayImage);
		$("#gallery .zoom img").attr("displayImage", displayImage);

		galleryThumbs.removeClass("selected");
		$(this).addClass("selected");

	}); // end click
};

hvt.advt.initSwatch = function() {
	$("#additional-views-container .altViews .color img").click( function() {
		var jqObj = $(this);
		hvt.advt.loadImageToGallery(true, jqObj);
		var displayImage = $(this).attr("displayImage");
		$("#gallery .photo img").attr("displayImage", displayImage);
		$("#gallery .zoom img").attr("displayImage", displayImage);
	});
};

hvt.advt.needSlider = function(){
	var galleryImages = $("#additional-views-container .thumbsContainer .slider");
	
	var first = $("img:first", galleryImages).offset();
	var last = $("img:last", galleryImages).offset();
	var distance = 0;
	if (last!=undefined) distance = last .left- first.left;
	 
	if( distance > 428)
		return true;
	else
		return false;
   
};

hvt.advt.getSliderLength = function(){
	var galleryImages = $("#additional-views-container .thumbsContainer .slider");
	var first = $("img:first", galleryImages).offset();
	var last = $("img:last", galleryImages).offset();
	var distance = 0;
	if (last!=undefined) distance = last .left- first.left;

	if(distance > 0)
		return distance;
	else
		return -1;
};

hvt.advt.loadImageToGallery = function(isSwatch, jqObj) {
	if (jqObj.attr("displayimage") != undefined) {	
		
		var url = "https://s7d2.scene7.com/is/image/Havertys/"
				+ jqObj.attr("displayimage");
		var clickedSwatch = jqObj;
		$("#gallery .photo img").hide();  // hide until it is loaded and adjusted
		$("#gallery .photo img").attr("src", url + "?op_sharpen=1&wid=550");
		$("#gallery .photo img").show();
		
		if (!isSwatch
				&& ((jqObj.attr("swatchName") != "Room Shot") && (jqObj
						.attr("swatchName") != "Product Shot"))) {
			hvt.advt.updateSwatch(clickedSwatch);
			$("#additional-views-container .altViews .color .swatch").show();
		}
		else if (!isSwatch) {
			$("#additional-views-container .altViews .color .swatch").hide();
		}
	}

};

hvt.advt.maxImageHeight = function(width, height) {
	return Math.floor((height * 960) / width);
};

hvt.advt.maxImageWidth = function(width, height) {
	return Math.floor((width * 490) / height);
};


hvt.advt.updateSwatch = function(jqObj) {
	var swatchName = jqObj.attr("swatchName");
	var swatchSRC = jqObj.attr("src");
	var swatchImg = jqObj.attr("swatchFile");
	var swatchTitle = jqObj.attr("swatchtitle");
	var item = jqObj.attr("displayimage");
    
	if (swatchName != undefined ){ 
		var swatchSRC = jqObj.attr("src");
		var swatchImg = jqObj.attr("swatchFile");
		var swatchTitle = jqObj.attr("swatchtitle");
		var item = jqObj.attr("displayimage");
		var multiSelect = jqObj.attr("multiSelect");
		
		// Assigning to variable to keep from traversing DOM twice.
		var swatch = $("#additional-views-container .altViews .color .swatch");
		$("img", swatch).attr("src", swatchSRC).attr("displayImage", swatchName);
		$(".swatchName", swatch).html(swatchTitle);
	
		// update the Add To Cart selection objects
		if ($('#productFabricSelect_1').length != 0)
		      $('#productFabricSelect_1').val(swatchImg);
		if ($('#productFabricSelect_2').length != 0)
		     $('#productFabricSelect_2').val(swatchImg);	
		
		if ($('#productFinishSelect_1').length != 0)
		      $('#productFinishSelect_1').val(swatchImg);
		if ($('#productFinishSelect_2').length != 0)
		     $('#productFinishSelect_2').val(swatchImg);
		
		if (multiSelect =="true") displayResolutionInformation();  // if it is a multi-select, go through lookup to find the sku and price
		else updateDimensionsPrice(item);
    }

};

hvt.advt.turnOnLightBox = function() {	
	var viewableWidth = $(window).width();
	var viewableHeight = $(window).height();
	var fullHeight = $(document).height();
	var lightBox = "<div id='lightBox'></div>";
	$("body").append(lightBox);
	lightBox = $("#lightBox");
	lightBox.css("position", "absolute");
	lightBox.css("top", "0px");
	lightBox.css("left", "0px");
	lightBox.css("width", viewableWidth + "px");
	lightBox.css("height", fullHeight + "px");
	lightBox.css("z-index", "9999");
	lightBox.fadeIn("slow");
	lightBox.click( function() {		
		lightBox.fadeOut("slow", function() {
			$(this).remove();
		});

		if (hvt.advt.videoOn)
			$("#flvContainer").fadeOut("slow", function() {
				$(this).remove();
			});

		if (hvt.advt.zoomOn)
			$("#zoomContainer").fadeOut("slow", function() {
				$(this).remove();
			});

		if (hvt.advt.emailFriendOn){
			$("#emailToAFriend").fadeOut("slow");
			hvt.advt.resetEmailToAFriend();
		}
		
	});	
	$(document).keyup(function(e){	
		if (e.keyCode == 27) {
			lightBox.fadeOut("slow", function(){$(this).remove();} );

			if(hvt.advt.videoOn)
				$("#flvContainer").fadeOut("slow", function(){$(this).remove();} );
				
			if(hvt.advt.zoomOn)
				$("#zoomContainer").fadeOut("slow", function(){$(this).remove();} );

			if(hvt.advt.emailFriendOn){
				$("#emailToAFriend").fadeOut("slow");
				hvt.advt.resetEmailToAFriend();
			}
		}
	});
	
};

hvt.advt.displayVideo = function(link) {
	temp = link.split('/')[1]
	temp.toLowerCase();
	temp.replace(".gif", ".flv");  // if it is a .gif or a .jpg, replace the extension 
	flvName= temp.replace(".jpg", ".flv");  
	hvt.advt.turnOnLightBox();

	var viewableWidth = $(window).width();
	var viewableHeight = $(window).height();

	var playerYpos = ((viewableHeight / 2) - 166) + $(document).scrollTop();
	var playerXpos = (viewableWidth / 2) - 259;

	var flashObj = '<object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" codebase="http://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=10,0,0,0" width="426" height="240" id="test" align="middle"><param name="allowScriptAccess" value="sameDomain" /><param name="allowFullScreen" value="true" /><param name="movie" value="http://www.havertys.com/wcsstore/Html/Static/hd-player.swf" /><param name="quality" value="high" /><param name="FlashVars" value="videoURL=rtmp://video.havertys.com/vod/'
			+ flvName
			+ '" /><param name="wmode" value="transparent" /><param name="bgcolor" value="#000000" /><embed src="https://www.havertys.com/wcsstore/Html/Static/hd-player.swf" quality="high" wmode="transparent" bgcolor="#000000" width="426" height="240" name="test" align="middle" allowScriptAccess="always" allowFullScreen="true" type="application/x-shockwave-flash" pluginspage="http://www.adobe.com/go/getflashplayer" FlashVars="videoURL=rtmp://video.havertys.com/vod/'
			+ flvName + '" /></object>';
	var flvContainer = "<div id='flvContainer'><div class='closeButton'>&nbsp;</div>"
			+ flashObj + "</div>";
	$("body").append(flvContainer);
	flvContainer = $("#flvContainer");
	flvContainer.css("position", "absolute");
	flvContainer.css("top", playerYpos + "px");
	flvContainer.css("left", playerXpos + "px");
	flvContainer.css("z-index", "10000");
	flvContainer.fadeIn("slow");
	$("#flvContainer .closeButton").click( function() {
		hvt.advt.closeVideo();
	});
	hvt.advt.videoOn = true;
};

hvt.advt.initQuickLook = function() {
	$(".product .imageContainer .quickLook").click( function(e) {
		var offsets = $(this).offset();
		var quickLook = $(".quickLookPopup");
		quickLook.css("top", offsets.top - 180);
		quickLook.css("left", offsets.left - 98);
		quickLook.fadeIn("slow");
		$(".quickLookPopup").mouseleave( function() {
			$(this).fadeOut("slow");
		});

		e.preventDefault();
	})
};

hvt.advt.closeVideo = function() {
	$("#lightBox").fadeOut("slow", function() {
		$(this).remove();
	});
	$("#flvContainer").fadeOut("slow", function() {
		$(this).remove();
	});
};

hvt.advt.closeZoom = function() {	
	$("#lightBox").fadeOut("slow", function() {
		$(this).remove();
	});
	$("#zoomContainer").fadeOut("slow", function() {
		$(this).remove();
	});
};

hvt.advt.closeEmailToAFriend = function() {
	$("#lightBox").fadeOut("slow", function() {
		$(this).remove();
	});
	 
		$("#emailToAFriend").fadeOut("slow");
		hvt.advt.resetEmailToAFriend();
	 
};

hvt.advt.zoomImage = function() {	 
	hvt.advt.turnOnLightBox();
	var imageName = $("#gallery .photo img").attr("displayImage");    
	var viewableWidth = $(window).width();
	var viewableHeight = $(window).height();

	var playerYpos = ((viewableHeight / 2) - 355) + $(document).scrollTop();
	var playerXpos = (viewableWidth / 2) - 435;

	$('#zoomContainer').remove();  // remove any zoomContainers that still exist
	var zoomObj = "<object width='756' height='588' data='https://s7d2.scene7.com/is-viewers/flash/genericzoom.swf?serverUrl=https://s7d2.scene7.com/is/image?company=Havertys&amp;image=Havertys/"
			+ imageName
			+ "&amp;contentRoot=https://s7d2.scene7.com/skins&amp;skin=Havertys/SWFs/Groups/zoomSkinTemplateFG.swf' type='application/x-shockwave-flash'><param value='https://s7d2.scene7.com/is-viewers/flash/genericzoom.swf?serverUrl=https://s7d2.scene7.com/is/image?company=Havertys&amp;image=Havertys/"
			+ imageName
			+ "&amp;contentRoot=https://s7d2.scene7.com/skins&amp;skin=Havertys/SWFs/Groups/zoomSkinTemplateFG.swf' name='movie'><param value='588' name='height'><param value='756' name='width'></object>";
	var zoomContainer = "<div id='zoomContainer'><div class='closeButton'>&nbsp;</div>"
			+ zoomObj + "</div>";
	$("body").append(zoomContainer);
	zoomContainer = $("#zoomContainer");
	zoomContainer.css("position", "absolute");
	if (playerYpos<0)	{playerYpos=0;}
	zoomContainer.css("top", playerYpos + "px");
	zoomContainer.css("left", playerXpos + "px");
	zoomContainer.css("z-index", "10000");
	zoomContainer.fadeIn("slow");

	$("#zoomContainer .closeButton").click( function() {
		hvt.advt.closeZoom();
	});
	hvt.advt.zoomOn = true;
}

hvt.advt.fastenPopup = function(div) {
	var displayStatus = div.style.display;

	if (displayStatus != "block") {
		div.style.display = "block";
		//var closebtn = div.getElementsByClassName("close");		
		//closebtn[0].style.display = "block";
		var temp = "div#"+div.id+" .close";
		$(temp).show();
		
	}

	$(".close", div).click( function(e) {
		e.stopPropagation();
		$(this).hide();
		$(this).parent().hide();
	});
};

hvt.advt.shareOnTwitter = function() {
	// Function provided by Twitter
	window.twttr = window.twttr || {};
	var D = 550, A = 450, C = screen.height, B = screen.width, H = Math
			.round((B / 2) - (D / 2)), G = 0, F = document, E;

	if (C > A) {
		G = Math.round((C / 2) - (A / 2));
	}
	window.twttr.shareWin = window.open('http://twitter.com/share', '', 'left='
			+ H + ',top=' + G + ',width=' + D + ',height=' + A
			+ ',personalbar=0,toolbar=0,scrollbars=1,resizable=1');
	E = F.createElement('script');
	E.src = 'http://platform.twitter.com/bookmarklets/share.js?v=1';
	F.getElementsByTagName('head')[0].appendChild(E);
};

hvt.advt.shareOnFacebook = function() {
	// Function provided by Facebook
	var d = document, f = 'https://www.facebook.com/share', l = d.location, e = encodeURIComponent, p = '.php?src=bm&v=4&i=1326378617&u='
			+ e(l.href) + '&t=' + e(d.title);
	1;

	try {
		if (!/^(.*\.)?facebook\.[^.]*$/.test(l.host))
			throw (0);
		share_internal_bookmarklet(p)
	} catch (z) {
		a = function() {
			if (!window.open(f + 'r' + p, 'sharer',
					'toolbar=0,status=0,resizable=1,width=626,height=436'))
				l.href = f + p
		};

		if (/Firefox/.test(navigator.userAgent)) setTimeout(a, 0);
		else { a()}
	};
};

hvt.advt.displayEmailFriend = function() {
	hvt.advt.turnOnLightBox();
	hvt.advt.emailFriendOn = true;

	var emailFriend = $("#emailToAFriend");
	emailFriend.css("z-index", "10000");

	$("#emailToAFriend").show();
	$("#SendMsgForm").show();
	$("#eMailSendHeader").show();
	
	$("#emailToAFriend .closeButton").click( function() {
		hvt.advt.closeEmailToAFriend();
	});
	if (typeof grecaptcha != "undefined"){
		grecaptcha.reset();
	}
	
};	

hvt.advt.displayRefineLinks = function() {
	var refineBy = $(".refineBy");
	$(".narrowMore", refineBy).hide();
	$(".refineLinks", refineBy).fadeIn("slow");
};

hvt.advt.viewAllConfigurations = function() {
	$(".multiConfig .viewAll").hide();
	$(".multiConfig").css("overflow", "visible");
};


hvt.advt.resetEmailToAFriend = function(){	  
    //$("#eMailSendButton").disabled=false;
    $("#eMailSendButton").removeAttr('disabled');
    $("#eMailSendResult").html("");   
};
