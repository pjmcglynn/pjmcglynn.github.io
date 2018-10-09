$(document).ready(function () {
	$("a[href^='/furniture']").each(function(){
		var PreviewPath = "/webapp/wcs/preview/servlet";
		var ToolKitPath = "/webapp/wcs/stores/servlet";
		var originalHREF = $(this).attr('href');
		if(window.location.href.indexOf(PreviewPath) > -1) {
			$(this).attr('href',PreviewPath+originalHREF);
	    }
		else if(window.location.href.indexOf(ToolKitPath) > -1) {
			$(this).attr('href',ToolKitPath+originalHREF);
		}
	});
});