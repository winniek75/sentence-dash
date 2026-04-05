import * as Phaser from 'phaser';
import { GameScene } from './scenes/GameScene';
import { ResultScene } from './scenes/ResultScene';
import { ProfileScene } from './scenes/ProfileScene';

import { soundManager } from './systems/SoundManager';

const config: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    title: 'Reading Dash',
    parent: 'app',
    width: 420,
    height: 780,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    backgroundColor: '#F5F7FA',
    scene: [ProfileScene, GameScene, ResultScene]
};

soundManager.init();
new Phaser.Game(config);
