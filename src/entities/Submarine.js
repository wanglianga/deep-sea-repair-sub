import { GAME_CONFIG, COLORS } from '../config/constants.js';

export class Submarine {
  constructor(scene, x, y) {
    this.scene = scene;
    this.x = x;
    this.y = y;
    
    this.oxygen = GAME_CONFIG.OXYGEN_MAX;
    this.power = GAME_CONFIG.POWER_MAX;
    this.pressure = 0;
    this.mechanicalArm = GAME_CONFIG.MECHANICAL_ARM_MAX;
    this.lightOn = true;
    this.lightRange = GAME_CONFIG.LIGHT_RANGE_MAX;
    
    this.velocityX = 0;
    this.velocityY = 0;
    this.angle = -90;
    
    this.isArmWorking = false;
    this.armTarget = null;
    
    this.createSprite();
    this.createLight();
    this.createArm();
    this.createBubbles();
  }
  
  createSprite() {
    const container = this.scene.add.container(this.x, this.y);
    
    const body = this.scene.add.graphics();
    body.fillStyle(COLORS.SUBMARINE_BODY, 1);
    body.fillEllipse(0, 0, 90, 50);
    
    body.fillStyle(COLORS.SUBMARINE_ACCENT, 1);
    body.fillRect(-20, -18, 25, 10);
    
    body.fillStyle(0xaaddff, 0.8);
    body.fillEllipse(-10, -12, 12, 7);
    
    const tail = this.scene.add.graphics();
    tail.fillStyle(COLORS.SUBMARINE_BODY, 1);
    tail.fillTriangle(45, -15, 60, 0, 45, 15);
    
    const fin = this.scene.add.graphics();
    fin.fillStyle(COLORS.SUBMARINE_ACCENT, 1);
    fin.fillTriangle(-30, -25, -20, -25, -25, -40);
    
    container.add([body, tail, fin]);
    container.setDepth(100);
    
    this.sprite = container;
    
    this.scene.physics.add.existing(container);
    container.body.setCircle(35);
    container.body.setCollideWorldBounds(true);
    container.body.setDrag(100);
    container.body.setBounce(0.3);
  }
  
  createLight() {
    this.light = this.scene.lights.addLight(
      this.x, this.y,
      this.lightRange,
      0xffffcc,
      1
    );
  }
  
  createArm() {
    this.armSprite = this.scene.add.graphics();
    this.armSprite.setDepth(99);
    this.updateArm();
  }
  
  createBubbles() {
    if (!this.scene.textures.exists('bubble')) {
      const bubbleTex = this.scene.textures.createCanvas('bubble', 16, 16);
      const bctx = bubbleTex.getContext();
      const gradient = bctx.createRadialGradient(6, 6, 1, 8, 8, 8);
      gradient.addColorStop(0, 'rgba(220, 240, 255, 0.9)');
      gradient.addColorStop(0.5, 'rgba(180, 220, 255, 0.5)');
      gradient.addColorStop(1, 'rgba(100, 160, 220, 0.1)');
      bctx.fillStyle = gradient;
      bctx.beginPath();
      bctx.arc(8, 8, 7, 0, Math.PI * 2);
      bctx.fill();
      bctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      bctx.beginPath();
      bctx.arc(6, 5, 2, 0, Math.PI * 2);
      bctx.fill();
      bubbleTex.refresh();
    }
    
    this.bubbleParticles = this.scene.add.particles(0, 0, 'bubble', {
      speed: { min: 20, max: 40 },
      angle: { min: 160, max: 200 },
      scale: { start: 0.5, end: 0 },
      alpha: { start: 0.6, end: 0 },
      lifespan: 1500,
      frequency: 300,
      quantity: 1,
      visible: false
    });
    this.bubbleParticles.setDepth(98);
  }
  
