import * as Phaser from 'phaser';
import { SaveManager } from '../systems/SaveManager';

interface ResultData {
    score: number;
    level: 'easy' | 'medium' | 'hard';
    tfCorrect: number;
    tfTotal: number;
    qCorrect: number;
    qTotal: number;
    bestStreak: number;
    timeBonus: number;
    passagesCompleted: number;
}

export class ResultScene extends Phaser.Scene {
    private resultData!: ResultData;
    private readonly W = 420;
    private readonly H = 780;

    constructor() {
        super({ key: 'ResultScene' });
    }

    init(data: ResultData) {
        this.resultData = data;
    }

    create() {
        const {
            score, level, tfCorrect, tfTotal, qCorrect, qTotal,
            bestStreak, timeBonus
        } = this.resultData;

        // Background
        const bg = this.add.graphics();
        bg.fillGradientStyle(0xF5F7FA, 0xF5F7FA, 0xE8ECF2, 0xE8ECF2, 1);
        bg.fillRect(0, 0, this.W, this.H);

        // Save progress
        SaveManager.updateHighScore(score);

        // Save session record
        const progress = SaveManager.loadProgress();
        progress.sessionHistory.push({
            sessionId: Date.now().toString(),
            date: new Date().toISOString().split('T')[0],
            score,
            level,
            tfCorrect,
            tfTotal,
            qCorrect,
            qTotal,
            bestStreak,
            timeBonus
        });
        SaveManager.saveProgress(progress);

        // Header message
        const totalCorrect = tfCorrect + qCorrect;
        const totalQuestions = tfTotal + qTotal;
        const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;

        let headerText: string;
        let headerColor: string;
        if (accuracy >= 80) {
            headerText = 'GREAT JOB!';
            headerColor = '#4CAF50';
        } else if (accuracy >= 50) {
            headerText = 'NICE TRY!';
            headerColor = '#FF9800';
        } else {
            headerText = 'KEEP GOING!';
            headerColor = '#2D5BCC';
        }

        const header = this.add.text(this.W / 2, 70, headerText, {
            fontFamily: 'Fredoka One', fontSize: '42px', color: headerColor,
            stroke: '#fff', strokeThickness: 3
        }).setOrigin(0.5).setAlpha(0).setScale(0.5);

        this.tweens.add({
            targets: header,
            alpha: 1, scale: 1,
            duration: 600,
            ease: 'Back.out'
        });

        // Score card
        const cardBg = this.add.graphics();
        cardBg.fillStyle(0xFFFFFF, 1);
        cardBg.fillRoundedRect(25, 120, this.W - 50, 140, 20);
        cardBg.lineStyle(2, 0xDDE3ED, 1);
        cardBg.strokeRoundedRect(25, 120, this.W - 50, 140, 20);

        this.add.text(this.W / 2, 155, `${score}`, {
            fontFamily: 'Fredoka One', fontSize: '52px', color: '#2D5BCC'
        }).setOrigin(0.5);

        this.add.text(this.W / 2, 195, 'POINTS', {
            fontFamily: 'Nunito', fontSize: '14px', color: '#888'
        }).setOrigin(0.5);

        // Level badge
        const levelColors: Record<string, string> = { easy: '#4CAF50', medium: '#FF9800', hard: '#F44336' };
        this.add.text(this.W / 2, 225, level.toUpperCase(), {
            fontFamily: 'Fredoka One', fontSize: '13px', color: '#FFFFFF',
            backgroundColor: levelColors[level],
            padding: { left: 10, right: 10, top: 3, bottom: 3 }
        }).setOrigin(0.5);

        // Stats section
        const statsCardBg = this.add.graphics();
        statsCardBg.fillStyle(0xFFFFFF, 1);
        statsCardBg.fillRoundedRect(25, 280, this.W - 50, 220, 20);
        statsCardBg.lineStyle(2, 0xDDE3ED, 1);
        statsCardBg.strokeRoundedRect(25, 280, this.W - 50, 220, 20);

        // True/False accuracy
        const tfAccuracy = tfTotal > 0 ? Math.round((tfCorrect / tfTotal) * 100) : 0;
        this.createStatRow(50, 305, 'True/False', `${tfCorrect}/${tfTotal}`, `${tfAccuracy}%`,
            tfAccuracy >= 80 ? '#4CAF50' : tfAccuracy >= 50 ? '#FF9800' : '#F44336');

        // Questions accuracy
        const qAccuracy = qTotal > 0 ? Math.round((qCorrect / qTotal) * 100) : 0;
        this.createStatRow(50, 355, 'Questions', `${qCorrect}/${qTotal}`, `${qAccuracy}%`,
            qAccuracy >= 80 ? '#4CAF50' : qAccuracy >= 50 ? '#FF9800' : '#F44336');

        // Divider
        const divider = this.add.graphics();
        divider.lineStyle(1, 0xEEEEEE, 1);
        divider.lineBetween(50, 395, this.W - 50, 395);

        // Best streak
        this.createStatItem(this.W / 2 - 80, 420, `${bestStreak}`, 'Best Streak', '#FF9800');

        // Time bonus
        this.createStatItem(this.W / 2 + 80, 420, `+${timeBonus}`, 'Time Bonus', '#2D5BCC');

        // Overall accuracy
        this.createStatItem(this.W / 2, 465, `${accuracy}%`, 'Overall', accuracy >= 80 ? '#4CAF50' : '#FF9800');

        // Buttons
        const btnY = 560;

        // Play Again
        this.createButton(this.W / 2 - 85, btnY, 'PLAY AGAIN', 0x4CAF50, () => {
            this.cameras.main.fadeOut(300, 255, 255, 255);
            this.time.delayedCall(300, () => this.scene.start('GameScene', { level }));
        });

        // Change Level
        this.createButton(this.W / 2 + 85, btnY, 'CHANGE LEVEL', 0x2D5BCC, () => {
            this.cameras.main.fadeOut(300, 255, 255, 255);
            this.time.delayedCall(300, () => this.scene.start('ProfileScene'));
        });

        // Fade in
        this.cameras.main.fadeIn(400, 255, 255, 255);
    }

