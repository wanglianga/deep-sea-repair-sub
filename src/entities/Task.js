import { GAME_CONFIG, COLORS } from '../config/constants.js';

export class Task {
  constructor(scene, type, x, y, name) {
    this.scene = scene;
    this.type = type;
    this.x = x;
    this.y = y;
    this.name = name;
    this.completed = false;
    this.progress = 0;
    this.requiresArm = true;
    this.isMultiStep = false;
    this.currentStepIndex = 0;
    this.steps = [];
    this.stepsCompleted = 0;
    this.stepProgress = 0;
    this.quality = 100;
    this.hasSecondaryFailureRisk = false;
    
    if (type === GAME_CONFIG.TASK_TYPES.PIPE_REPAIR) {
      this.isMultiStep = true;
      this.steps = [...GAME_CONFIG.PIPE_REPAIR_STEPS];
    } else if (type === GAME_CONFIG.TASK_TYPES.TOWER_REPAIR) {
      this.isMultiStep = true;
      this.steps = [...GAME_CONFIG.TOWER_REPAIR_STEPS];
    }
    
    this.createSprite();
  }
  
  createSprite() {
    const container = this.scene.add.container(this.x, this.y);
    
    const base = this.scene.add.graphics();
    
    switch (this.type) {
      case GAME_CONFIG.TASK_TYPES.CLEAR_OBSTACLE:
        base.fillStyle(0x665544, 1);
        base.fillRect(-25, -25, 50, 50);
        base.fillStyle(0x554433, 1);
        base.fillRect(-20, -30, 40, 10);
        base.fillStyle(0x443322, 1);
        base.fillTriangle(-25, 25, 25, 25, 0, 35);
        
        base.lineStyle(3, 0xff4444, 0.8);
        base.strokeRect(-22, -22, 44, 44);
        base.lineBetween(-15, -15, 15, 15);
        base.lineBetween(15, -15, -15, 15);
        break;
        
      case GAME_CONFIG.TASK_TYPES.WELD:
        base.fillStyle(COLORS.PIPE_RUST, 1);
        base.fillRect(-30, -15, 60, 30);
        base.fillStyle(0x884422, 1);
        base.fillRect(-5, -20, 10, 40);
        
        base.fillStyle(0xff6600, 0.6);
        base.fillEllipse(0, 0, 15, 20);
        break;
        
      case GAME_CONFIG.TASK_TYPES.WIRE:
        base.fillStyle(0x333333, 1);
        base.fillRect(-20, -25, 40, 50);
        base.fillStyle(0x222222, 1);
        base.fillRect(-15, -20, 30, 40);
        
        const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00];
        for (let i = 0; i < 4; i++) {
          base.fillStyle(colors[i], 1);
          base.fillRect(-10 + i * 6, -15, 3, 30);
        }
        
        base.lineStyle(2, 0xffff00, 0.8);
        base.strokeRect(-18, -23, 36, 46);
        break;
        
      case GAME_CONFIG.TASK_TYPES.SAMPLE:
        base.fillStyle(0x5577aa, 0.8);
        base.fillEllipse(0, 0, 30, 40);
        base.fillStyle(0x7799cc, 0.6);
        base.fillEllipse(-5, -5, 20, 30);
        
        base.lineStyle(2, 0x00ff88, 0.8);
        base.strokeEllipse(0, 0, 30, 40);
        break;
        
      case GAME_CONFIG.TASK_TYPES.PIPE_REPAIR:
        base.fillStyle(COLORS.PIPE_COLOR, 1);
        base.fillRect(-40, -18, 80, 36);
        
        base.fillStyle(COLORS.PIPE_RUST, 0.6);
        base.fillRect(-35, -15, 30, 30);
        
        base.fillStyle(0xff4400, 0.5);
        base.fillEllipse(0, 0, 12, 16);
        
        base.lineStyle(2, 0xff6600, 0.8);
        base.strokeRect(-38, -16, 76, 32);
        break;
        
      case GAME_CONFIG.TASK_TYPES.TOWER_REPAIR:
        base.fillStyle(COLORS.TOWER_COLOR, 1);
        base.fillRect(-12, -50, 24, 100);
        
        base.fillStyle(0x8899aa, 1);
        base.fillTriangle(-18, -50, 18, -50, 0, -75);
        
        base.fillStyle(0xff0000, 0.8);
        base.fillCircle(0, -60, 6);
        
        base.fillStyle(0x334455, 1);
        base.fillRect(-30, 40, 60, 25);
        
        base.lineStyle(2, 0xffff00, 0.6);
        base.strokeRect(-28, 42, 56, 21);
        break;
    }
    
