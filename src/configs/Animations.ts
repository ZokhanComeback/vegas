import {IParticleOptions} from '../commonTypes/commonTypes';

export const colorsForWin: number[] = [
  0xF8A91C,
  0xEE423E,
  0xFEF101,
  0x00AEAF,
  0x0468B4,
  0x5D3198
];

export const particleBlast = {
  "alpha": {
    "start": 1,
    "end": 1
  },
  "scale": {
    "start": 0.15,
    "end": 0.10,
    "minimumScaleMultiplier": 3
  },
  "color": {
    "start": "#9cf2ff",
    "end": "#12e647"
  },
  "speed": {
    "start": 120,
    "end": 50,
    "minimumSpeedMultiplier": 2
  },
  "acceleration": {
    "x": 0,
    "y": 0
  },
  "maxSpeed": 0,
  "startRotation": {
    "min": 0,
    "max": 360
  },
  "noRotation": true,
  "rotationSpeed": {
    "min": 5,
    "max": 5
  },
  "lifetime": {
    "min": 100,
    "max": 200
  },
  "blendMode": "normal",
  "frequency": 0.001,
  "emitterLifetime": -1,
  "maxParticles": 200,
  "pos": {
    "x": 50,
    "y": 50
  },
  "addAtBack": false,
  "spawnType": "circle",
  "spawnCircle": {
    "x": 3,
    "y": 10,
    "r": 5
  }
};

export const getParticleBlast = (options: IParticleOptions): any => {
  return {
    ...particleBlast,
    "color": {
      "start": options.startColor,
      "end": options.endColor
    },
    "pos": {
      "x": options.x,
      "y": options.y
    }
  }
}

export const colorForParticles = [
  '#BEE6E8',
  '#B1C6E5',
  '#8E93C5',
  '#9196C8',
  '#BAAFD7',
  '#E2CFE4',
  '#FAD4D3',
  '#FED1C0',
  '#FADEC9',
  '#FBF587'
];
