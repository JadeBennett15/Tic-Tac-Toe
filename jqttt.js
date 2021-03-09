$(document).ready(function(){

    /* Initialize variables */
    var playing = false; // boolean to determine if board is clickable
    var player1 = { number: 1, name: "Player 1", squares: [], score: 0, symbol: "X", computer: false };
    var player2 = { number: 2, name: "Player 2", squares: [], score: 0, symbol: "O", computer: false };
    player1.opponent = player2;
    player2.opponent = player1;
    var draws = 0;
    var taken = []; // all squares with Xs or Os in them
    var winners = [[1, 2, 3], [4, 5, 6], [7, 8, 9], [1, 4, 7], [2, 5, 8], [3, 6, 9], [1, 5, 9], [3, 5, 7]];
    var activePlayer = player1;
  
    function highlightScore (player) { // indicate whose turn it is
      $("#score" + player.number).css("border-color", "#D62828");
      $("#score" + player.opponent.number).css("border-color", "#003049");
    }
  
    // randomly choose starting player
    function choosePlayer() {
      var random = Math.floor((Math.random() * 2) + 1);
      console.log("Choosing player " + random);
      if (random == 1) {
        activePlayer = player1;    
      } else {
        activePlayer = player2;
      }
      highlightScore(activePlayer);
      console.log(activePlayer);
      if (activePlayer.computer) {
        console.log("is comp");
        processMove(computerMove()); // if that player is the computer, move for computer
      }
      playing = true;
    }
  
    function checkWin (player) { // check if a move wins the game
      var victory = false;
      winners.forEach(function(winner) { // for each winning combo, see if the player squares match
        if (fullMatch(winner, player.squares)) {
          victory = true;
          winner.forEach(function(number) {
            $("." + number).addClass("highlight"); // highlight winning squares
          });
        }
      });  
      if (victory) {
        player.score += 1; // increase score and display messages
        //   $(".board-squares").hide();
        $("#score" + player.number + "num").html(player.score);
        $(".message").html("<p>" + player.name + " Wins!</p>");
        $(".message").show();
      }
      return victory; // return true or false
    }
  
    function computerMove () { // lets script determine player 2's move
      console.log("computer is moving");
      var move = 5;
      do {
        move = Math.floor((Math.random() * 9) +1); // randomly choose a square between 1-9
      } while ($.inArray(move, taken) != -1); // make sure square isn't taken
      return move;
    }
  
    function checkDraw() { // check to see if all the squares have been taken
      if (taken.length == 9) {
        draws += 1; // count the game as a draw
        $("#drawsnum").html(draws);
        $(".message").html("Cat's game. Meow!").show();
        return true;
      }
    }
  
    function clearBoard() { // clear variables and Xs/Os after each game
      console.log("board cleared");
      setTimeout(function (){
        $("li").removeClass("highlight");
        $("li").html("&nbsp;");
        taken = [];
        player1.squares = [];
        player2.squares = [];
        $(".message").html("").hide();
        $(".board-squares").show();
        choosePlayer();
      }, 1000);
    }
  
    function processMove (move) {
      if (playing || activePlayer.computer) {
        console.log("processing" + move);
        if ($.inArray(move, taken) == -1) { // make sure move is valid
          taken.push(move); // if square hasn't already been taken, add it to the taken array
          activePlayer.squares.push(move); // add it to player's squares
          $("." + move).html(activePlayer.symbol); // mark it on the board
          if (checkWin(activePlayer) || checkDraw()) { // check to see if game over
            playing = false;
            clearBoard(); // clear the board
          } else {
            activePlayer = activePlayer.opponent; // switch players
            highlightScore(activePlayer);
            if (activePlayer.computer) {
              processMove(computerMove()); // move as computer
              playing = true;
            }
          }
        }
      }
    }
  
    /* Respond to board clicks */
    $("li").click(function(){
      var move = parseInt($(this).attr("class")); // get value of clicked box
      processMove(move);
    });
  
    /* Show options and start the game */
    $(".player-options").show();
    $(".players" ).click(function() {
      var value = $(this).val(); 
      if (value == "1") {
        player2.computer = true;
      } else {
        player2.computer = false;
      }
      console.log(player2.computer);
      $(".player-options").hide();
      $(".symbol-options").show();
    });
    $( ".symbols" ).click(function() {
      var value = $(this).val(); console.log(value);
      if (value == "X") {
        console.log(value);
        player1.symbol = "X";
        player2.symbol = "O";
      } else {
        player1.symbol = "O";
        player2.symbol = "X";
      }
      $(".symbol-options").hide();
      $(".board-squares").show();
      choosePlayer(); // randomly choose a player to start
    });
  
  }); // end document ready
  
  // extra function to check if all values of one array (values) are in another array (array)
  function fullMatch (values, array){ 
    for(var i = 0; i < values.length; i++){
      if($.inArray(values[i], array) == -1) return false;
    }
    return true;
  }