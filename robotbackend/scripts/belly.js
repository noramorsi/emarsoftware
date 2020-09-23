/*
* Belly class for creating the user interface on the robot's belly tablet
*/
function Belly(robotId, scale, resizeAxis) {

  Belly.robotId = robotId;
  Belly.currentScreen = -1;
  Belly.bellyScreens = null;
  Belly.scale = scale;
  Belly.resizeAxis = resizeAxis;

  Belly.updateRobotBelly = function(snapshot) {

    var robotState = snapshot.val();
    var bellyHTML = "";

    let newScreenIndex = robotState.currentBellyScreen;

    // Make sure it is a valid screen index
    if (newScreenIndex != undefined && Belly.bellyScreens != null) {
      
      newScreenIndex = Number(robotState.currentBellyScreen);
      if (newScreenIndex >= 0 && newScreenIndex < Belly.bellyScreens.length) {
      
        // Make sure it is a different screen from the currently displayed one
        if (newScreenIndex != Belly.currentScreen) {
          Belly.currentScreen = newScreenIndex;
          var screen = Belly.bellyScreens[Belly.currentScreen];

          var screenDiv = document.getElementById("screenDiv");
          // Set screen color
          if (screen.backgroundColor) {
            screenDiv.style.backgroundColor = screen.backgroundColor;
          }

          /*********
           Text instructions
          *********/
          if (screen.instructionLarge.isShown) {
            var largeInstruction = screen.instructionLarge.text;
            bellyHTML +=
              "<div class='screen-element instruction-large' style='z-index: 2'>" +
              largeInstruction +
              '</div> ';
          }

          if (screen.instructionSmall.isShown) {
            var smallInstruction = screen.instructionSmall.text;
            bellyHTML +=
              "<div class='screen-element instruction-small' style='z-index: 2'>" +
              smallInstruction +
              '</div>';
          }
          
          /*********
           Images
          *********/
          if (screen.images) {
            screen.images.forEach((element) => {
              var position = '';
              if (element.location.position && element.location.position === 'absolute') {
                position += 'position: absolute;';
                if (element.location.top !== undefined) {
                  position += 'top: ' + element.location.top + '; ';
                }
                if (element.location.bottom !== undefined) {
                  position += 'bottom: ' + element.location.bottom + '; ';
                }
                if (element.location.left !== undefined) {
                  position += 'left: ' + element.location.left + '; ';
                }
                if (element.location.right !== undefined) {
                  position += 'right: ' + element.location.right + '; ';
                }
              } else {
                position += 'position: relative;';
              }
              position += "'";
              bellyHTML +=
                "<img src='" +
                element.path +
                "' style='border: none; " + position +
                "width='" +
                element.size.x +
                "' height='" +
                element.size.y +
                "'/>";
            });
          }

          /*********
           Slider
          *********/
          if (screen.slider.isShown) {
            var sliderMin = screen.slider.min;
            var sliderCurrent = screen.slider.current;
            var sliderMax = screen.slider.max;
            bellyHTML += "<div class='screen-element mt-4'  style='z-index: 2'>";
            bellyHTML +=
              "<div class='min-value screen-item'  style='z-index: 2'>" +
              sliderMin +
              '</div>';
            bellyHTML +=
              "<input type='range' class='screen-slider' name='slider'" +
              " onchange='Belly.bellyInputReceived(this, " +
              Belly.currentScreen +
              ")'" +
              " value='" +
              sliderCurrent +
              "' min='0' max='100'>";
            bellyHTML +=
              "<div class='max-value screen-item'>" + sliderMax + '</div>';
            bellyHTML += '</div>';
          }

          /*********
           Checkboxes
          *********/
          if (screen.checkboxes.isShown) {
            bellyHTML += "<div class='d-flex justify-content-center flex-wrap screen-element mt-4' >";
            if (screen.checkboxes.names != undefined) {
              for (var j = 0; j < screen.checkboxes.names.length; j++) {
                var name = screen.checkboxes.names[j];
                bellyHTML +=
                  "<div class='deletable-button mr-2 border border-light screen-item' >";
                bellyHTML +=
                  "<div  style='z-index: 2'><input type='checkbox'  style='z-index: 2'name='checkbox' " +
                  "onchange='Belly.bellyInputReceived(this," +
                  Belly.currentScreen +
                  ',' +
                  j +
                  ")'>" +
                  name +
                  '</div>';
                bellyHTML += '</div>';
              }
            }
            bellyHTML += '</div>';
          }

          /*********
           Text input field
          *********/
          if (screen.textInput && screen.textInput.isShown === 1) {
            bellyHTML += "<div class='screen-element mt-4 style='z-index: 2'>";
            bellyHTML += '<textarea name="textinput" rows="4" cols="50"';
            bellyHTML += ' placeholder="' + screen.textInput.text + '"';
            bellyHTML += '></textarea>';
            bellyHTML += '</div>';
          }

          /*********
           Buttons
          *********/
          if (screen.buttons.isShown) {

            bellyHTML += "<div class='d-flex justify-content-center flex-wrap screen-element mt-4'  style='z-index: 2'>";
            
            if (screen.buttons.list != undefined) {
              for (var j = 0; j < screen.buttons.list.length; j++) {
                var name = screen.buttons.list[j].name;
                
                // Buttons with images
                if (screen.buttons.list[j].url) {
                  var url = screen.buttons.list[j].url;
                  bellyHTML +=
                    "<div style='align-self: start'>" + 
                    "<button class='btn btn-secondary mx-2 screen-item' " +
                    "onclick='Belly.bellyInputReceived(this," +
                    Belly.currentScreen +
                    ',' +
                    j +
                    ")' name='button'>" +
                    '<div><img  src=' +
                    url +
                    " width='80' height='80'/></div>" +
                    name +
                    '</button>';
                  // Buttons with text
                  if (screen.buttons.list[j].label) {
                    bellyHTML += '<h2 style="max-width: 160px">' + screen.buttons.list[j].label + '</h2>';
                  }
                  bellyHTML += '</div>';
                }

                // Buttons that have neither label nor image
                // TODO: Why is .name and .label a different thing?
                if (!screen.buttons.list[j].url && !screen.buttons.list[j].label) {
                  bellyHTML +=
                  "<div class='mt-2'>"+
                  "<button class='btn btn-secondary mx-2 screen-item' " +
                  "onclick='Belly.bellyInputReceived(this," +
                  Belly.currentScreen +
                  ',' +
                  j +
                  ")' name='button'>" +
                  name +
                  '</button></div>';
                }

              }
            }
            bellyHTML += '</div>';

          }

          screenDiv.innerHTML = bellyHTML;

          if (Belly.scale == 'small') {
            var largeInstructionElements = document.getElementsByClassName("instruction-large");
            var smallInstructionElements = document.getElementsByClassName("instruction-small");
            var otherElements = document.getElementsByClassName("screen-item");

            if (Belly.resizeAxis == "width") {
              for (var i=0; i<largeInstructionElements.length; i++)
                largeInstructionElements[i].style.fontSize = '3vw';
              for (var i=0; i<smallInstructionElements.length; i++)
                smallInstructionElements[i].style.fontSize = '2vw';
              for (var i=0; i<otherElements.length; i++)
                otherElements[i].style.fontSize = '1.5vw';
            }
            else {
              for (var i=0; i<largeInstructionElements.length; i++)
                largeInstructionElements[i].style.fontSize = '3vh';
              for (var i=0; i<smallInstructionElements.length; i++)
                smallInstructionElements[i].style.fontSize = '2vh';
              for (var i=0; i<otherElements.length; i++)
                otherElements[i].style.fontSize = '1.5vh';
            }
          }
        }
        else {
          console.log("Screen has not changed.");
        }
      }
      else {
        console.log("Screen index out of range.");  
      }
    }
    else {
      console.log("Screen index is not valid.");
      console.log("newScreenIndex: " + newScreenIndex);
      console.log(Belly.bellyScreens);
      console.log(robotState);
    }
  }

  Belly.bellyInputReceived = function(target, screenID, itemID) {

    // TODO: clean up the the non "list" parts of database once backwards compatibility issues are gone
    var date = new Date();
    if (target.name == "slider"){
      Belly.bellyScreens[screenID].slider.current = target.value;
      Belly.bellyScreens[screenID].slider.lastChanged = date.getTime();
    }

    if (target.name == "checkbox") {
      Belly.bellyScreens[screenID].checkboxes.list[itemID].value = target.checked;
      Belly.bellyScreens[screenID].checkboxes.list[itemID].lastChanged = date.getTime();
    }

    if (target.name == "button") {
      Belly.bellyScreens[screenID].buttons.list[itemID].lastPressed = date.getTime();
    }

    if (target.name == "imageButton") {
      Belly.bellyScreens[screenID].imageButtons.list[itemID].lastPressed = date.getTime();
    }

    var dir = 'robots/' + (Belly.robotId) + "/customAPI/inputs/";
    var dbRef = firebase.database().ref(dir);
    var updates = {"bellyScreens": Belly.bellyScreens};
    dbRef.update(updates);
  }

}
