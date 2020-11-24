import {EventEmitter} from 'events';

export const subscriber = new EventEmitter();

export const events = Object.freeze({
  dataLoaded: 'dataLoaded',
  gameStarted: 'gameStarted',
  spineEnd: 'spineEnd',
  gameFinished: 'gameFinished',
  balanceUpdated: 'balanceUpdated',
  gameLoop: 'gameLoop',
  winnerAnimation: 'winnerAnimation',
  winnerHighlightEnd: 'winnerHighlightEnd'
});
