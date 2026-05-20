import * as Phaser from 'phaser';
import { SaveManager } from '../systems/SaveManager';

interface WrongAnswerEntry {
    passageTitle: string;
    level: 'easy' | 'medium' | 'hard';
    type: 'trueFalse' | 'question';
    question: string;
    playerAnswer: string;
    correctAnswer: string;
    explanation: string;
}

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
    wrongAnswers?: WrongAnswerEntry[];
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
            bestStreak, timeBonus, wrongAnswers
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

        // High score indicator
        if (score >= progress.highScore) {
            this.add.text(this.W / 2, 218, 'NEW HIGH SCORE!', {
                fontFamily: 'Fredoka One', fontSize: '14px', color: '#FF9800'
            }).setOrigin(0.5);
        }

        // Level badge
        const levelColors: Record<string, string> = { easy: '#4CAF50', medium: '#FF9800', hard: '#F44336' };
        this.add.text(this.W / 2, 238, level.toUpperCase(), {
            fontFamily: 'Fredoka One', fontSize: '13px', color: '#FFFFFF',
            backgroundColor: levelColors[level],
            padding: { left: 10, right: 10, top: 3, bottom: 3 }
        }).setOrigin(0.5);

        // Stats section
        const statsCardBg = this.add.graphics();
        statsCardBg.fillStyle(0xFFFFFF, 1);
        statsCardBg.fillRoundedRect(25, 270, this.W - 50, 220, 20);
        statsCardBg.lineStyle(2, 0xDDE3ED, 1);
        statsCardBg.strokeRoundedRect(25, 270, this.W - 50, 220, 20);

        // True/False accuracy
        const tfAccuracy = tfTotal > 0 ? Math.round((tfCorrect / tfTotal) * 100) : 0;
        this.createStatRow(50, 295, 'True/False', `${tfCorrect}/${tfTotal}`, `${tfAccuracy}%`,
            tfAccuracy >= 80 ? '#4CAF50' : tfAccuracy >= 50 ? '#FF9800' : '#F44336');

        // Questions accuracy
        const qAccuracy = qTotal > 0 ? Math.round((qCorrect / qTotal) * 100) : 0;
        this.createStatRow(50, 345, 'Questions', `${qCorrect}/${qTotal}`, `${qAccuracy}%`,
            qAccuracy >= 80 ? '#4CAF50' : qAccuracy >= 50 ? '#FF9800' : '#F44336');

        // Divider
        const divider = this.add.graphics();
        divider.lineStyle(1, 0xEEEEEE, 1);
        divider.lineBetween(50, 385, this.W - 50, 385);

        // Best streak
        this.createStatItem(this.W / 2 - 80, 410, `${bestStreak}`, 'Best Streak', '#FF9800');

        // Time bonus
        this.createStatItem(this.W / 2 + 80, 410, `+${timeBonus}`, 'Time Bonus', '#2D5BCC');

        // Overall accuracy
        this.createStatItem(this.W / 2, 455, `${accuracy}%`, 'Overall', accuracy >= 80 ? '#4CAF50' : '#FF9800');

        // Wrong answers summary
        const hasWrongAnswers = wrongAnswers && wrongAnswers.length > 0;
        const btnY = hasWrongAnswers ? 560 : 550;

        if (hasWrongAnswers) {
            const wrongLabel = this.add.text(this.W / 2, 510, `${wrongAnswers.length} wrong answer${wrongAnswers.length > 1 ? 's' : ''} saved for review`, {
                fontFamily: 'Nunito', fontSize: '13px', color: '#F44336',
                fontStyle: 'bold'
            }).setOrigin(0.5);

            this.tweens.add({
                targets: wrongLabel,
                alpha: 0.5,
                yoyo: true,
                repeat: 2,
                duration: 500
            });

            // Review Wrong Answers button
            this.createButton(this.W / 2, 540, 'REVIEW MISTAKES', 0xF44336, () => {
                this.showWrongAnswerReview(wrongAnswers);
            });
        }

        // Action Buttons
        const actionY = hasWrongAnswers ? 610 : btnY;

        // Play Again
        this.createButton(this.W / 2 - 85, actionY, 'PLAY AGAIN', 0x4CAF50, () => {
            this.cameras.main.fadeOut(300, 255, 255, 255);
            this.time.delayedCall(300, () => this.scene.start('GameScene', { level }));
        });

        // Change Level
        this.createButton(this.W / 2 + 85, actionY, 'CHANGE LEVEL', 0x2D5BCC, () => {
            this.cameras.main.fadeOut(300, 255, 255, 255);
            this.time.delayedCall(300, () => this.scene.start('ProfileScene'));
        });

        // Fade in
        this.cameras.main.fadeIn(400, 255, 255, 255);
    }

    private showWrongAnswerReview(wrongAnswers: WrongAnswerEntry[]) {
        // Create a scrollable overlay with wrong answers
        const overlay = this.add.graphics().setDepth(200);
        overlay.fillStyle(0x000000, 0.6);
        overlay.fillRect(0, 0, this.W, this.H);

        const panelBg = this.add.graphics().setDepth(201);
        panelBg.fillStyle(0xFFFFFF, 1);
        panelBg.fillRoundedRect(15, 40, this.W - 30, this.H - 80, 20);

        const titleText = this.add.text(this.W / 2, 65, 'Wrong Answers Review', {
            fontFamily: 'Fredoka One', fontSize: '22px', color: '#F44336'
        }).setOrigin(0.5).setDepth(202);

        // Close button
        const closeBtn = this.add.text(this.W - 35, 50, 'X', {
            fontFamily: 'Fredoka One', fontSize: '20px', color: '#999'
        }).setOrigin(0.5).setDepth(202).setInteractive({ useHandCursor: true });

        const elements: Phaser.GameObjects.GameObject[] = [overlay, panelBg, titleText, closeBtn];

        let yPos = 95;
        wrongAnswers.forEach((wa, i) => {
            if (yPos > this.H - 120) return; // Prevent overflow

            const itemBg = this.add.graphics().setDepth(202);
            itemBg.fillStyle(0xFFF0F0, 1);
            itemBg.fillRoundedRect(25, yPos, this.W - 50, 110, 10);
            elements.push(itemBg);

            const numLabel = this.add.text(35, yPos + 8, `#${i + 1}  [${wa.passageTitle}]`, {
                fontFamily: 'Nunito', fontSize: '11px', color: '#888'
            }).setDepth(202);
            elements.push(numLabel);

            const qText = this.add.text(35, yPos + 25, wa.question, {
                fontFamily: 'Nunito', fontSize: '14px', color: '#333',
                fontStyle: 'bold',
                wordWrap: { width: this.W - 80 }
            }).setDepth(202);
            elements.push(qText);

            const yourAns = this.add.text(35, yPos + 55, `Your answer: ${wa.playerAnswer}`, {
                fontFamily: 'Nunito', fontSize: '12px', color: '#F44336'
            }).setDepth(202);
            elements.push(yourAns);

            const correctAns = this.add.text(35, yPos + 75, `Correct: ${wa.correctAnswer}`, {
                fontFamily: 'Nunito', fontSize: '12px', color: '#4CAF50',
                fontStyle: 'bold'
            }).setDepth(202);
            elements.push(correctAns);

            yPos += 120;
        });

        // Most Missed section (from localStorage)
        const mostMissed = SaveManager.getMostMissed(3);
        if (mostMissed.length > 0 && yPos < this.H - 160) {
            const missedTitle = this.add.text(this.W / 2, yPos + 10, 'Most Missed Questions', {
                fontFamily: 'Fredoka One', fontSize: '16px', color: '#FF9800'
            }).setOrigin(0.5).setDepth(202);
            elements.push(missedTitle);

            yPos += 35;
            mostMissed.forEach(mm => {
                if (yPos > this.H - 100) return;
                const mmText = this.add.text(35, yPos, `(${mm.timesWrong}x) ${mm.question}`, {
                    fontFamily: 'Nunito', fontSize: '12px', color: '#666',
                    wordWrap: { width: this.W - 80 }
                }).setDepth(202);
                elements.push(mmText);
                yPos += 25;
            });
        }

        closeBtn.on('pointerdown', () => {
            elements.forEach(el => el.destroy());
        });
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
