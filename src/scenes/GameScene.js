import Phaser from 'phaser';
import { GAME_CONFIG, COLORS } from '../config/constants.js';
import { Submarine } from '../entities/Submarine.js';
import { Task } from '../entities/Task.js';
import { Hazard } from '../entities/Hazard.js';
import { Anchor } from '../entities/Anchor.js';
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
    this.anchors = [];
    this.grabbedAnchor = null;
    this.anchorReturnRisk = 0;
    this.currentPowerSave = 0;
    this.totalTaskCount = 4;
  }
  
  create() {
    this.lights.enable();
    this.lights.setAmbientColor(0x112233);
    
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
    this.createAnchors();
    
    this.hud = new HUD(this);
    
    this.setupInput();
    
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
        type: GAME_CONFIG.TASK_TYPES.PIPE_REPAIR,
        x: 900,
        y: 1700,
        name: '管道裂缝维修'
      },
      {
        type: GAME_CONFIG.TASK_TYPES.TOWER_REPAIR,
        x: 600,
        y: 1100,
        name: '信号塔维修'
      },
      {
        type: GAME_CONFIG.TASK_TYPES.SAMPLE,
        x: 2400,
        y: 1750,
        name: '舱段取样'
      },
      {
        type: GAME_CONFIG.TASK_TYPES.CLEAR_OBSTACLE,
        x: 2000,
        y: 900,
        name: '通道清障'
      }
    ];
    
    this.totalTaskCount = taskConfigs.length;
    
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
  
  createAnchors() {
    this.anchors = [];
    
    const anchorConfigs = [
      { x: 750, y: 1550, name: '海沟锚点A' },
      { x: 1300, y: 1300, name: '海沟锚点B' },
      { x: 550, y: 1000, name: '塔基锚点' },
      { x: 2100, y: 700, name: '岩壁锚点' }
    ];
    
    anchorConfigs.forEach(config => {
      const anchor = new Anchor(this, config.x, config.y, config.name);
      this.anchors.push(anchor);
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
      l: Phaser.Input.Keyboard.KeyCodes.L,
      e: Phaser.Input.Keyboard.KeyCodes.E
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
    
    this.keys.e.on('down', () => {
      if (this.gameState !== 'playing') return;
      this.toggleAnchor();
    });
    
    this.keys.l.on('down', () => {
      if (this.gameState !== 'playing') return;
      const isOn = this.submarine.toggleLight();
      this.hud.showMessage(isOn ? '照明灯已开启' : '照明灯已关闭', 1000);
    });
  }
  
  toggleAnchor() {
    if (this.grabbedAnchor) {
      this.releaseAnchor();
    } else {
      this.tryGrabAnchor();
    }
  }
  
  tryGrabAnchor() {
    let nearestAnchor = null;
    let nearestDistance = Infinity;
    
    this.anchors.forEach(anchor => {
      if (anchor.isInRange(this.submarine)) {
        const dx = anchor.x - this.submarine.x;
        const dy = anchor.y - this.submarine.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < nearestDistance) {
          nearestDistance = dist;
          nearestAnchor = anchor;
        }
      }
    });
    
    if (nearestAnchor && this.submarine.mechanicalArm > 10) {
      nearestAnchor.grab();
      this.grabbedAnchor = nearestAnchor;
      this.submarine.isArmWorking = true;
      this.submarine.armTarget = { x: nearestAnchor.x, y: nearestAnchor.y, type: 'anchor' };
      this.hud.showMessage(`已连接 ${nearestAnchor.name}，机身稳定中`, 1500);
      
      this.anchorReturnRisk += GAME_CONFIG.ANCHOR_RETURN_RISK_INCREASE;
    } else if (!nearestAnchor) {
      this.hud.showMessage('附近没有可用的锚点', 1500);
    } else {
      this.hud.showMessage('机械臂耐久不足，无法使用锚点', 1500);
    }
  }
  
  releaseAnchor() {
    if (this.grabbedAnchor) {
      this.grabbedAnchor.release();
      this.grabbedAnchor = null;
      this.submarine.isArmWorking = false;
      this.submarine.armTarget = null;
      this.hud.showMessage('已断开锚点连接', 1000);
    }
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
    if (this.currentTask) {
      this.currentTask.active = false;
      this.currentTask = null;
    }
    
    if (!this.grabbedAnchor) {
      this.submarine.stopArm();
    }
  }
  
  update(time, delta) {
    if (this.gameState !== 'playing') return;
    
    this.submarine.update(this.cursors, delta);
    
    this.environment.update(this.submarine, delta);
    
    this.currentPowerSave = this.environment.getCurrentPowerSave(this.submarine);
    if (this.currentPowerSave > 0) {
      const powerSaveAmount = GAME_CONFIG.POWER_DRAIN_RATE * this.currentPowerSave * delta / 16;
      this.submarine.power = Math.min(GAME_CONFIG.POWER_MAX, this.submarine.power + powerSaveAmount);
    }
    
    if (this.grabbedAnchor) {
      this.applyAnchorStabilization(delta);
      
      this.submarine.mechanicalArm -= GAME_CONFIG.ANCHOR_ARM_DRAIN_RATE * delta / 16;
      if (this.submarine.mechanicalArm <= 0) {
        this.submarine.mechanicalArm = 0;
        this.releaseAnchor();
        this.hud.showMessage('机械臂耐久耗尽，锚点已断开！', 2000);
      }
    }
    
    this.anchors.forEach(anchor => {
      anchor.update(delta);
      
      const inRange = anchor.isInRange(this.submarine);
      anchor.showRange(inRange && !this.grabbedAnchor);
    });
    
    this.hazards.forEach(hazard => {
      hazard.update(delta);
    });
    
    if (this.submarine.isArmWorking && this.currentTask && !this.grabbedAnchor) {
      this.currentTask.workOnTask(0.5 * delta / 16);
      
      if (this.currentTask.completed) {
        this.stopArmAction();
        this.tasksCompleted++;
        const remaining = this.totalTaskCount - this.tasksCompleted;
        this.hud.showMessage(`任务完成！剩余 ${remaining} 个任务`, 2000);
        
        if (this.tasksCompleted >= this.totalTaskCount && !this.returnTaskActive) {
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
      this.levelBuilder.getMotherShipPosition(),
      {
        grabbedAnchor: this.grabbedAnchor,
        currentPowerSave: this.currentPowerSave,
        anchorReturnRisk: this.anchorReturnRisk
      }
    );
    
    if (this.submarine.isDead()) {
      this.gameOver();
    }
    
    this.updateVisibility();
  }
  
  applyAnchorStabilization(delta) {
    if (!this.grabbedAnchor) return;
    
    const force = this.grabbedAnchor.getStabilizationForce(this.submarine);
    const body = this.submarine.sprite.body;
    
    body.velocity.x += force.x * delta * 2;
    body.velocity.y += force.y * delta * 2;
    
    body.velocity.x *= GAME_CONFIG.ANCHOR_STABILIZATION_RATIO;
    body.velocity.y *= GAME_CONFIG.ANCHOR_STABILIZATION_RATIO;
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
    this.releaseAnchor();
    
    const returnPenalty = this.calculateReturnPenalty();
    const hasSecondaryFailure = returnPenalty > 0.1;
    
    if (hasSecondaryFailure) {
      this.submarine.oxygen -= returnPenalty * 20;
      this.submarine.power -= returnPenalty * 15;
      
      if (this.submarine.oxygen <= 0 || this.submarine.power <= 0) {
        this.hud.showMessage('返航途中发生二次故障！任务失败...', 3000);
        this.time.delayedCall(2000, () => {
          this.gameOver();
        });
        return;
      }
    }
    
    this.cameras.main.fade(1000, 0, 50, 50);
    
    this.time.delayedCall(1000, () => {
      this.scene.start('WinScene', {
        score: {
          oxygen: this.submarine.oxygen,
          power: this.submarine.power,
          arm: this.submarine.mechanicalArm
        },
        tasksCompleted: this.tasksCompleted,
        totalTasks: this.totalTaskCount,
        taskDetails: this.tasks.map(task => ({
          name: task.name,
          completed: task.completed,
          quality: task.quality || 100,
          hasSecondaryRisk: task.hasSecondaryFailureRisk || false,
          isMultiStep: task.isMultiStep || false,
          stepsCompleted: task.stepsCompleted || 0,
          totalSteps: task.steps?.length || 0
        })),
        returnPenalty: returnPenalty,
        hasSecondaryFailure: hasSecondaryFailure,
        anchorReturnRisk: this.anchorReturnRisk
      });
    });
  }
  
  calculateReturnPenalty() {
    let totalPenalty = 0;
    
    this.tasks.forEach(task => {
      if (task.completed && task.hasSecondaryFailureRisk) {
        totalPenalty += task.calculateReturnPenalty() * 0.3;
      }
    });
    
    totalPenalty += this.anchorReturnRisk * 0.5;
    
    return Math.min(totalPenalty, 0.8);
  }
}