  update(cursors, deltaTime) {
    const body = this.sprite.body;
    const speed = GAME_CONFIG.SUBMARINE_SPEED;
    const accel = GAME_CONFIG.SUBMARINE_ACCELERATION;
    
    let moveX = 0;
    let moveY = 0;
    
    if (cursors.left.isDown || cursors.a?.isDown) moveX -= 1;
    if (cursors.right.isDown || cursors.d?.isDown) moveX += 1;
    if (cursors.up.isDown || cursors.w?.isDown) moveY -= 1;
    if (cursors.down.isDown || cursors.s?.isDown) moveY += 1;
    
    if (moveX !== 0 || moveY !== 0) {
      const length = Math.sqrt(moveX * moveX + moveY * moveY);
      moveX /= length;
      moveY /= length;
      
      body.setAcceleration(moveX * accel, moveY * accel);
      
      this.angle = Math.atan2(moveY, moveX) * 180 / Math.PI;
      this.sprite.angle = this.angle;
      
      this.power -= GAME_CONFIG.POWER_DRAIN_RATE * deltaTime / 16;
      
      if (this.bubbleParticles) {
        this.bubbleParticles.visible = true;
        const bubbleX = this.x - Math.cos(this.angle * Math.PI / 180) * 50;
        const bubbleY = this.y - Math.sin(this.angle * Math.PI / 180) * 50;
        this.bubbleParticles.setPosition(bubbleX, bubbleY);
      }
    } else {
      body.setAcceleration(0, 0);
      if (this.bubbleParticles) {
        this.bubbleParticles.visible = false;
      }
    }
    
    if (body.velocity.length() > speed) {
      body.velocity.normalize().scale(speed);
    }
    
    this.x = this.sprite.x;
    this.y = this.sprite.y;
    this.velocityX = body.velocity.x;
    this.velocityY = body.velocity.y;
    
    if (this.light) {
      this.light.x = this.x;
      this.light.y = this.y;
      this.light.radius = this.lightOn ? this.lightRange : 30;
      this.light.intensity = this.lightOn ? 1 : 0.2;
    }
    
    this.oxygen -= GAME_CONFIG.OXYGEN_DRAIN_RATE * deltaTime / 16;
    
    if (this.lightOn) {
      this.power -= GAME_CONFIG.LIGHT_POWER_DRAIN * deltaTime / 16;
    }
    
    const depth = this.y / GAME_CONFIG.WORLD_HEIGHT;
    this.pressure += (GAME_CONFIG.PRESSURE_RATE + depth * GAME_CONFIG.PRESSURE_DEPTH_FACTOR) * deltaTime / 16;
    
    if (this.isArmWorking && this.armTarget) {
      this.mechanicalArm -= GAME_CONFIG.ARM_USE_RATE * deltaTime / 16;
      this.power -= GAME_CONFIG.ARM_POWER_DRAIN * deltaTime / 16;
    }
    
    if (this.mechanicalArm < 0) this.mechanicalArm = 0;
    if (this.oxygen < 0) this.oxygen = 0;
    if (this.power < 0) this.power = 0;
    if (this.pressure > 100) this.pressure = 100;
    
    this.updateArm();
  }
  
  updateArm() {
    this.armSprite.clear();
    
    const armLength = this.isArmWorking ? 60 : 40;
    const armEndX = this.x + Math.cos(this.angle * Math.PI / 180) * armLength;
    const armEndY = this.y + Math.sin(this.angle * Math.PI / 180) * armLength;
    
    this.armSprite.lineStyle(4, COLORS.ARM_COLOR, 1);
    this.armSprite.beginPath();
    this.armSprite.moveTo(this.x, this.y);
    this.armSprite.lineTo(armEndX, armEndY);
    this.armSprite.strokePath();
    
    if (this.isArmWorking) {
      this.armSprite.fillStyle(0xffaa00, 1);
      this.armSprite.fillCircle(armEndX, armEndY, 8);
      
      const sparkCount = 3;
      for (let i = 0; i < sparkCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const dist = Math.random() * 15;
        this.armSprite.fillStyle(0xffff00, 0.8);
        this.armSprite.fillCircle(
          armEndX + Math.cos(angle) * dist,
          armEndY + Math.sin(angle) * dist,
          2
        );
      }
    } else {
      this.armSprite.fillStyle(0x666666, 1);
      this.armSprite.fillCircle(armEndX, armEndY, 5);
    }
  }
  
  toggleLight() {
    this.lightOn = !this.lightOn;
    return this.lightOn;
  }
  
  startArm(target) {
    if (this.mechanicalArm > 0 && this.power > 5) {
      this.isArmWorking = true;
      this.armTarget = target;
      return true;
    }
    return false;
  }
  
  stopArm() {
    this.isArmWorking = false;
    this.armTarget = null;
  }
  
  getPosition() {
    return { x: this.x, y: this.y };
  }
  
  applyCurrent(currentX, currentY, strength) {
    const body = this.sprite.body;
    body.velocity.x += currentX * strength;
    body.velocity.y += currentY * strength;
  }
  
  takeDamage(amount, type) {
    switch (type) {
      case 'electric':
        this.power -= amount;
        break;
      case 'debris':
        this.mechanicalArm -= amount * 0.5;
        this.oxygen -= amount * 0.2;
        break;
      default:
        this.oxygen -= amount * 0.3;
    }
  }
  
  isDead() {
    return this.oxygen <= 0 || this.pressure >= 100 || this.power <= 0;
  }
  
  getDeathReason() {
    if (this.oxygen <= 0) return '氧气耗尽，潜航员窒息...';
    if (this.pressure >= 100) return '压力过大，潜航器外壳破裂...';
    if (this.power <= 0) return '电力耗尽，潜航器失去动力...';
    return '任务失败';
  }
  
  setPosition(x, y) {
    this.x = x;
    this.y = y;
    this.sprite.setPosition(x, y);
    if (this.light) {
      this.light.x = x;
      this.light.y = y;
    }
  }
}
