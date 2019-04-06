var map;
var popup;
var popupBuilding;
var hasPopUp = false;
var boundsHoengg;
var boundsZentrum;
var building_layers = {};
var lastValidCenter

function initMap() {
	
	var styledMapType = new google.maps.StyledMapType(GoogleMapsStyle)
	
	
	map = new google.maps.Map(document.getElementById('map'), {
          //center: {lat: 47.4085, lng: 8.508},
          //zoom: 17,
          draggable: false,
          minZoom: 16,
          maxZoom: 17,
          fullscreenControl: false,
          mapTypeControl: false,
		  streetViewControl: false,
		  mapTypeControlOptions: {
            mapTypeIds: ['styled_map']
		  }
        });

    // Define bounding box of the map extend
    boundsHoengg = new google.maps.LatLngBounds(
        new google.maps.LatLng(47.40706622, 8.50244751),
        new google.maps.LatLng(47.40962208, 8.51147513)
    );
    boundsZentrum = new google.maps.LatLngBounds(
        new google.maps.LatLng(47.3742982608617, 8.53935066625299),
        new google.maps.LatLng(47.383575587554,8.55891295286814)
    );
    map.fitBounds(boundsHoengg);  

    lastValidCenter = map.getCenter();
    google.maps.event.addListener(map, 'center_changed', function() {
        if (map.getZoom() == 17) {
            map.setOptions({draggable: true});
            if (boundsHoengg.contains(map.getCenter()) || boundsZentrum.contains(map.getCenter())) {
                // still within valid bounds, so save the last valid position
                lastValidCenter = map.getCenter();
                return; 
            }
    
            // not valid anymore => return to last valid position
            map.panTo(lastValidCenter);
        }
        else {
            map.setOptions({draggable: false});
        }
        
    });
  
	//Associate the styled map with the MapTypeId and set it to display.
	map.mapTypes.set('styled_map', styledMapType);
    map.setMapTypeId('styled_map');
	
	// Load Vector Data
	var forest_layer = new google.maps.Data({map:map});
	forest_layer.addGeoJson(forest);
	forest_layer.setStyle({fillColor: 'green', strokeWeight: 0});
    
    
    for (j in buildings.features) {
        var name = buildings.features[j].properties.BuildName;
        building_layers[name] = {};
        building_layers[name]["feature"] = new google.maps.Data({map:map});
        building_layers[name]["feature"].addGeoJson(buildings.features[j]);
        //building_layer.addGeoJson(zentrum.features[41]);
        building_layers[name]["feature"].setStyle({fillColor: '#91056A', strokeWeight: 0});
        building_layers[name]["campus"] = buildings.features[j].properties.campus;
        building_layers[name]["centerLat"] = buildings.features[j].properties.centerLong;
        building_layers[name]["centerLong"] = buildings.features[j].properties.centerLat;
    }

    for (j in zentrum.features) {
        var name = zentrum.features[j].properties.BuildName;
        building_layers[name] = {};
        building_layers[name]["feature"] = new google.maps.Data({map:map});
        building_layers[name]["feature"].addGeoJson(zentrum.features[j]);
        //building_layer.addGeoJson(zentrum.features[41]);
        building_layers[name]["feature"].setStyle({fillColor: '#91056A', strokeWeight: 0});
        building_layers[name]["campus"] = zentrum.features[j].properties.campus;
        building_layers[name]["centerLat"] = zentrum.features[j].properties.centerLong;
        building_layers[name]["centerLong"] = zentrum.features[j].properties.centerLat;
    }
    
	//For point data: icon: 'path' title: 'lala' 

    for (var i in building_layers) {
    
        //use a 'mouseover' event listener to change the style of the feature
        building_layers[i]["feature"].addListener('mouseover', function(event) {
            popupBuilding = new google.maps.InfoWindow(
            {	content:event.feature.getProperty("BuildName"),
                position:new google.maps.LatLng({lat:event.feature.getProperty("centerLong"),lng: event.feature.getProperty("centerLat")})
                });
                popupBuilding.open(map);
    
            building_layers[i]["feature"].overrideStyle(event.feature , {fillOpacity: 1});
        });
        

        //use a 'mouseout' event listener to come back to the previous style
        building_layers[i]["feature"].addListener('mouseout', function(event) {
            popupBuilding.setMap(null);
        building_layers[i]["feature"].revertStyle();
        
        });
    }
    
    /*
    //use a 'click' event listener to show information when polygon is clicked
    building_layer.addListener('click', function(event){
        mapPolygonSelected(event);

    })
    */

   var centerControlDiv = document.createElement('div');
   var centerControl = new CenterControl(centerControlDiv, map);

   centerControlDiv.index = 1;
   map.controls[google.maps.ControlPosition.TOP_RIGHT].push(centerControlDiv); 
    
}

