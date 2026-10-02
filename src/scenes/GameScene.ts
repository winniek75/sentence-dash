import * as Phaser from 'phaser';
import { Passage, passages, splitSentences } from '../data/passages';
import { soundManager } from '../systems/SoundManager';
import { SaveManager } from '../systems/SaveManager';
import { Level, GameMode, DEFAULT_COUNT, DEFAULT_MODE, MAX_COUNT, JP_FONT } from '../systems/Launch';

declare global { interface Window { WiseXP?: any; } }

type Phase = 'reading' | 'trueFalse' | 'question' | 'passageSummary' | 'transition';
type Outcome = 'correct' | 'wrong' | 'timeout';

interface PassageResult {
    tfCorrect: number;
    tfTotal: number;
    qCorrect: number;
    qTotal: number;
    /** 時間切れ（速読チャレンジのみ）。誤答とは別に数える */
    tfTimeouts: number;
    qTimeouts: number;
    timeBonus: number;
}

interface FeedbackInfo {
    outcome: Outcome;
    prompt: string;
    correctAnswer: string;
    playerAnswer?: string;
    explanation?: string;
    evidence: number[];
    bonus: number;
}

export class GameScene extends Phaser.Scene {
    private readonly W = 420;
    private readonly H = 780;
    // 速読チャレンジ（speed）のときだけ使う制限時間（秒）
    private readonly READ_TIME = 18;
    private readonly TF_TIME = 5;
    private readonly Q_TIME = 10;

    // Game state
    private level: Level = 'easy';
    /** careful = じっくり読む（時間制限なし） / speed = 速読チャレンジ */
    private mode: GameMode = DEFAULT_MODE;
    private requestedCount = DEFAULT_COUNT;
    private totalPassages = DEFAULT_COUNT;
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

    // Wrong answers tracked during this session
    private sessionWrongAnswers: Array<{
        passageTitle: string;
        level: Level;
        type: 'trueFalse' | 'question';
        question: string;
        playerAnswer: string;
        correctAnswer: string;
        explanation: string;
    }> = [];

    constructor() {
        super({ key: 'GameScene' });
    }

    init(data: { level?: Level; mode?: GameMode; count?: number }) {
        this.level = data.level || 'easy';
        this.mode = data.mode || DEFAULT_MODE;
        this.requestedCount = Phaser.Math.Clamp(Math.floor(data.count || DEFAULT_COUNT), 1, MAX_COUNT);
    }

    private get timed(): boolean {
        return this.mode === 'speed';
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
        this.sessionWrongAnswers = [];

        // Select passages for this session.
        // 少ない文章数で何回か遊んでも同じ文章ばかりにならないよう、
        // まだ読んでいない文章 → 読んでから時間がたった文章 の順に選ぶ。
        const recent = SaveManager.loadProgress().recentPassages || [];
        const levelPassages = Phaser.Utils.Array.Shuffle(passages.filter(p => p.level === this.level));
        levelPassages.sort((a, b) => recent.indexOf(a.id) - recent.indexOf(b.id));
        this.currentPassages = levelPassages.slice(0, this.requestedCount);

        // If not enough passages at this level, fill from others
        if (this.currentPassages.length < this.requestedCount) {
            const others = passages.filter(p => p.level !== this.level);
            const extra = Phaser.Utils.Array.Shuffle([...others]).slice(0, this.requestedCount - this.currentPassages.length);
            this.currentPassages.push(...extra);
        }
        this.totalPassages = this.currentPassages.length;

        // Background
        const bg = this.add.graphics();
        bg.fillGradientStyle(0xF5F7FA, 0xF5F7FA, 0xE8ECF2, 0xE8ECF2, 1);
        bg.fillRect(0, 0, this.W, this.H);

        // HUD (persistent)
        this.createHUD();

        // Back button
        this.createBackButton();

        // UI group for phase-specific elements
        this.uiGroup = this.add.group();

        // Start first passage
        this.startPassage();

        this.cameras.main.fadeIn(300, 245, 247, 250);
    }

