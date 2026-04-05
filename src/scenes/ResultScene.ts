import * as Phaser from 'phaser';
import { SaveManager } from '../systems/SaveManager';

interface ResultData {
    score: number;
    sessionId?: string;
    bestCombo?: number;
    accuracy?: number;
    questionsAnswered?: number;
    questionsCorrect?: number;
    grammarMistakes?: Record<string, number>;
}

export class ResultScene extends Phaser.Scene {
    private resultData!: ResultData;

    constructor() {
        super({ key: 'ResultScene' });
    }

    init(data: ResultData) {
        this.resultData = data;
    }

    create() {
        const {
            score, bestCombo = 0, accuracy = 0,
            questionsAnswered = 0, questionsCorrect = 0,
            grammarMistakes = {}
        } = this.resultData;

        // Background
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x0f3460, 0x0f3460, 1);
        bg.fillRect(0, 0, 390, 844);

        // Save progress
        SaveManager.updateHighScore(score);

        // === Header ===
        const headerText = score >= 500 ? 'GREAT JOB!' : score >= 200 ? 'NICE TRY!' : 'KEEP GOING!';
        const headerColor = score >= 500 ? '#FFD700' : score >= 200 ? '#4CAF50' : '#42A5F5';

        const header = this.add.text(195, 60, headerText, {
            fontFamily: 'Fredoka One', fontSize: '42px', color: headerColor,
            stroke: '#000', strokeThickness: 4
        }).setOrigin(0.5).setAlpha(0).setScale(0.5);

        this.tweens.add({
            targets: header,
            alpha: 1, scale: 1,
            duration: 600,
            ease: 'Back.out'
        });

        // === Score Card ===
        const scoreCardBg = this.add.graphics();
        scoreCardBg.fillStyle(0x2a2a4a, 0.9);
        scoreCardBg.fillRoundedRect(25, 110, 340, 160, 16);
        scoreCardBg.lineStyle(2, 0xFFD700, 0.3);
        scoreCardBg.strokeRoundedRect(25, 110, 340, 16, 16);

        this.add.text(195, 140, `${score}`, {
            fontFamily: 'Fredoka One', fontSize: '56px', color: '#FFD700'
        }).setOrigin(0.5);

        this.add.text(195, 180, 'POINTS', {
            fontFamily: 'Nunito', fontSize: '14px', color: '#8888bb'
        }).setOrigin(0.5);

        // Stats row
        const statsY = 230;
        // Accuracy
        this.createStatBox(80, statsY, `${accuracy}%`, 'Accuracy',
            accuracy >= 80 ? '#4CAF50' : accuracy >= 50 ? '#FF9800' : '#FF5252');
        // Best combo
        this.createStatBox(195, statsY, `${bestCombo}x`, 'Best Combo', '#42A5F5');
        // Questions
        this.createStatBox(310, statsY, `${questionsCorrect}/${questionsAnswered}`, 'Correct', '#AB47BC');

        // === Weak Areas Section ===
        const mistakeEntries = Object.entries(grammarMistakes)
            .sort((a, b) => b[1] - a[1]);

        if (mistakeEntries.length > 0) {
            const weakBg = this.add.graphics();
            weakBg.fillStyle(0x2a2a4a, 0.9);
            const weakHeight = Math.min(mistakeEntries.length, 4) * 35 + 50;
            weakBg.fillRoundedRect(25, 290, 340, weakHeight, 16);

            this.add.text(45, 305, 'Areas to Review', {
                fontFamily: 'Fredoka One', fontSize: '16px', color: '#FF9800'
            });

            const displayMistakes = mistakeEntries.slice(0, 4);
            displayMistakes.forEach(([tag, count], i) => {
                const tagDisplay = tag.replace(/_/g, ' ');
                const y = 340 + i * 35;

                this.add.text(55, y, tagDisplay, {
                    fontFamily: 'Nunito', fontSize: '16px', color: '#ddd'
                });

                // Mistake count indicator
                const barWidth = Math.min(count * 30, 100);
                const barBg = this.add.graphics();
                barBg.fillStyle(0xFF5252, 0.3);
                barBg.fillRoundedRect(250, y + 2, 100, 16, 8);
                barBg.fillStyle(0xFF5252, 0.8);
                barBg.fillRoundedRect(250, y + 2, barWidth, 16, 8);

                this.add.text(355, y + 2, `${count}`, {
                    fontFamily: 'Nunito', fontSize: '12px', color: '#FF8A80'
                }).setOrigin(0.5, 0);
            });
        }

