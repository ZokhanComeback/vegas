import {Model} from '../model/Model';
import {State} from "../provider/State";
import {jackpot} from "../configs/Rewards";

export class Cheats {
  public static preparedWin: boolean = false;
  public static preparedJackpot: boolean = false;
  public static winIndex: number = 0;

  public static setCheats = (): void => {
    // @ts-ignore
    window.wipe = Cheats.wipe;
    // @ts-ignore
    window.hesoyam = Cheats.hesoyam;
    // @ts-ignore
    window.jackpot = Cheats.jackpot;
    // @ts-ignore
    window.winJ = Cheats.winJ;
    // @ts-ignore
    window.winO = Cheats.winO;
    // @ts-ignore
    window.winK = Cheats.winK;
    // @ts-ignore
    window.winE = Cheats.winE;
    // @ts-ignore
    window.winR = Cheats.winR;
    // @ts-ignore
    window.truthGame = Cheats.truthGame;
  };

  public static wipe = async (): Promise<void> => {
    await Model.setTestUser({
      firstname: 'Jhon',
      surname: 'Doe',
      balance: 40000,
      games: {
        vegas: {
          spinsAvailable: 5,
          totalGames: 5
        }
      }
    });

    State.updateBalance(40000, 5);

    console.log('done!');
  };

  public static hesoyam = async (): Promise<void> => {
    const res = await Model.sendGameResults(jackpot);

    State.updateBalance(res.balance, res.games.vegas.spinsAvailable);

    console.log('done!');
  };

  public static jackpot = (): void => {
    Cheats.preparedJackpot = true;
    Cheats.preparedWin = false;

    console.log('done!');
  };

  public static winJ = (): void => {
    Cheats.preparedWin = true;
    Cheats.preparedJackpot = false;
    Cheats.winIndex = 0;

    console.log('done!');
  };

  public static winO = (): void => {
    Cheats.preparedWin = true;
    Cheats.preparedJackpot = false;
    Cheats.winIndex = 1;

    console.log('done!');
  };

  public static winK = (): void => {
    Cheats.preparedWin = true;
    Cheats.preparedJackpot = false;
    Cheats.winIndex = 2;

    console.log('done!');
  };

  public static winE = (): void => {
    Cheats.preparedWin = true;
    Cheats.preparedJackpot = false;
    Cheats.winIndex = 3;

    console.log('done!');
  };

  public static winR = (): void => {
    Cheats.preparedWin = true;
    Cheats.preparedJackpot = false;
    Cheats.winIndex = 4;

    console.log('done!');
  };

  public static truthGame = (): void => {
    Cheats.preparedWin = false;
    Cheats.preparedJackpot = false;

    console.log('done!');
  };
}
