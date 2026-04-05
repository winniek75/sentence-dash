import * as Phaser from 'phaser';
import { SaveManager } from '../systems/SaveManager';

export class ProfileScene extends Phaser.Scene {
    private selectedLevel: 'easy' | 'medium' | 'hard' = 'easy';
    private progress = SaveManager.loadProgress();

    constructor() {
        super({ key: 'ProfileScene' });
    }

    create() {
        this.progress = SaveManager.loadProgress();
        this.selectedLevel = this.progress.selectedLevel || 'easy';

        const W = 420;
        const H = 780;

        // Background gradient (light theme)
        const bg = this.add.graphics();
        bg.fillGradientStyle(0xE8F0FE, 0xE8F0FE, 0xD4E4FC, 0xD4E4FC, 1);
        bg.fillRect(0, 0, W, H);

        // Decorative circles
        this.add.circle(60, 80, 100, 0xC5D8F7, 0.4);
        this.add.circle(380, 650, 130, 0xC5D8F7, 0.3);

        // Title
        const title = this.add.text(W / 2, 80, 'Reading Dash', {
            fontFamily: 'Fredoka One', fontSize: '40px', color: '#2D5BCC',
            stroke: '#fff', strokeThickness: 3
        }).setOrigin(0.5);

        this.add.text(W / 2, 125, 'English Reading Training', {
            fontFamily: 'Nunito', fontSize: '16px', color: '#5B7DB8'
        }).setOrigin(0.5);

        this.tweens.add({
            targets: [title],
            y: '-=4',
            yoyo: true,
            repeat: -1,
            duration: 1800,
            ease: 'Sine.easeInOut'
        });

        // --- Name Input Card ---
        this.createNameCard(W / 2, 210);

        // --- Difficulty Selector ---
        this.add.text(W / 2, 310, 'Difficulty', {
            fontFamily: 'Fredoka One', fontSize: '22px', color: '#3A5FA0'
        }).setOrigin(0.5);

        const levels: Array<{ level: 'easy' | 'medium' | 'hard'; label: string; stars: string; color: number }> = [
            { level: 'easy', label: 'Easy', stars: '\u2B50', color: 0x4CAF50 },
            { level: 'medium', label: 'Medium', stars: '\u2B50\u2B50', color: 0xFF9800 },
            { level: 'hard', label: 'Hard', stars: '\u2B50\u2B50\u2B50', color: 0xF44336 }
        ];

        const levelButtons: Array<{ bg: Phaser.GameObjects.Graphics; text: Phaser.GameObjects.Text; starsText: Phaser.GameObjects.Text; level: 'easy' | 'medium' | 'hard' }> = [];

        levels.forEach((item, i) => {
            const bx = 75 + i * 120;
            const by = 380;
            const isSelected = this.selectedLevel === item.level;

            const btnBg = this.add.graphics();
            if (isSelected) {
                btnBg.fillStyle(item.color, 1);
                btnBg.fillRoundedRect(bx - 50, by - 40, 100, 80, 14);
            } else {
                btnBg.fillStyle(0xFFFFFF, 1);
                btnBg.fillRoundedRect(bx - 50, by - 40, 100, 80, 14);
                btnBg.lineStyle(2, item.color, 0.6);
                btnBg.strokeRoundedRect(bx - 50, by - 40, 100, 80, 14);
            }

            const labelColor = isSelected ? '#FFFFFF' : '#333333';
            const labelText = this.add.text(bx, by - 12, item.label, {
                fontFamily: 'Fredoka One', fontSize: '18px', color: labelColor
            }).setOrigin(0.5);

            const starsText = this.add.text(bx, by + 15, item.stars, {
                fontSize: '18px'
            }).setOrigin(0.5);

            const zone = this.add.zone(bx, by, 100, 80).setInteractive({ useHandCursor: true });
            zone.on('pointerdown', () => {
                this.selectedLevel = item.level;
                this.progress.selectedLevel = item.level;
                SaveManager.saveProgress(this.progress);
                this.scene.restart();
            });

            levelButtons.push({ bg: btnBg, text: labelText, starsText, level: item.level });
        });

        // --- High Score Display ---
        if (this.progress.highScore > 0) {
            const scoreBg = this.add.graphics();
            scoreBg.fillStyle(0xFFFFFF, 0.8);
            scoreBg.fillRoundedRect(W / 2 - 150, 460, 300, 60, 12);

            this.add.text(W / 2, 475, `High Score: ${this.progress.highScore}`, {
                fontFamily: 'Fredoka One', fontSize: '20px', color: '#FF9800'
            }).setOrigin(0.5);

            this.add.text(W / 2, 500, `Total: ${this.progress.totalScore} pts`, {
                fontFamily: 'Nunito', fontSize: '14px', color: '#888'
            }).setOrigin(0.5);
        }

        // --- Start Button ---
        const startY = this.progress.highScore > 0 ? 580 : 500;

        const startBg = this.add.graphics();
        startBg.fillStyle(0x2D5BCC, 1);
        startBg.fillRoundedRect(W / 2 - 110, startY - 30, 220, 60, 30);

        // Shadow
        const startShadow = this.add.graphics();
        startShadow.fillStyle(0x1A3D8F, 0.4);
        startShadow.fillRoundedRect(W / 2 - 107, startY - 27, 220, 60, 30);
        startShadow.setDepth(-1);

        const startText = this.add.text(W / 2, startY, 'START', {
            fontFamily: 'Fredoka One', fontSize: '28px', color: '#FFFFFF'
        }).setOrigin(0.5);

        const startZone = this.add.zone(W / 2, startY, 220, 60).setInteractive({ useHandCursor: true });

        startZone.on('pointerover', () => {
            this.tweens.add({ targets: startText, scaleX: 1.08, scaleY: 1.08, duration: 100 });
        });
        startZone.on('pointerout', () => {
            this.tweens.add({ targets: startText, scaleX: 1, scaleY: 1, duration: 100 });
        });
        startZone.on('pointerdown', () => {
            // Ensure name is set
            if (!this.progress.playerName) {
                this.progress.playerName = 'Player';
            }
            SaveManager.saveProgress(this.progress);
            this.cameras.main.fadeOut(300, 255, 255, 255);
            this.time.delayedCall(300, () => {
                this.scene.start('GameScene', { level: this.selectedLevel });
            });
        });

        // Fade in
        this.cameras.main.fadeIn(300, 255, 255, 255);
    }

