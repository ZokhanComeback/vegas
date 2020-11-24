export class Helpers {
  static getDevice = (): string => {
    switch (true) {
      case window.innerWidth > 1200
      && window.innerHeight * 2 > window.innerWidth
      && window.innerWidth * 2 > window.innerHeight:
        return 'desktop';

      case window.innerWidth > window.innerHeight:
        return 'device-h';

      case window.innerWidth < window.innerHeight:
        return 'device-v';

      default:
        return 'desktop';
    }
  };

  static getRandomInt = (min: number, max: number, without?: number[]): number => {
    let result = Math.floor(min + Math.random() * (max + 1 - min));

    if (without && without.some(n => result === n)) {
      return Helpers.getRandomInt(min, max, without);
    } else {
      return result;
    }
  };
}