        // === My Sentence Section ===
        const sentenceY = mistakeEntries.length > 0
            ? 300 + Math.min(mistakeEntries.length, 4) * 35 + 70
            : 310;

        const sentenceBg = this.add.graphics();
        sentenceBg.fillStyle(0x2a2a4a, 0.9);
        sentenceBg.fillRoundedRect(25, sentenceY, 340, 90, 16);
        sentenceBg.lineStyle(1, 0x4CAF50, 0.3);
        sentenceBg.strokeRoundedRect(25, sentenceY, 340, 90, 16);

        const promptText = this.add.text(195, sentenceY + 25, "Write Today's Sentence!", {
            fontFamily: 'Fredoka One', fontSize: '18px', color: '#4CAF50'
        }).setOrigin(0.5);

        const promptSub = this.add.text(195, sentenceY + 55, 'Tap here to write', {
            fontFamily: 'Nunito', fontSize: '14px', color: '#8888bb'
        }).setOrigin(0.5);

        const sentenceZone = this.add.zone(195, sentenceY + 45, 340, 90)
            .setInteractive({ useHandCursor: true });

        sentenceZone.on('pointerdown', () => {
            const sentence = window.prompt("Today's Sentence (ex: I play soccer every day.):");
            if (sentence) {
                const progress = SaveManager.loadProgress();
                progress.mySentences.push({
                    date: new Date().toISOString().split('T')[0],
                    sentence: sentence,
                    sessionScore: score
                });
                SaveManager.saveProgress(progress);

                promptText.setText(`"${sentence}"`);
                promptText.setColor('#fff');
                promptText.setFontSize('16px');
                promptSub.setText('Saved!');
                promptSub.setColor('#4CAF50');
            }
        });

        // === Buttons ===
        const btnY = sentenceY + 130;

        // Play Again button
        this.createButton(120, btnY, 'PLAY AGAIN', 0x4CAF50, () => {
            this.cameras.main.fadeOut(300, 0, 0, 0);
            this.time.delayedCall(300, () => this.scene.start('GameScene'));
        });

        // Profile button
        this.createButton(280, btnY, 'PROFILE', 0x42A5F5, () => {
            this.cameras.main.fadeOut(300, 0, 0, 0);
            this.time.delayedCall(300, () => this.scene.start('ProfileScene'));
        });

        // Fade in
        this.cameras.main.fadeIn(400, 0, 0, 0);
    }

    private createStatBox(x: number, y: number, value: string, label: string, color: string) {
        this.add.text(x, y, value, {
            fontFamily: 'Fredoka One', fontSize: '22px', color: color
        }).setOrigin(0.5);

        this.add.text(x, y + 25, label, {
            fontFamily: 'Nunito', fontSize: '11px', color: '#8888bb'
        }).setOrigin(0.5);
    }

    private createButton(x: number, y: number, text: string, color: number, onClick: () => void) {
        const btnBg = this.add.graphics();
        btnBg.fillStyle(color, 1);
        btnBg.fillRoundedRect(x - 65, y - 22, 130, 44, 22);

        const btnText = this.add.text(x, y, text, {
            fontFamily: 'Fredoka One', fontSize: '16px', color: '#fff'
        }).setOrigin(0.5);

        const zone = this.add.zone(x, y, 130, 44).setInteractive({ useHandCursor: true });
        zone.on('pointerdown', onClick);
        zone.on('pointerover', () => {
            this.tweens.add({ targets: btnText, scaleX: 1.1, scaleY: 1.1, duration: 100 });
        });
        zone.on('pointerout', () => {
            this.tweens.add({ targets: btnText, scaleX: 1, scaleY: 1, duration: 100 });
        });
    }
}
