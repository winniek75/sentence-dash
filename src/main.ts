import * as Phaser from 'phaser';
import { GameScene } from './scenes/GameScene';
import { ResultScene } from './scenes/ResultScene';
import { ProfileScene } from './scenes/ProfileScene';

import { soundManager } from './systems/SoundManager';

declare global { interface Window { WiseXP?: any; } }

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

// テキストの鮮明化: 全シーンの Text オブジェクトの resolution を DPR に設定
const DPR = Math.min(window.devicePixelRatio || 1, 3);
game.scene.scenes.forEach((s) => {
    s.events.on('create', () => {
        s.children.list.forEach((child) => {
            if (child instanceof Phaser.GameObjects.Text) {
                child.setResolution(DPR);
            }
        });
    });
});
