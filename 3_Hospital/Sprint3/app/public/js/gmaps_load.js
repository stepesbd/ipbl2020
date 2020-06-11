// main.js
function loadGoogleMapsApi(){
	if(typeof google === "undefined"){
		var script = document.createElement("script");
		script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAHa1KVp_6wozWWyXGKxIHpfScYuNhqaoU&callback=initMap";
		document.getElementsByTagName("head")[0].appendChild(script);
	} else {
		loadGoogleMapsApiReady();
	}
}
function loadGoogleMapsApiReady(){
	$("body").trigger("gmap_loaded");
}

// other.js
$("body").bind("gmap_loaded", function(){
	alert("Google map is loaded and ready to be used!");
});
loadGoogleMapsApi();