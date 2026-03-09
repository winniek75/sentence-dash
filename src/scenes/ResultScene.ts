import * as Phaser from 'phaser';
import { SaveManager } from '../systems/SaveManager';

export class ResultScene extends Phaser.Scene {
    private score: number = 0;

    constructor() {
        super({ key: 'ResultScene' });
    }

    init(data: { score: number; sessionId?: string }) {
        this.score = data.score;
    }

    create() {
        // bg
        this.add.rectangle(195, 422, 390, 844, 0x1a1a2e);
        
        this.add.text(195, 200, 'FINISHED!', { fontFamily: 'Fredoka One', fontSize: '48px', color: '#FFD700' }).setOrigin(0.5);
        this.add.text(195, 300, `SCORE: ${this.score}`, { fontFamily: 'Fredoka One', fontSize: '36px', color: '#fff' }).setOrigin(0.5);
        
        // Save progress highscore
        SaveManager.updateHighScore(this.score);

        const promptText = this.add.text(195, 450, "Write Today's 'My Sentence'!\nTap Here to Input", { 
            fontFamily: 'Nunito', 
            fontSize: '20px', 
            color: '#4CAF50',
            align: 'center'
        }).setOrigin(0.5).setInteractive();

        promptText.on('pointerdown', () => {
            const sentence = window.prompt("Today's 'My Sentence' (ex: I play soccer every day.):");
            if (sentence) {
                const progress = SaveManager.loadProgress();
                progress.mySentences.push({
                    date: new Date().toISOString().split('T')[0],
                    sentence: sentence,
                    sessionScore: this.score
                });
                SaveManager.saveProgress(progress);
                
                promptText.setText(`Saved:\n"${sentence}"\n\nTap to Restart`);
                promptText.setStyle({ color: '#fff' });
                
                // Switch action to restart
                promptText.removeAllListeners('pointerdown');
                promptText.on('pointerdown', () => {
                    this.scene.start('GameScene');
                });
            }
        });
        
        const skipText = this.add.text(195, 600, "Skip & Restart", { fontFamily: 'Nunito', fontSize: '20px', color: '#aaa' }).setOrigin(0.5).setInteractive();
        skipText.on('pointerdown', () => {
            this.scene.start('GameScene');
        });
    }
}
