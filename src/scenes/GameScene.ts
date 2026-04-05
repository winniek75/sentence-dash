import * as Phaser from 'phaser';
import { Passage, passages } from '../data/passages';
import { soundManager } from '../systems/SoundManager';

type Phase = 'reading' | 'trueFalse' | 'question' | 'passageSummary' | 'transition';

interface PassageResult {
    tfCorrect: number;
    tfTotal: number;
    qCorrect: number;
    qTotal: number;
    timeBonus: number;
}

export class GameScene extends Phaser.Scene {
    private readonly W = 420;
    private readonly H = 780;
    private readonly TOTAL_PASSAGES = 8;
    private readonly READ_TIME = 18; // seconds
    private readonly TF_TIME = 5;
    private readonly Q_TIME = 10;

    // Game state
    private level: 'easy' | 'medium' | 'hard' = 'easy';
    private passageIndex = 0;
    private currentPassages: Passage[] = [];
    private currentPassage!: Passage;
    private phase: Phase = 'reading';

    // Scoring
    private score = 0;
    private streak = 0;
    private bestStreak = 0;
    private totalTimeBonus = 0;
    private passageResults: PassageResult[] = [];
    private currentPassageResult!: PassageResult;

    // True/False phase
    private tfIndex = 0;

    // Question phase
    private qIndex = 0;

    // Timer
    private timerEvent: Phaser.Time.TimerEvent | null = null;
    private answerStartTime = 0;

    // UI elements (destroyed/recreated per phase)
    private uiGroup!: Phaser.GameObjects.Group;
    private progressBar!: Phaser.GameObjects.Graphics;
    private scoreText!: Phaser.GameObjects.Text;
    private streakText!: Phaser.GameObjects.Text;
    private timerBar!: Phaser.GameObjects.Graphics;
    private timerTween: Phaser.Tweens.Tween | null = null;
    private passageText!: Phaser.GameObjects.Text;
    private passageBg!: Phaser.GameObjects.Graphics;

    // Prevent double-tap
    private inputLocked = false;

    constructor() {
        super({ key: 'GameScene' });
    }

    init(data: { level?: 'easy' | 'medium' | 'hard' }) {
        this.level = data.level || 'easy';
    }

    create() {
        // Reset state
        this.passageIndex = 0;
        this.score = 0;
        this.streak = 0;
        this.bestStreak = 0;
        this.totalTimeBonus = 0;
        this.passageResults = [];
        this.inputLocked = false;

        // Select passages for this session
        const levelPassages = passages.filter(p => p.level === this.level);
        this.currentPassages = Phaser.Utils.Array.Shuffle([...levelPassages]).slice(0, this.TOTAL_PASSAGES);

        // If not enough passages at this level, fill from others
        if (this.currentPassages.length < this.TOTAL_PASSAGES) {
            const others = passages.filter(p => p.level !== this.level);
            const extra = Phaser.Utils.Array.Shuffle([...others]).slice(0, this.TOTAL_PASSAGES - this.currentPassages.length);
            this.currentPassages.push(...extra);
        }

        // Background
        const bg = this.add.graphics();
        bg.fillGradientStyle(0xF5F7FA, 0xF5F7FA, 0xE8ECF2, 0xE8ECF2, 1);
        bg.fillRect(0, 0, this.W, this.H);

        // HUD (persistent)
        this.createHUD();

        // UI group for phase-specific elements
        this.uiGroup = this.add.group();

        // Start first passage
        this.startPassage();

        this.cameras.main.fadeIn(300, 245, 247, 250);
    }

    // ==================== HUD ====================

    private createHUD() {
        // Progress bar background
        this.progressBar = this.add.graphics().setDepth(50);
        this.drawProgressBar();

        // Score
        this.scoreText = this.add.text(15, 12, 'Score: 0', {
            fontFamily: 'Fredoka One', fontSize: '16px', color: '#2D5BCC'
        }).setDepth(51);

        // Streak
        this.streakText = this.add.text(this.W - 15, 12, '', {
            fontFamily: 'Fredoka One', fontSize: '16px', color: '#FF9800'
        }).setOrigin(1, 0).setDepth(51);

        // Timer bar
        this.timerBar = this.add.graphics().setDepth(50);
    }

