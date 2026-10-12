import * as Phaser from 'phaser';
import { SaveManager } from '../systems/SaveManager';
import {
    Level, GameMode, COUNT_OPTIONS, DEFAULT_COUNT, DEFAULT_MODE, JP_FONT,
    consumeLaunchParams, isEmbedded, goToPortal
} from '../systems/Launch';

export class ProfileScene extends Phaser.Scene {
    private selectedLevel: Level = 'easy';
    private selectedMode: GameMode = DEFAULT_MODE;
    private selectedCount = DEFAULT_COUNT;
    private progress = SaveManager.loadProgress();

    constructor() {
        super({ key: 'ProfileScene' });
    }

    create() {
        this.progress = SaveManager.loadProgress();
        this.selectedLevel = this.progress.selectedLevel || 'easy';
        this.selectedMode = this.progress.selectedMode || DEFAULT_MODE;
        this.selectedCount = this.progress.selectedCount || DEFAULT_COUNT;

        // URLパラメータで指定されていれば、メニューを飛ばして直接はじめる
        const launch = consumeLaunchParams();
        if (launch) {
            this.scene.start('GameScene', {
                level: launch.level || this.selectedLevel,
                mode: launch.mode || DEFAULT_MODE,
                count: launch.count || DEFAULT_COUNT
            });
            return;
        }

        const W = 960;
        const H = 540;

        // Background gradient (light theme)
        const bg = this.add.graphics();
        bg.fillGradientStyle(0xE8F0FE, 0xE8F0FE, 0xD4E4FC, 0xD4E4FC, 1);
        bg.fillRect(0, 0, W, H);

        // Decorative circles
        this.add.circle(80, 60, 100, 0xC5D8F7, 0.4);
        this.add.circle(900, 480, 130, 0xC5D8F7, 0.3);

        // ===== LEFT COLUMN (Title + Name) =====
        const leftX = 240;

        // Title
        const title = this.add.text(leftX, 36, 'Reading Dash', {
            fontFamily: 'Fredoka One', fontSize: '36px', color: '#2D5BCC',
            stroke: '#fff', strokeThickness: 3
        }).setOrigin(0.5);

        this.add.text(leftX, 72, 'リーディングダッシュ', {
            fontFamily: JP_FONT, fontSize: '14px', color: '#3A5FA0', fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(leftX, 92, '英語の文章を読んで、しつもんに答えよう', {
            fontFamily: JP_FONT, fontSize: '12px', color: '#5B7DB8'
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
        this.createNameCard(leftX, 138);

        // ===== RIGHT COLUMN (Settings) =====
        const rightX = 700;

        // --- Level ---
        this.sectionLabel(rightX, 28, 'レベル');

        const levels: Array<{ level: Level; label: string; sub: string; stars: string; color: number }> = [
            { level: 'easy', label: 'Easy', sub: 'みじかい文', stars: '⭐', color: 0x4CAF50 },
            { level: 'medium', label: 'Medium', sub: '3級', stars: '⭐⭐', color: 0xFF9800 },
            { level: 'hard', label: 'Hard', sub: '準2級', stars: '⭐⭐⭐', color: 0xF44336 },
            { level: 'advanced', label: 'Adv.', sub: '2級', stars: '⭐⭐⭐⭐', color: 0x9C27B0 }
        ];

        levels.forEach((item, i) => {
            const bx = 530 + i * 110;
            const by = 78;
            const isSelected = this.selectedLevel === item.level;
            this.optionBox(bx, by, 100, 68, item.color, isSelected);

            const labelColor = isSelected ? '#FFFFFF' : '#333333';
            this.add.text(bx, by - 20, item.label, {
                fontFamily: 'Fredoka One', fontSize: '16px', color: labelColor
            }).setOrigin(0.5);

            this.add.text(bx, by + 1, item.stars, { fontSize: '12px' }).setOrigin(0.5);

            this.add.text(bx, by + 18, item.sub, {
                fontFamily: JP_FONT, fontSize: '10px', color: isSelected ? '#FFFFFF' : '#777777'
            }).setOrigin(0.5);

            const zone = this.add.zone(bx, by, 100, 68).setInteractive({ useHandCursor: true });
            zone.on('pointerdown', () => {
                this.progress.selectedLevel = item.level;
                SaveManager.saveProgress(this.progress);
                this.scene.restart();
            });
        });

        // --- Mode (じっくり読む / 速読チャレンジ) ---
        this.sectionLabel(rightX, 130, '読みかた');

        const modes: Array<{ mode: GameMode; label: string; sub: string; color: number }> = [
            { mode: 'careful', label: '🐢 じっくり読む', sub: '時間せいげんなし', color: 0x2D9C8F },
            { mode: 'speed', label: '⚡ 速読チャレンジ', sub: '時間せいげんあり', color: 0x7E57C2 }
        ];

        modes.forEach((item, i) => {
            const bx = 600 + i * 200;
            const by = 176;
            const isSelected = this.selectedMode === item.mode;
            this.optionBox(bx, by, 185, 58, item.color, isSelected);

            this.add.text(bx, by - 10, item.label, {
                fontFamily: JP_FONT, fontSize: '15px', fontStyle: 'bold',
                color: isSelected ? '#FFFFFF' : '#333333'
            }).setOrigin(0.5);

            this.add.text(bx, by + 14, item.sub, {
                fontFamily: JP_FONT, fontSize: '11px', color: isSelected ? '#FFFFFF' : '#777777'
            }).setOrigin(0.5);

            const zone = this.add.zone(bx, by, 185, 58).setInteractive({ useHandCursor: true });
            zone.on('pointerdown', () => {
                this.progress.selectedMode = item.mode;
                SaveManager.saveProgress(this.progress);
                this.scene.restart();
            });
        });

        // --- Number of passages (2 / 4 / 8) ---
        this.sectionLabel(rightX, 224, '文章の数');

        // 1文章あたりの目安: じっくり 約1分半 / 速読 約1分
        const minutesPer = this.selectedMode === 'careful' ? 1.5 : 1;
        COUNT_OPTIONS.forEach((n, i) => {
            const bx = 580 + i * 120;
            const by = 268;
            const isSelected = this.selectedCount === n;
            this.optionBox(bx, by, 105, 54, 0x2D5BCC, isSelected);

            this.add.text(bx, by - 8, `${n}`, {
                fontFamily: 'Fredoka One', fontSize: '22px', color: isSelected ? '#FFFFFF' : '#2D5BCC'
            }).setOrigin(0.5);

            this.add.text(bx, by + 16, `やく${Math.round(n * minutesPer)}分`, {
                fontFamily: JP_FONT, fontSize: '10px', color: isSelected ? '#FFFFFF' : '#777777'
            }).setOrigin(0.5);

            const zone = this.add.zone(bx, by, 105, 54).setInteractive({ useHandCursor: true });
            zone.on('pointerdown', () => {
                this.progress.selectedCount = n;
                SaveManager.saveProgress(this.progress);
                this.scene.restart();
            });
        });

        // --- High Score Display ---
        if (this.progress.highScore > 0) {
            this.add.text(leftX, 190, `High Score: ${this.progress.highScore}   (Total: ${this.progress.totalScore} pts)`, {
                fontFamily: 'Nunito', fontSize: '13px', color: '#C77700', fontStyle: 'bold'
            }).setOrigin(0.5);
        }

        // --- Start Button (center-bottom) ---
        const startY = 400;
        const startX = W / 2;

        // Shadow
        const startShadow = this.add.graphics();
        startShadow.fillStyle(0x1A3D8F, 0.4);
        startShadow.fillRoundedRect(startX - 137, startY - 27, 280, 60, 30);

        const startBg = this.add.graphics();
        startBg.fillStyle(0x2D5BCC, 1);
        startBg.fillRoundedRect(startX - 140, startY - 30, 280, 60, 30);

        const startText = this.add.text(startX, startY, 'START', {
            fontFamily: 'Fredoka One', fontSize: '30px', color: '#FFFFFF'
        }).setOrigin(0.5);

        const startZone = this.add.zone(startX, startY, 280, 60).setInteractive({ useHandCursor: true });

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
                this.scene.start('GameScene', {
                    level: this.selectedLevel,
                    mode: this.selectedMode,
                    count: this.selectedCount
                });
            });
        });

        // --- Portal link (iframe 埋め込み時は親側に戻る手段があるので出さない) ---
        if (!isEmbedded()) {
            const home = this.add.text(W / 2, 490, '🏠 学習ホームにもどる', {
                fontFamily: JP_FONT, fontSize: '14px', color: '#5B7DB8'
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });
            home.on('pointerover', () => home.setColor('#2D5BCC'));
            home.on('pointerout', () => home.setColor('#5B7DB8'));
            home.on('pointerdown', () => goToPortal());
        }

        // Fade in
        this.cameras.main.fadeIn(300, 255, 255, 255);
    }