    private createStatRow(x: number, y: number, label: string, countStr: string, pctStr: string, pctColor: string) {
        this.add.text(x, y, label, {
            fontFamily: 'Nunito', fontSize: '16px', color: '#555', fontStyle: 'bold'
        });

        this.add.text(this.W - 50 - 70, y, countStr, {
            fontFamily: 'Nunito', fontSize: '16px', color: '#888'
        }).setOrigin(1, 0);

        this.add.text(this.W - 50, y, pctStr, {
            fontFamily: 'Fredoka One', fontSize: '20px', color: pctColor
        }).setOrigin(1, 0);
    }

    private createStatItem(x: number, y: number, value: string, label: string, color: string) {
        this.add.text(x, y, value, {
            fontFamily: 'Fredoka One', fontSize: '22px', color: color
        }).setOrigin(0.5);

        this.add.text(x, y + 25, label, {
            fontFamily: 'Nunito', fontSize: '11px', color: '#888'
        }).setOrigin(0.5);
    }

    private createButton(x: number, y: number, text: string, color: number, onClick: () => void) {
        const btnBg = this.add.graphics();
        btnBg.fillStyle(color, 1);
        btnBg.fillRoundedRect(x - 75, y - 24, 150, 48, 24);

        const btnText = this.add.text(x, y, text, {
            fontFamily: 'Fredoka One', fontSize: '14px', color: '#fff'
        }).setOrigin(0.5);

        const zone = this.add.zone(x, y, 150, 48).setInteractive({ useHandCursor: true });
        zone.on('pointerdown', onClick);
        zone.on('pointerover', () => {
            this.tweens.add({ targets: btnText, scaleX: 1.08, scaleY: 1.08, duration: 100 });
        });
        zone.on('pointerout', () => {
            this.tweens.add({ targets: btnText, scaleX: 1, scaleY: 1, duration: 100 });
        });
    }
}
