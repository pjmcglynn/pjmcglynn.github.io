CommonUtilsJS={
	getFormattedSku:function(sku) {
		 return sku = sku.substring(0,1)+"-"+sku.substring(1,5)+"-"+sku.substring(5,9);
	},
		
	formatPrice:function(price) {
		return "$" + parseFloat(price, 10).toFixed(2).replace(/(\d)(?=(\d{3})+\.)/g, "$1,");
	},
	
	isSessionExpired:function(data) {
		var sessionExpired = false;
		if(data.indexOf('"errorCode": "2510"') != -1) {
			sessionExpired = true;
		} else if(data.indexOf('UserTimeoutView.jsp') != -1) {
			sessionExpired = true;
		}
		return sessionExpired;
	},
	
	isCookieInvalid:function(data) {
		return data.indexOf('_ERR_INVALID_COOKIE') != -1;
	},
	
	processInvalidCookie:function(redirectURL) {
		document.cookie = "worksheetId=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
		document.cookie = "cartQuantity=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
		document.cookie = "userName=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
		CommonUtilsJS.redirectToURL(redirectURL);
	},
	
	redirectToURL:function(url) {
		document.location.href = url;
	},
	
	showErrorDialog:function(title, message, callback) {
		$('#errorPopup').html(message);
		$("#errorPopup").dialog({
			title: title,
			modal: true,
			position: {my:'top', at: 'top+30%'},
			width: '500',
			height: '220',
			buttons: {
				Ok: function() {
					$(this).dialog("close");
					if(callback) {
						callback.call();
					}
				}
			}
		});
	},
	
	showMessageDialog:function(title, message, callback) {
		$('#messagePopup').html(message);
		$('#messagePopup').dialog({
			title: title,
			modal: true,
			position: {my:'top', at: 'top+30%'},
			width: '500',
			height: '220',
			buttons: {
				Ok: function() {
					$(this).dialog("close");
					if(callback) {
						callback.call();
					}
				}
			}
		});
	}
}