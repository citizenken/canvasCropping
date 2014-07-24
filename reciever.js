window.onload = function() {
  // $("body").find("a").parent().parent().remove()

  // cast.receiver.logger.setLevelValue(0);
  // window.castReceiverManager = cast.receiver.CastReceiverManager.getInstance();
  // console.log('Starting Receiver Manager');

  // // handler for the 'ready' event
  // castReceiverManager.onReady = function(event) {
  //   console.log('Received Ready event: ' + JSON.stringify(event.data));
  //   window.castReceiverManager.setApplicationState("Application status is ready...");
  // };

  // // handler for 'senderconnected' event
  // castReceiverManager.onSenderConnected = function(event) {
  //   console.log('Received Sender Connected event: ' + event.data);
  //   newSender = window.castReceiverManager.getSender(event.data);
  //   addNewSender(newSender);
  // };

  // window.messageBus =
  //   window.castReceiverManager.getCastMessageBus(
  //       'urn:x-cast:com.google.cast.sample.helloworld');


  // // create a CastMessageBus to handle messages for a custom namespace

  // // handler for the CastMessageBus message event

  $("#submit").on("click", function () {
    var input = $("#input").val();
    var message = JSON.parse(input);
    console.log(message)
    switch (message["type"]) {
      case "draw":

        redraw(event.senderId, message)
        break;
    }
  })
  // window.messageBus.onMessage = function(event) {
  //   senderIndex = getSenderIndex(event.senderId)
  //   var message = JSON.parse(event.data)
  //   switch (message["type"]) {
  //     case "draw":
  //       redraw(event.senderId)
  //       break;
  //   }
  // }

  // // initialize the CastReceiverManager with an application status message
  // window.castReceiverManager.start({statusText: "Application is starting"});
  // console.log('Receiver Manager started');

  // // handler for 'senderdisconnected' event
  // castReceiverManager.onSenderDisconnected = function(event) {
  //   console.log('Received Sender Disconnected event: ' + event.data);
  //   if (window.castReceiverManager.getSenders().length == 0) {
  //   // window.close();
  // }
  // };

  // // handler for 'systemvolumechanged' event
  // castReceiverManager.onSystemVolumeChanged = function(event) {
  //   console.log('Received System Volume Changed event: ' + event.data['level'] + ' ' +
  //       event.data['muted']);
  // };
};

  function redraw(senderID, message){
    var body = message.body
    var lineWidth = body.strokeInfo.lineWidth
    var lineJoin = body.strokeInfo.lineJoin
    var colors = body.strokeInfo.colors
    var clickX = body.Xcoords
    var clickY = body.Ycoords
    var drag = body.strokeInfo.clickDrag

    context = document.getElementById('canvas').getContext("2d");
    context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas

    context.lineJoin = lineJoin;
    context.lineWidth = lineWidth;
    console.log(message)
    for(var i=0; i < clickX.length; i++) {
      context.beginPath();
      if(drag[i] && i){
        context.moveTo(clickX[i-1], clickY[i-1]);
       }else{
         context.moveTo(clickX[i]-1, clickY[i]);
       }
       context.lineTo(clickX[i], clickY[i]);
       context.closePath();
       context.strokeStyle = colors[i];
       context.stroke();
    }

    // strokeInfo = {
    //   strokeStyle: context.strokeStyle,
    //   lineJoin: context.lineJoin,
    //   lineWidth: context.lineWidth}

    // message = JSON.stringify({type:"draw", body:{strokeInfo: strokeInfo, Xcoords: clickX, Ycoords: clickY}});
    // console.log(message);
    // sendMessage(message);
  }

function addNewSender (newSender) {
  var sender = {id:newSender.id, disabled: true, storyLine: '', player: '', start: null}
  if (senders.length <= 0) {
    senders.push(newSender);
  } else {
    var regex = ".*:"
    var prefix = sender.id.match(regex);
    var replaced = removeDuplicateSenders(prefix[0], sender);
    if (replaced === 0) {
      senders.push(sender)
    }
  }

  disablePlayer(sender.id);
  grantStartControls(sender.id);
}

