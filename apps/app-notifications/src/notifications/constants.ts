interface NotificationText {
  winning_points: string[];
  losing_points: string[];
  team_match_result: string[];
  draw_match: string[];
  regularisation_points: string[];
}

export const NOTIFICATIONS_FR: NotificationText = {
  winning_points: [
    "Bravo, champion ! Vous avez marqué [X] points ! C'est comme si vous aviez trouvé le trésor caché dans le jeu ! 🏆",
    "C'est une véritable pluie de points ! Vous venez de gagner [X] points. On dirait que la chance est de votre côté aujourd'hui ! ☔",
    'Woo-hoo ! Vous avez réussi à empocher [X] points. Vous êtes en train de devenir une légende du jeu ! 🚀',
    'Vous avez défié les lois de la physique en obtenant [X] points. Comment faites-vous ça ? 🧐',
    'Votre performance est incroyable ! Vous méritez un standing ovation pour avoir obtenu [X] points. 👏🎉',
    'Qui aurait cru ?! Vous venez de marquer [X] points et de laisser tout le monde sans voix. Vous êtes un génie du jeu ! 🤯',
    'La machine à points est en marche ! Vous avez obtenu [X] points, et vous êtes sur la bonne voie pour conquérir le monde du jeu ! 🌎',
    'Vous êtes sur une série de victoires ! [X] points supplémentaires dans la poche. Vous êtes une force de la nature ! 💥',
    "C'est comme si vous étiez né pour gagner des points ! [X] de plus à votre actif. Vous êtes vraiment spécial ! ✨",
    "On dirait que la bonne étoile brille sur vous aujourd'hui. [X] points ajoutés à votre score. Continuez à briller ! 🌟",
  ],
  losing_points: [
    "Oh non ! Vous avez perdu [X] points. La bonne nouvelle, c'est que cela signifie plus de suspense pour la prochaine victoire ! 🙈",
    'La gravité a frappé ! Vous venez de perdre [X] points, mais souvenez-vous, ce qui monte doit parfois redescendre. 🌧️',
    'Les points se sont échappés comme des papillons ! Vous avez perdu [X] points. Ne vous inquiétez pas, ils reviendront bientôt. 🦋',
    "La courbe des points est un peu en dents de scie aujourd'hui. [X] points de moins, mais rien que vous ne puissiez rattraper ! ⛷️",
    'La roulette des points a tourné, et vous avez perdu [X] points. La prochaine rotation sera peut-être plus chanceuse ! 🎰',
    'La voie vers la victoire a ses hauts et ses bas. Vous venez de perdre [X] points, mais vous avez encore beaucoup de temps pour briller. 🌞',
    "Le jeu vous a fait une petite farce en vous retirant [X] points. Pas de panique, l'avenir est rempli de possibilités ! 🌈",
    "Même les légendes ont leurs moments difficiles. [X] points de moins aujourd'hui, mais demain est un nouveau jour ! 🌄",
    "Les points ont décidé de faire une pause, vous avez perdu [X]. Mais c'est le moment idéal pour préparer votre retour triomphant ! 🚀",
  ],
  regularisation_points: [
    "Régularisation en cours ! Des résultats du mois précédent viennent seulement d'être encodés. Vous avez maintenant [X] points ! 🔄🔢",
  ],
  team_match_result: [
    '[hometeam] a [result] contre [awayteam] avec un score de [homescore] à [awayscore]',
  ],
  draw_match: [
    "[hometeam] et [awayteam] ont fait match nul avec un score de [homescore] à [awayscore]. C'était une bataille féroce jusqu'au bout ! ⚖️🏟️",
    'Le match entre [hometeam] et [awayteam] se termine par un nul [homescore] - [awayscore]. Une confrontation passionnante ! 🏓🤝',
    '[hometeam] et [awayteam] se quittent sur un score de parité [homescore] - [awayscore]. Les deux équipes se sont bien battues ! 🏓⚽',
    'Aucun vainqueur dans le match entre [hometeam] et [awayteam]. Le résultat final est de [homescore] - [awayscore]. 🏓🤝',
    'Match nul ! [hometeam] et [awayteam] se quittent sur un score égal [homescore] - [awayscore]. Les supporters de chaque équipe doivent être fiers ! 🤝🏓',
  ],
};

