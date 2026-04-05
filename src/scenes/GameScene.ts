import * as Phaser from 'phaser';
import { Question } from '../data/questions';
import { MemoryEngine } from '../systems/MemoryEngine';
import { QuestionBankManager } from '../systems/QuestionBankManager';
import { soundManager } from '../systems/SoundManager';

export class GameScene extends Phaser.Scene {
    private score: number = 0;
    private combo: number = 0;
    private bestCombo: number = 0;
    private hearts: number = 3;
    private baseSpeed: number = 300;
    private questionsAnswered: number = 0;
    private questionsCorrect: number = 0;
    private grammarMistakes: Map<string, number> = new Map();

    private player!: Phaser.GameObjects.Rectangle;
    private playerGlow!: Phaser.GameObjects.Rectangle;
    private currentLaneIndex: number = 1;
    private lanes: number[] = [65, 195, 325];

    private questionText!: Phaser.GameObjects.Text;
    private questionTagText!: Phaser.GameObjects.Text;
    private scoreText!: Phaser.GameObjects.Text;
    private comboText!: Phaser.GameObjects.Text;
    private comboMultiplierText!: Phaser.GameObjects.Text;
    private streakText!: Phaser.GameObjects.Text;

    private heartIcons: Phaser.GameObjects.Text[] = [];

    private targetPresentationGroup!: Phaser.GameObjects.Group;

    private isTargetPresentationActive: boolean = true;
    private isGameOver: boolean = false;
    private isTransitioning: boolean = false;

    private cardGroup!: Phaser.Physics.Arcade.Group;
    private currentQuestion!: Question;
    private cardsSpawned: boolean = false;

    private memoryEngine!: MemoryEngine;
    private qBankManager!: QuestionBankManager;
    private sessionId!: string;

    // Word Order Mode Logic
    private isWordOrderMode: boolean = false;
    private wordOrderCurrentIndex: number = 0;
    private wordOrderTotalPieces: number = 0;
    private wordOrderSequence: string[] = [];

    // Difficulty Logic
    private difficulty: 'Easy' | 'Normal' | 'Hard' = 'Normal';
    private difficultyMultiplier: number = 1;

    // Particle emitters
    private correctEmitter!: Phaser.GameObjects.Particles.ParticleEmitter;

    constructor() {
        super({ key: 'GameScene' });
    }

    preload() {
    }