    private drawProgressBar() {
        this.progressBar.clear();
        // Background
        this.progressBar.fillStyle(0xDDE3ED, 1);
        this.progressBar.fillRoundedRect(10, 40, this.W - 20, 8, 4);
        // Fill
        const fillW = ((this.passageIndex) / this.TOTAL_PASSAGES) * (this.W - 20);
        if (fillW > 0) {
            this.progressBar.fillStyle(0x4CAF50, 1);
            this.progressBar.fillRoundedRect(10, 40, fillW, 8, 4);
        }
        // Label
        // Remove old label if exists
        const existingLabel = this.children.getByName('progressLabel') as Phaser.GameObjects.Text;
        if (existingLabel) existingLabel.destroy();

        this.add.text(this.W / 2, 44, `${this.passageIndex + 1} / ${this.TOTAL_PASSAGES}`, {
            fontFamily: 'Nunito', fontSize: '10px', color: '#888'
        }).setOrigin(0.5).setDepth(51).setName('progressLabel');
    }

    private updateScoreDisplay() {
        this.scoreText.setText(`Score: ${this.score}`);
        if (this.streak >= 2) {
            const mult = this.getStreakMultiplier();
            this.streakText.setText(`${this.streak} streak ${mult > 1 ? mult + 'x' : ''}`);
            this.streakText.setColor(mult >= 3 ? '#F44336' : mult >= 2 ? '#FF9800' : '#FF9800');
        } else {
            this.streakText.setText('');
        }
    }

    private getStreakMultiplier(): number {
        if (this.streak >= 5) return 3;
        if (this.streak >= 3) return 2;
        return 1;
    }

    // ==================== TIMER ====================

    private startTimer(seconds: number, onExpire: () => void) {
        this.answerStartTime = this.time.now;

        // Draw timer bar
        this.drawTimerBar(1);

        // Tween-based timer bar animation
        if (this.timerTween) this.timerTween.destroy();

        const duration = seconds * 1000;

        this.timerTween = this.tweens.addCounter({
            from: 1,
            to: 0,
            duration: duration,
            onUpdate: (tween) => {
                this.drawTimerBar(tween.getValue() ?? 0);
            },
            onComplete: () => {
                this.drawTimerBar(0);
            }
        });

        // Timer event for expiration
        if (this.timerEvent) this.timerEvent.destroy();
        this.timerEvent = this.time.delayedCall(seconds * 1000, () => {
            onExpire();
        });
    }

    private stopTimer(): number {
        const elapsed = (this.time.now - this.answerStartTime) / 1000;
        if (this.timerEvent) {
            this.timerEvent.destroy();
            this.timerEvent = null;
        }
        if (this.timerTween) {
            this.timerTween.destroy();
            this.timerTween = null;
        }
        return elapsed;
    }

    private drawTimerBar(fraction: number) {
        this.timerBar.clear();
        const barY = 55;
        const barH = 5;
        // Background
        this.timerBar.fillStyle(0xDDE3ED, 1);
        this.timerBar.fillRect(10, barY, this.W - 20, barH);
        // Fill
        const fillW = fraction * (this.W - 20);
        if (fillW > 0) {
            const color = fraction > 0.3 ? 0x4CAF50 : fraction > 0.15 ? 0xFF9800 : 0xF44336;
            this.timerBar.fillStyle(color, 1);
            this.timerBar.fillRect(10, barY, fillW, barH);
        }
    }

    // ==================== PASSAGE FLOW ====================

    private startPassage() {
        this.currentPassage = this.currentPassages[this.passageIndex];
        this.currentPassageResult = { tfCorrect: 0, tfTotal: 0, qCorrect: 0, qTotal: 0, timeBonus: 0 };
        this.tfIndex = 0;
        this.qIndex = 0;
        this.drawProgressBar();
        this.updateScoreDisplay();

        // Show passage number transition
        this.phase = 'transition';
        this.clearUI();

        const overlay = this.add.graphics();
        overlay.fillStyle(0x2D5BCC, 0.9);
        overlay.fillRoundedRect(this.W / 2 - 130, this.H / 2 - 60, 260, 120, 20);
        this.uiGroup.add(overlay);

        const numText = this.add.text(this.W / 2, this.H / 2 - 20, `Passage ${this.passageIndex + 1}/${this.TOTAL_PASSAGES}`, {
            fontFamily: 'Fredoka One', fontSize: '24px', color: '#FFFFFF'
        }).setOrigin(0.5).setAlpha(0);
        this.uiGroup.add(numText);

        const titleText = this.add.text(this.W / 2, this.H / 2 + 15, this.currentPassage.title, {
            fontFamily: 'Nunito', fontSize: '18px', color: '#C5D8F7'
        }).setOrigin(0.5).setAlpha(0);
        this.uiGroup.add(titleText);

        this.tweens.add({ targets: numText, alpha: 1, duration: 300, ease: 'Power2' });
        this.tweens.add({ targets: titleText, alpha: 1, duration: 300, delay: 200, ease: 'Power2' });

        this.time.delayedCall(1800, () => {
            this.tweens.add({
                targets: [overlay, numText, titleText],
                alpha: 0,
                duration: 300,
                onComplete: () => {
                    this.clearUI();
                    this.showReadingPhase();
                }
            });
        });
    }

