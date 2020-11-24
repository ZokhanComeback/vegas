export class AbstractPixiComponent {
  public width: number = 0;
  public height: number = 0;
  public container: PIXI.Container;
  constructor(
    width: number,
    height: number,
    container: PIXI.Container
  ) {
    this.width = width;
    this.height = height;
    this.container = container;
  }
}
