<!-- This script controls the tabs -->

if(!self.ProductTabs){self.ProductTabs={};}

var productName = $('#product-display-name').html();

function showDetailsPopup(event){
	cmCreateElementTag(productName, "Options Details");
}

function showMapPopup(){
	cmCreateElementTag(productName, "Find In Store Details Map");
}

function seeMoreInCollection(){
	$('.more-in-collection').slideDown();
	$('.see-more-in-collection').hide();
	$('.see-less-in-collection').show();
}

function seeLessInCollection(){
	$('.more-in-collection').slideUp();
	$('.see-more-in-collection').show();
	$('.see-less-in-collection').hide();
	$('html, body').animate({
		scrollTop: $('#product-tabs').offset().top - 30
	}, 500);
	return false;
}

function isInteger(sText){
	var ValidChars = "0123456789";
	var IsNumber=true;
	var Char;
	for (i = 0; i < sText.length && IsNumber == true; i++) 
	{
		Char = sText.charAt(i); 
		if (ValidChars.indexOf(Char) == -1) 
		{
			IsNumber = false;
		}
	}
	return IsNumber;
}

function zipCodeRequiredMessageOn(zipCodeRequiredDIV, invalidZipCodeDIV, inavlidZipFromServiceDIV){
		dojo.byId(zipCodeRequiredDIV).innerHTML = "Zip code is required. Please try again.";
		invalidZipcodeMessageOff(invalidZipCodeDIV);
		$('#' + inavlidZipFromServiceDIV).hide();
}

function zipCodeRequiredMessageOff(zipCodeRequiredDIV){
	dojo.byId(zipCodeRequiredDIV).innerHTML = "";
}

function invalidZipcodeMessageOn(zipCodeRequiredDIV, invalidZipCodeDIV, inavlidZipFromServiceDIV){
	dojo.byId(invalidZipCodeDIV).innerHTML = "Invalid zip code entered. Please try again.";
	zipCodeRequiredMessageOff(zipCodeRequiredDIV);
	$('#' + inavlidZipFromServiceDIV).hide();
}

function invalidZipcodeMessageOff(invalidZipCodeDIV){
	dojo.byId(invalidZipCodeDIV).innerHTML ="";
}

function emptyZipHandler(eventObj, zipID){
	var zipID = '#' + zipID;
	var zip = $(zipID).val();
	var message = "Enter zip code";
	if (eventObj.type == 'click') {
		if (zip == message) {
			$(zipID).val("");
		}
	} else if (eventObj.type == 'blur') {
		if (zip == "") {
			$(zipID).val(message);
		}		
	}
}

function validateZip(eventObj, findInStoremap, zipID, zipCodeRequiredDIV, invalidZipCodeDIV, inavlidZipFromServiceDIV){
	var zip = $('#' + zipID).val().substring(0,5);
	if(eventObj.keyCode == 13 || eventObj.type == 'click'){
		if(zip == "" || zip == "Enter" ){
			$('#' + zipID).val("");
			zipCodeRequiredMessageOn(zipCodeRequiredDIV, invalidZipCodeDIV, inavlidZipFromServiceDIV);
			return;
		}
		if ( !isInteger(zip) || zip.length != 5){
			invalidZipcodeMessageOn(zipCodeRequiredDIV, invalidZipCodeDIV, inavlidZipFromServiceDIV);
			return;
			
		}
		if(zipID == "whereZipFindInStore"){
			findInStoremap["radii"] = $("#whereDistance").val();
			dojo.cookie("radii",$("#whereDistance").val(),{expires:30, path:"/"});
		}
		//dojo.cookie("zip", {expires: -1});
		if (zip) zip = zip.replace(/^\s+|\s+$/g, '') ; 
		dojo.cookie("zip", zip, {expires:30, path:"/"});
		invalidZipcodeMessageOff(invalidZipCodeDIV);
		findInStoremap["zip"] = zip;
		refreshContext(findInStoremap, zipID);
		if (zipID == "whereZipFindInStore"){
			refreshContext(findInStoremap, 'whereZipAvailability');
		}
		else refreshContext(findInStoremap, 'whereZipFindInStore');
	}
}
	
wc.render.declareContext("AvailabilityTabContext",{urlRequestType:"", catalogId:"", productId:"", 
	urlLangId:"-1", langId:"-1", storeId:"", catEntryIds:"", deliverydateforeachitemZipCode:""},"");

