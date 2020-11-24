import {AbstractPixiComponent} from "../abstracts/AbstractPixiComponent";
import * as particles from "pixi-particles";
import {colorForParticles, getParticleBlast} from "../../configs/Animations";
import {Helpers} from "../../helpers/Helpers";

export class HandleParticles extends AbstractPixiComponent {
  // @ts-ignore
  private app: PIXI.Application;
  private texture: PIXI.Texture | null = null;
  private particlesContainer = new PIXI.Container();

  constructor(width: number, height: number, app: PIXI.Application) {
    super(width, height, app.stage);
    this.app = app;
  };

  public setTexture = (): void => {
    const canvas = document.createElement('canvas') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(2, 2, 2, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.closePath();

    this.texture = PIXI.Texture.from(canvas);
  };

  public createEmitter = (index: number): void => {
    setTimeout(() => {
      const startColor = colorForParticles[
        Helpers.getRandomInt(0, colorForParticles.length - 1)
        ];

      const endColor = colorForParticles[
        Helpers.getRandomInt(0, colorForParticles.length - 1)
        ];

      const x = Helpers.getRandomInt(50, this.width - 50);
      const y = Helpers.getRandomInt(50, this.height - 100);

      const options = getParticleBlast({
        startColor,
        endColor,
        x,
        y
      });

      const emitter = new particles.Emitter(
        this.particlesContainer,
        [this.texture],
        options
      );

      emitter.playOnceAndDestroy();
    }, index * 200)
  };

  public createEmitters = (): void => {
    this.particlesContainer.destroy();
    this.particlesContainer = new PIXI.ParticleContainer();
    this.particlesContainer.width = this.container.width;
    this.particlesContainer.height = this.container.height;
    this.container.addChild(this.particlesContainer);

    const random = Helpers.getRandomInt(15, 32);

    for (let i = 0; i < random; i++) {
      this.createEmitter(i);
    }
  }

  public start = (): void => {
    this.createEmitters();
  };

  public init = () => {
    this.setTexture();
  };
}
