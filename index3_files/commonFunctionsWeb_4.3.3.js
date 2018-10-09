$(document).ready(function(){ 
		if ($(window).width() < 768) {
			$(".categoryNavWidget.collapsible").attr("aria-expanded","false");
			$(".facetWidget.collapsible").attr("aria-expanded","false");
			if (document.cookie.indexOf("userName") >= 0) {
				//User logged in
				$('.myDesignCenterRollover').css('left', '-130px');
			}
			else{
				//User not logged in
				$('.myDesignCenterRollover').css('left', '-50px');
			}
		} else{
			$(".categoryNavWidget.collapsible").attr("aria-expanded","true");
			$(".facetWidget.collapsible").attr("aria-expanded","true");
			var activeTab = $(".tab-title.active-tab").attr("tabTrigger");
			$(activeTab).show();
		};
		var zipCookieValue = dojo.cookie('zip');
 		if (zipCookieValue != null && zipCookieValue.length > 0){
 			$('#findDesignHelpInput').val(zipCookieValue);
 		}
});

$(document).on("click", ".expandToggleBtn, .headerLabel", function () {
	var expandToggle = $(this).closest('.expandToggle');
	expandToggle.find('.expandContent').slideToggle('fast', function(){
		expandToggle.toggleClass('expanded');
	});
});

$(document).on("click", ".havertysPopup .closeButton", function () {
	$(this).closest('.havertysPopup').hide();
});

$(document).on("click", "*[tabtrigger]", function () {
	var tabTrigger = $(this).attr('tabTrigger');
	if ($(window).width() < 768) {
		$(tabTrigger).animate({left: "-=100%",}, 300, function(){lockBodyScroll();});
		return false;
	}
	else {
		$('.tab-title').removeClass('active-tab');
		$('.tab-title[tabTrigger="'+tabTrigger+'"]').addClass('active-tab');
		$('.tab-content').hide();
		$(tabTrigger).show();
	}
});

$(document).on("click", ".close-tab-btn", function () {
	unlockBodyScroll();
	$(this).closest('.tab-content').animate({left: "+=100%",}, 300);
	return false;
});

$(document).on("click", ".designHelp-Mobile .black-btn", function () {
	$(this).toggleClass('designHelpOpen');
	$(this).parent().find('.designHelpDropdown').slideToggle();
});

//This script toggles the visibility of the facets when you resize the window width
var windowWidth = $(window).width();
$(window).resize(function(){
   if($(this).width() != windowWidth){
	   if ($(window).width() < 768) {
			$(".categoryNavWidget.collapsible").attr("aria-expanded","false");
			$(".facetWidget.collapsible").attr("aria-expanded","false");
		} else{
			$(".categoryNavWidget.collapsible").attr("aria-expanded","true");
			$(".facetWidget.collapsible").attr("aria-expanded","true");
		};
   }
});

function lockBodyScroll(){
	var currentPosition = $(window).scrollTop();
	var currentWidth = $('body').outerWidth();
	$('body').css('margin-top', -currentPosition).css('width', currentWidth).addClass('noScroll').attr('currentPosition', currentPosition);
}

function unlockBodyScroll(){
	var currentPosition = $('body').attr('currentPosition');
	$('body').css('margin-top','').css('width', '').removeClass('noScroll').removeAttr('currentPosition');
	$("html, body").animate({scrollTop: currentPosition}, 0);
}

function displayQuickSignIn() {
	$('#quickSignIn').dialog({
		title: "Sign in",
		modal: true,
		width: '400',
		position: {my: "center center",at: "center center",of: window,collision: "none"},
		dialogClass: 'quickSignIn',
		close: function() {
			$('.quickSignIn').hide();
		}
	});
	QuickSignInCM('QuickSignIn Dialog Displayed');
}

function displayRequestDesignHelpDialog(elementID) {
	$.ajax({
		url: 'DesignHelpPopupCmd',
		dataType: 'html',
		beforeSend: function(jqXHR, settings) {
			cursor_wait();
		},
		error: function(jqXHR, textStatus, errorThrown) {
			CommonUtilsJS.showErrorDialog('Request design help error', 'There was an error while sending your request. Please try again or call 1-888-HAVERTY for assistance.');
		},
		success: function(data) {
			try {
				var errorMsg = $(data).filter('#ERROR_MESSAGE');
				if(errorMsg.length) {
					var errorMessage = errorMsg.html();
					CommonUtilsJS.showErrorDialog('Request design help error', errorMessage);	
				} else {
					CommonFunctionsJS.showRequestDesignHelpDialog(data);
				}
			} catch(err) {
				this.error();
			}
		}, complete: function(jqXHR, textStatus) {
			cursor_clear();
		}
	});
	
	DesignHelpCM(elementID);
}

