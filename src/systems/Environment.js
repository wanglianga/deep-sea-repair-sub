import { COLORS } from '../config/constants.js';

export class Environment {
  constructor(scene) {
    this.scene = scene;
    this.currents = [];
    this.decorations = [];
    
    this.createBackground();
    this.createCurrents();
    this.createDecorations();
  }
  
  createBackground() {
    const bg = this.scene.add.graphics();
    
    const gradient = this.scene.textures.createCanvas('bgGradient', 3200, 2400);
    const ctx = gradient.getContext();
    
    const gradientCtx = ctx.createLinearGradient(0, 0, 0, 2400);
    gradientCtx.addColorStop(0, '#003355');
    gradientCtx.addColorStop(0.5, '#002244');
    gradientCtx.addColorStop(1, '#001122');
    
    ctx.fillStyle = gradientCtx;
    ctx.fillRect(0, 0, 3200, 2400);
    
    gradient.refresh();
    
    const bgImage = this.scene.add.image(0, 0, 'bgGradient').setOrigin(0);
    bgImage.setDepth(0);
    
    this.createLightRays();
    this.createParticles();
  }
  
  createLightRays() {
    this.lightRays = [];
    
    for (let i = 0; i < 8; i++) {
      const ray = this.scene.add.graphics();
      ray.fillStyle(0x88ccff, 0.03);
      
      const x = i * 450 + 100;
      const width = 150 + Math.random() * 100;
      
      ray.beginPath();
      ray.moveTo(x - width / 2, 0);
      ray.lineTo(x + width / 2, 0);
      ray.lineTo(x + width, 2400);
      ray.lineTo(x - width, 2400);
      ray.closePath();
      ray.fillPath();
      
      ray.setDepth(5);
      ray.alpha = 0.02 + Math.random() * 0.03;
      
      this.lightRays.push({
        sprite: ray,
        speed: 0.05 + Math.random() * 0.1,
        baseAlpha: ray.alpha
      });
    }
  }
  
  createParticles() {
    this.underwaterParticles = this.scene.add.particles(1600, 1200, 'particle', {
      speed: { min: 5, max: 15 },
      angle: { min: -10, max: 10 },
      scale: { start: 0.3, end: 0.1 },
      alpha: { start: 0.4, end: 0.1 },
      lifespan: { min: 5000, max: 10000 },
      frequency: 200,
      quantity: 1,
      emitZone: {
        type: 'random',
        source: new Phaser.Geom.Rectangle(0, 0, 3200, 2400)
      }
    });
    this.underwaterParticles.setDepth(10);
    
    this.scene.textures.createCanvas('particle', 8, 8);
    const particleTex = this.scene.textures.get('particle');
    const pctx = particleTex.getContext();
    pctx.fillStyle = 'rgba(200, 230, 255, 0.5)';
    pctx.beginPath();
    pctx.arc(4, 4, 3, 0, Math.PI * 2);
    pctx.fill();
    particleTex.refresh();
  }
  
  createCurrents() {
    const currentConfigs = [
      { x: 800, y: 600, width: 400, height: 200, dirX: 1, dirY: 0, strength: 0.3 },
      { x: 1600, y: 1000, width: 300, height: 350, dirX: -0.8, dirY: 0.3, strength: 0.25 },
      { x: 2400, y: 800, width: 350, height: 250, dirX: 0.6, dirY: 0.5, strength: 0.35 },
      { x: 1200, y: 1800, width: 500, height: 200, dirX: -1, dirY: 0.1, strength: 0.28 },
      { x: 2000, y: 1600, width: 280, height: 300, dirX: 0.5, dirY: -0.6, strength: 0.3 }
    ];
    
    currentConfigs.forEach(config => {
      const current = this.createCurrent(config);
      this.currents.push(current);
    });
  }
  
  createCurrent(config) {
    const container = this.scene.add.container(config.x, config.y);
    
    const graphics = this.scene.add.graphics();
    graphics.fillStyle(0x4488cc, 0.08);
    graphics.fillRect(-config.width / 2, -config.height / 2, config.width, config.height);
    
    const arrowCount = 6;
    for (let i = 0; i < arrowCount; i++) {
      const ax = Phaser.Math.Between(-config.width / 2 + 30, config.width / 2 - 30);
      const ay = Phaser.Math.Between(-config.height / 2 + 30, config.height / 2 - 30);
      
      graphics.lineStyle(2, 0x66bbff, 0.4);
      graphics.beginPath();
      
      const arrowLen = 20;
      const angle = Math.atan2(config.dirY, config.dirX);
      
      graphics.moveTo(ax, ay);
      graphics.lineTo(
        ax + Math.cos(angle) * arrowLen,
        ay + Math.sin(angle) * arrowLen
      );
      graphics.strokePath();
      
      const headLen = 6;
      const headAngle = Math.PI / 6;
      graphics.beginPath();
      graphics.moveTo(
        ax + Math.cos(angle) * arrowLen,
        ay + Math.sin(angle) * arrowLen
      );
      graphics.lineTo(
        ax + Math.cos(angle + Math.PI - headAngle) * headLen + Math.cos(angle) * arrowLen,
        ay + Math.sin(angle + Math.PI - headAngle) * headLen + Math.sin(angle) * arrowLen
      );
      graphics.moveTo(
        ax + Math.cos(angle) * arrowLen,
        ay + Math.sin(angle) * arrowLen
      );
      graphics.lineTo(
        ax + Math.cos(angle + Math.PI + headAngle) * headLen + Math.cos(angle) * arrowLen,
        ay + Math.sin(angle + Math.PI + headAngle) * headLen + Math.sin(angle) * arrowLen
      );
      graphics.strokePath();
    }
    
    container.add(graphics);
    container.setDepth(15);
    
    return {
      sprite: container,
      x: config.x,
      y: config.y,
      width: config.width,
      height: config.height,
      dirX: config.dirX,
      dirY: config.dirY,
      strength: config.strength
    };
  }
  
