var calenderData = {};

// Load the calender data into the divs
function importCalendar(name){

    calenderData = {};
    if (name == "Daniel") {
        myStudies = calendarMaster1Sem;
    }
    else if (name == "Miriam") {
        myStudies  = calendarBachelor1Sem;
    }
        
    var data = myStudies.VCALENDAR[0].VEVENT;
    for (day=1; day<6; day++){
        calenderData[day] = {};
    }
    for (lecture = 0; lecture < data.length; lecture++) {
        dateStart = new Date(data[lecture].DTSTART.substring(0,4), parseInt(data[lecture].DTSTART.substring(4,6))-1, data[lecture].DTSTART.substring(6,8),data[lecture].DTSTART.substring(9,11),data[lecture].DTSTART.substring(11,13),0,0);
        dateEnd = new Date(data[lecture].DTEND.substring(0,4), parseInt(data[lecture].DTEND.substring(4,6))-1, data[lecture].DTEND.substring(6,8),data[lecture].DTEND.substring(9,11),data[lecture].DTEND.substring(11,13),0,0);
        day = dateStart.getDay();
        hourStart = dateStart.getHours() + Math.floor(dateStart.getMinutes()/31); // Round up all minutes more than 30
        hourEnd = dateEnd.getHours() - 1 + Math.floor(dateEnd.getMinutes()/30);

        for (i = hourStart; i < hourEnd+1; i++){
            var summary = data[lecture].SUMMARY;
            var description = data[lecture].DESCRIPTION;
            calenderData[day][i] = {};
            
            // Set each hour key to the buildingName value
            calenderData[day][i]["BuildName"] = data[lecture].LOCATION.substring(0,3).replace(/\s+/g,"");
            calenderData[day][i]["RoomName"] = data[lecture].LOCATION.substring(3);
            calenderData[day][i]["LectureName"] = summary.substring(0,summary.search('\\('));
            calenderData[day][i]["ProfName"] = summary.substring(summary.search('\\)')+1);
            if (dateStart.getMinutes() == 0) {
                minutes = "00";
            }
            else {
                minutes = dateStart.getMinutes();
            }
            calenderData[day][i]["StartTime"] = dateStart.getHours() + ':'+ minutes;
            if (dateEnd.getMinutes() == 0) {
                minutes = "00";
            }
            else {
                minutes = dateEnd.getMinutes();
            }
            calenderData[day][i]["EndTime"] = dateEnd.getHours() + ':'+ minutes;
            if (description.search("http") != -1) {
                calenderData[day][i]["Link"] = description.substring(description.search("http"));
            } 
        }
    }
    loadWeekday(selectedWeekday);
};
