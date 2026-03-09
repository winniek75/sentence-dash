import * as Phaser from 'phaser';
import { SaveManager } from '../systems/SaveManager';

export class ProfileScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ProfileScene' });
    }

    create() {
        this.add.rectangle(195, 422, 390, 844, 0x1a1a2e);
        this.add.text(195, 200, 'YOUR PROFILE', { fontFamily: 'Fredoka One', fontSize: '36px', color: '#FFD700' }).setOrigin(0.5);

        const progress = SaveManager.loadProgress();

        const namePrompt = this.add.text(195, 300, `Name: ${progress.playerName}\n(Tap to change)`, { fontFamily: 'Nunito', fontSize: '24px', color: '#fff', align: 'center' }).setOrigin(0.5).setInteractive();
        namePrompt.on('pointerdown', () => {
            const name = window.prompt("Your Name:", progress.playerName);
            if (name) {
                progress.playerName = name;
                namePrompt.setText(`Name: ${progress.playerName}\n(Tap to change)`);
            }
        });

        const animalPrompt = this.add.text(195, 400, `Fav Animal: ${progress.playerProfile.favoriteAnimal || 'None'}\n(Tap to set)`, { fontFamily: 'Nunito', fontSize: '24px', color: '#fff', align: 'center' }).setOrigin(0.5).setInteractive();
        animalPrompt.on('pointerdown', () => {
            const animal = window.prompt("Favorite Animal (e.g., dog, cat, bear):", progress.playerProfile.favoriteAnimal);
            if (animal) {
                progress.playerProfile.favoriteAnimal = animal;
                animalPrompt.setText(`Fav Animal: ${animal}\n(Tap to set)`);
            }
        });
        
        const foodPrompt = this.add.text(195, 500, `Fav Food: ${progress.playerProfile.favoriteFood || 'None'}\n(Tap to set)`, { fontFamily: 'Nunito', fontSize: '24px', color: '#fff', align: 'center' }).setOrigin(0.5).setInteractive();
        foodPrompt.on('pointerdown', () => {
            const food = window.prompt("Favorite Food (e.g., apple, pizza):", progress.playerProfile.favoriteFood);
            if (food) {
                progress.playerProfile.favoriteFood = food;
                foodPrompt.setText(`Fav Food: ${food}\n(Tap to set)`);
            }
        });

        const startBtn = this.add.text(195, 650, 'START GAME', { fontFamily: 'Fredoka One', fontSize: '28px', color: '#4CAF50' }).setOrigin(0.5).setInteractive();
        startBtn.on('pointerdown', () => {
            SaveManager.saveProgress(progress);
            this.scene.start('GameScene');
        });
    }
}