  createDecorations() {
    this.createSeaFloor();
    this.createRocks();
    this.createPlants();
  }
  
  createSeaFloor() {
    const floor = this.scene.add.graphics();
    floor.fillStyle(0x332211, 1);
    floor.fillRect(0, 2300, 3200, 100);
    
    floor.fillStyle(0x443322, 0.8);
    for (let i = 0; i < 50; i++) {
      const x = i * 70 + Math.random() * 30;
      const h = 10 + Math.random() * 20;
      floor.fillRect(x, 2300 - h, 40 + Math.random() * 20, h);
    }
    
    floor.setDepth(20);
  }
  
  createRocks() {
    const rockPositions = [
      { x: 300, y: 2250, size: 60 },
      { x: 900, y: 2280, size: 45 },
      { x: 1500, y: 2260, size: 70 },
      { x: 2100, y: 2270, size: 55 },
      { x: 2700, y: 2250, size: 50 },
      { x: 500, y: 1200, size: 40 },
      { x: 1800, y: 500, size: 35 },
      { x: 2500, y: 1400, size: 45 }
    ];
    
    rockPositions.forEach(pos => {
      const rock = this.scene.add.graphics();
      
      rock.fillStyle(0x554433, 1);
      rock.beginPath();
      rock.moveTo(-pos.size, pos.size * 0.3);
      rock.lineTo(-pos.size * 0.6, -pos.size * 0.5);
      rock.lineTo(pos.size * 0.3, -pos.size * 0.7);
      rock.lineTo(pos.size, -pos.size * 0.2);
      rock.lineTo(pos.size * 0.8, pos.size * 0.4);
      rock.lineTo(0, pos.size * 0.5);
      rock.closePath();
      rock.fillPath();
      
      rock.fillStyle(0x665544, 0.6);
      rock.beginPath();
      rock.moveTo(-pos.size * 0.3, -pos.size * 0.3);
      rock.lineTo(pos.size * 0.2, -pos.size * 0.5);
      rock.lineTo(pos.size * 0.4, -pos.size * 0.1);
      rock.lineTo(-pos.size * 0.1, pos.size * 0.1);
      rock.closePath();
      rock.fillPath();
      
      rock.setPosition(pos.x, pos.y);
      rock.setDepth(25);
      
      this.decorations.push(rock);
    });
  }
  
  createPlants() {
    const plantPositions = [
      { x: 150, y: 2300 },
      { x: 400, y: 2300 },
      { x: 700, y: 2300 },
      { x: 1100, y: 2300 },
      { x: 1400, y: 2300 },
      { x: 1700, y: 2300 },
      { x: 2000, y: 2300 },
      { x: 2400, y: 2300 },
      { x: 2800, y: 2300 },
      { x: 3000, y: 2300 }
    ];
    
    plantPositions.forEach(pos => {
      const seaweed = this.scene.add.graphics();
      const height = 80 + Math.random() * 60;
      
      seaweed.lineStyle(4, 0x226633, 1);
      seaweed.beginPath();
      seaweed.moveTo(0, 0);
      
      const segments = 6;
      for (let i = 1; i <= segments; i++) {
        const y = -height * (i / segments);
        const x = Math.sin(i * 0.8 + pos.x) * 15;
        seaweed.lineTo(x, y);
      }
      seaweed.strokePath();
      
      seaweed.fillStyle(0x338844, 0.8);
      for (let i = 1; i <= 3; i++) {
        const y = -height * (i / 4);
        const x = Math.sin(i * 0.8 + pos.x) * 15;
        seaweed.beginPath();
        seaweed.ellipse(x + 8, y, 10, 5, 0.3, 0, Math.PI * 2);
        seaweed.fillPath();
      }
      
      seaweed.setPosition(pos.x, pos.y);
      seaweed.setDepth(22);
      
      this.decorations.push(seaweed);
    });
  }
  
  update(submarine, deltaTime) {
    this.currents.forEach(current => {
      if (this.isInCurrent(submarine, current)) {
        submarine.applyCurrent(current.dirX, current.dirY, current.strength);
      }
    });
    
    this.lightRays.forEach((ray, index) => {
      ray.sprite.alpha = ray.baseAlpha + Math.sin(this.scene.time.now / 2000 + index) * 0.01;
    });
  }
  
  isInCurrent(submarine, current) {
    return (
      submarine.x > current.x - current.width / 2 &&
      submarine.x < current.x + current.width / 2 &&
      submarine.y > current.y - current.height / 2 &&
      submarine.y < current.y + current.height / 2
    );
  }
  
  getVisibilityAtPosition(x, y, hazards) {
    let visibility = 1;
    
    hazards.forEach(hazard => {
      if (hazard.type === 'low_visibility' && hazard.isInside(x, y)) {
        visibility = Math.min(visibility, 0.3);
      }
    });
    
    return visibility;
  }
}
