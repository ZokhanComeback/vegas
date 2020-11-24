import {IArea} from '../commonTypes/commonTypes';

export class Store {
  public static app: null | PIXI.Application = null;
  public static giuArea: IArea = {
    width: 0,
    height: 0
  };
  public static slotsArea: IArea = {
    width: 0,
    height: 0
  };
  public static itemSize: number = 0;
  public static itemArea: number = 0;
}