    private sectionLabel(x: number, y: number, text: string) {
        this.add.text(x, y, text, {
            fontFamily: JP_FONT, fontSize: '14px', color: '#3A5FA0', fontStyle: 'bold'
        }).setOrigin(0.5);
    }

    private optionBox(x: number, y: number, w: number, h: number, color: number, selected: boolean) {
        const g = this.add.graphics();
        if (selected) {
            g.fillStyle(color, 1);
            g.fillRoundedRect(x - w / 2, y - h / 2, w, h, 14);
        } else {
            g.fillStyle(0xFFFFFF, 1);
            g.fillRoundedRect(x - w / 2, y - h / 2, w, h, 14);
            g.lineStyle(2, color, 0.6);
            g.strokeRoundedRect(x - w / 2, y - h / 2, w, h, 14);
        }
    }

    private createNameCard(x: number, y: number) {
        const cardBg = this.add.graphics();
        cardBg.fillStyle(0xFFFFFF, 0.9);
        cardBg.fillRoundedRect(x - 190, y - 28, 380, 56, 14);
        cardBg.lineStyle(2, 0xD0D8E8, 1);
        cardBg.strokeRoundedRect(x - 190, y - 28, 380, 56, 14);

        this.add.text(x - 170, y - 21, 'Your Name / なまえ', {
            fontFamily: JP_FONT, fontSize: '11px', color: '#8899BB'
        });

        const displayName = this.progress.playerName || 'タップして なまえを入れる';
        const nameColor = this.progress.playerName ? '#333333' : '#AABBCC';

        this.add.text(x - 170, y - 2, displayName, {
            fontFamily: JP_FONT, fontSize: '17px', color: nameColor, fontStyle: 'bold'
        });

        this.add.text(x + 160, y, '✏️', { fontSize: '18px' }).setOrigin(0.5);

        const zone = this.add.zone(x, y, 380, 56).setInteractive({ useHandCursor: true });
        zone.on('pointerdown', () => {
            const name = window.prompt('Your Name / なまえ:', this.progress.playerName || '');
            if (name !== null && name.trim()) {
                this.progress.playerName = name.trim();
                SaveManager.saveProgress(this.progress);
                this.scene.restart();
            }
        });
    }
}