wc.render.declareRefreshController({
	  id: "AvailabilityTabController",
	  renderContext: wc.render.getContextById("AvailabilityTabContext"),
	  url: "DeliveryAvailabilityCmd",
	  formId: "",

	modelChangedHandler: function(message, widget) {
	  },

	renderContextChangedHandler: function(message, widget) {
		var controller = this;
		var renderContext = this.renderContext;
		widget.refresh(renderContext.properties);
	  },

	postRefreshHandler: function(widget) {
		cursor_clear();
		$("#whereZipAvailability").val(dojo.cookie("zip"));
		seeLessInCollection();
	  }

	});

wc.render.declareContext("FindInStoreResultsContext",{urlRequestType:"", catalogId:"", productId:"", 
	urlLangId:"-1", langId:"-1", storeId:"", partNumbers:"", radii:"", storesForItemsZipCode:""},"");

wc.render.declareRefreshController({
	  id: "FindInStoreResultsController",
	  renderContext: wc.render.getContextById("FindInStoreResultsContext"),
	  url: "StoresForItemsCmd",
	  formId: "",

	modelChangedHandler: function(message, widget) {
	  },

	renderContextChangedHandler: function(message, widget) {
		var controller = this;
		var renderContext = this.renderContext;
		widget.refresh(renderContext.properties);
	  },

	postRefreshHandler: function(widget) {
		$("#whereDistance").val(dojo.cookie("radii"));
		$("#whereZipFindInStore").val(dojo.cookie("zip"));
	  }

	});

refreshContext = function(findInStoremap, zipID){
	cursor_wait();
	switch (zipID){
		case "whereZipFindInStore":
			wc.render.updateContext("FindInStoreResultsContext",{urlRequestType:"Base", catalogId:findInStoremap["catalogId"], productId:findInStoremap["productId"], 
				urlLangId:"-1", langId:"-1", storeId:findInStoremap["storeId"], partNumbers:findInStoremap["partNumbers"].join(","), radii:findInStoremap["radii"] , storesForItemsZipCode:findInStoremap["zip"]},"");
			break;
		case "whereZipAvailability":
			wc.render.updateContext("AvailabilityTabContext",{urlRequestType:"Base", catalogId:findInStoremap["catalogId"], productId:findInStoremap["productId"], 
				urlLangId:"-1", langId:"-1", storeId:findInStoremap["storeId"], catEntryIds:findInStoremap["catEntryIds"].join(","), deliverydateforeachitemZipCode:findInStoremap["zip"]},"");
		break;
	}
	
};

populateTab = function(zipDIV){
	// map is defined in Java Script section of /Stores/WebContent/Widgets-Havertys/com.havertys.commerce.store.widgets.HVTFindInStore/HVTFindInStore_UI.jsp
	if (! (dojo.cookie("zip")== null || dojo.cookie("zip") == undefined)){
		findInStoremap["zip"] = dojo.cookie("zip"); 
		refreshContext(findInStoremap, zipDIV); 
	}
}

<!-- This script scrolls the window and opens the appropriate tab when a quick link is clicked -->

$(document).ready(function() {
	
	$('#product-tabs li').click(function(event){
		var clickedLink = $(this).attr('id');
		cmCreateElementTag(productName, clickedLink);
		seeLessInCollection();
	});
	
	$('#rating-container').click( function() {
		 $('html, body').animate({
	       scrollTop: $('#reviews-tab').offset().top
	    }, 500);
		 cmCreateElementTag(productName, 'Review Stars');
	});
	
	$('#productDetails').click( function() {
		if ($(window).width() > 767) {
			$('html, body').animate({
				scrollTop: $('#details-benefits-tab').offset().top -30
			}, 500);
		}
		cmCreateElementTag(productName, 'Product Details');
	});
	
	$('#product-benefits .snippet h3').click( function() {
		if ($(window).width() < 768) {
			$(this).closest('.snippet').toggleClass('snippetOpen');
			$(this).siblings('.acc-section').slideToggle(300);
		}
	});
	
	$('.showDetailsPopup').focusin(function(){
		$(this).mouseover();
	}).focusout(function(){
		$(this).mouseout();
	});
	
	if ($('#product-benefits li').length == 0){
		$('#product-benefits').hide();
	}

});