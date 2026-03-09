import * as Phaser from 'phaser';
import { Question } from '../data/questions';
import { MemoryEngine } from '../systems/MemoryEngine';
import { QuestionBankManager } from '../systems/QuestionBankManager';
import { soundManager } from '../systems/SoundManager';

export class GameScene extends Phaser.Scene {
    private score: number = 0;
    private combo: number = 0;
    private hearts: number = 3;
    private baseSpeed: number = 300;
    
    private player!: Phaser.GameObjects.Rectangle;
    private currentLaneIndex: number = 1; // 0: Left, 1: Center, 2: Right
    private lanes: number[] = [65, 195, 325]; // X coordinates for 3 lanes
    
    private questionText!: Phaser.GameObjects.Text;
    private scoreText!: Phaser.GameObjects.Text;
    private comboText!: Phaser.GameObjects.Text;
    private heartsText!: Phaser.GameObjects.Text;
    
    private targetPresentationGroup!: Phaser.GameObjects.Group;
    
    private isTargetPresentationActive: boolean = true;
    private isGameOver: boolean = false;
    
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
        // Will load assets here later (images, sounds)
    }

    create() {
        // Reset state
        this.score = 0;
        this.combo = 0;
        this.hearts = 3;
        this.baseSpeed = 300;
        this.isTargetPresentationActive = true;
        this.isGameOver = false;
        this.cardsSpawned = false;
        
        // Setup Data Systems
        this.memoryEngine = new MemoryEngine();
        this.qBankManager = new QuestionBankManager(this.memoryEngine);
        this.sessionId = Date.now().toString();
        // Initialize the session with a daily target grammar (hardcoded for phase 2 MVP)
        this.qBankManager.initializeSessionQueue("present_simple_3rd", 20);
        
        // Difficulty Config
        // For MVP, we can randomly or statically assign it, or scale it over time.
        // Let's scale it slightly based on progress score (simple dynamic difficulty)
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
        }).setDepth(10); // Ensure they appear above cards

        // Draw lanes
        const graphics = this.add.graphics();
        graphics.lineStyle(2, 0x16213e);
        graphics.beginPath();
        graphics.moveTo(130, 0); graphics.lineTo(130, 844);
        graphics.moveTo(260, 0); graphics.lineTo(260, 844);
        graphics.strokePath();

        // Player (Ground roughly at y=750)
        this.player = this.add.rectangle(this.lanes[this.currentLaneIndex], 750, 60, 60, 0xffffff);
        this.physics.add.existing(this.player);
        
        // HUD
        this.add.rectangle(195, 25, 390, 50, 0x000000, 0.7);
        this.scoreText = this.add.text(10, 10, 'SCORE: 0', { fontFamily: 'Fredoka One', fontSize: '20px', color: '#fff' });
        this.comboText = this.add.text(150, 10, 'COMBO: 0', { fontFamily: 'Fredoka One', fontSize: '20px', color: '#fff' });
        this.heartsText = this.add.text(280, 10, '❤️❤️❤️', { fontFamily: 'Fredoka One', fontSize: '20px', color: '#fff' });
        
        // Question Area (Top 35% ~ y: 50 to 250)
        this.add.rectangle(195, 150, 390, 200, 0x2a2a4a);
        this.questionText = this.add.text(195, 220, '', { fontFamily: 'Nunito', fontSize: '24px', color: '#fff', align: 'center', wordWrap: { width: 350 } }).setOrigin(0.5);
        
        // Setup Card Group
        this.cardGroup = this.physics.add.group();
        
        // Input Handling (Swipe / Tap)
        this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
            if (this.isTargetPresentationActive || this.isGameOver) return;
            if (pointer.x < 130 && this.currentLaneIndex > 0) this.currentLaneIndex--;
            else if (pointer.x > 260 && this.currentLaneIndex < 2) this.currentLaneIndex++;
            else if (pointer.x >= 130 && pointer.x <= 260) this.currentLaneIndex = 1;
            
            // Move player
            this.tweens.add({
                targets: this.player,
                x: this.lanes[this.currentLaneIndex],
                duration: 100
            });
        });
        
        // Overlap Check
        this.physics.add.overlap(this.player, this.cardGroup, this.onCardCollected, undefined, this);

        // Start TODAY'S TARGET sequence
        this.startTargetPresentation();
    }

    startTargetPresentation() {
        this.targetPresentationGroup = this.add.group();
        const overlay = this.add.rectangle(195, 422, 390, 844, 0x000000, 0.9);
        const title = this.add.text(195, 300, "TODAY'S TARGET", { fontFamily: 'Fredoka One', fontSize: '32px', color: '#FFD700' }).setOrigin(0.5);
        const targetgrammar = this.add.text(195, 380, "Present Simple: He/She", { fontFamily: 'Nunito', fontSize: '24px', color: '#fff' }).setOrigin(0.5);
        
        this.targetPresentationGroup.addMultiple([overlay, title, targetgrammar]);
        
        soundManager.playSound('start');
        
        this.time.delayedCall(3000, () => {
            this.targetPresentationGroup.clear(true, true);
            this.isTargetPresentationActive = false;
            this.loadNextQuestion();
        });
    }

    loadNextQuestion() {
        this.currentQuestion = this.qBankManager.getNextQuestion();
        
        // Check if it's a Word Order question (Mode 2)
        if (this.currentQuestion.grammar_tag?.includes("word_order") || this.currentQuestion.correct_order) {
            this.isWordOrderMode = true;
            this.wordOrderSequence = this.currentQuestion.correct_order || [];
            this.wordOrderTotalPieces = this.wordOrderSequence.length;
            this.wordOrderCurrentIndex = 0;
            
            // Display empty slots or full sentence as a hint
            // Real implementation would just display words collected so far, for MVP we show target format
            this.questionText.setText("[Word Order Mode]\nGather in correct order!");
            
        } else {
            this.isWordOrderMode = false;
            // Replace answer with fill-in-the-blank
            const answer = this.currentQuestion.correct_answer || "___";
            let displaySentence = this.currentQuestion.sentence.replace(answer, "___");
            this.questionText.setText(displaySentence);
        }
        
        this.cardsSpawned = false;
    }

    spawnCards() {
        this.cardsSpawned = true;
        
        if (this.isWordOrderMode) {
             const targetWord = this.wordOrderSequence[this.wordOrderCurrentIndex];
             // Create two distractors from OTHER words in the sentence 
             // (in a real game, logic needs to guarantee we don't accidentally pick the right word)
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
        for (let i = 0; i < 3; i++) {
            const isCorrect = answers[i] === correctWord;
            const cardBg = this.add.rectangle(this.lanes[i], 300, 100, 80, isCorrect ? 0x4CAF50 : 0x2196F3).setInteractive();
            const cardText = this.add.text(this.lanes[i], 300, answers[i], { fontFamily: 'Nunito', fontSize: '18px', color: '#fff', fontStyle: 'bold', align: 'center', wordWrap: {width: 90} }).setOrigin(0.5);
            
            this.physics.add.existing(cardBg);
            (cardBg.body as Phaser.Physics.Arcade.Body).setVelocityY(this.baseSpeed);
            
            cardBg.setData('isCorrect', isCorrect);
            cardBg.setData('textObj', cardText);
            
            // Entrance animation for cards
            cardBg.setScale(0);
            cardText.setScale(0);
            this.tweens.add({
                targets: [cardBg, cardText],
                scale: 1,
                duration: 300,
                ease: 'Back.out'
            });
            
            this.cardGroup.add(cardBg);
        }
    }

    override update() {
        if (this.isTargetPresentationActive || this.isGameOver) return;
        
        // Ensure text stays with moving cards
        this.cardGroup.getChildren().forEach((child) => {
            const card = child as Phaser.GameObjects.Rectangle;
            const textObj = card.getData('textObj') as Phaser.GameObjects.Text;
            textObj.y = card.y;
            
            // Check if card missed entirely
            if (card.y > 850) {
                const isCorrect = card.getData('isCorrect');
                textObj.destroy();
                card.destroy();
                
                // If the destroyed card was the correct answer, they missed it
                if (isCorrect && !this.isGameOver) {
                   this.handleWrongAnswer();
                }
            }
        });

        // Spawn logic
        if (!this.cardsSpawned && this.cardGroup.countActive() === 0) {
            this.spawnCards();
        }
    }

    onCardCollected(_player: any, card: any) {
        if (this.isGameOver) return;
        
        const isCorrect = card.getData('isCorrect');
        
        // Destroy all existing cards in this wave
        this.cardGroup.getChildren().forEach(c => {
            const t = c.getData('textObj');
            if(t) t.destroy();
            c.destroy();
        });
        
        if (isCorrect) {
            this.handleCorrectAnswer();
        } else {
            this.handleWrongAnswer();
        }
    }

    handleCorrectAnswer() {
        if (this.isWordOrderMode) {
            this.wordOrderCurrentIndex++;
            this.score += 50; // Partial score for word order piece
            this.updateHUD();
            this.cameras.main.flash(200, 0, 255, 0);
            soundManager.playSound('correct');
            
            // Give a jump animation to the player on correct
            this.tweens.add({
                targets: this.player,
                y: this.player.y - 30,
                yoyo: true,
                duration: 150,
                ease: 'Sine.easeInOut'
            });

            // Check if sequence is finished
            if (this.wordOrderCurrentIndex >= this.wordOrderTotalPieces) {
                this.correctEmitter.explode(20, this.player.x, this.player.y);
                this.memoryEngine.processAnswer(this.currentQuestion.id, true, this.sessionId);
                this.combo++;
                this.score += 50; // Bonus for completion
                this.baseSpeed *= (1.05 * this.difficultyMultiplier); // Scaled speedup
                this.updateHUD();
                this.loadNextQuestion();
            } else {
                // Spawn next wave for the next word
                this.cardsSpawned = false;
            }
        } else {
            this.memoryEngine.processAnswer(this.currentQuestion.id, true, this.sessionId);
            
            this.score += 100;
            this.combo++;
            this.updateHUD();
            
            // Visual feedback
            this.correctEmitter.explode(15, this.player.x, this.player.y);
            this.tweens.add({
                targets: this.player,
                y: this.player.y - 30,
                yoyo: true,
                duration: 150,
                ease: 'Sine.easeInOut'
            });
            
            this.baseSpeed *= (1.05 * this.difficultyMultiplier); // Scaled speedup
            this.cameras.main.flash(500, 0, 255, 0); // Green flash
            soundManager.playSound('correct');
            
            this.loadNextQuestion();
        }
    }

    handleWrongAnswer() {
        this.memoryEngine.processAnswer(this.currentQuestion.id, false, this.sessionId);
        
        this.combo = 0;
        this.hearts--;
        this.updateHUD();
        
        this.cameras.main.flash(500, 255, 0, 0); // Red flash
        
        if (this.hearts <= 0) {
            this.triggerGameOver();
        } else {
            this.loadNextQuestion();
        }
    }

    updateHUD() {
        this.scoreText.setText(`SCORE: ${this.score}`);
        this.comboText.setText(`COMBO: ${this.combo}`);
        
        let hText = '';
        for(let i=0; i<this.hearts; i++) hText += '❤️';
        this.heartsText.setText(hText);
    }

    triggerGameOver() {
        this.isGameOver = true;
        this.add.rectangle(195, 422, 390, 844, 0x000000, 0.8);
        this.add.text(195, 300, 'GAME OVER', { fontFamily: 'Fredoka One', fontSize: '48px', color: '#FF0000' }).setOrigin(0.5);

        this.time.delayedCall(1500, () => {
             this.scene.start('ResultScene', { score: this.score, sessionId: this.sessionId });
        });
    }
}
