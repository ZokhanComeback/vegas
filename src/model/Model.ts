//There is demonstration of my work with API. It's not a real project
import {IFate, IGameStatus, IProfile, IReward, IWinArea} from '../commonTypes/commonTypes';
import {Helpers} from "../helpers/Helpers";
import {Cheats} from "../cheats/Cheats";
import {defaultRewards, slotValues} from "../configs/Rewards";

export class Model {
  public static setTestUser = async (profile: IProfile): Promise<string> => {
    const response = await fetch('https://test-slots-85b25.firebaseio.com/users.json', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(profile)
    });

    const data = await response.json();

    localStorage.setItem('testUser', data.name);

    return data.name;
  };

  public static getTestUser = async (token: string): Promise<IProfile> => {
    const response = await fetch(`https://test-slots-85b25.firebaseio.com/users/${token}.json`, {
      method: 'GET',
      headers: {'Content-Type': 'application/json'}
    });

    return await response.json();
  };

  public static setNewData = async (newData: IProfile): Promise<void> => {
    const token = localStorage.getItem('testUser');

    return new Promise(async res => {
      await fetch(`https://test-slots-85b25.firebaseio.com/users/${token}.json`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(newData)
      });

      res();
    });
  };

  public static startGame = async (): Promise<IProfile> => {
    return new Promise( async res => {
      const newData = await Model.getTestUser(localStorage.getItem('testUser')!);

      if (
        newData.games.vegas.spinsAvailable > 0
      ) {
        newData.games.vegas.spinsAvailable -= 1;
      } else {
        newData.balance -= 50;
      }

      await Model.setNewData(newData);

      res(newData);
    });
  };

  public static sendGameResults = async (results: IReward): Promise<IProfile> => {
    return new Promise(async res => {
      const token = localStorage.getItem('testUser');

      const newData = await Model.getTestUser(localStorage.getItem('testUser')!);

      switch (results.type) {
        case 'extra':
          newData.games.vegas.spinsAvailable += results.amount;
          break;

        case 'cent':
          newData.balance += results.amount;
          break;
      }

      await fetch(`https://test-slots-85b25.firebaseio.com/users/${token}.json`, {
        method: 'PATCH',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(newData)
      });

      await Model.setNewData(newData);

      res(newData);
    });
  };

  public static getRandomLooseScreen = (): string[][] => {
    const area: number[][] = [];

    for (let i = 0; i < 5; i++) {
      const col: number[] = [];

      for (let j = 0; j < 3; j++) {
        let temp = 10;

        if (
          i === 0 && j === 0
        ) {
          temp = Helpers.getRandomInt(1, 4);
        } else if (
          i === 0 && j > 0
        ) {
          temp = Helpers.getRandomInt(0, 4, [col[j - 1]]);
        } else if (
          i > 0 && j === 0
        ) {
          temp = Helpers.getRandomInt(1, 4, [ area[i - 1][j] ]);
        } else {
          temp = Helpers.getRandomInt(0, 4, [ area[i - 1][j], col[j - 1] ]);
        }

        col.push(temp);
      }

      area.push(col);
    }

    return Model.mapNumbersToValues(area);
  };

  public static getScrollAreas = () => {
    const first = Model.getRandomLooseScreen();
    const second = Model.getRandomLooseScreen();
    const third = Model.getRandomLooseScreen();

    return first.map((col, index) => {
      const additional: string[] = [];

      switch (index) {
        case 1:
          additional.push(...col);
          break;
        case 2:
          additional.push(...col, ...second[index]);
          break;
        case 3:
          additional.push(...col, ...second[index], ...third[index]);
          break;
        case 4:
          additional.push(...col, ...second[index], ...third[index], ...first.reverse()[index]);
          break;
      }

      return [
        ...col,
        ...second[index],
        ...third[index],
        ...first.reverse()[index],
        ...second.reverse()[index],
        ...third.reverse()[index],
        ...first.map(col => col.reverse())[index],
        ...second.map(col => col.reverse())[index],
        ...third.map(col => col.reverse())[index],
        ...first.map(col => col.reverse()).reverse()[index],
        ...second.map(col => col.reverse()).reverse()[index],
        ...third.map(col => col.reverse()).reverse()[index],
        ...additional
      ];
    });
  };

  public static getWinScreen = (symbol: string): IWinArea => {
    const random = Model.getRandomLooseScreen();
    const happyRow = Helpers.getRandomInt(0, 2);

    return {
      row: happyRow,
      area: random.map(col => col.map((item, index) => index === happyRow ? symbol : item))
    };
  };

  public static getJackpotScreen = (): IWinArea => {
    const random = Model.getRandomLooseScreen();
    const happyRow = Helpers.getRandomInt(0, 2);

    const area = random.map((col, colIndex) => {
      return col.map((item, index) => {
        if (
          index === happyRow
        ) {
          return slotValues[colIndex]
        } else {
          return item;
        }
      });
    });

    return {
      row: happyRow,
      area
    };
  };

  public static getResultScreen = (): IFate => {
    const status = Model.getFate();

    switch(true) {
      case status.isWin:
        let winData = Model.getWinScreen(slotValues[status.winnerIndex]);
        return {
          gameStatus: status,
          screen: winData.area,
          happyRow: winData.row
        };

      case status.isLoose:
        status.isWin = false;
        status.isLoose = true;
        status.winnerIndex = 4;
        return {
          gameStatus: status,
          screen: Model.getRandomLooseScreen(),
          happyRow: 0
        };

      case status.isJackpot:
        let jackpotData = Model.getJackpotScreen();
        return {
          gameStatus: status,
          screen: jackpotData.area,
          happyRow: jackpotData.row
        };

      default:
        return {
          gameStatus: status,
          screen: Model.getRandomLooseScreen(),
          happyRow: 0
        };
    }
  };

  public static getFate = (): IGameStatus => {
    const result: IGameStatus = {
      isWin: false,
      isLoose: true,
      isJackpot: false,
      winnerIndex: 0
    };

    if (
      Cheats.preparedWin
    ) {
      result.isLoose = false;
      result.isWin = true;
      result.winnerIndex = Cheats.winIndex;
    } else if (
      Cheats.preparedJackpot
    ) {
      result.isLoose = false;
      result.isJackpot = true;
    }

    const winPercentSum: number = defaultRewards.map(r => r.percent).reduce((prev, curr) => prev += curr);
    const jackpotPercent = 1;
    const unluckPercent = 100 - jackpotPercent - winPercentSum;

    const random = Helpers.getRandomInt(1, 100);

    if (
      random <= unluckPercent
    ) {
      return result;
    } else if (
      random === 100
    ) {
      result.isLoose = false;
      result.isJackpot = true;
      return result;
    } else {
      let counter = random;

      for (let i = 0; i < defaultRewards.length; i++) {
        if (
          counter <= unluckPercent + defaultRewards[i].percent
        ) {
          result.isLoose = false;
          result.isWin = true;
          result.winnerIndex = i;
          return result;
        } else {
          counter += defaultRewards[i].percent;
        }
      }

      return result;
    }
  };

  public static mapNumbersToValues = (area: number[][]) => {
    return area.map(col => col.map(item => slotValues[item]));
  };
}
