import { GAME_CONFIG, COLORS } from '../config/constants.js';

export class Anchor {
  constructor(scene, x, y, name = '锚点') {
    this.scene = scene;
    this.x = x;
    this.y = y;
    this.name = name;
    this.isGrabbed = false;
    this.grabRange = GAME_CONFIG.ANCHOR_GRAB_RANGE;
    
    this.createSprite();
  }
  
  createSprite() {
    const container = this.scene.add.container(this.x, this.y);
    
    const base = this.scene.add.graphics();
    
    base.fillStyle(0x556677, 1);
    base.fillRect(-25, -25, 50, 50);
    
    base.fillStyle(0x445566, 1);
    base.fillRect(-30, -20, 10, 40);
    base.fillRect(20, -20, 10, 40);
    
    base.fillStyle(0x334455, 1);
    base.fillCircle(0, 0, 12);
    
    base.fillStyle(0x667788, 0.8);
    base.fillCircle(0, 0, 6);
    
    base.lineStyle(3, 0x8899aa, 0.6);
    base.strokeRect(-25, -25, 50, 50);
    
    const chain = this.scene.add.graphics();
    chain.lineStyle(3, 0x667788, 0.8);
    for (let i = 0; i < 5; i++) {
      const cy = -35 - i * 12;
      chain.strokeCircle(0, cy, 5);
    }
    chain.visible = false;
    this.chainSprite = chain;
    
    const hook = this.scene.add.graphics();
    hook.lineStyle(4, 0xffaa00, 1);
    hook.beginPath();
    hook.arc(0, 10, 15, Math.PI * 0.2, Math.PI * 0.8, true);
    hook.strokePath();
    hook.visible = false;
    this.hookSprite = hook;
    
    container.add([base, chain, hook]);
    container.setDepth(55);
    
    this.rangeIndicator = this.scene.add.graphics();
    this.rangeIndicator.lineStyle(2, 0xffaa00, 0.3);
    this.rangeIndicator.strokeCircle(0, 0, this.grabRange);
    this.rangeIndicator.visible = false;
    container.add(this.rangeIndicator);
    
    this.nameTag = this.scene.add.text(0, 45, this.name, {
      fontSize: '12px',
      color: '#88ffaa',
      fontFamily: 'Microsoft YaHei',
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: { x: 5, y: 2 }
    }).setOrigin(0.5);
    container.add(this.nameTag);
    
    this.statusText = this.scene.add.text(0, 65, '可用', {
      fontSize: '11px',
      color: '#00ff88',
      fontFamily: 'Microsoft YaHei'
    }).setOrigin(0.5);
    container.add(this.statusText);
    
    this.sprite = container;
  }
  
  isInRange(submarine) {
    const dx = this.x - submarine.x;
    const dy = this.y - submarine.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < this.grabRange;
  }
  
  grab() {
    if (this.isGrabbed) return false;
    this.isGrabbed = true;
    this.chainSprite.visible = true;
    this.hookSprite.visible = true;
    this.statusText.setText('已连接');
    this.statusText.setColor('#ffaa00');
    
    this.scene.tweens.add({
      targets: this.sprite,
      scale: 1.1,
      duration: 200,
      yoyo: true
    });
    
    return true;
  }
  
  release() {
    this.isGrabbed = false;
    this.chainSprite.visible = false;
    this.hookSprite.visible = false;
    this.statusText.setText('可用');
    this.statusText.setColor('#00ff88');
  }
  
  showRange(show) {
    if (this.rangeIndicator) {
      this.rangeIndicator.visible = show;
    }
  }
  
  getStabilizationForce(submarine) {
    if (!this.isGrabbed) return { x: 0, y: 0 };
    
    const dx = this.x - submarine.x;
    const dy = this.y - submarine.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance < 10) return { x: 0, y: 0 };
    
    const ratio = GAME_CONFIG.ANCHOR_STABILIZATION_RATIO;
    return {
      x: (dx / distance) * ratio,
      y: (dy / distance) * ratio
    };
  }
  
  update(deltaTime) {
    if (this.isGrabbed) {
      const pulse = 1 + Math.sin(this.scene.time.now / 300) * 0.05;
      this.sprite.scale = pulse;
    }
  }
  
  destroy() {
    if (this.sprite) {
      this.sprite.destroy();
    }
  }
}