function disablePlayer (senderID) {
  sendMessage(senderID, messageJson("status", "disabled"))
}

function parseSettings (settings) {
  seed = settings.seed;
  rounds = settings.rounds;
  timer = settings.timer;
  seconds = settings.seconds;

  if (seed) {
    displayStorySeed();
  } else {
    var storySeed = $("#storySeed");
    storySeed.text('');
    storySeed.hide();
    $("#storySeedLabel").hide();
  }

  if (timer) {
    var timeInfo = {timer:seconds};
    console.log(senders);
      for (var i = 0; i <= senders.length - 1; i++) {
        sendMessage(senders[i].id, messageJson("set", timeInfo));
      };
  }

}

function displayStorySeed () {
  var storySeed = $("#storySeed")
  storySeed.text('');
  var seed = returnRandomSeed();
  storySeed.text(seed);
  if (!$("#storySeedLabel").is(":visible")) {
    $("#storySeedLabel").show();
  }
}

function removeDuplicateSenders (prefix, sender) {
  var replaced = 0
  for (var i = 0; i <= senders.length - 1; i++) {
    if (senders[i].id.match(prefix) !== null) {
      senders.splice(i, 1, sender)
      replaced = 1
    }
  };
  return replaced
}

function getSenderIndex (senderID) {
  for (var i = 0; i <= senders.length - 1; i++) {
    if (senders[i].id === senderID) {
      return i;
    }
  };
}

function enableNextPlayer () {
  if (rounds > 0) {
    var storyLine = "";
    if (storyLines.length != 0) {
      if (currentSender == 0) {
        storyLine = shuffledSenders[shuffledSenders.length - 1].storyLine
      } else {
        storyLine = shuffledSenders[currentSender - 1].storyLine
      }
    }

    sendMessage(shuffledSenders[currentSender].id, messageJson("status", "enabled"))
    sendMessage(shuffledSenders[currentSender].id, messageJson("storyline", storyLine))
  } else if (rounds === 0) {
    gameStart = 0
    endGame();
  }
}

function endGame () {
  sendMessage("status", "complete");
  displayStoryLine()
}

function displayStoryLine() {
  var story = storyLines.join("<br>");
  var saveStory = storyLines.join("\n");
  displayText(story)
}

function displayPlayer (senderIndex) {
  var playerName = senders[senderIndex].player
  var playerNumber = senderIndex + 1
  var html = "<tr class='player'>" +
                "<td id=\"" + playerName + "\">" +
                  "Player " + playerNumber + ": " + playerName +
              "</tr>"


  $("#players > tbody:last").append(html)
}

function sendMessage (senderID, message) {
  console.log("Sending " + message + " to " + senderID)
  window.messageBus.send(senderID, message)
}

function messageJson (contentType, contentBody) {
  return JSON.stringify({type: contentType, body: contentBody})
}

function setPlayerName (senderIndex, messageBody) {
  senders[senderIndex].player = messageBody;
  players.push(messageBody);

}

// utility function to display the text message in the input field
function displayText(text) {
  $("#message").html(text);
  window.castReceiverManager.setApplicationState(text);
};

function startGame() {
  shuffledSenders = senders.slice(0)
  shuffle(shuffledSenders)
}

function grantStartControls (senderID) {
  if (getSenderIndex(senderID) === 0) {
    senders[0].start = true
    for (var i = 1; i <= senders.length - 1; i++) {
      senders[i].start = false
    };
    if ($(".player").length) {
      $(".player").remove();
    }
    sendMessage(senderID, messageJson("set", "start"));
  }
}

function shuffle(array) {
  var currentIndex = array.length
    , temporaryValue
    , randomIndex
    ;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}