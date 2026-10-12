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
new Phaser.Game(config);

// DPR処理を削除 — Phaser の Scale.FIT がポインター座標を正しく変換するので
// canvas サイズを手動で変更するとタッチ座標がずれる原因になる
