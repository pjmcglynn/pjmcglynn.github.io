$(document).ready(function(){ 

function simple_tooltip(target_items, name) {
	$('.hotspot').each(function(i) {
		var sku = $(this).text();
		var imgSku = "<img class='tooltip-img' src='https://s7d2.scene7.com/is/image/Havertys/" + sku + "?op_sharpen=1&wid=200&hei=130'/>";
		$("body").append("<div class='" + name + "' id='" + name + i + "'><p>" + $(this).attr('title') + "<hr class='line-style'>" + imgSku + "</p></div>");
		var my_tooltip = $("#" + name + i);
		$(this).removeAttr("title").mouseover(function() {
			my_tooltip.addClass('on');
		}).mousemove(function(kmouse) {
			my_tooltip.css({
				left : kmouse.pageX - 15,
				top : kmouse.pageY + 25,
			});
		}).mouseout(function() {
			my_tooltip.removeClass('on');
		});
		
		$(this).focusin(function() {
			var topPos = $(this).offset().top + 20;
			var leftPos = $(this).offset().left + 20;
			my_tooltip.addClass('on').css('top', topPos).css('left', leftPos);
		}).focusout(function() {
			my_tooltip.removeClass('on');
		});
	});
}

simple_tooltip("a", "tooltip");

});