    container.add(base);
    
    this.icon = this.scene.add.text(0, 0, this.getIcon(), {
      fontSize: '24px',
      color: '#ffffff'
    }).setOrigin(0.5);
    container.add(this.icon);
    
    this.progressBar = this.scene.add.graphics();
    this.progressBar.y = 45;
    container.add(this.progressBar);
    
    this.stepIndicator = this.scene.add.graphics();
    this.stepIndicator.y = 55;
    container.add(this.stepIndicator);
    
    this.stepText = this.scene.add.text(0, 70, '', {
      fontSize: '11px',
      color: '#ffdd00',
      fontFamily: 'Microsoft YaHei',
      backgroundColor: 'rgba(0,0,0,0.6)',
      padding: { x: 4, y: 1 }
    }).setOrigin(0.5);
    this.stepText.visible = false;
    container.add(this.stepText);
    
    this.nameTag = this.scene.add.text(0, 90, this.name, {
      fontSize: '14px',
      color: '#ffffff',
      fontFamily: 'Microsoft YaHei',
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: { x: 5, y: 2 }
    }).setOrigin(0.5);
    container.add(this.nameTag);
    
    container.setDepth(60);
    this.sprite = container;
    
    this.updateProgress();
  }
  
  getIcon() {
    if (this.isMultiStep) {
      if (this.completed) return '✓';
      const currentStep = this.steps[this.currentStepIndex];
      return currentStep ? currentStep.icon : '🔧';
    }
    
    switch (this.type) {
      case GAME_CONFIG.TASK_TYPES.CLEAR_OBSTACLE:
        return '⛏';
      case GAME_CONFIG.TASK_TYPES.WELD:
        return '🔧';
      case GAME_CONFIG.TASK_TYPES.WIRE:
        return '⚡';
      case GAME_CONFIG.TASK_TYPES.SAMPLE:
        return '🧪';
      case GAME_CONFIG.TASK_TYPES.PIPE_REPAIR:
        return '🔧';
      case GAME_CONFIG.TASK_TYPES.TOWER_REPAIR:
        return '📡';
      default:
        return '❓';
    }
  }
  
  getCurrentStep() {
    if (!this.isMultiStep || this.completed) return null;
    return this.steps[this.currentStepIndex];
  }
  
  updateProgress() {
    this.progressBar.clear();
    
    const displayProgress = this.isMultiStep ? 
      ((this.stepsCompleted + (this.stepProgress / 100)) / this.steps.length) * 100 : 
      this.progress;
    
    if (this.completed) {
      this.progressBar.fillStyle(0x00ff88, 1);
    } else {
      this.progressBar.fillStyle(0xffaa00, 1);
    }
    
    const width = 60;
    const height = 6;
    this.progressBar.fillRect(-width / 2, -height / 2, width * (displayProgress / 100), height);
    
    this.progressBar.lineStyle(1, 0xffffff, 0.5);
    this.progressBar.strokeRect(-width / 2, -height / 2, width, height);
    
    if (this.isMultiStep && !this.completed) {
      this.updateStepIndicator();
    }
    
    if (this.isMultiStep) {
      const currentStep = this.getCurrentStep();
      if (currentStep) {
        this.stepText.visible = true;
        this.stepText.setText(`步骤 ${this.currentStepIndex + 1}/${this.steps.length}: ${currentStep.name}`);
      }
    }
    
    if (this.completed) {
      this.sprite.alpha = 0.6;
      this.icon.setText('✓');
      this.nameTag.setColor('#00ff88');
      if (this.stepText) {
        this.stepText.setText('全部完成');
        this.stepText.setColor('#00ff88');
      }
    }
  }
  
  updateStepIndicator() {
    this.stepIndicator.clear();
    
    const stepCount = this.steps.length;
    const dotSize = 8;
    const spacing = 18;
    const startX = -((stepCount - 1) * spacing) / 2;
    
    for (let i = 0; i < stepCount; i++) {
      const x = startX + i * spacing;
      
      if (i < this.stepsCompleted) {
        this.stepIndicator.fillStyle(0x00ff88, 1);
        this.stepIndicator.fillCircle(x, 0, dotSize / 2);
      } else if (i === this.currentStepIndex) {
        this.stepIndicator.fillStyle(0xffdd00, 1);
        this.stepIndicator.fillCircle(x, 0, dotSize / 2);
        
        const pulse = 1 + Math.sin(this.scene.time.now / 200) * 0.3;
        this.stepIndicator.lineStyle(2, 0xffdd00, 0.5);
        this.stepIndicator.strokeCircle(x, 0, (dotSize / 2) * pulse + 3);
      } else {
        this.stepIndicator.fillStyle(0x555555, 1);
        this.stepIndicator.fillCircle(x, 0, dotSize / 2);
      }
    }
  }
  
  workOnTask(amount) {
    if (this.completed) return false;
    
    if (this.isMultiStep) {
      this.stepProgress += amount;
      
      if (this.stepProgress >= 100) {
        this.completeCurrentStep();
      }
    } else {
      this.progress += amount;
      if (this.progress >= 100) {
        this.progress = 100;
        this.completed = true;
        this.onComplete();
      }
    }
    
    this.updateProgress();
    return true;
  }
  
  completeCurrentStep() {
    this.stepProgress = 0;
    this.stepsCompleted++;
    
    if (this.stepsCompleted >= this.steps.length) {
      this.completed = true;
      this.quality = 100;
      this.hasSecondaryFailureRisk = false;
      this.onComplete();
    } else {
      this.currentStepIndex++;
      this.scene.tweens.add({
        targets: this.sprite,
        scale: 1.15,
        duration: 200,
        yoyo: true
      });
      
      const stepParticles = this.scene.add.circle(this.x, this.y, 15, 0x00ff88, 0.6);
      this.scene.tweens.add({
        targets: stepParticles,
        scale: 2,
        alpha: 0,
        duration: 500,
        onComplete: () => stepParticles.destroy()
      });
    }
  }
  
  skipToNextStep() {
    if (this.completed) return false;
    if (this.stepsCompleted >= this.steps.length - 1) return false;
    
    this.stepProgress = 0;
    this.stepsCompleted++;
    this.currentStepIndex++;
    this.hasSecondaryFailureRisk = true;
    this.quality = Math.max(0, this.quality - 30);
    
    this.updateProgress();
    return true;
  }
  
  calculateReturnPenalty() {
    if (!this.hasSecondaryFailureRisk) return 0;
    return (100 - this.quality) / 100;
  }
  
  onComplete() {
    this.scene.tweens.add({
      targets: this.sprite,
      scale: 1.2,
      duration: 200,
      yoyo: true
    });
    
    for (let i = 0; i < 15; i++) {
      this.scene.time.delayedCall(i * 40, () => {
        const particle = this.scene.add.circle(
          this.x + Phaser.Math.Between(-25, 25),
          this.y + Phaser.Math.Between(-25, 25),
          Phaser.Math.Between(3, 7),
          this.hasSecondaryFailureRisk ? 0xffaa00 : 0x00ff88,
          0.8
        );
        this.scene.tweens.add({
          targets: particle,
          y: particle.y - 60,
          alpha: 0,
          duration: 900,
          onComplete: () => particle.destroy()
        });
      });
    }
  }
  
  isInRange(submarine) {
    const dx = this.x - submarine.x;
    const dy = this.y - submarine.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < 80;
  }
  
  destroy() {
    if (this.sprite) {
      this.sprite.destroy();
    }
  }
}