    create() {
        // Reset state
        this.score = 0;
        this.combo = 0;
        this.bestCombo = 0;
        this.hearts = 3;
        this.baseSpeed = 300;
        this.isTargetPresentationActive = true;
        this.isGameOver = false;
        this.isTransitioning = false;
        this.cardsSpawned = false;
        this.questionsAnswered = 0;
        this.questionsCorrect = 0;
        this.grammarMistakes = new Map();
        this.heartIcons = [];

        // Setup Data Systems
        this.memoryEngine = new MemoryEngine();
        this.qBankManager = new QuestionBankManager(this.memoryEngine);
        this.sessionId = Date.now().toString();
        this.qBankManager.initializeSessionQueue("present_simple_3rd", 20);

        // Difficulty Config
        const progress = this.memoryEngine.getProgress();
        if (progress.totalScore < 1000) this.difficulty = 'Easy';
        else if (progress.totalScore < 5000) this.difficulty = 'Normal';
        else this.difficulty = 'Hard';

        switch(this.difficulty) {
            case 'Easy': this.difficultyMultiplier = 0.8; break;
            case 'Normal': this.difficultyMultiplier = 1.0; break;
            case 'Hard': this.difficultyMultiplier = 1.3; break;
        }

        this.baseSpeed = 300 * this.difficultyMultiplier;

        // Setup Particles
        this.correctEmitter = this.add.particles(0, 0, 'star', {
            speed: { min: 100, max: 300 },
            angle: { min: 250, max: 290 },
            scale: { start: 0.5, end: 0 },
            alpha: { start: 1, end: 0 },
            gravityY: 400,
            lifespan: 1000,
            emitting: false
        }).setDepth(10);

        // Background gradient effect
        const bgGrad = this.add.graphics();
        bgGrad.fillGradientStyle(0x1a1a2e, 0x1a1a2e, 0x16213e, 0x16213e, 1);
        bgGrad.fillRect(0, 0, 390, 844);

        // Draw lanes with subtle gradient lines
        const graphics = this.add.graphics();
        graphics.lineStyle(1, 0x2a2a4a, 0.5);
        graphics.beginPath();
        graphics.moveTo(130, 50); graphics.lineTo(130, 844);
        graphics.moveTo(260, 50); graphics.lineTo(260, 844);
        graphics.strokePath();

        // Player glow effect
        this.playerGlow = this.add.rectangle(this.lanes[this.currentLaneIndex], 750, 70, 70, 0x4CAF50, 0.3);
        this.playerGlow.setDepth(4);

        // Player
        this.player = this.add.rectangle(this.lanes[this.currentLaneIndex], 750, 56, 56, 0xffffff);
        this.player.setStrokeStyle(3, 0x4CAF50);
        this.player.setDepth(5);
        this.physics.add.existing(this.player);

        // Pulsing glow animation
        this.tweens.add({
            targets: this.playerGlow,
            alpha: { from: 0.2, to: 0.5 },
            scale: { from: 1, to: 1.2 },
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // HUD Background
        const hudBg = this.add.graphics();
        hudBg.fillStyle(0x000000, 0.8);
        hudBg.fillRoundedRect(5, 5, 380, 45, 10);
        hudBg.setDepth(20);

        this.scoreText = this.add.text(15, 15, 'SCORE: 0', {
            fontFamily: 'Fredoka One', fontSize: '18px', color: '#FFD700'
        }).setDepth(21);

        this.comboText = this.add.text(155, 15, 'COMBO: 0', {
            fontFamily: 'Fredoka One', fontSize: '18px', color: '#4CAF50'
        }).setDepth(21);

        // Individual heart icons
        for (let i = 0; i < 3; i++) {
            const heart = this.add.text(295 + i * 28, 12, '\u2764\ufe0f', {
                fontFamily: 'Fredoka One', fontSize: '22px'
            }).setDepth(21);
            this.heartIcons.push(heart);
        }

        // Combo multiplier display (hidden initially)
        this.comboMultiplierText = this.add.text(195, 400, '', {
            fontFamily: 'Fredoka One', fontSize: '64px', color: '#FFD700',
            stroke: '#000', strokeThickness: 6
        }).setOrigin(0.5).setAlpha(0).setDepth(30);

        // Streak text
        this.streakText = this.add.text(195, 55, '', {
            fontFamily: 'Fredoka One', fontSize: '14px', color: '#FFD700',
            align: 'center'
        }).setOrigin(0.5).setAlpha(0).setDepth(21);

        // Question Area with improved styling
        const qAreaBg = this.add.graphics();
        qAreaBg.fillStyle(0x2a2a4a, 0.9);
        qAreaBg.fillRoundedRect(10, 70, 370, 180, 16);
        qAreaBg.lineStyle(2, 0x4a4a6a, 0.5);
        qAreaBg.strokeRoundedRect(10, 70, 370, 180, 16);

        this.questionTagText = this.add.text(195, 85, '', {
            fontFamily: 'Nunito', fontSize: '12px', color: '#8888bb',
            align: 'center'
        }).setOrigin(0.5);

        this.questionText = this.add.text(195, 165, '', {
            fontFamily: 'Nunito', fontSize: '22px', color: '#fff',
            align: 'center', wordWrap: { width: 340 },
            lineSpacing: 6
        }).setOrigin(0.5);

        // Setup Card Group
        this.cardGroup = this.physics.add.group();

        // Input Handling
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (this.isTargetPresentationActive || this.isGameOver || this.isTransitioning) return;
            if (pointer.x < 130 && this.currentLaneIndex > 0) this.currentLaneIndex--;
            else if (pointer.x > 260 && this.currentLaneIndex < 2) this.currentLaneIndex++;
            else if (pointer.x >= 130 && pointer.x <= 260) this.currentLaneIndex = 1;

            this.tweens.add({
                targets: [this.player, this.playerGlow],
                x: this.lanes[this.currentLaneIndex],
                duration: 100
            });
        });

        // Overlap Check
        this.physics.add.overlap(this.player, this.cardGroup, this.onCardCollected, undefined, this);

        this.startTargetPresentation();
    }

