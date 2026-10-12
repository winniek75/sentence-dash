import * as Phaser from 'phaser';
import { GameScene } from './scenes/GameScene';
import { ResultScene } from './scenes/ResultScene';
import { ProfileScene } from './scenes/ProfileScene';

import { soundManager } from './systems/SoundManager';

declare global { interface Window { WiseXP?: any; } }

if (typeof window !== 'undefined' && window.WiseXP) {
    window.WiseXP.init('sentence-dash');
}

// Retina 対応:
// キャンバスを DPR 倍の解像度で作り、カメラを DPR 倍にズームする。
// ゲーム座標は 960×540 のまま変わらない。テキスト等が鮮明に描画される。
const DPR = Math.min(window.devicePixelRatio || 1, 2);

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
const game = new Phaser.Game(config);

// 各シーンの create 後にカメラズーム+中央寄せを適用
game.scene.scenes.forEach((s) => {
    s.events.on('create', () => {
        if (DPR > 1) {
            s.cameras.main.setZoom(DPR);
            s.cameras.main.centerOn(960 / 2, 540 / 2);
        }
    });
});
