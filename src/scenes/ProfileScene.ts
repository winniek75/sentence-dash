import * as Phaser from 'phaser';
import { SaveManager } from '../systems/SaveManager';

export class ProfileScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ProfileScene' });
    }

    create() {
        // Background
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x0f3460, 0x0f3460, 1);
        bg.fillRect(0, 0, 390, 844);

        // Decorative circles
        this.add.circle(50, 100, 80, 0x16213e, 0.3);
        this.add.circle(340, 700, 120, 0x16213e, 0.3);

        // Title with glow effect
        const titleShadow = this.add.text(195, 82, 'YOUR PROFILE', {
            fontFamily: 'Fredoka One', fontSize: '36px', color: '#000000'
        }).setOrigin(0.5).setAlpha(0.3);

        const title = this.add.text(195, 80, 'YOUR PROFILE', {
            fontFamily: 'Fredoka One', fontSize: '36px', color: '#FFD700',
            stroke: '#000', strokeThickness: 2
        }).setOrigin(0.5);

        // Animate title
        this.tweens.add({
            targets: [title, titleShadow],
            y: '-=5',
            yoyo: true,
            repeat: -1,
            duration: 1500,
            ease: 'Sine.easeInOut'
        });

        const progress = SaveManager.loadProgress();

        // --- Name Card ---
        this.createProfileCard(195, 190, 'Your Name', progress.playerName || 'Player', () => {
            const name = window.prompt("Your Name:", progress.playerName);
            if (name) {
                progress.playerName = name;
                this.scene.restart();
            }
        });

        // --- Favorite Animal with emoji selection ---
        const animalEmojis = [
            { emoji: '\ud83d\udc36', name: 'dog' },
            { emoji: '\ud83d\udc31', name: 'cat' },
            { emoji: '\ud83d\udc3b', name: 'bear' },
            { emoji: '\ud83d\udc30', name: 'rabbit' },
            { emoji: '\ud83d\udc27', name: 'penguin' },
            { emoji: '\ud83e\udd81', name: 'lion' }
        ];
        this.createEmojiSelector(195, 310, 'Favorite Animal',
            progress.playerProfile.favoriteAnimal, animalEmojis, (selected) => {
                progress.playerProfile.favoriteAnimal = selected;
            });

        // --- Favorite Food with emoji selection ---
        const foodEmojis = [
            { emoji: '\ud83c\udf55', name: 'pizza' },
            { emoji: '\ud83c\udf63', name: 'sushi' },
            { emoji: '\ud83c\udf54', name: 'burger' },
            { emoji: '\ud83c\udf4e', name: 'apple' },
            { emoji: '\ud83c\udf70', name: 'cake' },
            { emoji: '\ud83c\udf66', name: 'ice cream' }
        ];
        this.createEmojiSelector(195, 450, 'Favorite Food',
            progress.playerProfile.favoriteFood, foodEmojis, (selected) => {
                progress.playerProfile.favoriteFood = selected;
            });

        // --- Favorite Sport with emoji selection ---
        const sportEmojis = [
            { emoji: '\u26bd', name: 'soccer' },
            { emoji: '\ud83c\udfc0', name: 'basketball' },
            { emoji: '\ud83c\udfbe', name: 'tennis' },
            { emoji: '\ud83c\udfca', name: 'swimming' },
            { emoji: '\u26be', name: 'baseball' },
            { emoji: '\ud83c\udfc3', name: 'running' }
        ];
        this.createEmojiSelector(195, 590, 'Favorite Sport',
            progress.playerProfile.favoriteSport, sportEmojis, (selected) => {
                progress.playerProfile.favoriteSport = selected;
            });

        // --- Start Game Button ---
        const btnBg = this.add.graphics();
        btnBg.fillStyle(0x4CAF50, 1);
        btnBg.fillRoundedRect(95, 720, 200, 55, 28);
        btnBg.lineStyle(2, 0x66BB6A, 1);
        btnBg.strokeRoundedRect(95, 720, 200, 55, 28);

        const btnShadow = this.add.graphics();
        btnShadow.fillStyle(0x000000, 0.3);
        btnShadow.fillRoundedRect(98, 723, 200, 55, 28);

        const startBtn = this.add.text(195, 748, 'START GAME', {
            fontFamily: 'Fredoka One', fontSize: '24px', color: '#fff'
        }).setOrigin(0.5);

        // Make the button area interactive
        const btnZone = this.add.zone(195, 748, 200, 55).setInteractive({ useHandCursor: true });

        btnZone.on('pointerover', () => {
            this.tweens.add({ targets: [btnBg, btnShadow, startBtn], scaleX: 1.05, scaleY: 1.05, duration: 100 });
        });
        btnZone.on('pointerout', () => {
            this.tweens.add({ targets: [btnBg, btnShadow, startBtn], scaleX: 1, scaleY: 1, duration: 100 });
        });
        btnZone.on('pointerdown', () => {
            SaveManager.saveProgress(progress);
            this.cameras.main.fadeOut(300, 0, 0, 0);
            this.time.delayedCall(300, () => {
                this.scene.start('GameScene');
            });
        });

        // Fade in
        this.cameras.main.fadeIn(300, 0, 0, 0);
    }

    private createProfileCard(x: number, y: number, label: string, value: string, onTap: () => void) {
        const cardBg = this.add.graphics();
        cardBg.fillStyle(0x2a2a4a, 0.9);
        cardBg.fillRoundedRect(x - 170, y - 35, 340, 70, 12);
        cardBg.lineStyle(1, 0x4a4a6a, 0.5);
        cardBg.strokeRoundedRect(x - 170, y - 35, 340, 70, 12);

        this.add.text(x - 150, y - 20, label, {
            fontFamily: 'Nunito', fontSize: '12px', color: '#8888bb'
        });

        this.add.text(x - 150, y, value, {
            fontFamily: 'Nunito', fontSize: '22px', color: '#fff', fontStyle: 'bold'
        });

        // Edit indicator
        this.add.text(x + 140, y - 5, '\u270f\ufe0f', { fontSize: '20px' }).setOrigin(0.5);

        const zone = this.add.zone(x, y, 340, 70).setInteractive({ useHandCursor: true });
        zone.on('pointerdown', onTap);
    }

    private createEmojiSelector(
        x: number, y: number, label: string, currentValue: string,
        options: { emoji: string; name: string }[],
        onSelect: (name: string) => void
    ) {
        const cardBg = this.add.graphics();
        cardBg.fillStyle(0x2a2a4a, 0.9);
        cardBg.fillRoundedRect(x - 170, y - 40, 340, 100, 12);
        cardBg.lineStyle(1, 0x4a4a6a, 0.5);
        cardBg.strokeRoundedRect(x - 170, y - 40, 340, 100, 12);

        this.add.text(x - 150, y - 30, label, {
            fontFamily: 'Nunito', fontSize: '12px', color: '#8888bb'
        });

        const startX = x - 130;
        const spacing = 53;

        for (let i = 0; i < options.length; i++) {
            const opt = options[i];
            const ex = startX + i * spacing;
            const ey = y + 20;

            const isSelected = currentValue === opt.name;

            // Selection highlight
            if (isSelected) {
                const highlight = this.add.graphics();
                highlight.fillStyle(0x4CAF50, 0.3);
                highlight.fillRoundedRect(ex - 20, ey - 20, 40, 40, 10);
                highlight.lineStyle(2, 0x4CAF50, 0.8);
                highlight.strokeRoundedRect(ex - 20, ey - 20, 40, 40, 10);
            }

            const emojiText = this.add.text(ex, ey, opt.emoji, {
                fontSize: '28px'
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });

            emojiText.on('pointerdown', () => {
                onSelect(opt.name);
                this.scene.restart();
            });
        }
    }
}