    // ==================== READING PHASE ====================

    private showReadingPhase() {
        this.phase = 'reading';
        this.clearUI();

        // Passage box
        this.passageBg = this.add.graphics();
        this.passageBg.fillStyle(0xFFFFFF, 1);
        this.passageBg.fillRoundedRect(15, 70, this.W - 30, 380, 16);
        this.passageBg.lineStyle(2, 0xDDE3ED, 1);
        this.passageBg.strokeRoundedRect(15, 70, this.W - 30, 380, 16);
        this.uiGroup.add(this.passageBg);

        // Title
        const titleLabel = this.add.text(this.W / 2, 90, this.currentPassage.title, {
            fontFamily: 'Fredoka One', fontSize: '20px', color: '#2D5BCC'
        }).setOrigin(0.5);
        this.uiGroup.add(titleLabel);

        // Passage text
        this.passageText = this.add.text(this.W / 2, 120, this.currentPassage.text, {
            fontFamily: 'Nunito', fontSize: '17px', color: '#333333',
            wordWrap: { width: this.W - 70 },
            lineSpacing: 8,
            align: 'left'
        }).setOrigin(0.5, 0);
        this.uiGroup.add(this.passageText);

        // "READ" badge
        const readBadge = this.add.text(this.W / 2, 470, 'READ CAREFULLY', {
            fontFamily: 'Fredoka One', fontSize: '22px', color: '#4CAF50'
        }).setOrigin(0.5);
        this.uiGroup.add(readBadge);

        this.tweens.add({
            targets: readBadge,
            alpha: 0.4,
            yoyo: true,
            repeat: -1,
            duration: 1000
        });

        // Timer
        this.startTimer(this.READ_TIME, () => {
            this.beginTrueFalsePhase();
        });
    }

    // ==================== TRUE/FALSE PHASE ====================

    private beginTrueFalsePhase() {
        this.stopTimer();
        this.phase = 'trueFalse';
        this.tfIndex = 0;
        this.showTrueFalseQuestion();
    }

