import {Store} from '../provider/Store';
import {State} from '../provider/State';

import {AbstractPixiComponent} from './abstracts/AbstractPixiComponent';

import {SlotsWrapper} from './components/SlotsWrapper';

import {Gui} from "../gui/Gui";
import {Controller} from "../controller/Controller";
import {HandleParticles} from "./components/HandleParticles";
import {Cheats} from "../cheats/Cheats";

export class App extends AbstractPixiComponent {
  private readonly app: PIXI.Application;
  private readonly gui: Gui;
  private readonly slots: SlotsWrapper;
  private particles: HandleParticles | null = null;

  constructor(app: PIXI.Application, width: number, height: number) {
    super(width, height, app.stage);
    this.app = app;
    this.gui = new Gui();
    this.slots = new SlotsWrapper(0, 0, app.stage);
  };

  private onDataLoaded = (): void => {
    State.hideLoader();
    this.init();
  };

  public setEvents = (): void => {
    State.onLoadingEnd(this.onDataLoaded);
    State.onWinnerAnimation(this.showParticles);
  };

  private initSlots = (): void => {
    this.slots.init();
  };

  private setParticles = (): void => {
    const wrapper = document.querySelector('#particles') as HTMLElement;

    const newApplication = new PIXI.Application({
      width: window.innerWidth / 2,
      height: window.innerHeight / 2,
      antialias: true,
      transparent: true
    });

    wrapper.appendChild(newApplication.view);

    this.particles = new HandleParticles(window.innerWidth / 2, window.innerHeight / 2, newApplication);
  };

  private initParticles = (): void => {
    if (
      this.particles
    ) {
      this.particles.init();
    }
  };

  private showParticles = (): void => {
    if (
      this.particles
    ) {
      this.particles.start();
    }
  };

  public start = (): void => {
    this.setEvents();

    Store.app = this.app;

    State.loadData();
  };

  private init = (): void => {
    State.setDefaultValue();
    this.gui.init();
    Cheats.setCheats();
    Controller.setEvents();
    this.initSlots();
    this.setParticles();
    this.initParticles();
  };
}
