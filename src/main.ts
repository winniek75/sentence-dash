import * as Phaser from 'phaser';
import { GameScene } from './scenes/GameScene';
import { ResultScene } from './scenes/ResultScene';
import { ProfileScene } from './scenes/ProfileScene';

import { soundManager } from './systems/SoundManager';

declare global { interface Window { WiseXP?: any; } }

if (typeof window !== 'undefined' && window.WiseXP) {
    window.WiseXP.init('sentence-dash');
}

const DPR = Math.min(window.devicePixelRatio || 1, 2);
// Export globally for scenes to use
(window as any).__RD_S = DPR;

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.CANVAS,
    title: 'Reading Dash',
    parent: 'app',
    width: Math.round(960 * DPR),
    height: Math.round(540 * DPR),
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        expandParent: true,
    },
    backgroundColor: '#F5F7FA',
    scene: [ProfileScene, GameScene, ResultScene],
    render: {
        antialias: true,
    },
    input: {
        activePointers: 1,
        touch: { capture: true },
    }
};

soundManager.init();
new Phaser.Game(config);