var campusShown = "hoengg";
function CenterControl(controlDiv, map) {

    // Set CSS for the control border.
    var controlUI = document.createElement('div');
    controlUI.style.backgroundColor = '#91056A80';
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginRight = '22px';
    controlUI.style.textAlign = 'center';
    controlUI.title = 'Click to change the map of the campus';
    controlDiv.appendChild(controlUI);

    // Set CSS for the control interior.
    var controlText = document.createElement('div');
    controlText.style.fontFamily = 'Roboto,Arial,sans-serif';
    controlUI.style.color = '#ffffff';
    controlText.style.fontSize = '16px';
    controlText.style.lineHeight = '38px';
    controlText.style.paddingLeft = '5px';
    controlText.style.paddingRight = '5px';
    controlText.innerHTML = 'Change Campus';
    controlUI.appendChild(controlText);

    // Setup the click event listeners: simply set the map to Chicago.
    controlUI.addEventListener('mouseover', function(){
        controlUI.style.backgroundColor = '#91056A';
    })
    controlUI.addEventListener('mouseout', function(){
        controlUI.style.backgroundColor = '#91056A80';
    })
    
    controlUI.addEventListener('click', function() {
        
        if (!map.tilesloading){
        
        if (campusShown == "hoengg") {
            map.fitBounds(boundsZentrum);
            campusShown = "zentrum";
        }
        else {
            map.fitBounds(boundsHoengg);
            campusShown = "hoengg";
        }
    }
    });

    google.maps.event.trigger(map, 'resize');

  }

function highlightBuilding(selectedTime){
    if (hasPopUp){
        popup.setMap(null);
        hasPopUp = false;
    } 
    if (calenderData[selectedWeekday][selectedTime] != null) {
        selectedBuildName = calenderData[selectedWeekday][selectedTime]["BuildName"]; 
    }
    else {
        selectedBuildName = "";
    }
    
    if (previousSelectedBuilding != "") {
        building_layers[previousSelectedBuilding]["feature"].setStyle({fillOpacity: 0.3, fillColor:'#91056A', strokeWeight: 0});
    }
    
    previousSelectedBuilding = selectedBuildName;
    
    if (selectedBuildName != "") {

        building_layers[selectedBuildName]["feature"].setStyle({fillOpacity: 1, fillColor:'#91056A', strokeWeight: 0});

        if (building_layers[selectedBuildName]["campus"] == "hoengg"){
            map.fitBounds(boundsHoengg); 
            campus = "zentrum";
        }
        else {
            map.fitBounds(boundsZentrum); 
            campus = "hoengg";
        }

        var contentString = "<b>" + calenderData[selectedWeekday][selectedTime]["LectureName"] + "</b>" + "<br>"+ 
                            "Building: "  + calenderData[selectedWeekday][selectedTime]["BuildName"]+ "<br>"+  
                            "Room: " + calenderData[selectedWeekday][selectedTime]["RoomName"]+ "<br>"+
                            "Time: " + calenderData[selectedWeekday][selectedTime]["StartTime"]+ " - " + calenderData[selectedWeekday][selectedTime]["EndTime"]+ "<br>"+  
                            "Professor: " + calenderData[selectedWeekday][selectedTime]["ProfName"];
        if (calenderData[selectedWeekday][selectedTime]["Link"] != null)
        { 
            contentString = contentString + "<br>" + 
                            '<a target = "_blank" href = "' + calenderData[selectedWeekday][selectedTime]["Link"]+ '">Link to Website</a></br>';
        }
        popup = new google.maps.InfoWindow(
            {	content:contentString,
                position:new google.maps.LatLng({lat:building_layers[selectedBuildName]["centerLat"],lng: building_layers[selectedBuildName]["centerLong"]})
                });
        popup.open(map);
        hasPopUp = true;

    }
}