    // ==================== BACK BUTTON ====================

    private createBackButton() {
        const btn = this.add.text(this.W - 15, 12, '✕ やめる', {
            fontFamily: 'Nunito', fontSize: '14px', color: '#999',
            fontStyle: 'bold'
        }).setOrigin(1, 0).setDepth(100).setInteractive({ useHandCursor: true });

        btn.on('pointerover', () => btn.setColor('#F44336'));
        btn.on('pointerout', () => btn.setColor('#999'));
        btn.on('pointerdown', () => {
            this.stopTimer();
            soundManager.stopSpeech();
            this.cameras.main.fadeOut(300, 245, 247, 250);
            this.time.delayedCall(300, () => {
                this.scene.start('ProfileScene');
            });
        });
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
        this.streakText = this.add.text(this.W / 2, 12, '', {
            fontFamily: 'Fredoka One', fontSize: '16px', color: '#FF9800'
        }).setOrigin(0.5, 0).setDepth(51);

        // Timer bar
        this.timerBar = this.add.graphics().setDepth(50);
    }

    private drawProgressBar() {
        this.progressBar.clear();
        // Background
        this.progressBar.fillStyle(0xDDE3ED, 1);
        this.progressBar.fillRoundedRect(10, 40, this.W - 20, 8, 4);
        // Fill
        const fillW = ((this.passageIndex) / this.totalPassages) * (this.W - 20);
        if (fillW > 0) {
            this.progressBar.fillStyle(0x4CAF50, 1);
            this.progressBar.fillRoundedRect(10, 40, fillW, 8, 4);
        }
        // Label
        // Remove old label if exists
        const existingLabel = this.children.getByName('progressLabel') as Phaser.GameObjects.Text;
        if (existingLabel) existingLabel.destroy();

        this.add.text(this.W / 2, 44, `${this.passageIndex + 1} / ${this.totalPassages}`, {
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
        this.currentPassageResult = { tfCorrect: 0, tfTotal: 0, qCorrect: 0, qTotal: 0, tfTimeouts: 0, qTimeouts: 0, timeBonus: 0 };
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

        const numText = this.add.text(this.W / 2, this.H / 2 - 20, `Passage ${this.passageIndex + 1}/${this.totalPassages}`, {
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

        // TTS Listen button
        const listenBtnBg = this.add.graphics();
        listenBtnBg.fillStyle(0x2D5BCC, 1);
        listenBtnBg.fillRoundedRect(this.W / 2 - 60, 500, 120, 40, 20);
        this.uiGroup.add(listenBtnBg);

        const listenText = this.add.text(this.W / 2, 520, 'Listen', {
            fontFamily: 'Fredoka One', fontSize: '16px', color: '#FFFFFF'
        }).setOrigin(0.5);
        this.uiGroup.add(listenText);

        const listenZone = this.add.zone(this.W / 2, 520, 120, 40).setInteractive({ useHandCursor: true });
        this.uiGroup.add(listenZone);
        listenZone.on('pointerdown', () => {
            soundManager.speak(this.currentPassage.text, 0.85);
        });

        // Auto-read the passage via TTS
        this.time.delayedCall(500, () => {
            if (this.phase === 'reading') soundManager.speak(this.currentPassage.text, 0.85);
        });

        if (this.timed) {
            const hint = this.add.text(this.W / 2, 570, `${this.READ_TIME}びょうで読もう`, {
                fontFamily: JP_FONT, fontSize: '13px', color: '#888'
            }).setOrigin(0.5);
            this.uiGroup.add(hint);

            // Timer
            this.startTimer(this.READ_TIME, () => {
                soundManager.stopSpeech();
                this.beginTrueFalsePhase();
            });
        } else {
            // じっくり読む: 時間制限なし。読めたら自分で進む。
            this.timerBar.clear();
            const hint = this.add.text(this.W / 2, 570, '時間は気にしなくていいよ。読めたらボタンをおそう', {
                fontFamily: JP_FONT, fontSize: '13px', color: '#888'
            }).setOrigin(0.5);
            this.uiGroup.add(hint);

            this.createWideButton(this.W / 2, 630, '読めた！ もんだいへ \u25B6', 0x4CAF50, () => {
                soundManager.stopSpeech();
                this.beginTrueFalsePhase();
            });
        }
    }

    /** 画面下の大きなボタン（じっくりモードの「読めた」「つぎへ」など） */
    private createWideButton(x: number, y: number, label: string, color: number, onTap: () => void) {
        const w = 260;
        const h = 56;
        const bg = this.add.graphics();
        bg.fillStyle(color, 1);
        bg.fillRoundedRect(x - w / 2, y - h / 2, w, h, 28);
        this.uiGroup.add(bg);

        const text = this.add.text(x, y, label, {
            fontFamily: JP_FONT, fontSize: '18px', color: '#FFFFFF', fontStyle: 'bold'
        }).setOrigin(0.5);
        this.uiGroup.add(text);

        const zone = this.add.zone(x, y, w, h).setInteractive({ useHandCursor: true });
        this.uiGroup.add(zone);
        let tapped = false;
        zone.on('pointerdown', () => {
            if (tapped) return;
            tapped = true;
            onTap();
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
        const phaseLabel = this.add.text(this.W / 2, 260, `TRUE or FALSE  (${this.tfIndex + 1}/${this.currentPassage.trueFalse.length})`, {
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

        // Read the T/F statement aloud
        soundManager.speak(tf.statement, 0.9);

        // TRUE button (left)
        this.createTFButton(this.W / 2 - 80, 480, '\u2B55', 'TRUE', 0x4CAF50, () => {
            this.handleTFAnswer(true);
        });

        // FALSE button (right)
        this.createTFButton(this.W / 2 + 80, 480, '\u274C', 'FALSE', 0xF44336, () => {
            this.handleTFAnswer(false);
        });

        // Timer（速読チャレンジのみ）
        if (this.timed) {
            this.startTimer(this.TF_TIME, () => {
                if (this.inputLocked) return;
                this.inputLocked = true;
                this.handleTFAnswer(null); // 時間切れ（誤答とは別あつかい）
            });
        } else {
            this.answerStartTime = this.time.now;
            this.timerBar.clear();
        }
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
        soundManager.stopSpeech();
        const tf = this.currentPassage.trueFalse[this.tfIndex];
        const correctAnswer = tf.isTrue ? 'TRUE' : 'FALSE';
        const info: FeedbackInfo = {
            outcome: 'wrong',
            prompt: `"${tf.statement}"`,
            correctAnswer,
            explanation: tf.explanation,
            evidence: tf.evidence,
            bonus: 0
        };

        this.currentPassageResult.tfTotal++;

        if (playerSaidTrue === null) {
            // 時間切れ: 速さの記録として数えるだけで、誤答としては保存・送信しない
            this.currentPassageResult.tfTimeouts++;
            this.streak = 0;
            info.outcome = 'timeout';
        } else if (playerSaidTrue === tf.isTrue) {
            this.currentPassageResult.tfCorrect++;
            const points = 100 * this.getStreakMultiplier();
            let bonus = 0;
            if (this.timed && elapsed < 2) {
                bonus = 50;
                this.totalTimeBonus += bonus;
                this.currentPassageResult.timeBonus += bonus;
            }
            this.score += points + bonus;
            this.streak++;
            if (this.streak > this.bestStreak) this.bestStreak = this.streak;

            soundManager.playSound('correct');
            info.outcome = 'correct';
            info.bonus = bonus;
        } else {
            this.streak = 0;
            soundManager.playSound('wrong');
            info.playerAnswer = playerSaidTrue ? 'TRUE' : 'FALSE';
            this.recordWrong('trueFalse', tf.statement, info.playerAnswer, correctAnswer, tf.explanation);
        }

        this.updateScoreDisplay();
        this.showFeedback(info);
    }

    /** 実際にまちがえた答えだけを記録・送信する（時間切れはここを通らない） */
    private recordWrong(type: 'trueFalse' | 'question', question: string, playerAnswer: string, correctAnswer: string, explanation: string) {
        const wrongEntry = {
            passageTitle: this.currentPassage.title,
            level: this.level,
            type,
            question,
            playerAnswer,
            correctAnswer,
            explanation
        };
        this.sessionWrongAnswers.push(wrongEntry);
        SaveManager.recordWrongAnswer({
            ...wrongEntry,
            date: new Date().toISOString().split('T')[0]
        });
        // Report wrong answer to WiseXP
        if (window.WiseXP) {
            try {
                window.WiseXP.reportWrong({ question, correct: correctAnswer, playerAnswer });
            } catch (_e) { /* SDK 側の失敗でゲームを止めない */ }
        }
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
        const phaseLabel = this.add.text(this.W / 2, 285, `Question ${this.qIndex + 1}/${this.currentPassage.questions.length}`, {
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

        // Read the question aloud
        soundManager.speak(q.question, 0.9);

        // Answer choices
        q.choices.forEach((choice, i) => {
            this.createChoiceButton(this.W / 2, 410 + i * 70, choice, i, () => {
                this.handleQuestionAnswer(i);
            });
        });

        // Timer（速読チャレンジのみ）
        if (this.timed) {
            this.startTimer(this.Q_TIME, () => {
                if (this.inputLocked) return;
                this.inputLocked = true;
                this.handleQuestionAnswer(-1); // 時間切れ（誤答とは別あつかい）
            });
        } else {
            this.answerStartTime = this.time.now;
            this.timerBar.clear();
        }
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
        soundManager.stopSpeech();
        const q = this.currentPassage.questions[this.qIndex];
        const correctAnswer = q.choices[q.correctIndex];
        const info: FeedbackInfo = {
            outcome: 'wrong',
            prompt: q.question,
            correctAnswer,
            evidence: q.evidence,
            bonus: 0
        };

        this.currentPassageResult.qTotal++;

        if (choiceIndex < 0) {
            // 時間切れ: 速さの記録として数えるだけで、誤答としては保存・送信しない
            this.currentPassageResult.qTimeouts++;
            this.streak = 0;
            info.outcome = 'timeout';
        } else if (choiceIndex === q.correctIndex) {
            this.currentPassageResult.qCorrect++;
            const points = 200 * this.getStreakMultiplier();
            let bonus = 0;
            if (this.timed && elapsed < 5) {
                bonus = 100;
                this.totalTimeBonus += bonus;
                this.currentPassageResult.timeBonus += bonus;
            }
            this.score += points + bonus;
            this.streak++;
            if (this.streak > this.bestStreak) this.bestStreak = this.streak;

            soundManager.playSound('correct');
            info.outcome = 'correct';
            info.bonus = bonus;
        } else {
            this.streak = 0;
            soundManager.playSound('wrong');
            info.playerAnswer = q.choices[choiceIndex];
            this.recordWrong('question', q.question, info.playerAnswer, correctAnswer,
                `The correct answer is: ${correctAnswer}`);
        }

        this.updateScoreDisplay();
        this.showFeedback(info);
    }

    // ==================== FEEDBACK ====================

    /**
     * 解説画面。答えだけでなく、根拠になる本文の文を
     *  (1) 上の本文の中で黄色くぬり、(2) 下に大きく引用して見せる。
     * じっくり読む: 「つぎへ」をおすまで待つ。
     * 速読チャレンジ: 数秒で自動的に進む（ボタンで早送りも可）。
     */
    private showFeedback(info: FeedbackInfo) {
        this.clearUI();
        this.timerBar.clear();
        this.showShrunkPassage(info.evidence);

        const cx = this.W / 2;
        const correct = info.outcome === 'correct';

        const verdict = {
            correct: { label: '\u2713 せいかい！', color: '#2E7D32' },
            wrong: { label: '\u2717 ざんねん…', color: '#C62828' },
            timeout: { label: '\u23F0 時間切れ', color: '#E65100' }
        }[info.outcome];

        const verdictText = this.add.text(cx, 278, verdict.label, {
            fontFamily: JP_FONT, fontSize: '26px', color: verdict.color, fontStyle: 'bold'
        }).setOrigin(0.5).setAlpha(0).setScale(0.6);
        this.uiGroup.add(verdictText);
        this.tweens.add({ targets: verdictText, alpha: 1, scale: 1, duration: 250, ease: 'Back.out' });

        let y = 304;

        const promptText = this.add.text(cx, y, info.prompt, {
            fontFamily: 'Nunito', fontSize: '14px', color: '#555',
            wordWrap: { width: this.W - 60 }, align: 'center'
        }).setOrigin(0.5, 0);
        this.uiGroup.add(promptText);
        y += promptText.height + 8;

        const answerText = this.add.text(cx, y, `こたえ:  ${info.correctAnswer}`, {
            fontFamily: JP_FONT, fontSize: '17px', color: '#2E7D32', fontStyle: 'bold',
            wordWrap: { width: this.W - 60 }, align: 'center'
        }).setOrigin(0.5, 0);
        this.uiGroup.add(answerText);
        y += answerText.height + 4;

        if (info.outcome === 'wrong' && info.playerAnswer) {
            const yours = this.add.text(cx, y, `きみの答え:  ${info.playerAnswer}`, {
                fontFamily: JP_FONT, fontSize: '13px', color: '#C62828',
                wordWrap: { width: this.W - 60 }, align: 'center'
            }).setOrigin(0.5, 0);
            this.uiGroup.add(yours);
            y += yours.height + 4;
        } else if (info.outcome === 'timeout') {
            const note = this.add.text(cx, y, 'まちがいには数えないよ。答えをたしかめよう', {
                fontFamily: JP_FONT, fontSize: '12px', color: '#E65100'
            }).setOrigin(0.5, 0);
            this.uiGroup.add(note);
            y += note.height + 4;
        }

        if (info.explanation) {
            const expl = this.add.text(cx, y + 2, info.explanation, {
                fontFamily: 'Nunito', fontSize: '13px', color: '#555',
                wordWrap: { width: this.W - 60 }, align: 'center'
            }).setOrigin(0.5, 0);
            this.uiGroup.add(expl);
            y += expl.height + 6;
        }

        // 根拠の文（本文からの引用）
        const sentences = splitSentences(this.currentPassage.text);
        const evidenceText = info.evidence
            .map(i => sentences[i])
            .filter(sp => !!sp)
            .map(sp => sp.text)
            .join(' ');
        if (evidenceText) {
            y += 8;
            const boxBg = this.add.graphics();
            this.uiGroup.add(boxBg);

            const label = this.add.text(32, y + 8, '\uD83D\uDCD6 本文のここに書いてあるよ', {
                fontFamily: JP_FONT, fontSize: '12px', color: '#8A6D00', fontStyle: 'bold'
            });
            this.uiGroup.add(label);

            const quote = this.add.text(32, y + 30, evidenceText, {
                fontFamily: 'Nunito', fontSize: '15px', color: '#333',
                wordWrap: { width: this.W - 64 }, lineSpacing: 4
            });
            this.uiGroup.add(quote);

            const boxH = 30 + quote.height + 10;
            boxBg.fillStyle(0xFFF6CC, 1);
            boxBg.fillRoundedRect(20, y, this.W - 40, boxH, 12);
            boxBg.lineStyle(2, 0xF2C94C, 1);
            boxBg.strokeRoundedRect(20, y, this.W - 40, boxH, 12);
            y += boxH;
        }

        // Bonus text
        if (info.bonus > 0) {
            const bonusText = this.add.text(cx, y + 18, `+${info.bonus} time bonus!`, {
                fontFamily: 'Fredoka One', fontSize: '16px', color: '#FF9800'
            }).setOrigin(0.5);
            this.uiGroup.add(bonusText);
        }

        // Streak multiplier popup
        if (correct && this.getStreakMultiplier() > 1) {
            const multText = this.add.text(this.W / 2, 210, `${this.getStreakMultiplier()}x STREAK!`, {
                fontFamily: 'Fredoka One', fontSize: '28px', color: '#FF9800',
                stroke: '#FFF', strokeThickness: 3
            }).setOrigin(0.5).setDepth(101).setAlpha(0).setScale(0.5);

            this.tweens.add({
                targets: multText,
                alpha: 1, scale: 1.2,
                duration: 300,
                yoyo: true,
                hold: 400,
                onComplete: () => multText.destroy()
            });
        }

        // Milestone streak celebration (5, 10, 15...)
        if (correct && this.streak > 0 && this.streak % 5 === 0) {
            const celebEmoji = this.streak >= 15 ? '\uD83D\uDD25' : this.streak >= 10 ? '\u2B50' : '\uD83C\uDF1F';
            const celebText = this.add.text(this.W / 2, 170, `${celebEmoji} ${this.streak} COMBO! ${celebEmoji}`, {
                fontFamily: 'Fredoka One', fontSize: '22px', color: '#FFD700',
                stroke: '#000', strokeThickness: 2
            }).setOrigin(0.5).setDepth(102).setAlpha(0).setScale(0.3);

            this.tweens.add({
                targets: celebText,
                alpha: 1, scale: 1.3, y: 150,
                duration: 400,
                ease: 'Back.out',
                onComplete: () => {
                    this.tweens.add({
                        targets: celebText,
                        alpha: 0, y: 120,
                        duration: 500,
                        delay: 600,
                        onComplete: () => celebText.destroy()
                    });
                }
            });
        }

        // Screen effect
        if (info.outcome === 'wrong') {
            this.cameras.main.shake(200, 0.008);
        }

        // 次へ進む
        let advanced = false;
        const advance = () => {
            if (advanced) return;
            advanced = true;
            this.advancePhase();
        };
        this.createWideButton(cx, 722, 'つぎへ \u25B6', 0x2D5BCC, advance);

        if (this.timed) {
            // 速読チャレンジ: 正解はテンポよく、それ以外は根拠を読む時間を少し長めに
            const expectedPhase = this.phase;
            const expectedPassage = this.passageIndex;
            const expectedItem = this.phase === 'trueFalse' ? this.tfIndex : this.qIndex;
            this.time.delayedCall(correct ? 2000 : 4000, () => {
                const sameItem = this.phase === expectedPhase
                    && this.passageIndex === expectedPassage
                    && (this.phase === 'trueFalse' ? this.tfIndex : this.qIndex) === expectedItem;
                if (sameItem) advance();
            });
        }
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
        SaveManager.rememberPassages([this.currentPassage.id]);

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

        const timeouts = this.currentPassageResult.tfTimeouts + this.currentPassageResult.qTimeouts;
        const notes: string[] = [];
        if (this.currentPassageResult.timeBonus > 0) notes.push(`+${this.currentPassageResult.timeBonus} time bonus`);
        if (timeouts > 0) notes.push(`\u23F0 時間切れ ${timeouts}問`);
        if (notes.length > 0) {
            const bonusLabel = this.add.text(this.W / 2, this.H / 2 + 35, notes.join('   '), {
                fontFamily: JP_FONT, fontSize: '14px', color: '#FF9800'
            }).setOrigin(0.5);
            this.uiGroup.add(bonusLabel);
        }

        this.time.delayedCall(2000, () => {
            this.passageIndex++;
            if (this.passageIndex < this.totalPassages && this.passageIndex < this.currentPassages.length) {
                this.startPassage();
            } else {
                this.goToResults();
            }
        });
    }

    // ==================== SHRUNK PASSAGE ====================

    private showShrunkPassage(evidence?: number[]) {
        const shrunkBg = this.add.graphics();
        shrunkBg.fillStyle(0xFFFFFF, evidence ? 1 : 0.7);
        shrunkBg.fillRoundedRect(10, 65, this.W - 20, 185, 12);
        shrunkBg.lineStyle(1, 0xDDE3ED, 0.5);
        shrunkBg.strokeRoundedRect(10, 65, this.W - 20, 185, 12);
        this.uiGroup.add(shrunkBg);

        const shrunkTitle = this.add.text(20, 72, this.currentPassage.title, {
            fontFamily: 'Fredoka One', fontSize: '13px', color: '#2D5BCC'
        });
        this.uiGroup.add(shrunkTitle);

        // 根拠の文をぬるマーカー（本文テキストより先に作って下に敷く）
        const marker = this.add.graphics();
        this.uiGroup.add(marker);

        const shrunkText = this.add.text(20, 90, this.currentPassage.text, {
            fontFamily: 'Nunito', fontSize: '12px', color: evidence ? '#333' : '#555',
            wordWrap: { width: this.W - 50 },
            lineSpacing: 3
        });
        this.uiGroup.add(shrunkText);

        if (evidence && evidence.length > 0) {
            this.drawEvidenceMarker(marker, shrunkText, this.currentPassage.text, evidence);
        }
    }

    /**
     * 折り返し後の各行について、根拠の文と重なる部分を黄色くぬる。
     * （Phaser の Text は部分的な背景色を持てないため、文字幅を測って矩形を敷く）
     */
    private drawEvidenceMarker(g: Phaser.GameObjects.Graphics, textObj: Phaser.GameObjects.Text, full: string, evidence: number[]) {
        const sentences = splitSentences(full);
        const ranges = evidence.map(i => sentences[i]).filter(sp => !!sp);
        if (ranges.length === 0) return;

        const lines = textObj.getWrappedText(full);
        const style = textObj.style as any;
        const metrics = style.getTextMetrics() as { fontSize: number };
        const ctx = textObj.context;
        ctx.save();
        ctx.font = style._font;
        const lineH = metrics.fontSize + textObj.lineSpacing;

        g.fillStyle(0xFFE066, 0.9);
        let cursor = 0;
        lines.forEach((raw, i) => {
            const line = raw.replace(/\s+$/, '');
            const core = line.replace(/^\s+/, '');
            if (!core) return;
            const lead = line.length - core.length;
            const ls = full.indexOf(core, cursor);
            if (ls < 0) return;
            const le = ls + core.length;
            cursor = le;
            ranges.forEach(r => {
                const a = Math.max(r.start, ls);
                const b = Math.min(r.end, le);
                if (a >= b) return;
                const x0 = ctx.measureText(line.slice(0, lead + a - ls)).width;
                const x1 = ctx.measureText(line.slice(0, lead + b - ls)).width;
                g.fillRoundedRect(textObj.x + x0 - 2, textObj.y + i * lineH - 1, x1 - x0 + 4, metrics.fontSize + 2, 3);
            });
        });
        ctx.restore();
    }

    // ==================== UTILITIES ====================

    private clearUI() {
        this.uiGroup.clear(true, true);
    }

    private goToResults() {
        // Aggregate stats
        let totalTFCorrect = 0, totalTFTotal = 0;
        let totalQCorrect = 0, totalQTotal = 0;
        let tfTimeouts = 0, qTimeouts = 0;

        this.passageResults.forEach(r => {
            totalTFCorrect += r.tfCorrect;
            totalTFTotal += r.tfTotal;
            totalQCorrect += r.qCorrect;
            totalQTotal += r.qTotal;
            tfTimeouts += r.tfTimeouts;
            qTimeouts += r.qTimeouts;
        });

        this.cameras.main.fadeOut(400, 255, 255, 255);
        this.time.delayedCall(400, () => {
            this.scene.start('ResultScene', {
                score: this.score,
                level: this.level,
                mode: this.mode,
                count: this.requestedCount,
                tfTimeouts,
                qTimeouts,
                tfCorrect: totalTFCorrect,
                tfTotal: totalTFTotal,
                qCorrect: totalQCorrect,
                qTotal: totalQTotal,
                bestStreak: this.bestStreak,
                timeBonus: this.totalTimeBonus,
                passagesCompleted: this.passageIndex,
                wrongAnswers: this.sessionWrongAnswers
            });
        });
    }
}