export const NOTIFICATIONS_EN: NotificationText = {
  winning_points: [
    "Congratulations, champion! You've scored [X] points! It's like you've found the hidden treasure in the game! 🏆",
    "It's a real downpour of points! You've just earned [X] points. Looks like luck is on your side today! ☔",
    "Woo-hoo! You've successfully pocketed [X] points. You're on your way to becoming a gaming legend! 🚀",
    "You've defied the laws of physics by getting [X] points. How do you do that? 🧐",
    'Your performance is incredible! You deserve a standing ovation for earning [X] points. 👏🎉',
    "Who would've thought?! You've just scored [X] points and left everyone speechless. You're a gaming genius! 🤯",
    "The points machine is in motion! You've gained [X] points, and you're on track to conquer the gaming world! 🌎",
    "You're on a winning streak! An extra [X] points in the bag. You're a force of nature! 💥",
    "It's like you were born to win points! [X] more to your name. You're truly special! ✨",
    'It looks like the lucky star is shining on you today. [X] points added to your score. Keep shining! 🌟',
  ],
  losing_points: [
    "Oh no! You've lost [X] points. The good news is, it means more suspense for the next victory! 🙈",
    "Gravity has struck! You've just lost [X] points, but remember, what goes up must sometimes come down. 🌧️",
    "Points have fluttered away like butterflies! You've lost [X] points. Don't worry, they'll be back soon. 🦋",
    "The points curve is a bit jagged today. [X] points less, but there's nothing you can't recover! ⛷️",
    "The points roulette has spun, and you've lost [X] points. The next spin might be luckier! 🎰",
    "The path to victory has its ups and downs. You've just lost [X] points, but you still have plenty of time to shine. 🌞",
    "The game played a little trick on you by taking away [X] points. Don't panic; the future is full of possibilities! 🌈",
    'Even legends have their tough moments. [X] points less today, but tomorrow is a new day! 🌄',
    "Points decided to take a break; you've lost [X]. But it's the perfect time to prepare for your triumphant comeback! 🚀",
  ],
  regularisation_points: [
    'Adjustment in progress! Results from the previous month have just been encoded. You now have [X] points! 🔄🔢',
  ],
  team_match_result: [
    '[hometeam] [result] against [awayteam] with a score of [homescore] to [awayscore].',
  ],
  draw_match: [
    '[hometeam] and [awayteam] have drawn with a score of [homescore] to [awayscore]. It was a fierce battle to the end! ⚖️🏟️',
  ],
};

export const NOTIFICATIONS_NL: NotificationText = {
  winning_points: [
    'Gefeliciteerd, kampioen! Je hebt [X] punten gescoord! Het is alsof je de verborgen schat in het spel hebt gevonden! 🏆',
    'Het regent punten! Je hebt zojuist [X] punten verdiend. Het lijkt erop dat het geluk vandaag aan jouw kant staat! ☔',
    'Woo-hoo! Je hebt succesvol [X] punten verdiend. Je bent op weg om een game-legende te worden! 🚀',
    'Je hebt de wetten van de fysica getart door [X] punten te behalen. Hoe doe je dat? 🧐',
    'Je prestatie is ongelooflijk! Je verdient een staande ovatie voor het verdienen van [X] punten. 👏🎉',
    'Wie had dat gedacht?! Je hebt zojuist [X] punten gescoord en iedereen sprakeloos achtergelaten. Je bent een game-genie! 🤯',
    'De puntenmachine is in beweging! Je hebt [X] punten verdiend, en je bent op weg om de gamewereld te veroveren! 🌎',
    'Je bent op een winnende streak! Een extra [X] punten in de tas. Je bent een kracht van de natuur! 💥',
    'Het lijkt erop dat je bent geboren om punten te winnen! [X] meer aan je naam. Je bent echt speciaal! ✨',
    'Het lijkt erop dat de geluksster vandaag op jou schijnt. [X] punten toegevoegd aan je score. Blijf stralen! 🌟',
  ],
  losing_points: [
    'Oh nee! Je hebt [X] punten verloren. Het goede nieuws is dat het meer spanning betekent voor de volgende overwinning! 🙈',
    'De zwaartekracht heeft toegeslagen! Je hebt zojuist [X] punten verloren, maar onthoud, wat omhoog gaat, moet soms naar beneden komen. 🌧️',
    'De punten zijn weggefladderd als vlinders! Je hebt [X] punten verloren. Maak je geen zorgen, ze komen snel terug. 🦋',
    'De puntencurve is vandaag een beetje hobbelig. [X] punten minder, maar er is niets dat je niet kunt herstellen! ⛷️',
    'De puntenroulette heeft gedraaid, en je hebt [X] punten verloren. De volgende draai kan geluk brengen! 🎰',
    'De weg naar de overwinning kent zijn ups en downs. Je hebt zojuist [X] punten verloren, maar je hebt nog genoeg tijd om te schitteren. 🌞',
    'Het spel heeft een klein grapje met je uitgehaald door [X] punten af ​​te nemen. Geen paniek; de toekomst zit vol mogelijkheden! 🌈',
    'Zelfs legendes hebben hun moeilijke momenten. [X] punten minder vandaag, maar morgen is een nieuwe dag! 🌄',
    'De punten hebben besloten om een pauze te nemen; je hebt [X] verloren. Maar het is het perfecte moment om je triomfantelijke comeback voor te bereiden! 🚀',
  ],
  regularisation_points: [
    'Aanpassing bezig! Resultaten van de vorige maand zijn zojuist ingevoerd. Je hebt nu [X] punten! 🔄🔢',
  ],
  team_match_result: [
    '[hometeam] heeft [result] van [awayteam] met een score van [homescore] tot [awayscore].',
  ],
  draw_match: [
    '[hometeam] en [awayteam] hebben gelijkgespeeld met een score van [homescore] tot [awayscore]. Het was een felle strijd tot het einde! ⚖️🏟️',
  ],
};
