import {Store} from '../../provider/Store';
import {AbstractPixiComponent} from "../abstracts/AbstractPixiComponent";
import {SlotsColumn} from "./SlotsColumn";

export class SlotsWrapper extends AbstractPixiComponent {
  private readonly parent: PIXI.Container;
  private readonly columns: SlotsColumn[] = [];

  constructor(width, height, parent: PIXI.Container) {
    super(width, height, new PIXI.Container());
    this.parent = parent;
  };

  private setEvents = (): void => {

  };

  public init = (): void => {
    this.setEvents();
    this.width = Store.slotsArea.width;
    this.height = Store.slotsArea.height;
    this.container.width = this.width;
    this.container.height = this.height;
    this.container.x = Store.slotsArea.width / 2 - this.width / 2;
    this.container.y = 0;

    const graphics = new PIXI.Graphics();

    graphics.lineStyle(2, 0xC6C8FF, 1);
    graphics.beginFill(0xC6C8FF, 0.20);
    graphics.drawRoundedRect(0, 0, this.width, this.height, 16);
    graphics.endFill();

    this.container.addChild(graphics);
    this.parent.addChild(this.container);

    this.initColumns();
  };

  public initColumns = () => {
    for (let i = 0; i < 5; i++) {
      const col = new SlotsColumn(Store.itemArea, Store.slotsArea.height, this.container, i);
      this.columns.push(col);
      col.init();
    }
  };
}
