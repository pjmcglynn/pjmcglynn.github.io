if(!self.MicroD) {self.MicroD = {};};

var callbacktriggered = false;

MicroD.zipCodeTest = function(zipCode, groupId, partNum, callbackFunction) {
               	
	var params = {
		"isMicroD" : "zipcode_test",
	    "altdel" : "N",
		"zipCode" : zipCode,
		"partNumber" : partNum,
		"groupId" : groupId,
		"memberId" : "*storeOwner",
		"storeId" : "10001",
		"langId" : "-1",
		"orderId" : ".",
		"catalogId" : "10051",
		"URL" : "HVTWorksheetAddCmd",
		"errorViewName" : "",
		"quantity" : "1",
		"djcall" : "Y"
	}

	$.ajax({
		url: 'HVTWorksheetAddCmd',
		data: params,
		dataType: 'html',
		beforeSend: function(jqXHR, settings) {
			cursor_wait();
		},
		error: function(jqXHR, textStatus, errorThrown){
			CommonUtilsJS.showErrorDialog('Add to Cart Error','An error occurred attempting to add an item to the cart.');
		},
		success: function(data) {
			try {
				if(CommonUtilsJS.isSessionExpired(data)) {
					CommonUtilsJS.redirectToURL(ProductCard_UI.TIMEOUT_URL);
					return;
				}
				var errorMsg = $(data).filter('#CHECKOUTERROR');
				if(errorMsg.length) {
					var checkoutError = errorMsg.html();
					var errorMsgJSON = $.parseJSON(checkoutError);
					CommonUtilsJS.showErrorDialog('Add to Cart Error', errorMsgJSON.errorMsg);	
				} else {
					callbackFunction();
				}
			} catch(err) {
				console.log(err);
				this.error();
			}
		},
		complete: function(jqXHR, textStatus) {
			cursor_clear();
		}
	});
};

MicroD.changeZip = function() {
	var callbackFunction = function(newzip){
		if (newzip) zipCode = newzip.replace(/^\s+|\s+$/g, '') ;							
		dojo.cookie('zip', zipCode, {path: '/', expires: 30});															
	};
	
	productDisplayJS.zipCodePopUp(callbackFunction, null);	
};


MicroD.zipTestPopup = function(dlgBody) {
	$('#zipCodeTestPopup').html(dlgBody);
	$('#zipCodeTestPopup').dialog({
		title: "Shopping Cart",
		modal: true,
		width: '500',
		height: '220',
		close: function() {					
			$('#zipCodeTestPopup').dialog("close");
		}
	});
};

MicroD.zipTest = function(catalogId, sessionID, zipCode, groupIdProductId, partNum, repItemPrice, microDUrl) {
	var callbackFunction = function(){
		MicroD.load(catalogId, sessionID, groupIdProductId[0], groupIdProductId[1], 1425, partNum, repItemPrice, microDUrl);
	}
	MicroD.zipCodeTest(zipCode, groupIdProductId[0], partNum, callbackFunction);
};

MicroD.loadSpecialOrderMicroD = function(catalogId, sessionID, partNumber, collection, productDescription, repItemSku, repItemPrice, microDUrl) {
	repItemSku = productDisplayJS.getFormattedSku(repItemSku);
	cursor_wait();
	// check for the zip code cookie
	var zipCode = dojo.cookie('zip');
	var groupIdProductId = partNumber.split("-"); 
	var repItemSkuNumOnly = repItemSku.split("-"); 
	
	if (zipCode == null || zipCode == '') {
		var callbackFunction = function(newzip){
			dojo.cookie('zip', newzip.replace(/^\s+|\s+$/g, ''), {path: '/', expires: 30});
			MicroD.zipTest(catalogId, sessionID, newzip, groupIdProductId, repItemSkuNumOnly[0]+repItemSkuNumOnly[1]+repItemSkuNumOnly[2], repItemPrice, microDUrl);
		};
		cursor_clear();
		productDisplayJS.zipCodePopUp(callbackFunction, null);
	} else	{
		MicroD.zipTest(catalogId, sessionID, zipCode, groupIdProductId, repItemSkuNumOnly[0]+repItemSkuNumOnly[1]+repItemSkuNumOnly[2], repItemPrice, microDUrl);
	} 
};	
	
MicroD.load = function(catalogId, userId, groupId, productId, catalogCode, repItemSku, repItemPrice, microDUrl) {

			//$('#microDPopup').dialog('destroy');
			$('#microDPopup').html('');

			cmCreatePageviewTag('CALLED MICROD', 'NEW SPECIAL ORDER CONFIGURATOR');
			
			var callerUniqueID = "W"+"109101"+userId+"|" + new Date().getTime();  	//S104804rbrace|1404152118372
			var microDVisualizationUrl = "/Redirect.aspx?action=FabricsInfo&Catalog="+catalogId+"&SKU=" + groupId +"-"+productId+ "&EmailAFriend=0&RugImage=&CallerUniqueID=" + callerUniqueID + dojo.byId('optionsSelected').value;
			callbacktriggered = false;
			//document.domain = 'havertys.com';
			//////////////////////////////////////////
			$('#microDPopup').append(					
					'<iframe id="microD_iframe_id" src="'+ microDUrl + microDVisualizationUrl + '" frameBorder="0" scrolling = "no" width="1040" height="1200" onload="MicroD.callbackAfterIFrameIsLoaded();"/>' +
					'<div id="microD_url" style="font-size:0.625rem; color:white">'+microDVisualizationUrl+'</div> '
			).dialog({
				modal:true,
				draggable: true,
				autoOpen: false,
				position: {
					my: "center center",
					at: "center center",
					of: window,
					collision: "none"
				},
				title:'Customize Me',
				resizable: true,
				width: "1040",
				height: "auto",
				dialogClass:"microD",
				overlay:{ opacity: 0.1, background: '#000000'},
				open : function() { },
				close: function() {
					if(productDisplayJS.microdCartAdded) {
						productDisplayJS.ajaxAdd2Cart2(repItemSku, 1, repItemPrice, userId);
						productDisplayJS.microdCartAdded = false;
						cmCreatePageviewTag('ADDED MICROD', 'NEW SPECIAL ORDER CONFIGURATOR');
					}
					$('#microDPopup').dialog('close');
				}
			});		
			cursor_clear();
			$("#zoom_icon").css("display","none");
			$('#microDPopup').dialog('open');
			$('html, body').animate({
		        scrollTop: $(".microD.ui-dialog").offset().top
		    }, 100);
			
};

MicroD.callbackAfterIFrameIsLoaded = function() {	
	// $('#microDPopup').height(1000); Set the height to 1000 
	
};

CloseMicroDPopup = function(optionsMap) {
	productDisplayJS.microdCartAdded = true;
	$('#microDPopup').dialog('close');
};

