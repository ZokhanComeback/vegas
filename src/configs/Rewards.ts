import {IReward} from '../commonTypes/commonTypes';

//Hardcoded! Test rewards for use. Another 70 percents - absolutely unlucky.
export const defaultRewards: IReward[] = [
  {
    type: 'cent',
    amount: 20,
    percent: 10
  },
  {
    type: 'extra',
    amount: 1,
    percent: 8
  },
  {
    type: 'cent',
    amount: 200,
    percent: 6
  },
  {
    type: 'extra',
    amount: 3,
    percent: 4
  },
  {
    type: 'cent',
    amount: 50000,
    percent: 2
  }
];

export const jackpot = {
  type: 'cent',
  amount: 200000,
  percent: 1
};

export const slotValues = ['j', 'o', 'k', 'e', 'r'];
