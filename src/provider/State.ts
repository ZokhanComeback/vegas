import {events, subscriber} from '../events/events';
import {IGameStatus, IReward} from '../commonTypes/commonTypes';
import {Model} from '../model/Model';
import {defaultRewards, jackpot} from '../configs/Rewards';

//Application State
export class State {
  //values
  public static userBalance: number = 0;
  public static userSpins: number = 0;
  public static rewards: IReward[];
  public static gameIsReady: boolean = false;
  public static currentScreen: string[][] = [];
  public static scrollAreas: string[][] = [];
  public static resultScreen: string[][] = [];
  public static unitedArea: string[][] = [];
  public static gameStatus: IGameStatus = {
    isWin: false,
    isLoose: true,
    isJackpot: false,
    winnerIndex: 0
  };
  public static happyRow: number = 0;
  public static winnerHighlightFinished: boolean = false;

  //Methods
  public static loadData = async (): Promise<void> => {
    let token = localStorage.getItem('testUser');

    if (
      !token
    ) {
      token = await Model.setTestUser({
        firstname: 'Jhon',
        surname: 'Doe',
        balance: 40000,
        games: {
          vegas: {
            spinsAvailable: 5,
            totalGames: 0
          }
        }
      });
    }

    const user = await Model.getTestUser(token);

    State.finishLoading(user.balance, user.games.vegas.spinsAvailable, [...defaultRewards]);
  };

  public static showLoader = (): void => {
    const loader = document.querySelector('#preloader') as HTMLElement;

    if (
      !loader
    ) {
      return ;
    }

    loader.style.display = 'inline-block';
  };

  public static hideLoader = (): void => {
    const loader = document.querySelector('#preloader') as HTMLElement;

    if (
      !loader
    ) {
      return ;
    }

    loader.style.display = 'none';
  };

  public static setDefaultValue = (): void => {
    State.currentScreen = Model.getRandomLooseScreen();
    State.setScrollAreas();
    State.setResultScreen();
    State.concatAreas();
  };

  public static setScrollAreas = (): void => {
    State.scrollAreas = Model.getScrollAreas();
  };

  public static setResultScreen = (): void => {
    const result = Model.getResultScreen();

    State.gameStatus = {...result.gameStatus};
    State.resultScreen = result.screen;
    State.happyRow = result.happyRow;
  };

  public static concatAreas = (): void => {
    State.unitedArea = [
      ...State.currentScreen
        .map((col, index) => {
          return [
            ...col,
            ...State.scrollAreas[index]
          ];
        })
    ];
  };

  public static concatWinScreen = (): void => {
    State.unitedArea = [
      ...State.unitedArea
        .map((col, index) => {
          return [
            ...col,
            ...State.resultScreen[index]
          ];
        })
    ];
  };

  public static spineEnd = async (): Promise<void> => {
    switch (true) {
      case State.gameStatus.isLoose:
        State.finishGame();
        break;

      case State.gameStatus.isWin:
        State.runWinnerAnimation();
        const winData = await Model.sendGameResults(State.rewards[State.gameStatus.winnerIndex]);

        const foo = () => {
          State.removeWinnerHighlightEnd(foo);
          State.updateBalance(winData.balance, winData.games.vegas.spinsAvailable);
          State.finishGame();
        };

        if (
          State.winnerHighlightFinished
        ) {
          foo();
        } else {
          State.onWinnerHighlightEnd(foo);
        }

        break;

      case State.gameStatus.isJackpot:
        State.runWinnerAnimation();
        const jackpotData = await Model.sendGameResults(jackpot);

        const bar = () => {
          State.removeWinnerHighlightEnd(bar);
          State.updateBalance(jackpotData.balance, jackpotData.games.vegas.spinsAvailable);
          State.finishGame();
        };

        if (
          State.winnerHighlightFinished
        ) {
          bar();
        } else {
          State.onWinnerHighlightEnd(bar);
        }

        break;
    }
  };

  public static areaRecovery = (): void => {
    State.currentScreen = [
      ...State.unitedArea.map(col => col.filter((_item, index,arr) => index >= arr.length - 3))
    ];

    State.unitedArea = [
      ...State.unitedArea.map(col => col.slice(0, col.length - 3))
    ];

    State.resultScreen = [];
  };

  //Event emitters
  public static finishLoading = (
    balance: number,
    tries: number,
    rewards: IReward[]
  ): void => {
    State.userBalance = balance;
    State.userSpins = tries;
    State.rewards = [...rewards];

    subscriber.emit(events.dataLoaded);
  };

  public static startGame = async (): Promise<void> => {
    State.setResultScreen();
    State.concatWinScreen();
    const newProfile = await Model.startGame();
    State.updateBalance(newProfile.balance, newProfile.games.vegas.spinsAvailable);
    State.winnerHighlightFinished = false;
    subscriber.emit(events.gameStarted);
  };

  public static finishGame = (): void => {
    State.areaRecovery();
    subscriber.emit(events.gameFinished);
  };

  public static updateBalance = (
    balance: number,
    spins: number
  ): void => {
    State.userBalance = balance;
    State.userSpins = spins;

    subscriber.emit(events.balanceUpdated);
  };

  public static gameLoop = (): void => {
    State.gameIsReady = true;

    subscriber.emit(events.gameLoop);
  };

  public static runWinnerAnimation = (): void => {
    subscriber.emit(events.winnerAnimation, State.happyRow);
  };

  public static winnerHighlightEnd = (): void => {
    State.winnerHighlightFinished = true;
    subscriber.emit(events.winnerHighlightEnd);
  };

  //Event listeners
  public static onLoadingEnd = (callback: () => void): void => {
    subscriber.on(events.dataLoaded, callback);
  };

  public static onGameStarted = (callback: () => void): void => {
    subscriber.on(events.gameStarted, callback);
  };

  public static onBalanceUpdated = (callback: () => void): void => {
    subscriber.on(events.balanceUpdated, callback);
  };

  public static onGameFinished = (callback: () => void): void => {
    subscriber.on(events.gameFinished, callback);
  };

  public static onGameLoop = (callback: () => void): void => {
    subscriber.on(events.gameLoop, callback);
  };

  public static onWinnerAnimation = (callback: (row: number) => void): void => {
    subscriber.on(events.winnerAnimation, callback);
  };

  public static removeWinnerAnimationListener = (callback: (row: number) => void): void => {
    subscriber.removeListener(events.winnerAnimation, callback);
  };

  public static onWinnerHighlightEnd = (callback: () => void): void => {
    subscriber.on(events.winnerHighlightEnd, callback);
  };

  public static removeWinnerHighlightEnd = (callback: () => void): void => {
    subscriber.removeListener(events.winnerHighlightEnd, callback);
  };
}
