import {State} from '../provider/State';

export class Controller {
  public static startSpin = (): void => {
    if (
      !State.gameIsReady
    ) {
      return ;
    }

    const button = document.querySelector('#UI_button') as HTMLButtonElement;

    if (
      button
    ) {
      button.classList.add('gui__button_disabled');
    }

    State.startGame();
  };

  public static setEvents = (): void => {
    const button = document.querySelector('#UI_button') as HTMLButtonElement;

    button.addEventListener('click', Controller.startSpin);
  };
}
