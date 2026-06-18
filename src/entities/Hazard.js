import { GAME_CONFIG, COLORS } from '../config/constants.js';

export class Hazard {
  constructor(scene, type, x, y, width, height) {
    this.scene = scene;
    this.type = type;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.damage = 0.5;
    this.active = true;
    
    this.createSprite();
  }
  
  createSprite() {
    const container = this.scene.add.container(this.x, this.y);
    
    const graphics = this.scene.add.graphics();
    
    switch (this.type) {
      case 'debris':
        this.createDebris(graphics);
        this.damage = 0.8;
        break;
        
      case 'electric':
        this.createElectric(graphics);
        this.damage = 1.2;
        break;
        
      case 'low_visibility':
        this.createLowVisibility(graphics);
        this.damage = 0;
        break;
    }
    
    container.add(graphics);
    container.setDepth(30);
    this.sprite = container;
    this.graphics = graphics;
    
    if (this.type === 'electric') {
      this.scene.time.addEvent({
        delay: 500,
        callback: this.flashElectric,
        callbackScope: this,
        loop: true
      });
    }
  }
  
  createDebris(graphics) {
    for (let i = 0; i < 15; i++) {
      const px = Phaser.Math.Between(-this.width / 2, this.width / 2);
      const py = Phaser.Math.Between(-this.height / 2, this.height / 2);
      const size = Phaser.Math.Between(5, 15);
      
      graphics.fillStyle(0x554433, 0.7);
      graphics.fillRect(px - size / 2, py - size / 2, size, size * 0.7);
      
      graphics.fillStyle(0x776655, 0.5);
      graphics.fillTriangle(
        px - size / 2, py - size / 2,
        px + size / 2, py - size / 2,
        px, py - size
      );
    }
    
    graphics.lineStyle(2, 0xff4444, 0.4);
    graphics.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);
  }
  
  createElectric(graphics) {
    graphics.fillStyle(0xffff00, 0.15);
    graphics.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    
    for (let i = 0; i < 5; i++) {
      const startX = Phaser.Math.Between(-this.width / 2, this.width / 2);
      const startY = -this.height / 2;
      
      graphics.lineStyle(2, 0xffff00, 0.8);
      graphics.beginPath();
      graphics.moveTo(startX, startY);
      
      let currentX = startX;
      let currentY = startY;
      const segments = 5;
      
      for (let j = 0; j < segments; j++) {
        currentX += Phaser.Math.Between(-20, 20);
        currentY += this.height / segments;
        graphics.lineTo(currentX, currentY);
      }
      
      graphics.strokePath();
    }
    
    graphics.lineStyle(2, 0xffff00, 0.5);
    graphics.strokeRect(-this.width / 2, -this.height / 2, this.width, this.height);
    
    const warning = this.scene.add.text(0, 0, '⚡', {
      fontSize: '32px'
    }).setOrigin(0.5);
    this.warningIcon = warning;
    this.sprite.add(warning);
  }
  
  createLowVisibility(graphics) {
    graphics.fillStyle(0x000011, 0.6);
    graphics.fillRect(-this.width / 2, -this.height / 2, this.width, this.height);
    
    for (let i = 0; i < 50; i++) {
      const px = Phaser.Math.Between(-this.width / 2, this.width / 2);
      const py = Phaser.Math.Between(-this.height / 2, this.height / 2);
      const size = Phaser.Math.Between(2, 8);
      
      graphics.fillStyle(0x333344, 0.3);
      graphics.fillCircle(px, py, size);
    }
  }
  
  flashElectric() {
    if (this.warningIcon) {
      this.warningIcon.visible = !this.warningIcon.visible;
    }
    if (this.graphics) {
      this.graphics.alpha = this.graphics.alpha === 1 ? 0.5 : 1;
    }
  }
  
  isInside(x, y) {
    return (
      x > this.x - this.width / 2 &&
      x < this.x + this.width / 2 &&
      y > this.y - this.height / 2 &&
      y < this.y + this.height / 2
    );
  }
  
  update(deltaTime) {
    if (this.type === 'low_visibility') {
      const speed = 0.05;
      this.y += Math.sin(this.scene.time.now / 2000) * speed * deltaTime / 16;
      this.sprite.y = this.y;
    }
  }
  
  destroy() {
    if (this.sprite) {
      this.sprite.destroy();
    }
  }
}
