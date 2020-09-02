

function getCategoryName(initials) {

  switch (initials) {

    case 'mat':
      return 'Matemática';
      break;

    case 'port':
      return 'Português';
      break;

    case 'geo':
      return 'Geografia';
      break;

    case 'hist':
      return 'História';
      break;
  }
}


// Setar um Timer para a questão de acordo com a dificuldade selecionada
function getQuestionTimerByDifficulty(gameDificult) {
  switch (gameDificult) {
    case 'easy':
      return 20;
      break;
    case 'medium':
      return 10;
      break;
    case 'hard':
      return 5;
      break;
  }
}

// Sortear número inteiro 
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min;
};

// Setar questão ao quiz
function setQuestion(question) {

  $('#question').html(question.question);
  $('#questionCategory').html(getCategoryName(question.category));
  $('#label-option1').html(question.option1);
  $('#label-option2').html(question.option2);
  $('#label-option3').html(question.option3);
};

// Setar borda abaixo do jogador atual
function setColorInCurrentPlayerBox(currentPlayer) {

  if (currentPlayer == 1) {
    $("#player2-box").removeClass("player-box-selected");
    $("#player1-box").addClass("player-box-selected");
  } else {
    $("#player1-box").removeClass("player-box-selected");
    $("#player2-box").addClass("player-box-selected");
  }
};

// Setar nome dos jogadores
function setPlayerNames(player1, player2) {
  $('#player1-name').html(player1);
  $('#player2-name').html(player2);
};

// Buscar questões referêntes a categoria escolhida
function findQuestionsByCategory(category, questionList) {
  if (category != 'mult') {
    const filteredQuestions = questionList.filter(ask => ask.category == category);
    return filteredQuestions;
  } else {
    return questionList;
  }
};

// Escolher uma questão
function chooseQuestion(questionList, questionUsed) {

  // Verificar se a questão já foi utilizada, e criar uma lista só com as não repetidas
  GameState.questionAllowed = questionList.filter(question => !GameState.questionUsed.includes(question.id));

  // Descobrir a quantidade de questões existentes
  const questionListLength = GameState.questionAllowed.length;

  // Sortear questão entre as disponíveis
  const newQuestion = GameState.questionAllowed[getRandomInt(0, questionListLength)];

  // Marcar questão como já utilizada
  GameState.questionUsed.push(newQuestion.id);

  // Retorna a questão sorteada
  return newQuestion;
};

// Setar um feedBack
function setFeedback(type, time) {
  switch (type) {

    case 'success':
      $("#feedbackSuccess").modal("show");
      setInterval(() => {
        $("#feedbackSuccess").modal("hide");
      }, time);
      break;

    case 'fail':
      $("#feedbackFail").modal("show");
      setInterval(() => {
        $("#feedbackFail").modal("hide");
      }, time);
      break;

    case 'limitTime':
      $("#feedbackLimitTime").modal("show");
      setInterval(() => {
        $("#feedbackLimitTime").modal("hide");
      }, time);
      break;

  }

};

// Setar resultado do jogo
function setResultGame(result) {
  if (result != 'empate') {

    $("#crash-box").addClass("d-none");
    $("#win-box").removeClass("d-none");
    $("#result").html(result);
  } else {
    $("#crash-box").removeClass("d-none");
    $("#win-box").addClass("d-none");
  }
}



// Jogo


// Verificar posições iguais
function equalPos(a, b, c) {
  var bgA = $("#pos" + a).css("background-image"); // armazena na variável bgA o 'nome' da imagem que está na pos A
  var bgB = $("#pos" + b).css("background-image"); // armazena na variável bgB o 'nome' da imagem que está na pos B
  var bgC = $("#pos" + c).css("background-image"); // armazena na variável bgC o 'nome' da imagem que está na casa C


  //Verifica se as 3 casas possuem a mesma imagem
  if ((bgA == bgB) && (bgB == bgC) && (bgA != "none" && bgA != "")) {
    if (bgA.indexOf("1.svg") >= 0) //Verifica se a imagem que está nas 3 casas pertence ou não ao jogador 1 (Imagem X)
      GameState.winner = 'player1'; // As 3 imagens são do jogador 1 (Imagem X), jogador 1 venceu.
    else
      GameState.winner = 'player2'; // As 3 imagens são do jogador 2 (Imagem 0), jogador 2 venceu.

    return true;
  }
  else {
    return false;
  }
}

// Verificar se houve um empate
function crashGame() {

  const posEmpty = $('.pos').filter(pos => pos.css('background-image') == 'none');

  console.group(posEmpty);

  if(posEmpty){
    console.log('Ainda há casas vazias');
  } else {
    console.log('Todas as casas estão ocupadas!');

  }

}


// Verificar se o jogo acabou e setar um vencedor.
function checkGameEnd() {


  const pos = $('.pos').css('background-image');

  //Verifica todas as possibilidades de haver um ganhador
  if (equalPos(1, 2, 3) || equalPos(4, 5, 6) || equalPos(7, 8, 9) ||
    equalPos(1, 4, 7) || equalPos(2, 5, 8) || equalPos(3, 6, 9) ||
    equalPos(1, 5, 9) || equalPos(3, 5, 7)) {

    // Pegar o jodagor vencedor
    const playerWinner = GameState.winner;

    // Setar o vencedor
    if (playerWinner === 'player1') {
      setResultGame(GameState.player1);
    } else {
      setResultGame(GameState.player2);
    }

    $(".pos").css("background-image", "none");
    $(".pos").off("click"); // Desabilita o clique do mouse nas casas

    // Efeito sonoro
    winner.load();
    winner.play();

    setInterval(() => {
      $("#end").modal("show");
    }, 3000);
  } else if(pos != 'none' || pos != ''){
    console.log('tudo preenchido');
  }
}


// Timer

function startTimer() {
  if ((GameState.timer - 1) >= 0) {

    // Pega a parte inteira dos minutos
    var min = parseInt(GameState.timer / 60);
    // Calcula os segundos restantes
    var seg = GameState.timer % 60;

    // Formata o número menor que dez, ex: 08, 07, ...
    if (min < 10) {
      min = "0" + min;
      min = min.substr(0, 2);
    }
    if (seg <= 9) {
      seg = "0" + seg;
    }

    // Cria a variável para formatar no estilo hora/cronômetro
    formatedTimer = seg;
    //JQuery pra setar o valor
    $("#timer").html(formatedTimer);

    // Define que a função será executada novamente em 1000ms = 1 segundo
    setTimeout('startTimer()', 1000);

    // diminui o tempo
    GameState.timer--;

    // Quando o contador chegar a zero faz esta ação
  } else {

    //console.log(GameState.timer);
    if (GameState.timer == 0.1) {
      //console.log('Nada fazer');
    } else {

      // Efeio sonoro 
      fail.load();
      fail.play();

      // Altera o jogador atual
      GameState.currentPlayer = GameState.currentPlayer == 1 ? 2 : 1;
      setColorInCurrentPlayerBox(GameState.currentPlayer);

      // Notificar usuário que a resposta esta incorreta
      setFeedback('limitTime', 1000);

      // Fecha a pergunta
      $('#quiz').modal('hide');

      // Escolhe a próxima pergunta
      GameState.currentQuestion = GameState.questionList[chooseQuestion(GameState.questionList)];
      setQuestion(GameState.currentQuestion);
    }
  }
}

function stopTimer() {
  GameState.timer = 0.1;
}

function questionTimer(status) {
  if (status === 'on') {
    startTimer();
  } else {
    stopTimer();
  }
}



