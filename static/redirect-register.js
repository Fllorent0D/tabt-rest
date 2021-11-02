(function() {
  const urlParams = new URLSearchParams(window.location.search);
  const playerId = urlParams.get('internalPlayerId');
  const clubId = urlParams.get('internalClubId');
  const db = urlParams.get('database');

  const aftt = 'https://resultats.aftt.be/index.php?menu=0&register=1';
  const vttl = 'https://competitie.vttl.be/index.php?menu=0&register=1';

  const form = document.createElement('form');
  form.method = 'POST';
  form.action = db === 'aftt' ? aftt : vttl;


  const playerIdField = document.createElement('input');
  playerIdField.type = 'hidden';
  playerIdField.name = 'player_id';
  playerIdField.value = playerId;

  form.appendChild(playerIdField);

  const clubIdField = document.createElement('input');
  clubIdField.type = 'hidden';
  clubIdField.name = 'club_id';
  clubIdField.value = clubId;
  form.appendChild(clubIdField);

  const stepField = document.createElement('input');
  stepField.type = 'hidden';
  stepField.name = 'RegisterStep';
  stepField.value = '3';
  form.appendChild(stepField);

  document.body.appendChild(form);
  form.submit();
})();
