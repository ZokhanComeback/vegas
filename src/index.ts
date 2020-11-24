import WebFont from 'webfontloader';
import './styles/styles.scss';
import * as PIXI from 'pixi.js'

import {App} from './view/App';

import background from './assets/background.jpg';

import {State} from './provider/State';
import {Helpers} from "./helpers/Helpers";
import {Store} from "./provider/Store";

// Preloading local fonts for use inside PIXI text. Its require, if we want to show correct fonts always.
WebFont.load({
  custom: {
    families: ['DRAguSans-Black']
  }
});

// PIXI loaded by webpack ProvidePlugin plugin.
global.PIXI = PIXI;

// Preloading background to show a nice image and preloader
const setBackground = (): Promise<void> => {
  return new Promise(res => {
    const root = document.querySelector('#root') as HTMLElement;

    const img = new Image();
    img.src = background;
    img.onload = () => {
      root.style.background = `url(${img.src})`;
      root.style.backgroundSize = 'cover';
      root.style.backgroundPositionX = 'center';
      root.style.backgroundPositionY = 'bottom';

      State.showLoader();

      res();
    }
  });
};

/* Truly speaking, I don't Like MVC structure in front-end, but at the moment I don't have some better patterns on my mind.
We can use 'Model' with the same methods in back-end. */

const setGameAreaSizes = (width: number, height: number): void => {
  const guiHeight = 100;
  const maxHeight = height - guiHeight - 20;
  let itemArea = width / 5;

  switch (Helpers.getDevice()) {
    case 'desktop':
    case 'device-h':
      while ((itemArea * 3) >= maxHeight) {
        itemArea -= 1;
      }
      break;
  }

  const itemSize = itemArea - (itemArea / 5);

  Store.giuArea = {
    width: itemArea * 5,
    height: guiHeight
  };

  Store.slotsArea = {
    width: itemArea * 5,
    height: itemArea * 3
  };

  Store.itemSize = itemSize;
  Store.itemArea = itemArea;
};

const start = async (): Promise<void> => {
  await setBackground();

  let width = Math.round(window.innerWidth * 0.95);
  let height = Math.round(window.innerHeight * 0.95);

  setGameAreaSizes(width, height);

  const gameWrapper = document.querySelector('#gameWrapper') as HTMLElement;

  const game = new PIXI.Application({
    antialias: true,
    width: Store.slotsArea.width,
    height: Store.slotsArea.height,
    transparent: true
  });

  game.view.id = 'game';
  game.view.className= 'game';

  // Attempt to avoid graphic bug in chrome

  gameWrapper.appendChild(game.view);

  const app = new App(
    game,
    width,
    height
  );

  app.start();
};

window.addEventListener('load', start);
