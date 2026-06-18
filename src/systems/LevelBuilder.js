import { COLORS } from '../config/constants.js';

export class LevelBuilder {
  constructor(scene) {
    this.scene = scene;
    this.structures = [];
  }
  
  build() {
    this.createPipes();
    this.createSignalTower();
    this.createWreck();
    this.createMotherShip();
    
    return this.structures;
  }
  
  createPipes() {
    const pipeGroup = this.scene.add.container(0, 0);
    
    const mainPipe = this.scene.add.graphics();
    mainPipe.fillStyle(COLORS.PIPE_COLOR, 1);
    
    mainPipe.fillRect(200, 1800, 800, 40);
    mainPipe.fillRect(1000, 1500, 40, 340);
    mainPipe.fillRect(1000, 1500, 600, 40);
    mainPipe.fillRect(1560, 1000, 40, 540);
    mainPipe.fillRect(1560, 1000, 500, 40);
    
    mainPipe.fillStyle(COLORS.PIPE_RUST, 0.5);
    for (let i = 0; i < 15; i++) {
      const px = 220 + i * 50;
      mainPipe.fillRect(px, 1800, 20, 40);
    }
    
    const jointPositions = [
      { x: 250, y: 1820 },
      { x: 450, y: 1820 },
      { x: 650, y: 1820 },
      { x: 850, y: 1820 },
      { x: 1020, y: 1600 },
      { x: 1020, y: 1700 },
      { x: 1200, y: 1520 },
      { x: 1400, y: 1520 },
      { x: 1580, y: 1200 },
      { x: 1580, y: 1300 },
      { x: 1700, y: 1020 },
      { x: 1900, y: 1020 }
    ];
    
    jointPositions.forEach(pos => {
      mainPipe.fillStyle(0x445566, 1);
      mainPipe.fillRect(pos.x - 8, pos.y - 8, 16, 16);
    });
    
    pipeGroup.add(mainPipe);
    pipeGroup.setDepth(40);
    
    this.structures.push({
      type: 'pipe',
      sprite: pipeGroup,
      bounds: [
        { x: 200, y: 1800, w: 800, h: 40 },
        { x: 1000, y: 1500, w: 40, h: 340 },
        { x: 1000, y: 1500, w: 600, h: 40 },
        { x: 1560, y: 1000, w: 40, h: 540 },
        { x: 1560, y: 1000, w: 500, h: 40 }
      ]
    });
  }
  
  createSignalTower() {
    const tower = this.scene.add.container(600, 1200);
    
    const graphics = this.scene.add.graphics();
    
    graphics.fillStyle(COLORS.TOWER_COLOR, 1);
    graphics.fillRect(-15, -100, 30, 200);
    
    graphics.fillStyle(0x8899aa, 1);
    graphics.fillTriangle(-20, -100, 20, -100, 0, -140);
    
    graphics.fillStyle(0x556677, 1);
    graphics.fillRect(-30, 100, 60, 20);
    
    graphics.fillStyle(0xff0000, 1);
    graphics.fillCircle(0, -120, 8);
    
    graphics.fillStyle(0x334455, 1);
    graphics.fillRect(-50, 80, 100, 40);
    graphics.fillStyle(0x223344, 1);
    graphics.fillRect(-45, 85, 90, 30);
    
    tower.add(graphics);
    tower.setDepth(45);
    
    this.scene.time.addEvent({
      delay: 2000,
      callback: () => {
        graphics.alpha = graphics.alpha === 1 ? 0.7 : 1;
      },
      loop: true
    });
    
    this.structures.push({
      type: 'signal_tower',
      sprite: tower,
      x: 600,
      y: 1200,
      bounds: [{ x: 550, y: 1100, w: 100, h: 200 }]
    });
  }
  
  createWreck() {
    const wreck = this.scene.add.container(2400, 1800);
    
    const graphics = this.scene.add.graphics();
    
    graphics.fillStyle(COLORS.WRECK_COLOR, 1);
    graphics.fillRect(-100, -50, 200, 100);
    
    graphics.fillStyle(0x664433, 1);
    graphics.fillRect(-100, -80, 80, 30);
    
    graphics.fillStyle(0x332211, 0.6);
    graphics.fillRect(-40, -30, 50, 20);
    
    graphics.fillStyle(0x554433, 0.8);
    graphics.fillRect(60, -40, 30, 80);
    graphics.fillRect(70, -50, 10, 10);
    
    graphics.lineStyle(3, 0x221100, 0.8);
    graphics.beginPath();
    graphics.moveTo(-80, -50);
    graphics.lineTo(-60, 50);
    graphics.moveTo(20, -50);
    graphics.lineTo(40, 50);
    graphics.strokePath();
    
    wreck.add(graphics);
    wreck.setDepth(42);
    
    this.structures.push({
      type: 'wreck',
      sprite: wreck,
      x: 2400,
      y: 1800,
      bounds: [{ x: 2300, y: 1750, w: 200, h: 100 }]
    });
  }
  
  createMotherShip() {
    const ship = this.scene.add.container(300, 400);
    
    const graphics = this.scene.add.graphics();
    
    graphics.fillStyle(COLORS.MOTHERSHIP_COLOR, 1);
    graphics.fillRect(-80, -30, 160, 60);
    
    graphics.fillStyle(0xaabbcc, 1);
    graphics.fillRect(-60, -60, 100, 30);
    
    graphics.fillStyle(0x667788, 1);
    graphics.fillRect(20, -70, 20, 25);
    
    graphics.fillStyle(0xff4400, 1);
    graphics.fillCircle(30, -75, 5);
    
    graphics.fillStyle(0x556677, 1);
    graphics.fillRect(-100, 20, 200, 15);
    
    graphics.fillStyle(0x334455, 1);
    graphics.fillRect(-30, 30, 25, 40);
    graphics.fillStyle(0x223344, 1);
    graphics.fillRect(-25, 35, 15, 30);
    
    graphics.fillStyle(0xffff00, 0.8);
    for (let i = 0; i < 4; i++) {
      graphics.fillCircle(-50 + i * 30, -15, 4);
    }
    
    ship.add(graphics);
    ship.setDepth(50);
    
    this.structures.push({
      type: 'mothership',
      sprite: ship,
      x: 300,
      y: 400,
      bounds: [{ x: 200, y: 370, w: 200, h: 60 }],
      isDock: true
    });
    
    this.motherShip = { x: 300, y: 400 };
  }
  
  getMotherShipPosition() {
    return this.motherShip;
  }
  
  isNearMotherShip(x, y, radius = 100) {
    if (!this.motherShip) return false;
    const dx = x - this.motherShip.x;
    const dy = y - this.motherShip.y;
    return Math.sqrt(dx * dx + dy * dy) < radius;
  }
  
  checkCollision(x, y, radius) {
    for (const structure of this.structures) {
      if (structure.bounds) {
        for (const bound of structure.bounds) {
          if (this.circleRectCollision(x, y, radius, bound.x, bound.y, bound.w, bound.h)) {
            return true;
          }
        }
      }
    }
    return false;
  }
  
  circleRectCollision(cx, cy, cr, rx, ry, rw, rh) {
    const closestX = Math.max(rx, Math.min(cx, rx + rw));
    const closestY = Math.max(ry, Math.min(cy, ry + rh));
    
    const dx = cx - closestX;
    const dy = cy - closestY;
    
    return (dx * dx + dy * dy) < (cr * cr);
  }
}
