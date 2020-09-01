
// GameState 
var GameState = {
  player1: null,
  player2: null,
  currentPlayer: 1,
  winner: null,
  difficulty: null,
  questionCategory: null,
  questionTimer: 0,
  questionList: null,
  questionUsed: [],
  questionAllowed: [],
  currentQuestion: null,
  currentClickedPos: null,
  start: false,
  end: false
}


// Pegar os dados do iniciais 
$('#btnSubmitForm').click(() => {

  // Efeito sonoro
  mouseClick.load();
  mouseClick.play();

  let formErrors = 0;
  const player1 = $('#player1').val();
  const player2 = $('#player2').val();
  const difficulty = $('#dificult').val();
  const questionCategory = $('#questionCategory').val();

  // AQUI VAI A VALIDAÇÃO - A fazer

  // DEVE SER VALIDADO O FORMULÁRIO
  if (formErrors == 0) {
    GameState.player1 = player1;
    GameState.player2 = player2;
    GameState.difficulty = difficulty;
    GameState.questionCategory = questionCategory;
    GameState.questionTimer = getQuestionTimerByDifficulty(dificult);
    GameState.start = true;
  }

  // INICIO DO JOGO
  if (GameState.start) {

    // Ocultar o formulário inicial
    $('#gameConfigCard').addClass('d-none');

    // Seta o nome dos jogadores
    setPlayerNames(GameState.player1, GameState.player2);

    // Setar o jogador da rodada
    setColorInCurrentPlayerBox(GameState.currentPlayer);

    // Abre o jogo
    $('#game').removeClass('d-none');
  }
});


// Quando selecionado uma alternativa
$('[name=options]').click(() => {

  // Efeito sonoro
  select.load();
  select.play();

});


// RESPOSTA DO QUIZ
$('#responseQuestion').click(function () {

  // Resposta do usuário
  const response = $('[name=options]:checked').val();

  // Resposta correta da pergunta
  const correctOption = GameState.currentQuestion.correct;


  // SE RESPOSTA CORRETA
  if (response === correctOption) {

    // Efeito sonoro
    success.load();
    success.play();

    console.log('Resposta correta');
    console.log(GameState.currentPlayer);

    var pos = $(`#${GameState.currentClickedPos}`);

    var bg = pos.css("background-image");

    // Verifica se a cada esta vazia
    if (bg == "none" || bg == "") {

      // Escolher imagem de acordo com o jogador da vez.
      var fig = "url(" + GameState.currentPlayer.toString() + ".svg)"; 

       // Adiciona, na casa, a imagem correspondente ao jogador.
      pos.css("background-image", fig);

      // Troca o jogador da vez 
      GameState.currentPlayer = (GameState.currentPlayer == 1 ? 2 : 1); 

      // Verificar fim de jogo.
      checkGameEnd(); 
    }

    setColorInCurrentPlayerBox(GameState.currentPlayer);

    // Notificar usuário que a resposta esta correta
    setFeedback('correct', 1000);

  } else {

    // RESPOSTA ERRADA

    // Efeio sonoro 
    fail.load();
    fail.play();

    // Altera o jogador atual
    GameState.currentPlayer = GameState.currentPlayer == 1 ? 2 : 1;
    setColorInCurrentPlayerBox(GameState.currentPlayer);

    // Notificar usuário que a resposta esta incorreta
    setFeedback('fail', 1000);
  }

  // Fecha a pergunta
  $('#quiz').modal('hide');


  // OBS
  // Verificar se o modal esta fechado antes de setar a próxima pergunta
  // comando na documentação do booststrap

  // Escolhe a próxima pergunta
  GameState.currentQuestion = GameState.questionList[chooseQuestion(GameState.questionList)];
  setQuestion(GameState.currentQuestion);
});




// Escolher um Posição
$(".pos").click(function () {

  // Efeito sonoro
  mouseClick.load();
  mouseClick.play();

  // Buscar perguntas refêntes ao conteúdo selecionado
  GameState.questionList = findQuestionsByCategory(GameState.questionCategory, questionList);

  // Setar uma pergunta
  GameState.currentQuestion = chooseQuestion(GameState.questionList, GameState.questionUsed);

  // Abrir o Quiz
  $('#quiz').modal('show');

  // Setar a pergunta atual
  setQuestion(GameState.currentQuestion);

  // Setar a posição clicada
  GameState.currentClickedPos = $(this).attr('id');

  // Setar a cor do jogador atual
  setColorInCurrentPlayerBox(GameState.currentPlayer);

});



$("#reset").click(function () {
  $(".pos").css("background-image", "none");
  GameState.currentPlayer = 2;
});

























