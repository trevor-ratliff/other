/*
find the angle of the hands on a clock (in respect to each other) then find what
time that angle is the same between 2 different cities (Richmond VA - San Fran)

the solution for Richmond VA - Chicago IL is: 12:30, 6:30
*/
var hourAngles = [];
var minAngles = [];

// everything is in minutes so we'll express the difference in minutes as well
//var timeHourDiff = -1;
var timeMinDiff = -60;	

for (let ii = 0; ii < 360; ii += (360/(12 * 60))) {
  hourAngles.push(ii);
}

for (let ii = 0; ii < 360; ii += (360/60)) {
  minAngles.push(ii);
}

// loop through hours then minutes
/*for (let ii = 12; ii < 24; ii++) {
  for (let nn = 0; nn < 60; nn++) {
    var hourOffset = (nn + timeMinDiff) > 60 ? 1 : 0;
    var hourUnderset = (nn - timeMinDiff) < 0 ? -1 : 0;
    var mainSite = findAngle(ii % 12, nn);
    var siteMinus = findAngle (((ii - timeHourDiff - hourUnderset) % 12),
      ((nn - timeMinDiff) % 60));
    var sitePlus = findAngle (((ii + timeHourDiff + hourOffset) % 12),
      ((nn + timeMinDiff) % 60));

    var currHour = (ii) % 12;
    if (currHour === 0) currHour = 12;
    var currMin = (nn) % 60;
    if (mainSite == sitePlus || (360 - mainSite) == sitePlus)
      console.log(`${currHour}:${(currMin < 10 ? '0' + currMin : currMin)} - mainSite: ${mainSite}(${(360-mainSite)}) - siteMinus: ${siteMinus}, sitePlus: ${sitePlus}`);
  }
}*/

// loop through as minutes
for (let min = 0; min < 720; min++) {
  let strHr = Math.floor(min/60).toString();
  if (strHr === "0") strHr = "12";
  
  let currMin = min % 60;
  let strMin = currMin < 10 ? '0' + currMin.toString() : currMin.toString();

  let minPlusAdjust = min + timeMinDiff;
  if (minPlusAdjust < 0) minPlusAdjust += 720;

  let minMinusAdjust = min - timeMinDiff;
  if (minMinusAdjust > 720) minMinusAdjust -= 720;

  var mainSite = findAngle(min, min %60);
  var sitePlus = findAngle((minPlusAdjust) % 720, min % 60);
  var siteMinus = findAngle((minMinusAdjust) % 720, min % 60);

  if ((mainSite === sitePlus || (360 - mainSite) === sitePlus))// || (mainSite === siteMinus || (360 - mainSite) === siteMinus)) 
    console.log(`${strHr}:${strMin} - mainSite: ${mainSite} - sitePlus: ${sitePlus} - siteMinus = ${siteMinus}`);
}

function findAngle(hour, min) {
  return Math.abs(hourAngles[hour] - minAngles[min]);
}
