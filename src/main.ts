import * as Phaser from 'phaser';
import { GameScene } from './scenes/GameScene';
import { ResultScene } from './scenes/ResultScene';
import { ProfileScene } from './scenes/ProfileScene';

import { soundManager } from './systems/SoundManager';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    title: 'Sentence Dash',
    parent: 'app',
    width: 390,
    height: 844,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0, x: 0 },
            debug: false
        }
    },
    backgroundColor: '#1a1a2e',
    scene: [ProfileScene, GameScene, ResultScene]
};

soundManager.init();
new Phaser.Game(config);
