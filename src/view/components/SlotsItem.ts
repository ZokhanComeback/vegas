import {Store} from '../../provider/Store';
import {State} from '../../provider/State';

import {AbstractPixiComponent} from '../abstracts/AbstractPixiComponent';

import { gsap } from 'gsap';
import PixiPlugin from 'gsap/PixiPlugin';

gsap.registerPlugin(PixiPlugin);

import {slotValues} from '../../configs/Rewards';
import {colorsForWin} from '../../configs/Animations';

export class SlotsItem extends AbstractPixiComponent {
  private readonly parent: PIXI.Container;
  private readonly symbol: string;
  private readonly columnLength: number;
  private readonly colIndex: number;
  private readonly index: number;
  public isCurrent: boolean;
  public isResult: boolean;
  private graphics: PIXI.Graphics = new PIXI.Graphics();

  constructor(
    width: number,
    height: number,
    parent: PIXI.Container,
    symbol: string,
    length: number,
    colIndex: number,
    index: number,
    isCurrent: boolean,
    isResult: boolean
  ) {
    super(width, height, new PIXI.Container());
    this.parent = parent;
    this.symbol = symbol;
    this.columnLength = length;
    this.colIndex = colIndex;
    this.index = index;
    this.isCurrent = isCurrent;
    this.isResult = isResult;
  };

  private setEvents = (): void => {
    State.onWinnerAnimation(this.winnerAnimation);
  };

  public init = (): void => {

    if (
      this.isResult
    ) {
      this.setEvents();
    }

    this.container.width = this.width;
    this.container.height = this.height;

    const gap = (Store.itemArea - Store.itemSize) / 2;

    this.container.x = gap;
    this.container.y = (-this.index + 2) * Store.itemArea + gap;

    this.graphics.beginFill(0x650A5A, 0.25);
    this.graphics.drawRoundedRect(0, 0, this.width, this.height, 16);
    this.graphics.endFill();

    const symbolStyle = new PIXI.TextStyle({
      fontFamily: 'DRAguSans-Black',
      fontSize: this.width / 1.5,
      fontWeight: 'bold',
      fill: ['#ffffff', '#00ff99'], // gradient
      stroke: '#4a1850',
      strokeThickness: 5,
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowBlur: 4,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 6,
      wordWrap: true,
      wordWrapWidth: 440,
      lineJoin: 'round'
    });

    const text = new PIXI.Text(this.symbol.toUpperCase(), symbolStyle);
    text.anchor.x = 0.5;
    text.position.x = this.width / 2;

    this.container.addChild(this.graphics, text);
    this.parent.addChild(this.container);
  };

  public winnerAnimation = (row: number) => {
    State.removeWinnerAnimationListener(this.winnerAnimation);
    let currentRowIndex = this.columnLength - this.index;

    if (
      currentRowIndex === 3
    ) {
      currentRowIndex = 1;
    } else if (
      currentRowIndex === 1
    ) {
      currentRowIndex = 3;
    }

    if (
      currentRowIndex !== row + 1
    ) {
      return ;
    }

    const symbolsIndex = slotValues.indexOf(this.symbol);
    const newGraphics = new PIXI.Graphics();
    newGraphics.lineStyle(6, colorsForWin[symbolsIndex], 1);
    newGraphics.beginFill(0x650A5A, 0);
    newGraphics.drawRoundedRect(0, 0, this.width, this.height, 16);
    newGraphics.endFill();
    newGraphics.alpha = 0;

    this.container.addChild(newGraphics);

    setTimeout(() => {
      gsap.to(newGraphics, {
        duration: 0.5,
        alpha: 1,
        ease: 'none',
        stagger: {
          onComplete: () => {
            if (
              this.colIndex === 4
            ) {
              State.winnerHighlightEnd();
            }
          }
        }
      });
    }, this.colIndex * 400);
  };
}
