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
    width: 960,
    height: 540,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    backgroundColor: '#F5F7FA',
    scene: [ProfileScene, GameScene, ResultScene],
    render: {
        antialias: true,
        pixelArt: false,
    },
    input: {
        activePointers: 1,
        touch: {
            capture: true,
        }
    }
};

soundManager.init();
const game = new Phaser.Game(config);

// 高解像度ディスプレイ対応:
// Phaser がポインター座標を管理した後で、canvas の描画バッファだけ拡大する。
// scale.refresh() を呼ぶことで入力座標も再計算される。
game.events.once('ready', () => {
    const canvas = game.canvas;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    if (dpr > 1) {
        const cssW = canvas.clientWidth;
        const cssH = canvas.clientHeight;
        canvas.width = Math.round(cssW * dpr);
        canvas.height = Math.round(cssH * dpr);
        canvas.style.width = cssW + 'px';
        canvas.style.height = cssH + 'px';
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.scale(dpr, dpr);
        // Phaserの入力座標を再計算
        game.scale.refresh();
    }
});
