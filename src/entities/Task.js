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
    
    this.nameTag = this.scene.add.text(0, 60, this.name, {
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
    switch (this.type) {
      case GAME_CONFIG.TASK_TYPES.CLEAR_OBSTACLE:
        return '⛏';
      case GAME_CONFIG.TASK_TYPES.WELD:
        return '🔧';
      case GAME_CONFIG.TASK_TYPES.WIRE:
        return '⚡';
      case GAME_CONFIG.TASK_TYPES.SAMPLE:
        return '🧪';
      default:
        return '❓';
    }
  }
  
  updateProgress() {
    this.progressBar.clear();
    
    if (this.completed) {
      this.progressBar.fillStyle(0x00ff88, 1);
    } else {
      this.progressBar.fillStyle(0xffaa00, 1);
    }
    
    const width = 40;
    const height = 6;
    this.progressBar.fillRect(-width / 2, -height / 2, width * (this.progress / 100), height);
    
    this.progressBar.lineStyle(1, 0xffffff, 0.5);
    this.progressBar.strokeRect(-width / 2, -height / 2, width, height);
    
    if (this.completed) {
      this.sprite.alpha = 0.6;
      this.icon.setText('✓');
      this.nameTag.setColor('#00ff88');
    }
  }
  
  workOnTask(amount) {
    if (this.completed) return false;
    
    this.progress += amount;
    if (this.progress >= 100) {
      this.progress = 100;
      this.completed = true;
      this.onComplete();
    }
    
    this.updateProgress();
    return true;
  }
  
  onComplete() {
    this.scene.tweens.add({
      targets: this.sprite,
      scale: 1.2,
      duration: 200,
      yoyo: true
    });
    
    for (let i = 0; i < 10; i++) {
      this.scene.time.delayedCall(i * 50, () => {
        const particle = this.scene.add.circle(
          this.x + Phaser.Math.Between(-20, 20),
          this.y + Phaser.Math.Between(-20, 20),
          Phaser.Math.Between(2, 6),
          0x00ff88,
          0.8
        );
        this.scene.tweens.add({
          targets: particle,
          y: particle.y - 50,
          alpha: 0,
          duration: 800,
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