    startTargetPresentation() {
        this.targetPresentationGroup = this.add.group();
        const overlay = this.add.rectangle(195, 422, 390, 844, 0x000000, 0.92);

        const title = this.add.text(195, 280, "TODAY'S TARGET", {
            fontFamily: 'Fredoka One', fontSize: '32px', color: '#FFD700',
            stroke: '#000', strokeThickness: 4
        }).setOrigin(0.5).setAlpha(0);

        const targetgrammar = this.add.text(195, 340, "Present Simple: He/She", {
            fontFamily: 'Nunito', fontSize: '24px', color: '#fff'
        }).setOrigin(0.5).setAlpha(0);

        const diffLabel = this.add.text(195, 400, `Difficulty: ${this.difficulty}`, {
            fontFamily: 'Nunito', fontSize: '18px',
            color: this.difficulty === 'Easy' ? '#4CAF50' : this.difficulty === 'Normal' ? '#FFD700' : '#FF5252'
        }).setOrigin(0.5).setAlpha(0);

        this.targetPresentationGroup.addMultiple([overlay, title, targetgrammar, diffLabel]);

        // Animate in
        this.tweens.add({ targets: title, alpha: 1, y: 300, duration: 500, ease: 'Back.out' });
        this.tweens.add({ targets: targetgrammar, alpha: 1, y: 360, duration: 500, delay: 300, ease: 'Back.out' });
        this.tweens.add({ targets: diffLabel, alpha: 1, y: 420, duration: 500, delay: 600, ease: 'Back.out' });

        soundManager.playSound('start');

        this.time.delayedCall(3000, () => {
            this.tweens.add({
                targets: [overlay, title, targetgrammar, diffLabel],
                alpha: 0,
                duration: 400,
                onComplete: () => {
                    this.targetPresentationGroup.clear(true, true);
                    this.isTargetPresentationActive = false;
                    this.loadNextQuestion();
                }
            });
        });
    }

    loadNextQuestion() {
        this.isTransitioning = true;
        this.currentQuestion = this.qBankManager.getNextQuestion();

        // Format grammar tag for display
        const tagDisplay = this.currentQuestion.grammar_tag.replace(/_/g, ' ').toUpperCase();
        this.questionTagText.setText(tagDisplay);

        if (this.currentQuestion.grammar_tag?.includes("word_order") || this.currentQuestion.correct_order) {
            this.isWordOrderMode = true;
            this.wordOrderSequence = this.currentQuestion.correct_order || [];
            this.wordOrderTotalPieces = this.wordOrderSequence.length;
            this.wordOrderCurrentIndex = 0;
            this.questionText.setText("[Word Order Mode]\nGather in correct order!");
        } else {
            this.isWordOrderMode = false;
            const answer = this.currentQuestion.correct_answer || "___";
            let displaySentence = this.currentQuestion.sentence.replace(answer, "___");
            this.questionText.setText(displaySentence);
        }

        // Transition animation
        this.questionText.setAlpha(0);
        this.questionTagText.setAlpha(0);
        this.tweens.add({
            targets: [this.questionText, this.questionTagText],
            alpha: 1,
            duration: 400,
            ease: 'Power2',
            onComplete: () => {
                this.isTransitioning = false;
                this.cardsSpawned = false;
            }
        });
    }

