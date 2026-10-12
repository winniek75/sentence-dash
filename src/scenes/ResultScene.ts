import * as Phaser from 'phaser';
import { SaveManager } from '../systems/SaveManager';
import { Level, GameMode, DEFAULT_COUNT, DEFAULT_MODE, JP_FONT, MODE_LABEL, isEmbedded, goToPortal } from '../systems/Launch';

declare global { interface Window { WiseXP?: any; } }

interface WrongAnswerEntry {
    passageTitle: string;
    level: Level;
    type: 'trueFalse' | 'question';
    question: string;
    playerAnswer: string;
    correctAnswer: string;
    explanation: string;
}

interface ResultData {
    score: number;
    level: Level;
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
    private readonly S = (window as any).__RD_S || 1;
    private p(v: number) { return Math.round(v * this.S); }
    private readonly W = Math.round(960 * ((window as any).__RD_S || 1));
    private readonly H = Math.round(540 * ((window as any).__RD_S || 1));

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

        // -> MoWISE portal へスコア送信 (WiseGame Bridge)
        try {
            const w = window as any;
            w.WiseGame && w.WiseGame.reportComplete({
                score, maxScore: Math.max(score, 100), accuracy,
                metadata: { level, bestStreak, timeBonus,
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

        // ===== LEFT SIDE: Header + Score =====
        const leftCx = this.p(240);

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

        const header = this.add.text(leftCx, this.p(50), headerText, {
            fontFamily: 'Fredoka One', fontSize: `${this.p(38)}px`, color: headerColor,
            stroke: '#fff', strokeThickness: this.p(3)
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
        cardBg.fillRoundedRect(leftCx - this.p(190), this.p(90), this.p(380), this.p(130), this.p(20));
        cardBg.lineStyle(this.p(2), 0xDDE3ED, 1);
        cardBg.strokeRoundedRect(leftCx - this.p(190), this.p(90), this.p(380), this.p(130), this.p(20));

        this.add.text(leftCx, this.p(125), `${score}`, {
            fontFamily: 'Fredoka One', fontSize: `${this.p(48)}px`, color: '#2D5BCC'
        }).setOrigin(0.5);

        this.add.text(leftCx, this.p(162), 'POINTS', {
            fontFamily: 'Nunito', fontSize: `${this.p(14)}px`, color: '#888'
        }).setOrigin(0.5);

        // High score indicator
        if (score >= progress.highScore) {
            this.add.text(leftCx, this.p(184), 'NEW HIGH SCORE!', {
                fontFamily: 'Fredoka One', fontSize: `${this.p(14)}px`, color: '#FF9800'
            }).setOrigin(0.5);
        }

        // Level + mode badge
        const levelColors: Record<string, string> = { easy: '#4CAF50', medium: '#FF9800', hard: '#F44336', advanced: '#9C27B0' };
        this.add.text(leftCx, this.p(204), `${level.toUpperCase()}  ・  ${MODE_LABEL[mode]}  ・  ${passagesCompleted}文章`, {
            fontFamily: JP_FONT, fontSize: `${this.p(12)}px`, color: '#FFFFFF', fontStyle: 'bold',
            backgroundColor: levelColors[level],
            padding: { left: this.p(10), right: this.p(10), top: this.p(3), bottom: this.p(3) }
        }).setOrigin(0.5);

        // Near-miss / perfect feedback
        if (perfect) {
            const perfectText = this.add.text(leftCx, this.p(240), 'PERFECT! \uD83D\uDC8E', {
                fontFamily: 'Fredoka One', fontSize: `${this.p(18)}px`, color: '#FFD700'
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
            this.add.text(leftCx, this.p(240), `あと${wrongCount}問でパーフェクト！`, {
                fontFamily: JP_FONT, fontSize: `${this.p(14)}px`, color: '#4CAF50',
                fontStyle: 'bold'
            }).setOrigin(0.5);
        }

        // ===== RIGHT SIDE: Stats =====
        const rightCx = this.p(700);
        const statsCardBg = this.add.graphics();
        statsCardBg.fillStyle(0xFFFFFF, 1);
        statsCardBg.fillRoundedRect(rightCx - this.p(210), this.p(40), this.p(420), this.p(220), this.p(20));
        statsCardBg.lineStyle(this.p(2), 0xDDE3ED, 1);
        statsCardBg.strokeRoundedRect(rightCx - this.p(210), this.p(40), this.p(420), this.p(220), this.p(20));

        // True/False accuracy
        const tfAccuracy = tfAnswered > 0 ? Math.round((tfCorrect / tfAnswered) * 100) : 0;
        this.createStatRow(rightCx - this.p(190), this.p(65), 'True/False', `${tfCorrect}/${tfAnswered}`, `${tfAccuracy}%`,
            tfAccuracy >= 80 ? '#4CAF50' : tfAccuracy >= 50 ? '#FF9800' : '#F44336');

        // Questions accuracy
        const qAccuracy = qAnswered > 0 ? Math.round((qCorrect / qAnswered) * 100) : 0;
        this.createStatRow(rightCx - this.p(190), this.p(110), 'Questions', `${qCorrect}/${qAnswered}`, `${qAccuracy}%`,
            qAccuracy >= 80 ? '#4CAF50' : qAccuracy >= 50 ? '#FF9800' : '#F44336');

        // Divider
        const divider = this.add.graphics();
        divider.lineStyle(this.p(1), 0xEEEEEE, 1);
        divider.lineBetween(rightCx - this.p(190), this.p(150), rightCx + this.p(190), this.p(150));

        // Stats row
        const speed = mode === 'speed';
        const statY = this.p(172);
        if (speed) {
            this.createStatItem(rightCx - this.p(140), statY, `${accuracy}%`, '正答率', accuracy >= 80 ? '#4CAF50' : '#FF9800');
            this.createStatItem(rightCx - this.p(50), statY, `${bestStreak}`, 'Best Streak', '#FF9800');
            this.createStatItem(rightCx + this.p(50), statY, `+${timeBonus}`, 'Time Bonus', '#2D5BCC');
            this.createStatItem(rightCx + this.p(140), statY, `${timeouts}問`, '時間切れ', timeouts > 0 ? '#E65100' : '#4CAF50');
            this.add.text(rightCx, this.p(224), timeouts > 0
                ? '時間切れは まちがいに数えていないよ（速さの記録）'
                : '全部の問題に時間内で答えられたよ！', {
                fontFamily: JP_FONT, fontSize: `${this.p(11)}px`, color: '#888'
            }).setOrigin(0.5);
        } else {
            this.createStatItem(rightCx - this.p(100), statY, `${accuracy}%`, '正答率', accuracy >= 80 ? '#4CAF50' : '#FF9800');
            this.createStatItem(rightCx, statY, `${bestStreak}`, 'Best Streak', '#FF9800');
            this.createStatItem(rightCx + this.p(100), statY, 'なし', '時間せいげん', '#2D9C8F');
            this.add.text(rightCx, this.p(224), 'なれてきたら「速読チャレンジ」にもちょうせんしよう', {
                fontFamily: JP_FONT, fontSize: `${this.p(11)}px`, color: '#888'
            }).setOrigin(0.5);
        }

        // ===== BOTTOM: Wrong answers + Action Buttons =====
        const hasWrongAnswers = wrongAnswers && wrongAnswers.length > 0;

        if (hasWrongAnswers) {
            const wrongLabel = this.add.text(leftCx, this.p(290), `まちがえた問題 ${wrongAnswers.length}問を ふくしゅう用にほぞんしたよ`, {
                fontFamily: JP_FONT, fontSize: `${this.p(12)}px`, color: '#F44336',
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
            this.createButton(leftCx, this.p(322), 'まちがい直し', 0xF44336, () => {
                this.showWrongAnswerReview(wrongAnswers);
            });
        }

        // Action Buttons (bottom center)
        const btnY = hasWrongAnswers ? this.p(390) : this.p(340);

        // Play Again
        this.createButton(this.W / 2 - this.p(100), btnY, 'もういちど', 0x4CAF50, () => {
            this.cameras.main.fadeOut(300, 255, 255, 255);
            this.time.delayedCall(300, () => this.scene.start('GameScene', { level, mode, count }));
        });

        // Change level / mode / count
        this.createButton(this.W / 2 + this.p(100), btnY, 'メニューへ', 0x2D5BCC, () => {
            this.cameras.main.fadeOut(300, 255, 255, 255);
            this.time.delayedCall(300, () => this.scene.start('ProfileScene'));
        });

        // Portal link (iframe 埋め込み時は親側に戻る手段があるので出さない)
        if (!isEmbedded()) {
            const home = this.add.text(this.W / 2, btnY + this.p(50), '\uD83C\uDFE0 学習ホームにもどる', {
                fontFamily: JP_FONT, fontSize: `${this.p(14)}px`, color: '#5B7DB8'
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
        panelBg.fillRoundedRect(this.p(40), this.p(20), this.W - this.p(80), this.H - this.p(40), this.p(20));

        const titleText = this.add.text(this.W / 2, this.p(45), 'まちがい直し', {
            fontFamily: JP_FONT, fontStyle: 'bold', fontSize: `${this.p(22)}px`, color: '#F44336'
        }).setOrigin(0.5).setDepth(202);

        // Close button
        const closeBtn = this.add.text(this.W - this.p(60), this.p(30), 'X', {
            fontFamily: 'Fredoka One', fontSize: `${this.p(20)}px`, color: '#999'
        }).setOrigin(0.5).setDepth(202).setInteractive({ useHandCursor: true });

        const elements: Phaser.GameObjects.GameObject[] = [overlay, panelBg, titleText, closeBtn];

        let yPos = this.p(72);
        wrongAnswers.forEach((wa, i) => {
            if (yPos > this.H - this.p(80)) return; // Prevent overflow

            const itemBg = this.add.graphics().setDepth(202);
            itemBg.fillStyle(0xFFF0F0, 1);
            itemBg.fillRoundedRect(this.p(55), yPos, this.W - this.p(110), this.p(90), this.p(10));
            elements.push(itemBg);

            const numLabel = this.add.text(this.p(70), yPos + this.p(6), `#${i + 1}  [${wa.passageTitle}]`, {
                fontFamily: 'Nunito', fontSize: `${this.p(11)}px`, color: '#888'
            }).setDepth(202);
            elements.push(numLabel);

            const qText = this.add.text(this.p(70), yPos + this.p(22), wa.question, {
                fontFamily: 'Nunito', fontSize: `${this.p(13)}px`, color: '#333',
                fontStyle: 'bold',
                wordWrap: { width: this.W - this.p(160) }
            }).setDepth(202);
            elements.push(qText);

            const yourAns = this.add.text(this.p(70), yPos + this.p(48), `Your answer: ${wa.playerAnswer}`, {
                fontFamily: 'Nunito', fontSize: `${this.p(12)}px`, color: '#F44336'
            }).setDepth(202);
            elements.push(yourAns);

            const correctAns = this.add.text(this.p(70), yPos + this.p(66), `Correct: ${wa.correctAnswer}`, {
                fontFamily: 'Nunito', fontSize: `${this.p(12)}px`, color: '#4CAF50',
                fontStyle: 'bold'
            }).setDepth(202);
            elements.push(correctAns);

            yPos += this.p(98);
        });

        // Most Missed section (from localStorage)
        const mostMissed = SaveManager.getMostMissed(3);
        if (mostMissed.length > 0 && yPos < this.H - this.p(100)) {
            const missedTitle = this.add.text(this.W / 2, yPos + this.p(8), 'Most Missed Questions', {
                fontFamily: 'Fredoka One', fontSize: `${this.p(16)}px`, color: '#FF9800'
            }).setOrigin(0.5).setDepth(202);
            elements.push(missedTitle);

            yPos += this.p(30);
            mostMissed.forEach(mm => {
                if (yPos > this.H - this.p(60)) return;
                const mmText = this.add.text(this.p(70), yPos, `(${mm.timesWrong}x) ${mm.question}`, {
                    fontFamily: 'Nunito', fontSize: `${this.p(12)}px`, color: '#666',
                    wordWrap: { width: this.W - this.p(160) }
                }).setDepth(202);
                elements.push(mmText);
                yPos += this.p(24);
            });
        }

        closeBtn.on('pointerdown', () => {
            elements.forEach(el => el.destroy());
        });
    }

    private createStatRow(x: number, y: number, label: string, countStr: string, pctStr: string, pctColor: string) {
        this.add.text(x, y, label, {
            fontFamily: 'Nunito', fontSize: `${this.p(16)}px`, color: '#555', fontStyle: 'bold'
        });

        this.add.text(x + this.p(280), y, countStr, {
            fontFamily: 'Nunito', fontSize: `${this.p(16)}px`, color: '#888'
        }).setOrigin(1, 0);

        this.add.text(x + this.p(370), y, pctStr, {
            fontFamily: 'Fredoka One', fontSize: `${this.p(20)}px`, color: pctColor
        }).setOrigin(1, 0);
    }

    private createStatItem(x: number, y: number, value: string, label: string, color: string) {
        this.add.text(x, y, value, {
            fontFamily: 'Fredoka One', fontSize: `${this.p(20)}px`, color: color
        }).setOrigin(0.5);

        this.add.text(x, y + this.p(22), label, {
            fontFamily: JP_FONT, fontSize: `${this.p(11)}px`, color: '#888'
        }).setOrigin(0.5);
    }

    private createButton(x: number, y: number, text: string, color: number, onClick: () => void) {
        const btnBg = this.add.graphics();
        btnBg.fillStyle(color, 1);
        btnBg.fillRoundedRect(x - this.p(80), y - this.p(24), this.p(160), this.p(48), this.p(24));

        const btnText = this.add.text(x, y, text, {
            fontFamily: JP_FONT, fontSize: `${this.p(15)}px`, color: '#fff', fontStyle: 'bold'
        }).setOrigin(0.5);

        const zone = this.add.zone(x, y, this.p(160), this.p(48)).setInteractive({ useHandCursor: true });
        zone.on('pointerdown', onClick);
        zone.on('pointerover', () => {
            this.tweens.add({ targets: btnText, scaleX: 1.08, scaleY: 1.08, duration: 100 });
        });
        zone.on('pointerout', () => {
            this.tweens.add({ targets: btnText, scaleX: 1, scaleY: 1, duration: 100 });
        });
    }
}
