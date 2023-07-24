/*
Open the Suggestions tab and choose a template to get started creating different content types for your pop-up.
To learn more about using Arcade to create pop-up content visit:
https://developers.arcgis.com/arcade/guide/profiles/#popup-element
*/


//Only show populated fields
var displayNames = ['Feature ID', 'Project Name', 'Project Design Year', 'Project Construction Year', 'NACOG TIP ID', 'Funding Source', 'Design Phase Cost', 'Construction Phase Cost', 'Design Phase Local Match', 'Construction Phase Local Match', 'Total Project Cost, All Phases', 'Project Sponsor']
var fieldsArray = ['id', 'name', 'd_year', 'c_year', 'tip_id', 'fund_type', 'd_cost', 'c_cost', 'd_match', 'c_match', 'total_cost', 'sponsor']


var returnString = "<table>"
var projectPhases = "Design & Construction"


// Only show a 'total project cost' attribute if more than one phase is found
var showTotal = true


// Use Expects to indicate required fields
Expects( $feature, 'id', 'name', 'd_year', 'c_year', 'tip_id', 'fund_type', 'd_cost', 'c_cost', 'd_match', 'c_match', 'total_cost', 'sponsor')


// Scan records for specific empty fields indicating whether the project has multiple phases, set flags accordingly
if(isEmpty($feature[fieldsArray[3]])) {
  projectPhases = "Design Only"
  showTotal = false
} else if(isEmpty($feature[fieldsArray[2]])) {
  projectPhases = "Construction Only"
  showTotal = false
}


// Start building our return popup
returnString = returnString + "<tr><td><b>Project Type</b></td><td>" + projectPhases + "<" + TextFormatting.ForwardSlash + "td><" + TextFormatting.ForwardSlash + "tr>";


// Loop through our attributes (skip the first, an internal ID which shouldn't be included)
for (var i = 1; i < 12; i++) {
  if(!isEmpty($feature[fieldsArray[i]])) {
      // Format years (remove comma)
      if(i > 1 && i < 4){
        returnString = returnString + "<tr><td><b>" + displayNames[i] + "</b></td><td>" + Text($feature[fieldsArray[i]],'###') + "<" + TextFormatting.ForwardSlash + "td><" + TextFormatting.ForwardSlash + "tr>";
        continue;
      }
      // Format currency (add dollar sign)
      if(i > 5 && i < 11) {
        returnString = returnString + "<tr><td><b>" + displayNames[i] + "</b></td><td>" + Text($feature[fieldsArray[i]],'$#,###.00') + "<" + TextFormatting.ForwardSlash + "td><" + TextFormatting.ForwardSlash + "tr>";
        continue;
      }


      // Skip appending the project total if there is only one project phase
      if(i == 10 && !showTotal){continue;}


    // Append line to the popup if the field is populated and the value is formatted how we want it
    returnString = returnString + "<tr><td><b>" + displayNames[i] + "</b></td><td>" + $feature[fieldsArray[i]] + "<" + TextFormatting.ForwardSlash + "td><" + TextFormatting.ForwardSlash + "tr>";
  }
}


// Finish formatting the popup
returnString = returnString + "<" + TextFormatting.ForwardSlash + "table>";


// Return the popup
return {
  type : 'text',
    text : returnString
}



