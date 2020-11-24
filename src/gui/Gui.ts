import {Store} from '../provider/Store';
import {State} from '../provider/State';

import { gsap } from 'gsap';

export class Gui {
  public setEvents = (): void => {
    State.onBalanceUpdated(this.update);
    State.onGameLoop(this.enableButton);
  };

  public init = (): void => {
    this.setEvents();
    const gui = document.querySelector('#gui') as HTMLElement;
    const balance = document.querySelector('#UI_balance') as HTMLElement;
    const freeSpins = document.querySelector('#UI_freeSpins') as HTMLElement;

    const gameWrapper = document.querySelector('#gameWrapper') as HTMLElement;

    if (
      balance &&
      freeSpins
    ) {
      balance.textContent = `Balance: $${State.userBalance / 100}`;
      freeSpins.textContent = `Free Spins: ${State.userSpins}`;
    }

    if (
      gameWrapper
    ) {
      gameWrapper.style.display = 'block';

      gsap.to(gameWrapper, {
        duration: 0.6,
        opacity: 1,
        scale: 1,
        ease: 'none'
      });
    }

    if (
      gui
    ) {
      gui.style.width = Store.giuArea.width + 'px';
      gui.style.display = 'flex';

      gsap.to(gui, {
        duration: 0.8,
        translateY: 0,
        ease: 'back.out(1.7)',
        stagger: {
          onComplete: () => {
            State.gameIsReady = true;
          }
        }
      });
    }
  };

  public update = (): void => {
    const balance = document.querySelector('#UI_balance') as HTMLElement;
    const freeSpins = document.querySelector('#UI_freeSpins') as HTMLElement;

    if (
      balance && freeSpins
    ) {
      balance.textContent = `Balance: $${State.userBalance / 100}`;
      freeSpins.textContent = `Free Spins: ${State.userSpins}`;
    }
  };

  public enableButton = (): void => {
    const button = document.querySelector('#UI_button') as HTMLButtonElement;

    if (
      button
    ) {
      button.classList.remove('gui__button_disabled');
    }
  };
}
