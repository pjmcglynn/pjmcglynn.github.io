function cursor_wait(message) {
	if(message) {
		var msgContainer = '<div id="progress_bar_message">' + message + '</div>';
		$('#progress_bar_dialog_animation').addClass('progress_bar_dialog_animation_with_message');
		$('#progress_bar_dialog_animation').append(msgContainer);
	}
	$('#progress_bar_dialog').show();
}

function cursor_clear() {	
	requestSubmitted = false;
	$('.progress_bar_dialog').hide();
	$('#progress_bar_dialog_animation').removeClass('progress_bar_dialog_animation_with_message');
	$('#progress_bar_message').remove();
}