    private showTrueFalseQuestion() {
        this.clearUI();
        this.inputLocked = false;

        // Shrunk passage at top
        this.showShrunkPassage();

        const tf = this.currentPassage.trueFalse[this.tfIndex];

        // Phase label
        const phaseLabel = this.add.text(this.W / 2, 260, `TRUE or FALSE  (${this.tfIndex + 1}/3)`, {
            fontFamily: 'Fredoka One', fontSize: '16px', color: '#888'
        }).setOrigin(0.5);
        this.uiGroup.add(phaseLabel);

        // Statement box
        const stmtBg = this.add.graphics();
        stmtBg.fillStyle(0xFFFFFF, 1);
        stmtBg.fillRoundedRect(20, 285, this.W - 40, 120, 14);
        stmtBg.lineStyle(2, 0xDDE3ED, 1);
        stmtBg.strokeRoundedRect(20, 285, this.W - 40, 120, 14);
        this.uiGroup.add(stmtBg);

        const stmtText = this.add.text(this.W / 2, 345, `"${tf.statement}"`, {
            fontFamily: 'Nunito', fontSize: '18px', color: '#333',
            wordWrap: { width: this.W - 80 },
            align: 'center',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.uiGroup.add(stmtText);

        // TRUE button (left)
        this.createTFButton(this.W / 2 - 80, 480, '\u2B55', 'TRUE', 0x4CAF50, () => {
            this.handleTFAnswer(true);
        });

        // FALSE button (right)
        this.createTFButton(this.W / 2 + 80, 480, '\u274C', 'FALSE', 0xF44336, () => {
            this.handleTFAnswer(false);
        });

        // Timer
        this.startTimer(this.TF_TIME, () => {
            this.handleTFAnswer(null); // Time up = wrong
        });
    }

    private createTFButton(x: number, y: number, emoji: string, label: string, color: number, onTap: () => void) {
        const btnBg = this.add.graphics();
        btnBg.fillStyle(color, 1);
        btnBg.fillRoundedRect(x - 60, y - 45, 120, 90, 18);
        this.uiGroup.add(btnBg);

        const emojiText = this.add.text(x, y - 12, emoji, {
            fontSize: '32px'
        }).setOrigin(0.5);
        this.uiGroup.add(emojiText);

        const labelText = this.add.text(x, y + 25, label, {
            fontFamily: 'Fredoka One', fontSize: '16px', color: '#FFFFFF'
        }).setOrigin(0.5);
        this.uiGroup.add(labelText);

        const zone = this.add.zone(x, y, 120, 90).setInteractive({ useHandCursor: true });
        this.uiGroup.add(zone);
        zone.on('pointerdown', () => {
            if (this.inputLocked) return;
            this.inputLocked = true;
            onTap();
        });
    }

    private handleTFAnswer(playerSaidTrue: boolean | null) {
        const elapsed = this.stopTimer();
        const tf = this.currentPassage.trueFalse[this.tfIndex];
        const isCorrect = playerSaidTrue !== null && playerSaidTrue === tf.isTrue;

        this.currentPassageResult.tfTotal++;

        if (isCorrect) {
            this.currentPassageResult.tfCorrect++;
            let points = 100 * this.getStreakMultiplier();
            let bonus = 0;
            if (elapsed < 2) {
                bonus = 50;
                this.totalTimeBonus += bonus;
                this.currentPassageResult.timeBonus += bonus;
            }
            this.score += points + bonus;
            this.streak++;
            if (this.streak > this.bestStreak) this.bestStreak = this.streak;

            soundManager.playSound('correct');
            this.showFeedback(true, tf.explanation, bonus);
        } else {
            this.streak = 0;
            soundManager.playSound('wrong');
            this.showFeedback(false, tf.explanation, 0);
        }

        this.updateScoreDisplay();
    }

    // ==================== QUESTION PHASE ====================

    private beginQuestionPhase() {
        this.phase = 'question';
        this.qIndex = 0;
        this.showQuestion();
    }

    private showQuestion() {
        this.clearUI();
        this.inputLocked = false;

        // Shrunk passage
        this.showShrunkPassage();

        const q = this.currentPassage.questions[this.qIndex];

        // Question type badge
        const typeBadge = this.add.text(this.W / 2, 260, q.type.toUpperCase(), {
            fontFamily: 'Fredoka One', fontSize: '14px', color: '#FFFFFF',
            backgroundColor: '#2D5BCC',
            padding: { left: 12, right: 12, top: 4, bottom: 4 }
        }).setOrigin(0.5);
        this.uiGroup.add(typeBadge);

        // Phase label
        const phaseLabel = this.add.text(this.W / 2, 285, `Question ${this.qIndex + 1}/2`, {
            fontFamily: 'Nunito', fontSize: '13px', color: '#888'
        }).setOrigin(0.5);
        this.uiGroup.add(phaseLabel);

        // Question text
        const qText = this.add.text(this.W / 2, 330, q.question, {
            fontFamily: 'Nunito', fontSize: '18px', color: '#333',
            wordWrap: { width: this.W - 60 },
            align: 'center',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.uiGroup.add(qText);

        // Answer choices
        q.choices.forEach((choice, i) => {
            this.createChoiceButton(this.W / 2, 410 + i * 70, choice, i, () => {
                this.handleQuestionAnswer(i);
            });
        });

        // Timer
        this.startTimer(this.Q_TIME, () => {
            this.handleQuestionAnswer(-1); // Time up
        });
    }

    private createChoiceButton(x: number, y: number, text: string, _index: number, onTap: () => void) {
        const btnW = this.W - 60;
        const btnH = 52;

        const btnBg = this.add.graphics();
        btnBg.fillStyle(0xFFFFFF, 1);
        btnBg.fillRoundedRect(x - btnW / 2, y - btnH / 2, btnW, btnH, 14);
        btnBg.lineStyle(2, 0x2D5BCC, 0.4);
        btnBg.strokeRoundedRect(x - btnW / 2, y - btnH / 2, btnW, btnH, 14);
        this.uiGroup.add(btnBg);

        const btnText = this.add.text(x, y, text, {
            fontFamily: 'Nunito', fontSize: '17px', color: '#333',
            fontStyle: 'bold',
            wordWrap: { width: btnW - 30 },
            align: 'center'
        }).setOrigin(0.5);
        this.uiGroup.add(btnText);

        const zone = this.add.zone(x, y, btnW, btnH).setInteractive({ useHandCursor: true });
        this.uiGroup.add(zone);
        zone.on('pointerdown', () => {
            if (this.inputLocked) return;
            this.inputLocked = true;
            onTap();
        });
    }

    private handleQuestionAnswer(choiceIndex: number) {
        const elapsed = this.stopTimer();
        const q = this.currentPassage.questions[this.qIndex];
        const isCorrect = choiceIndex === q.correctIndex;

        this.currentPassageResult.qTotal++;

        if (isCorrect) {
            this.currentPassageResult.qCorrect++;
            let points = 200 * this.getStreakMultiplier();
            let bonus = 0;
            if (elapsed < 5) {
                bonus = 100;
                this.totalTimeBonus += bonus;
                this.currentPassageResult.timeBonus += bonus;
            }
            this.score += points + bonus;
            this.streak++;
            if (this.streak > this.bestStreak) this.bestStreak = this.streak;

            soundManager.playSound('correct');
            const explanation = `Correct! The answer is: ${q.choices[q.correctIndex]}`;
            this.showFeedback(true, explanation, bonus);
        } else {
            this.streak = 0;
            soundManager.playSound('wrong');
            const explanation = `The correct answer is: ${q.choices[q.correctIndex]}`;
            this.showFeedback(false, explanation, 0);
        }

        this.updateScoreDisplay();
    }

    // ==================== FEEDBACK ====================

    private showFeedback(correct: boolean, explanation: string, bonus: number) {
        // Overlay for feedback
        const feedbackBg = this.add.graphics().setDepth(100);
        feedbackBg.fillStyle(correct ? 0x4CAF50 : 0xF44336, 0.15);
        feedbackBg.fillRect(0, 0, this.W, this.H);

        // Feedback icon
        const icon = this.add.text(this.W / 2, this.H / 2 - 40, correct ? '\u2713' : '\u2717', {
            fontFamily: 'Fredoka One', fontSize: '64px',
            color: correct ? '#4CAF50' : '#F44336'
        }).setOrigin(0.5).setDepth(101).setAlpha(0).setScale(0.5);

        this.tweens.add({
            targets: icon,
            alpha: 1, scale: 1,
            duration: 250,
            ease: 'Back.out'
        });

        // Explanation
        const explText = this.add.text(this.W / 2, this.H / 2 + 20, explanation, {
            fontFamily: 'Nunito', fontSize: '15px',
            color: correct ? '#2E7D32' : '#C62828',
            wordWrap: { width: this.W - 60 },
            align: 'center'
        }).setOrigin(0.5).setDepth(101).setAlpha(0);

        this.tweens.add({ targets: explText, alpha: 1, duration: 200, delay: 150 });

        // Bonus text
        if (bonus > 0) {
            const bonusText = this.add.text(this.W / 2, this.H / 2 + 60, `+${bonus} time bonus!`, {
                fontFamily: 'Fredoka One', fontSize: '16px', color: '#FF9800'
            }).setOrigin(0.5).setDepth(101).setAlpha(0);
            this.tweens.add({
                targets: bonusText,
                alpha: 1, y: this.H / 2 + 50,
                duration: 300, delay: 200,
                onComplete: () => {
                    this.tweens.add({ targets: bonusText, alpha: 0, duration: 300, delay: 600 });
                }
            });
        }

        // Streak multiplier popup
        if (correct && this.getStreakMultiplier() > 1) {
            const multText = this.add.text(this.W / 2, this.H / 2 - 90, `${this.getStreakMultiplier()}x STREAK!`, {
                fontFamily: 'Fredoka One', fontSize: '28px', color: '#FF9800',
                stroke: '#FFF', strokeThickness: 3
            }).setOrigin(0.5).setDepth(101).setAlpha(0).setScale(0.5);

            this.tweens.add({
                targets: multText,
                alpha: 1, scale: 1.2,
                duration: 300,
                yoyo: true,
                hold: 400
            });
        }

        // Screen effect
        if (!correct) {
            this.cameras.main.shake(200, 0.008);
        }

        // Auto-advance after feedback
        this.time.delayedCall(1500, () => {
            feedbackBg.destroy();
            icon.destroy();
            explText.destroy();
            this.advancePhase();
        });
    }

    private advancePhase() {
        if (this.phase === 'trueFalse') {
            this.tfIndex++;
            if (this.tfIndex < this.currentPassage.trueFalse.length) {
                this.showTrueFalseQuestion();
            } else {
                this.beginQuestionPhase();
            }
        } else if (this.phase === 'question') {
            this.qIndex++;
            if (this.qIndex < this.currentPassage.questions.length) {
                this.showQuestion();
            } else {
                this.showPassageSummary();
            }
        }
    }

    // ==================== PASSAGE SUMMARY ====================

    private showPassageSummary() {
        this.phase = 'passageSummary';
        this.clearUI();
        this.stopTimer();
        this.drawTimerBar(0);

        this.passageResults.push({ ...this.currentPassageResult });

        const totalCorrect = this.currentPassageResult.tfCorrect + this.currentPassageResult.qCorrect;
        const totalQ = this.currentPassageResult.tfTotal + this.currentPassageResult.qTotal;

        // Summary card
        const cardBg = this.add.graphics();
        cardBg.fillStyle(0xFFFFFF, 1);
        cardBg.fillRoundedRect(this.W / 2 - 140, this.H / 2 - 80, 280, 160, 20);
        cardBg.lineStyle(2, 0xDDE3ED, 1);
        cardBg.strokeRoundedRect(this.W / 2 - 140, this.H / 2 - 80, 280, 160, 20);
        this.uiGroup.add(cardBg);

        const emoji = totalCorrect >= 4 ? '\u2B50' : totalCorrect >= 2 ? '\u{1F44D}' : '\u{1F4AA}';
        const summaryIcon = this.add.text(this.W / 2, this.H / 2 - 50, emoji, {
            fontSize: '36px'
        }).setOrigin(0.5);
        this.uiGroup.add(summaryIcon);

        const summaryText = this.add.text(this.W / 2, this.H / 2, `${totalCorrect} / ${totalQ} correct`, {
            fontFamily: 'Fredoka One', fontSize: '24px', color: '#333'
        }).setOrigin(0.5);
        this.uiGroup.add(summaryText);

        if (this.currentPassageResult.timeBonus > 0) {
            const bonusLabel = this.add.text(this.W / 2, this.H / 2 + 35, `+${this.currentPassageResult.timeBonus} time bonus`, {
                fontFamily: 'Nunito', fontSize: '15px', color: '#FF9800'
            }).setOrigin(0.5);
            this.uiGroup.add(bonusLabel);
        }

        this.time.delayedCall(2000, () => {
            this.passageIndex++;
            if (this.passageIndex < this.TOTAL_PASSAGES && this.passageIndex < this.currentPassages.length) {
                this.startPassage();
            } else {
                this.goToResults();
            }
        });
    }

    // ==================== SHRUNK PASSAGE ====================

    private showShrunkPassage() {
        const shrunkBg = this.add.graphics();
        shrunkBg.fillStyle(0xFFFFFF, 0.7);
        shrunkBg.fillRoundedRect(10, 65, this.W - 20, 185, 12);
        shrunkBg.lineStyle(1, 0xDDE3ED, 0.5);
        shrunkBg.strokeRoundedRect(10, 65, this.W - 20, 185, 12);
        this.uiGroup.add(shrunkBg);

        const shrunkTitle = this.add.text(20, 72, this.currentPassage.title, {
            fontFamily: 'Fredoka One', fontSize: '13px', color: '#2D5BCC'
        });
        this.uiGroup.add(shrunkTitle);

        const shrunkText = this.add.text(20, 90, this.currentPassage.text, {
            fontFamily: 'Nunito', fontSize: '12px', color: '#555',
            wordWrap: { width: this.W - 50 },
            lineSpacing: 3
        });
        this.uiGroup.add(shrunkText);
    }

    // ==================== UTILITIES ====================

    private clearUI() {
        this.uiGroup.clear(true, true);
    }

    private goToResults() {
        // Aggregate stats
        let totalTFCorrect = 0, totalTFTotal = 0;
        let totalQCorrect = 0, totalQTotal = 0;

        this.passageResults.forEach(r => {
            totalTFCorrect += r.tfCorrect;
            totalTFTotal += r.tfTotal;
            totalQCorrect += r.qCorrect;
            totalQTotal += r.qTotal;
        });

        this.cameras.main.fadeOut(400, 255, 255, 255);
        this.time.delayedCall(400, () => {
            this.scene.start('ResultScene', {
                score: this.score,
                level: this.level,
                tfCorrect: totalTFCorrect,
                tfTotal: totalTFTotal,
                qCorrect: totalQCorrect,
                qTotal: totalQTotal,
                bestStreak: this.bestStreak,
                timeBonus: this.totalTimeBonus,
                passagesCompleted: this.passageIndex
            });
        });
    }
}