    spawnCards() {
        this.cardsSpawned = true;

        if (this.isWordOrderMode) {
             const targetWord = this.wordOrderSequence[this.wordOrderCurrentIndex];
             let pool = [...this.wordOrderSequence];
             pool.splice(pool.indexOf(targetWord), 1);
             Phaser.Utils.Array.Shuffle(pool);

             let distractors = [pool[0] || "dummy1", pool[1] || "dummy2"];
             let answers = [targetWord, ...distractors];
             Phaser.Utils.Array.Shuffle(answers);
             this.layoutCards(answers, targetWord);

        } else {
            const answer = this.currentQuestion.correct_answer || "";
            const dists = this.currentQuestion.distractors || [];
            let answers = [answer, ...dists];
            Phaser.Utils.Array.Shuffle(answers);
            this.layoutCards(answers, answer);
        }
    }

    layoutCards(answers: string[], correctWord: string) {
        const cardColors = [0x5C6BC0, 0x42A5F5, 0x26C6DA];
        const correctColor = 0x66BB6A;

        for (let i = 0; i < Math.min(answers.length, 3); i++) {
            const isCorrect = answers[i] === correctWord;
            const color = isCorrect ? correctColor : cardColors[i % cardColors.length];

            // Card container with rounded appearance
            const cardBg = this.add.rectangle(
                this.lanes[i], 280, 110, 70, color
            ).setInteractive();
            cardBg.setStrokeStyle(2, 0xffffff, 0.3);
            cardBg.setDepth(8);

            // Card shadow
            const shadow = this.add.rectangle(
                this.lanes[i] + 3, 283, 110, 70, 0x000000, 0.3
            ).setDepth(7);

            const cardText = this.add.text(this.lanes[i], 280, answers[i], {
                fontFamily: 'Nunito', fontSize: '17px', color: '#fff',
                fontStyle: 'bold', align: 'center', wordWrap: { width: 100 }
            }).setOrigin(0.5).setDepth(9);

            this.physics.add.existing(cardBg);
            (cardBg.body as Phaser.Physics.Arcade.Body).setVelocityY(this.baseSpeed);

            cardBg.setData('isCorrect', isCorrect);
            cardBg.setData('textObj', cardText);
            cardBg.setData('shadowObj', shadow);

            // Entrance animation
            cardBg.setScale(0);
            cardText.setScale(0);
            shadow.setScale(0);
            this.tweens.add({
                targets: [cardBg, cardText, shadow],
                scale: 1,
                duration: 350,
                delay: i * 80,
                ease: 'Back.out'
            });

            this.cardGroup.add(cardBg);
        }
    }

    override update() {
        if (this.isTargetPresentationActive || this.isGameOver || this.isTransitioning) return;

        this.cardGroup.getChildren().forEach((child) => {
            const card = child as Phaser.GameObjects.Rectangle;
            const textObj = card.getData('textObj') as Phaser.GameObjects.Text;
            const shadowObj = card.getData('shadowObj') as Phaser.GameObjects.Rectangle;
            if (textObj) textObj.y = card.y;
            if (shadowObj) {
                shadowObj.y = card.y + 3;
                shadowObj.x = card.x + 3;
            }

            if (card.y > 850) {
                const isCorrect = card.getData('isCorrect');
                if (textObj) textObj.destroy();
                if (shadowObj) shadowObj.destroy();
                card.destroy();

                if (isCorrect && !this.isGameOver) {
                   this.handleWrongAnswer();
                }
            }
        });

        if (!this.cardsSpawned && this.cardGroup.countActive() === 0) {
            this.spawnCards();
        }
    }

    onCardCollected(_player: any, card: any) {
        if (this.isGameOver || this.isTransitioning) return;

        const isCorrect = card.getData('isCorrect');

        // Destroy all existing cards in this wave
        this.cardGroup.getChildren().forEach(c => {
            const t = c.getData('textObj');
            const s = c.getData('shadowObj');
            if (t) t.destroy();
            if (s) s.destroy();
            c.destroy();
        });

        if (isCorrect) {
            this.handleCorrectAnswer();
        } else {
            this.handleWrongAnswer();
        }
    }

