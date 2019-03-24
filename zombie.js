let inquirer = require('inquirer');

function hero(name, characterClass, hitPoints, attackAmount, deffense) {
    this.name = name;
    this.characterClass = characterClass;
    this.originalHitpoints = hitPoints;
    this.hitPoints = hitPoints;
    this.lifePotions = 0;
    this.experience = 0;
    this.level = 1;
    this.attackAmount = attackAmount;
    this.deffense = deffense;
    this.attack = function (character) {
        let hitAmount = Math.floor(Math.random() * (this.attackAmount+1));
        console.log(`\n${this.name} hits ${character.name} with an attack of ${hitAmount} <<<<<`);
        let blockAmount = Math.floor(Math.random() * (character.deffense+1))
        if (blockAmount <= hitAmount) {
            console.log(`\n${character.name} blocks ${blockAmount} damage`)
            character.hitPoints -= hitAmount - blockAmount;
        } else {
            console.log(`${character.name} blocked all damage`)            
        }
        character.printStats();
    }
    this.printStats = function () {
        console.log('');
        console.log('-----------------------------------------');
        console.log(this.name);
        console.log(`level ${this.level} ${this.characterClass}`);
        console.log(`experience: ${this.experience}/40`)
        console.log(`hit points: ${this.hitPoints}/${this.originalHitpoints}`);
        console.log(`life potions: ${this.lifePotions}`)
        console.log('attack: ' + this.attackAmount);
        console.log('deffense: ' + this.deffense);
        console.log('-----------------------------------------');
    }
    this.resetHitpoints = function () {
        this.hitPoints = this.originalHitpoints;
    }
    this.useLifePotion = function () {
        if (this.lifePotions > 0) {
            this.resetHitpoints();
            this.lifePotions--;
            this.printStats();
        } else {
            console.log(`\nyou have no life potions`);
        }
    }
    this.levelUp = function () {
        this.level++;
        this.deffense++;
        this.attackAmount++;
        this.originalHitpoints += 10;
        this.experience = 0;
    }
}

function enemy(name, characterClass, hitPoints, attackAmount, deffense, experienceGiven) {
    this.name = name;
    this.characterClass = characterClass;
    this.originalHitpoints = hitPoints;
    this.hitPoints = hitPoints;
    this.experienceGiven = experienceGiven;
    this.attackAmount = attackAmount;
    this.deffense = deffense;
    this.attack = function (character) {
        let hitAmount = Math.floor(Math.random() * (this.attackAmount+1));
        console.log(`\n${this.name} hits ${character.name} with an attack of ${hitAmount} <<<<<`);
        let blockAmount = Math.floor(Math.random() * (character.deffense + 1))
        if (blockAmount <= hitAmount) {
            console.log(`\n${character.name} blocks ${blockAmount} damage`)
            character.hitPoints -= hitAmount - blockAmount;
        } else {
            console.log(`${character.name} blocked all damage`)            
        }
        character.printStats();
    }
    this.printStats = function () {
        console.log('');
        console.log('-----------------------------------------');
        console.log('name: ' + this.name);
        console.log('character class: ' + this.characterClass);
        console.log(`hit points: ${this.hitPoints}/${this.originalHitpoints}`);
        console.log('attack: ' + this.attackAmount);
        console.log('deffense: ' + this.deffense);
        console.log('-----------------------------------------');
    }
    this.resetHitpoints = function () {
        this.hitPoints = this.originalHitpoints;
    }
}

let player = new hero('Josh', 'Human', 150, 5, 1);
let deathWalker = new enemy('Death Walker', 'Undead', 10, 4, 0, 5);
let archer = new enemy('Archer', 'Human', 30, 4, 1, 15);
let axeman = new enemy('Axeman', 'Human', 45, 5, 2, 20);
let dog = new enemy('Dog', 'Animal', 25, 3, 0, 5);

function introduceEnemy(enemy) {
    console.log('');
    console.log('*****************************************');
    console.log('----- NEW ENEMY -------------------------<<<<<<<<');
    console.log('*****************************************');
    console.log('');
    console.log(`you are facing ${enemy.name}, a ${enemy.characterClass}!`);
    console.log('-----------------------------------------');
    player.printStats();
    enemy.printStats();
    }

function fightOrNot(enemy) {
    inquirer.prompt([
        {
            type: 'input',
            message: '\nwould you like to fight? (y/n)',
            name: 'fight'
        }
    ]).then(function(response){
        if (response.fight === 'y') {
            fight(enemy);
        } else {
            console.log(`\n${player.name} chose not to fight this one...`)
            nextEvent();
        }
    })
}

function fight(enemy) {
    inquirer.prompt([
        {
            type: 'input',
            message: '\nattack, use life potion or retreat? (a/l/r)',
            name: 'fight'
        }
    ]).then(function(response){
        if (response.fight === 'a'){
            player.attack(enemy);
            if (enemy.hitPoints > 0) {
                enemy.attack(player);                
            }
            if (player.hitPoints > 0 && enemy.hitPoints > 0) {
                fight(enemy)
            } else if(player.hitPoints <= 0) {
                console.log(`\n${player.name} has lost, game over!`)
            } else if (enemy.hitPoints <= 0) {
                console.log('');
                console.log('*****************************************');
                console.log('----- AFTER BATTLE REPORT ---------------<<<<<<<<');
                console.log('*****************************************');
                console.log(`\n${enemy.name} was defeated!`);
                console.log(`\nexperience plus ${enemy.experienceGiven}`);
                player.experience += enemy.experienceGiven;
                enemy.resetHitpoints();
                let rand = Math.floor(Math.random() * 2);
                if (rand === 0) {
                    console.log(`\nyou found a life potion!`);
                    player.lifePotions += 1;
                }
                if (player.experience >= 40) {
                    console.log(`\nyou leveled up`)
                    player.levelUp();
                }
                nextEvent();
            }

        } else if (response.fight === 'r') {
            console.log(`\n${player.name} retreats!`)
            nextEvent();
        } else if (response.fight === 'l') {
            player.useLifePotion();
            fight(enemy);
        } else {
            fight(enemy);
        }
    })
}

function nextEvent() {
    let rand = Math.floor(Math.random() * 4);
    if(rand === 0){
        introduceEnemy(deathWalker);
        fightOrNot(deathWalker);
    } else if (rand === 1) {
        introduceEnemy(archer);
        fightOrNot(archer);        
    } else if (rand === 2) {
        introduceEnemy(axeman);
        fightOrNot(axeman);
    } else if (rand === 3) {
        introduceEnemy(dog);
        fightOrNot(dog);
    }
}

nextEvent();
