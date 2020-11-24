// For model

export interface IProfileGameData {
  spinsAvailable: number;
  totalGames: number;
}

export interface IProfile {
  name?: string;
  firstname: string;
  surname: string;
  balance: number;
  games: {
    vegas: IProfileGameData
  }
}

export interface IWinArea {
  row: number;
  area: string[][];
}

// Universal

export interface IReward {
  type: string;
  amount: number;
  percent: number;
}

export interface IArea {
  width: number;
  height: number;
}

export interface IGameStatus {
  isWin: boolean;
  isLoose: boolean;
  isJackpot: boolean;
  winnerIndex: number;
}

export interface IFate {
  screen: string[][];
  happyRow: number;
  gameStatus: IGameStatus;
}

export interface IParticleOptions {
  startColor: string;
  endColor: string;
  x: number;
  y: number;
}