CommonFunctionsJS = {
	showRequestDesignHelpDialog:function(body){
		$('#requestDesignHelp').html(body);
		$('#requestDesignHelp').dialog({
			title: "Need Design Expertise?",
			modal: true,
			width: '400',
			position: {
				my: "center center",
				at: "center center",
				of: window,
				collision: "none"
			},
			dialogClass: 'requestDesignHelpPopup',
			close: function() {
				$('.requestDesignHelp').hide();
			}
		});
	},
	
	findStores:function(){
		if(CommonFunctionsJS.validateCustomerContact()) {
			GoogleMapJS.loadGoogleMaps();
		}
	},
	
	stepBack:function(){
		formValidationJS.removeAllErrors();
		$('.designHelpQuestion, .fewDetails, #popupFooter .submitLocation').show();
		$('#requestDesignHelp .storeList, #popupFooter .backStep, #popupFooter .contactMe').hide();
	},
	
	validateCustomerContact:function() {
		valid = true;
		$("#firstName").val($("#firstName").val().trim());
		if(!formValidationJS.isFieldValid($("#firstName").val(),'#firstName','#firstName-error', true)) {
			valid = false;
		}
		$("#lastName").val($("#lastName").val().trim());
		if(!formValidationJS.isFieldValid($("#lastName").val(),'#lastName','#lastName-error', true)) {
			valid = false;
		}
		$("#phone").val($("#phone").val().trim());
		$("#phone").val(formValidationJS.formatPhoneNumber($("#phone").val()));
		if(!formValidationJS.isPhoneValid($("#phone").val(),'#phone','#phone-error', true)) {
			valid = false;
		}
		$("#findDesignHelpInput").val($("#findDesignHelpInput").val().trim());
		if(!formValidationJS.isFieldValid($("#findDesignHelpInput").val(),'#findDesignHelpInput','#findDesignHelpInput-error', true)) {
			valid = false;
		}
		return valid;
	},
	
	customerContactSendRequest:function() {
		formValidationJS.removeAllErrors();
		DesignHelpCM('Contact Me');
		var divPcBranch = $('input[name="storeResult"]:checked').val();
		if(divPcBranch) {
			var division = divPcBranch.substring(0,1);
			var profitCenter = divPcBranch.substring(1,4);
			var branch = divPcBranch.substring(4,6);
			CommonFunctionsJS.customerContactRequest(division,profitCenter,branch);
		} else {
			CommonUtilsJS.showErrorDialog('Select a store', 'Please select a store.');
		}
	}, 
	
	customerContactRequest:function(division,profitCenter,branch) {
		var firstName = $("#firstName").val();
		var lastName = $("#lastName").val();
		var phone = $("#phone").val();
		var qstAmt = $("#qstAmt").val();
		var findDesignHelpInput = $("#findDesignHelpInput").val();
		var answers = [];
		for(i = 1; i <= qstAmt; i++) {
			answer = $("#question_"+i).val();
			answers.push(answer);
		}
		
		var params = {
			division: division,
			profitCenter: profitCenter,
			branch: branch,
			firstName: firstName,
			lastName: lastName,
			phone: phone,
			findDesignHelpInput: findDesignHelpInput,
			answers: answers
		};
		
		$.ajax({
			url: 'CustomerContactRequestCmd',
			data: params,
			dataType: 'html',
			beforeSend: function(jqXHR, settings) {
				cursor_wait();
			},
			error: function(jqXHR, textStatus, errorThrown) {
				CommonUtilsJS.showErrorDialog('Send customer contact request error', 'There was an error while sending your request. Please try again or call 1-888-HAVERTY for assistance.');
			},
			success: function(data) {
				try {
					var response = $.parseJSON(data);
					if(response.errorMsg) {
						CommonUtilsJS.showErrorDialog('Send customer contact request error', response.errorMsg);
					} else if(response.updateReturnCode == '0') {
						$('#requestDesignHelp').dialog('close');
						$('#requestDesignHelpSuccess').dialog({
							title: "Thanks for reaching out",
							modal: true,
							width: '400',
							position: {
								my: "center center",
								at: "center center",
								of: window,
								collision: "none"
							},
							dialogClass: 'requestDesignHelpSuccessPopup',
							close: function() {
								$('#requestDesignHelpSuccess').hide();
							}
						});
					} else {
						this.error();
					}
				} catch(err) {
					this.error();
				}
			}, complete: function(jqXHR, textStatus) {
				cursor_clear();
			}
		});
	}
}