    handleCorrectAnswer() {
        this.questionsAnswered++;
        this.questionsCorrect++;

        if (this.isWordOrderMode) {
            this.wordOrderCurrentIndex++;
            this.score += 50;
            this.updateHUD();
            this.cameras.main.flash(200, 0, 255, 0);
            soundManager.playSound('correct');

            this.tweens.add({
                targets: [this.player, this.playerGlow],
                y: this.player.y - 30,
                yoyo: true,
                duration: 150,
                ease: 'Sine.easeInOut'
            });

            if (this.wordOrderCurrentIndex >= this.wordOrderTotalPieces) {
                this.correctEmitter.explode(20, this.player.x, this.player.y);
                this.memoryEngine.processAnswer(this.currentQuestion.id, true, this.sessionId);
                this.combo++;
                if (this.combo > this.bestCombo) this.bestCombo = this.combo;
                this.score += 50 * this.getComboMultiplier();
                this.baseSpeed = Math.min(this.baseSpeed * 1.03, 600);
                this.updateHUD();
                this.showComboEffect();
                this.loadNextQuestion();
            } else {
                this.cardsSpawned = false;
            }
        } else {
            this.memoryEngine.processAnswer(this.currentQuestion.id, true, this.sessionId);

            this.combo++;
            if (this.combo > this.bestCombo) this.bestCombo = this.combo;
            this.score += 100 * this.getComboMultiplier();
            this.updateHUD();

            this.correctEmitter.explode(15, this.player.x, this.player.y);
            this.tweens.add({
                targets: [this.player, this.playerGlow],
                y: this.player.y - 30,
                yoyo: true,
                duration: 150,
                ease: 'Sine.easeInOut'
            });

            // Smoother difficulty progression
            this.baseSpeed = Math.min(this.baseSpeed * 1.03, 600);
            this.cameras.main.flash(300, 0, 200, 0, true);
            soundManager.playSound('correct');

            this.showComboEffect();
            this.loadNextQuestion();
        }
    }

    getComboMultiplier(): number {
        if (this.combo >= 10) return 4;
        if (this.combo >= 7) return 3;
        if (this.combo >= 4) return 2;
        return 1;
    }

    showComboEffect() {
        const multiplier = this.getComboMultiplier();

        if (multiplier > 1) {
            this.comboMultiplierText.setText(`${multiplier}x!`);
            this.comboMultiplierText.setAlpha(1);
            this.comboMultiplierText.setScale(0.5);

            // Color based on multiplier
            const colors: Record<number, string> = { 2: '#4CAF50', 3: '#FF9800', 4: '#FF1744' };
            this.comboMultiplierText.setColor(colors[multiplier] || '#FFD700');

            this.tweens.add({
                targets: this.comboMultiplierText,
                scale: 1.5,
                alpha: 0,
                y: 350,
                duration: 800,
                ease: 'Power2',
                onComplete: () => {
                    this.comboMultiplierText.y = 400;
                }
            });
        }

        // Streak display
        if (this.combo >= 3) {
            this.streakText.setText(`${this.combo} streak!`);
            this.streakText.setAlpha(1);
            this.tweens.add({
                targets: this.streakText,
                alpha: 0,
                duration: 1500,
                delay: 500
            });
        }

        // Player color shift on high combo
        if (this.combo >= 7) {
            this.player.setFillStyle(0xFFD700);
            this.player.setStrokeStyle(3, 0xFF9800);
            this.playerGlow.setFillStyle(0xFFD700, 0.3);
        } else if (this.combo >= 4) {
            this.player.setFillStyle(0x4CAF50);
            this.player.setStrokeStyle(3, 0x66BB6A);
            this.playerGlow.setFillStyle(0x4CAF50, 0.3);
        } else {
            this.player.setFillStyle(0xffffff);
            this.player.setStrokeStyle(3, 0x4CAF50);
            this.playerGlow.setFillStyle(0x4CAF50, 0.3);
        }
    }

