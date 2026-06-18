import Phaser from 'phaser';
import { GAME_CONFIG, COLORS } from '../config/constants.js';
import { Submarine } from '../entities/Submarine.js';
import { Task } from '../entities/Task.js';
import { Hazard } from '../entities/Hazard.js';
import { Environment } from '../systems/Environment.js';
import { LevelBuilder } from '../systems/LevelBuilder.js';
import { HUD } from '../systems/HUD.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
  }
  
  init() {
    this.gameState = 'playing';
    this.tasksCompleted = 0;
    this.returnTaskActive = false;
  }
  
  create() {
    this.physics.world.setBounds(0, 0, GAME_CONFIG.WORLD_WIDTH, GAME_CONFIG.WORLD_HEIGHT);
    
    this.cameras.main.setBounds(0, 0, GAME_CONFIG.WORLD_WIDTH, GAME_CONFIG.WORLD_HEIGHT);
    this.cameras.main.setZoom(1);
    
    this.environment = new Environment(this);
    
    this.levelBuilder = new LevelBuilder(this);
    this.levelBuilder.build();
    
    this.submarine = new Submarine(this, 300, 400);
    
    this.cameras.main.startFollow(this.submarine.sprite, true, 0.08, 0.08);
    
    this.createTasks();
    this.createHazards();
    
    this.hud = new HUD(this);
    
    this.setupInput();
    
    this.lights.enable();
    this.lights.setAmbientColor(0x112233);
    
    this.damageCooldown = 0;
    
    this.hud.showMessage('任务开始！完成所有维修任务后返回母船', 3000);
    
    this.time.addEvent({
      delay: 5000,
      callback: () => {
        this.hud.showMessage('提示：注意氧气和压力值，及时返回母船补给', 2500);
      }
    });
  }
  
  createTasks() {
    this.tasks = [];
    
    const taskConfigs = [
      {
        type: GAME_CONFIG.TASK_TYPES.CLEAR_OBSTACLE,
        x: 800,
        y: 1700,
        name: '管道清障'
      },
      {
        type: GAME_CONFIG.TASK_TYPES.WELD,
        x: 1300,
        y: 1450,
        name: '管道焊接'
      },
      {
        type: GAME_CONFIG.TASK_TYPES.WIRE,
        x: 600,
        y: 1100,
        name: '信号塔接线'
      },
      {
        type: GAME_CONFIG.TASK_TYPES.SAMPLE,
        x: 2400,
        y: 1750,
        name: '舱段取样'
      }
    ];
    
    taskConfigs.forEach(config => {
      const task = new Task(this, config.type, config.x, config.y, config.name);
      this.tasks.push(task);
    });
  }
  
  createHazards() {
    this.hazards = [];
    
    const hazardConfigs = [
      { type: 'debris', x: 1000, y: 1650, width: 200, height: 150 },
      { type: 'electric', x: 1700, y: 1100, width: 180, height: 200 },
      { type: 'low_visibility', x: 2000, y: 1800, width: 400, height: 300 },
      { type: 'debris', x: 500, y: 800, width: 150, height: 180 },
      { type: 'electric', x: 2600, y: 1500, width: 160, height: 180 },
      { type: 'low_visibility', x: 1200, y: 600, width: 350, height: 250 }
    ];
    
    hazardConfigs.forEach(config => {
      const hazard = new Hazard(this, config.type, config.x, config.y, config.width, config.height);
      this.hazards.push(hazard);
    });
  }
  
  setupInput() {
    this.cursors = this.input.keyboard.createCursorKeys();
    
    this.keys = this.input.keyboard.addKeys({
      w: Phaser.Input.Keyboard.KeyCodes.W,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      s: Phaser.Input.Keyboard.KeyCodes.S,
      d: Phaser.Input.Keyboard.KeyCodes.D,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
      l: Phaser.Input.Keyboard.KeyCodes.L
    });
    
    this.cursors.w = this.keys.w;
    this.cursors.a = this.keys.a;
    this.cursors.s = this.keys.s;
    this.cursors.d = this.keys.d;
    
    this.keys.space.on('down', () => {
      if (this.gameState !== 'playing') return;
      this.handleArmAction();
    });
    
    this.keys.space.on('up', () => {
      this.stopArmAction();
    });
    
    this.keys.l.on('down', () => {
      if (this.gameState !== 'playing') return;
      const isOn = this.submarine.toggleLight();
      this.hud.showMessage(isOn ? '照明灯已开启' : '照明灯已关闭', 1000);
    });
  }
  
  handleArmAction() {
    let nearestTask = null;
    let nearestDistance = Infinity;
    
    this.tasks.forEach(task => {
      if (!task.completed && task.isInRange(this.submarine)) {
        const dx = task.x - this.submarine.x;
        const dy = task.y - this.submarine.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < nearestDistance) {
          nearestDistance = dist;
          nearestTask = task;
        }
      }
    });
    
    if (nearestTask) {
      if (this.submarine.mechanicalArm > 0 && this.submarine.power > 5) {
        this.submarine.startArm(nearestTask);
        this.currentTask = nearestTask;
        nearestTask.active = true;
      } else {
        this.hud.showMessage('机械臂耐久或电量不足！', 1500);
      }
    } else {
      this.hud.showMessage('附近没有可执行的任务', 1500);
    }
  }
  
  stopArmAction() {
    this.submarine.stopArm();
    if (this.currentTask) {
      this.currentTask.active = false;
      this.currentTask = null;
    }
  }
  
  update(time, delta) {
    if (this.gameState !== 'playing') return;
    
    this.submarine.update(this.cursors, delta);
    
    this.environment.update(this.submarine, delta);
    
    this.hazards.forEach(hazard => {
      hazard.update(delta);
    });
    
    if (this.submarine.isArmWorking && this.currentTask) {
      this.currentTask.workOnTask(0.5 * delta / 16);
      
      if (this.currentTask.completed) {
        this.stopArmAction();
        this.tasksCompleted++;
        this.hud.showMessage(`任务完成！剩余 ${4 - this.tasksCompleted} 个任务`, 2000);
        
        if (this.tasksCompleted >= 4 && !this.returnTaskActive) {
          this.returnTaskActive = true;
          this.hud.showMessage('所有任务完成！返回母船返航！', 3000);
        }
      }
    }
    
    if (this.damageCooldown > 0) {
      this.damageCooldown -= delta;
    } else {
      this.checkHazardDamage();
    }
    
    if (this.returnTaskActive) {
      this.checkReturnToShip();
    }
    
    this.hud.update(
      this.submarine,
      this.tasks,
      this.hazards,
      this.levelBuilder.getMotherShipPosition()
    );
    
    if (this.submarine.isDead()) {
      this.gameOver();
    }
    
    this.updateVisibility();
  }
  
  checkHazardDamage() {
    this.hazards.forEach(hazard => {
      if (hazard.active && hazard.isInside(this.submarine.x, this.submarine.y)) {
        if (hazard.type === 'electric') {
          this.submarine.takeDamage(2, 'electric');
          this.damageCooldown = 500;
          
          this.cameras.main.shake(100, 0.005);
        } else if (hazard.type === 'debris') {
          this.submarine.takeDamage(1, 'debris');
          this.damageCooldown = 800;
        }
      }
    });
  }
  
  checkReturnToShip() {
    if (this.levelBuilder.isNearMotherShip(this.submarine.x, this.submarine.y, 80)) {
      this.winGame();
    }
  }
  
  updateVisibility() {
    let visibility = 1;
    
    this.hazards.forEach(hazard => {
      if (hazard.type === 'low_visibility' && hazard.isInside(this.submarine.x, this.submarine.y)) {
        visibility = Math.min(visibility, 0.4);
      }
    });
    
    if (this.submarine.lightOn) {
      this.lights.setAmbientColor(0x112233);
    } else {
      this.lights.setAmbientColor(0x081018);
    }
  }
  
  gameOver() {
    this.gameState = 'gameover';
    this.submarine.stopArm();
    
    this.cameras.main.fade(1000, 0, 0, 0);
    
    this.time.delayedCall(1000, () => {
      this.scene.start('GameOverScene', {
        reason: this.submarine.getDeathReason()
      });
    });
  }
  
  winGame() {
    this.gameState = 'win';
    this.submarine.stopArm();
    
    this.cameras.main.fade(1000, 0, 50, 50);
    
    this.time.delayedCall(1000, () => {
      this.scene.start('WinScene', {
        score: {
          oxygen: this.submarine.oxygen,
          power: this.submarine.power,
          arm: this.submarine.mechanicalArm
        },
        tasksCompleted: this.tasksCompleted
      });
    });
  }
}
