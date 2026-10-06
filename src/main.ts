import * as Phaser from 'phaser';
import { GameScene } from './scenes/GameScene';
import { ResultScene } from './scenes/ResultScene';
import { ProfileScene } from './scenes/ProfileScene';

import { soundManager } from './systems/SoundManager';

declare global { interface Window { WiseXP?: any; } }

// Initialize WiseXP SDK
if (typeof window !== 'undefined' && window.WiseXP) {
    window.WiseXP.init('sentence-dash');
}

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.CANVAS,
    title: 'Reading Dash',
    parent: 'app',
    width: 420,
    height: 780,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    backgroundColor: '#F5F7FA',
    scene: [ProfileScene, GameScene, ResultScene],
    render: {
        antialias: true,
    }
};

soundManager.init();
const game = new Phaser.Game(config);

// 高解像度ディスプレイでのぼやけを解消
game.events.once('ready', () => {
    const canvas = game.canvas;
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    if (dpr > 1) {
        const w = canvas.width;
        const h = canvas.height;
        canvas.width = w * dpr;
        canvas.height = h * dpr;
        canvas.style.width = `${w}px`;
        canvas.style.height = `${h}px`;
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.scale(dpr, dpr);
    }
});