    handleWrongAnswer() {
        this.questionsAnswered++;
        this.memoryEngine.processAnswer(this.currentQuestion.id, false, this.sessionId);

        // Track grammar mistakes
        const tag = this.currentQuestion.grammar_tag;
        this.grammarMistakes.set(tag, (this.grammarMistakes.get(tag) || 0) + 1);

        this.combo = 0;
        this.hearts--;
        this.updateHUD();

        // Reset player color
        this.player.setFillStyle(0xffffff);
        this.player.setStrokeStyle(3, 0x4CAF50);
        this.playerGlow.setFillStyle(0x4CAF50, 0.3);

        // Flash the lost heart red before hiding it
        if (this.hearts >= 0 && this.hearts < this.heartIcons.length) {
            const lostHeart = this.heartIcons[this.hearts];
            this.tweens.add({
                targets: lostHeart,
                alpha: 0,
                scaleX: 2,
                scaleY: 2,
                duration: 400,
                ease: 'Power2',
                onComplete: () => {
                    lostHeart.setVisible(false);
                    lostHeart.setScale(1);
                }
            });
        }

        // Screen shake effect
        this.cameras.main.shake(300, 0.01);
        this.cameras.main.flash(400, 255, 0, 0);

        if (this.hearts <= 0) {
            this.triggerGameOver();
        } else {
            this.loadNextQuestion();
        }
    }

    updateHUD() {
        this.scoreText.setText(`SCORE: ${this.score}`);

        const multiplier = this.getComboMultiplier();
        const comboColor = multiplier >= 4 ? '#FF1744' : multiplier >= 3 ? '#FF9800' : multiplier >= 2 ? '#4CAF50' : '#4CAF50';
        this.comboText.setColor(comboColor);
        this.comboText.setText(`COMBO: ${this.combo}`);
    }

    triggerGameOver() {
        this.isGameOver = true;

        const overlay = this.add.rectangle(195, 422, 390, 844, 0x000000, 0);
        this.tweens.add({ targets: overlay, alpha: 0.85, duration: 600 });

        const gameOverText = this.add.text(195, 300, 'GAME OVER', {
            fontFamily: 'Fredoka One', fontSize: '48px', color: '#FF5252',
            stroke: '#000', strokeThickness: 6
        }).setOrigin(0.5).setAlpha(0).setScale(0.5);

        this.tweens.add({
            targets: gameOverText,
            alpha: 1,
            scale: 1,
            duration: 500,
            delay: 300,
            ease: 'Back.out'
        });

        const scoreDisplay = this.add.text(195, 380, `Final Score: ${this.score}`, {
            fontFamily: 'Fredoka One', fontSize: '28px', color: '#FFD700'
        }).setOrigin(0.5).setAlpha(0);

        this.tweens.add({
            targets: scoreDisplay,
            alpha: 1,
            duration: 500,
            delay: 600
        });

        this.time.delayedCall(2000, () => {
            const accuracy = this.questionsAnswered > 0
                ? Math.round((this.questionsCorrect / this.questionsAnswered) * 100) : 0;

            // Convert grammar mistakes map to a plain object for passing to ResultScene
            const mistakesObj: Record<string, number> = {};
            this.grammarMistakes.forEach((count, tag) => {
                mistakesObj[tag] = count;
            });

            this.scene.start('ResultScene', {
                score: this.score,
                sessionId: this.sessionId,
                bestCombo: this.bestCombo,
                accuracy: accuracy,
                questionsAnswered: this.questionsAnswered,
                questionsCorrect: this.questionsCorrect,
                grammarMistakes: mistakesObj
            });
        });
    }
}
