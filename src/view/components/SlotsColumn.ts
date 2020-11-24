import {Store} from '../../provider/Store';
import {State} from '../../provider/State';

import {AbstractPixiComponent} from '../abstracts/AbstractPixiComponent';

import {SlotsItem} from './SlotsItem';

import { gsap } from 'gsap';
import PixiPlugin from 'gsap/PixiPlugin';

gsap.registerPlugin(PixiPlugin);

export class SlotsColumn extends AbstractPixiComponent {
  private readonly parent: PIXI.Container;
  private readonly index: number;
  private readonly items: SlotsItem[] = [];

  constructor(width: number, height: number, parent: PIXI.Container, index: number) {
    super(width, height, new PIXI.Container());
    this.parent = parent;
    this.index = index;
  };

  private setEvents = (): void => {
    State.onGameStarted(this.startGame);
    State.onGameFinished(this.repaint);
  };

  public init = (): void => {
    this.setEvents();
    this.container.width = this.width;
    this.container.height = this.height;

    this.container.x = this.index * Store.itemArea;
    this.container.y = 0;

    this.parent.addChild(this.container);

    this.initCurrentScreen();
    this.initScrollArea();
  };

  public initCurrentScreen = (): void => {
    for (let i = 0; i < State.currentScreen[this.index].length; i++) {
      const item = new SlotsItem(
        Store.itemSize,
        Store.itemSize,
        this.container,
        State.currentScreen[this.index][i],
        State.unitedArea[this.index].length,
        this.index,
        i,
        true,
        false
      );

      this.items.push(item);
      item.init();
    }
  };

  public initScrollArea = (): void => {
    for (let i = 3; i < State.unitedArea[this.index].length; i++) {
      const item = new SlotsItem(
        Store.itemSize,
        Store.itemSize,
        this.container,
        State.unitedArea[this.index][i],
        State.unitedArea[this.index].length,
        this.index,
        i,
        false,
        false
      );

      this.items.push(item);
      item.init();
    }
  };

  public initResultScreen = (): void => {
    for (let i = State.unitedArea[this.index].length - 3; i < State.unitedArea[this.index].length; i++) {
      const item = new SlotsItem(
        Store.itemSize,
        Store.itemSize,
        this.container,
        State.unitedArea[this.index][i],
        State.unitedArea[this.index].length,
        this.index,
        i,
        false,
        true
      );

      this.items.push(item);
      item.init();
    }
  };

  public clear = (): void => {
    this.items.filter(item => {
      if (
        item.isCurrent || item.isResult
      ) {
        item.container.destroy();
      }

      return !item.isCurrent && !item.isResult;
    });
  };

  public repaint = (): void => {
    this.clear();
    this.initCurrentScreen();
    this.container.y = 0;

    if (
      this.index === 4
    ) {
      State.gameLoop();
    }
  };

  public startGame = (): void => {
    this.initResultScreen();
    this.spin();
  };

  public spin = (): void => {
    State.gameIsReady = false;

    gsap.to(this.container, {
      duration: 3 + (this.index * 0.5),
      y: Store.itemArea * (State.unitedArea[this.index].length - 3),
      ease: 'back.out(0.5)',
      stagger: {
        onComplete: () => {
          if (
            this.index === 4
          ) {
            State.spineEnd();
          }
        }
      }
    });
  };
}
