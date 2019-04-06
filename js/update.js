
var selectedWeekday = 1;
var previousSelectedTime = 8;
var previousSelectedBuilding = "";
// Function to update the highlighted building, hour-div and timeslider according to the new time that was set
// (either through moving the time silder or by selecting another div in the calendar)
function update(selectedTime){

    if (!map.tilesloading) {

        document.getElementById("buttonWeekday_"+selectedWeekday).focus();
        selectedTime = getNewSelectedTime(selectedTime) 
        
        // 1. step: Highlight calendar
        var previousSelectedDiv = document.getElementById("hour_" + previousSelectedTime);
        previousSelectedDiv.style.background = '#1F407A';
        var selectedDiv = document.getElementById("hour_" + selectedTime);
        selectedDiv.style.background = '#91056A';
        previousSelectedTime = selectedTime;

        // 2. step: Move timeslider
        document.getElementById("slider").value = selectedTime;
        TimeBubble = document.getElementById('TimeBubble');
        
        pos = (document.getElementById("slider").getBoundingClientRect().left-document.body.getBoundingClientRect().left) + (selectedTime-8)*document.getElementById("slider").clientWidth/12;
        TimeBubble.style.left = pos.toString() + 'px' ;
        TimeBubble.innerText = selectedTime.toString() + ":00";
        
        // 3.step: Highlight building    
        if (calenderData[selectedWeekday] != null){
            highlightBuilding(selectedTime);
        }
    }
}

document.onkeydown = function(event){
    if (event.keyCode == 39){
        update("+1");
    }
    if (event.keyCode == 37){
        update("-1");
    }
}

function getNewSelectedTime(selectedTime) {
    if (selectedTime == "-1"){
        selectedTime = parseInt(previousSelectedTime) - 1;
        if (selectedTime < 8){
            selectedTime = 19;
            weekDay = selectedWeekday - 1;
            if (weekDay < 1){
                weekDay = 5;
            }
            loadWeekday(weekDay);
        }
    }
    else if (selectedTime == "+1"){
        selectedTime = parseInt(previousSelectedTime) + 1;
        if (selectedTime > 19){
            selectedTime = 8;
            weekDay = selectedWeekday + 1;
            if (weekDay > 5){
                weekDay = 1;
            }
            loadWeekday(weekDay);
        }
    }
    else {
        selectedTime = selectedTime;
    }
    return selectedTime;

}

function loadWeekday(weekDay){
    selectedWeekday = weekDay;
    document.getElementById("buttonWeekday_"+selectedWeekday).focus();

    for (i=8; i<20; i++){
        var hourDiv = document.getElementById("hour_" +i+"_text");
        if (calenderData[weekDay] != null){
            if (calenderData[weekDay][i] == null){
                hourDiv.innerText = "";
            }
            else {
                hourDiv.innerText = calenderData[weekDay][i]["LectureName"];
            }
        }
    }
    update(document.getElementById("slider").value);
}