    private createNameCard(x: number, y: number) {
        const cardBg = this.add.graphics();
        cardBg.fillStyle(0xFFFFFF, 0.9);
        cardBg.fillRoundedRect(x - 170, y - 35, 340, 70, 14);
        cardBg.lineStyle(2, 0xD0D8E8, 1);
        cardBg.strokeRoundedRect(x - 170, y - 35, 340, 70, 14);

        this.add.text(x - 150, y - 22, 'Your Name', {
            fontFamily: 'Nunito', fontSize: '12px', color: '#8899BB'
        });

        const displayName = this.progress.playerName || 'Tap to enter name';
        const nameColor = this.progress.playerName ? '#333333' : '#AABBCC';

        this.add.text(x - 150, y + 2, displayName, {
            fontFamily: 'Nunito', fontSize: '20px', color: nameColor, fontStyle: 'bold'
        });

        this.add.text(x + 140, y - 5, '\u270F\uFE0F', { fontSize: '20px' }).setOrigin(0.5);

        const zone = this.add.zone(x, y, 340, 70).setInteractive({ useHandCursor: true });
        zone.on('pointerdown', () => {
            const name = window.prompt("Your Name:", this.progress.playerName || '');
            if (name !== null && name.trim()) {
                this.progress.playerName = name.trim();
                SaveManager.saveProgress(this.progress);
                this.scene.restart();
            }
        });
    }
}
