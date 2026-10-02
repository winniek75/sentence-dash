import * as Phaser from 'phaser';
import { SaveManager } from '../systems/SaveManager';
import { GameMode, DEFAULT_COUNT, DEFAULT_MODE, JP_FONT, MODE_LABEL, isEmbedded, goToPortal } from '../systems/Launch';

declare global { interface Window { WiseXP?: any; } }

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
    mode?: GameMode;
    count?: number;
    /** 時間切れの数（tfTotal / qTotal には含まれるが、誤答ではない） */
    tfTimeouts?: number;
    qTimeouts?: number;
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
            bestStreak, timeBonus, wrongAnswers, passagesCompleted
        } = this.resultData;
        const mode = this.resultData.mode || DEFAULT_MODE;
        const count = this.resultData.count || DEFAULT_COUNT;
        const tfTimeouts = this.resultData.tfTimeouts || 0;
        const qTimeouts = this.resultData.qTimeouts || 0;
        const timeouts = tfTimeouts + qTimeouts;

        // 正答率は「答えた問題」に対する割合。時間切れ（速さ）は別に数える。
        const tfAnswered = tfTotal - tfTimeouts;
        const qAnswered = qTotal - qTimeouts;
        const totalCorrect = tfCorrect + qCorrect;
        const totalQuestions = tfTotal + qTotal;
        const totalAnswered = tfAnswered + qAnswered;
        const accuracy = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;

        // Background
        const bg = this.add.graphics();
        bg.fillGradientStyle(0xF5F7FA, 0xF5F7FA, 0xE8ECF2, 0xE8ECF2, 1);
        bg.fillRect(0, 0, this.W, this.H);

        // → MoWISE portal へスコア送信 (WiseGame Bridge)
        try {
            const w = window as any;
            w.WiseGame && w.WiseGame.reportComplete({
                score, maxScore: Math.max(score, 100), accuracy,
                metadata: { level, bestStreak, timeBonus,
                            // 速度の記録（正答率とは別）: 時間切れは誤答に含めない
                            mode, passages: passagesCompleted,
                            totalQuestions, answered: totalAnswered, timeouts,
                            wrongAnswers: (wrongAnswers || []).slice(0, 20).map((w: WrongAnswerEntry) => ({
                                q: w.question, correct: w.correctAnswer, chosen: w.playerAnswer, tag: 'word_order'
                            })) }
            });
        } catch (e) {}

        // Report game result to WiseXP
        if (window.WiseXP) {
            try {
                window.WiseXP.reportGame({
                    score,
                    correct: totalCorrect,
                    total: totalQuestions,
                    maxCombo: bestStreak,
                    grade: 0,
                });
            } catch (_e) { /* SDK 側の失敗で結果画面を止めない */ }
        }

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
            timeBonus,
            mode,
            passages: passagesCompleted,
            timeouts
        });
        SaveManager.saveProgress(progress);

        // Header message
        const perfect = accuracy === 100 && timeouts === 0;

        let headerText: string;
        let headerColor: string;
        if (perfect) {
            headerText = 'PERFECT! \uD83D\uDC8E';
            headerColor = '#FFD700';
        } else if (accuracy >= 80) {
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

        // Level + mode badge
        const levelColors: Record<string, string> = { easy: '#4CAF50', medium: '#FF9800', hard: '#F44336' };
        this.add.text(this.W / 2, 238, `${level.toUpperCase()}  ・  ${MODE_LABEL[mode]}  ・  ${passagesCompleted}文章`, {
            fontFamily: JP_FONT, fontSize: '12px', color: '#FFFFFF', fontStyle: 'bold',
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
        const tfAccuracy = tfAnswered > 0 ? Math.round((tfCorrect / tfAnswered) * 100) : 0;
        this.createStatRow(50, 295, 'True/False', `${tfCorrect}/${tfAnswered}`, `${tfAccuracy}%`,
            tfAccuracy >= 80 ? '#4CAF50' : tfAccuracy >= 50 ? '#FF9800' : '#F44336');

        // Questions accuracy
        const qAccuracy = qAnswered > 0 ? Math.round((qCorrect / qAnswered) * 100) : 0;
        this.createStatRow(50, 345, 'Questions', `${qCorrect}/${qAnswered}`, `${qAccuracy}%`,
            qAccuracy >= 80 ? '#4CAF50' : qAccuracy >= 50 ? '#FF9800' : '#F44336');

        // Divider
        const divider = this.add.graphics();
        divider.lineStyle(1, 0xEEEEEE, 1);
        divider.lineBetween(50, 385, this.W - 50, 385);

        // 正答率（答えた問題のうち合っていた割合） / Best streak
        const speed = mode === 'speed';
        this.createStatItem(this.W / 2 - (speed ? 115 : 100), 402, `${accuracy}%`, '正答率', accuracy >= 80 ? '#4CAF50' : '#FF9800');
        this.createStatItem(this.W / 2 - (speed ? 38 : 0), 402, `${bestStreak}`, 'Best Streak', '#FF9800');

        // 速さの記録（正答率とは別）
        if (speed) {
            this.createStatItem(this.W / 2 + 40, 402, `+${timeBonus}`, 'Time Bonus', '#2D5BCC');
            this.createStatItem(this.W / 2 + 118, 402, `${timeouts}問`, '時間切れ', timeouts > 0 ? '#E65100' : '#4CAF50');
            this.add.text(this.W / 2, 456, timeouts > 0
                ? '時間切れは まちがいに数えていないよ（速さの記録）'
                : '全部の問題に時間内で答えられたよ！', {
                fontFamily: JP_FONT, fontSize: '11px', color: '#888'
            }).setOrigin(0.5);
        } else {
            this.createStatItem(this.W / 2 + 100, 402, 'なし', '時間せいげん', '#2D9C8F');
            this.add.text(this.W / 2, 456, 'なれてきたら「速読チャレンジ」にもちょうせんしよう', {
                fontFamily: JP_FONT, fontSize: '11px', color: '#888'
            }).setOrigin(0.5);
        }

        // Near-miss feedback
        if (perfect) {
            const perfectText = this.add.text(this.W / 2, 476, 'PERFECT! \uD83D\uDC8E', {
                fontFamily: 'Fredoka One', fontSize: '18px', color: '#FFD700'
            }).setOrigin(0.5).setAlpha(0).setScale(0.5);
            this.tweens.add({
                targets: perfectText,
                alpha: 1, scale: 1.2,
                duration: 500,
                ease: 'Back.out',
                yoyo: true,
                hold: 1000,
                onComplete: () => perfectText.setScale(1).setAlpha(1)
            });
        } else if (accuracy >= 80 && totalAnswered > totalCorrect) {
            const wrongCount = totalAnswered - totalCorrect;
            this.add.text(this.W / 2, 476, `\u3042\u3068${wrongCount}\u554F\u3067\u30D1\u30FC\u30D5\u30A7\u30AF\u30C8\uFF01`, {
                fontFamily: JP_FONT, fontSize: '14px', color: '#4CAF50',
                fontStyle: 'bold'
            }).setOrigin(0.5);
        }

        // Wrong answers summary
        const hasWrongAnswers = wrongAnswers && wrongAnswers.length > 0;
        const btnY = hasWrongAnswers ? 560 : 550;

        if (hasWrongAnswers) {
            const wrongLabel = this.add.text(this.W / 2, 512, `まちがえた問題 ${wrongAnswers.length}問を ふくしゅう用にほぞんしたよ`, {
                fontFamily: JP_FONT, fontSize: '12px', color: '#F44336',
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
            this.createButton(this.W / 2, 545, 'まちがい直し', 0xF44336, () => {
                this.showWrongAnswerReview(wrongAnswers);
            });
        }

        // Action Buttons
        const actionY = hasWrongAnswers ? 610 : btnY;

        // Play Again
        this.createButton(this.W / 2 - 85, actionY, 'もういちど', 0x4CAF50, () => {
            this.cameras.main.fadeOut(300, 255, 255, 255);
            this.time.delayedCall(300, () => this.scene.start('GameScene', { level, mode, count }));
        });

        // Change level / mode / count
        this.createButton(this.W / 2 + 85, actionY, 'メニューへ', 0x2D5BCC, () => {
            this.cameras.main.fadeOut(300, 255, 255, 255);
            this.time.delayedCall(300, () => this.scene.start('ProfileScene'));
        });

        // Portal link (iframe 埋め込み時は親側に戻る手段があるので出さない)
        if (!isEmbedded()) {
            const home = this.add.text(this.W / 2, actionY + 62, '\uD83C\uDFE0 学習ホームにもどる', {
                fontFamily: JP_FONT, fontSize: '14px', color: '#5B7DB8'
            }).setOrigin(0.5).setInteractive({ useHandCursor: true });
            home.on('pointerover', () => home.setColor('#2D5BCC'));
            home.on('pointerout', () => home.setColor('#5B7DB8'));
            home.on('pointerdown', () => goToPortal());
        }

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

        const titleText = this.add.text(this.W / 2, 65, 'まちがい直し', {
            fontFamily: JP_FONT, fontStyle: 'bold', fontSize: '22px', color: '#F44336'
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
            fontFamily: JP_FONT, fontSize: '11px', color: '#888'
        }).setOrigin(0.5);
    }

    private createButton(x: number, y: number, text: string, color: number, onClick: () => void) {
        const btnBg = this.add.graphics();
        btnBg.fillStyle(color, 1);
        btnBg.fillRoundedRect(x - 75, y - 24, 150, 48, 24);

        const btnText = this.add.text(x, y, text, {
            fontFamily: JP_FONT, fontSize: '15px', color: '#fff', fontStyle: 'bold'
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
