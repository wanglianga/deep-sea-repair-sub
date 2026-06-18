import { COLORS, GAME_CONFIG } from '../config/constants.js';

export class HUD {
  constructor(scene) {
    this.scene = scene;
    this.elements = {};
    
    this.createTopBar();
    this.createLeftPanel();
    this.createRightPanel();
    this.createBottomBar();
    this.createCompass();
    this.createTaskPanel();
    this.createWarningIndicators();
  }
  
  createTopBar() {
    const topBar = this.scene.add.graphics();
    topBar.fillStyle(0x000000, 0.6);
    topBar.fillRect(0, 0, 1280, 60);
    topBar.setScrollFactor(0);
    topBar.setDepth(1000);
    
    const title = this.scene.add.text(640, 10, '深海维修任务', {
      fontSize: '20px',
      color: '#00ffaa',
      fontFamily: 'Microsoft YaHei',
      fontWeight: 'bold'
    }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(1001);
    
    this.elements.topBar = topBar;
    this.elements.title = title;
  }
  
  createLeftPanel() {
    const panel = this.scene.add.graphics();
    panel.fillStyle(0x001122, 0.8);
    panel.fillRect(10, 70, 200, 300);
    panel.lineStyle(2, 0x00aacc, 0.6);
    panel.strokeRect(10, 70, 200, 300);
    panel.setScrollFactor(0);
    panel.setDepth(1000);
    
    this.createOxygenMeter();
    this.createPowerMeter();
    this.createPressureMeter();
    this.createArmMeter();
    
    this.elements.leftPanel = panel;
  }
  
  createOxygenMeter() {
    const label = this.scene.add.text(20, 85, '氧气', {
      fontSize: '16px',
      color: '#00ffaa',
      fontFamily: 'Microsoft YaHei'
    }).setScrollFactor(0).setDepth(1001);
    
    const barBg = this.scene.add.graphics();
    barBg.fillStyle(0x003322, 1);
    barBg.fillRect(70, 85, 130, 20);
    barBg.lineStyle(1, 0x00ffaa, 0.5);
    barBg.strokeRect(70, 85, 130, 20);
    barBg.setScrollFactor(0).setDepth(1001);
    
    const barFill = this.scene.add.graphics();
    barFill.fillStyle(COLORS.OXYGEN_COLOR, 1);
    barFill.fillRect(72, 87, 126, 16);
    barFill.setScrollFactor(0).setDepth(1002);
    
    const valueText = this.scene.add.text(200, 85, '100%', {
      fontSize: '14px',
      color: '#00ffaa',
      fontFamily: 'Microsoft YaHei'
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(1002);
    
    this.elements.oxygen = { label, barBg, barFill, valueText };
  }
  
  createPowerMeter() {
    const label = this.scene.add.text(20, 130, '电量', {
      fontSize: '16px',
      color: '#ffdd00',
      fontFamily: 'Microsoft YaHei'
    }).setScrollFactor(0).setDepth(1001);
    
    const barBg = this.scene.add.graphics();
    barBg.fillStyle(0x332200, 1);
    barBg.fillRect(70, 130, 130, 20);
    barBg.lineStyle(1, 0xffdd00, 0.5);
    barBg.strokeRect(70, 130, 130, 20);
    barBg.setScrollFactor(0).setDepth(1001);
    
    const barFill = this.scene.add.graphics();
    barFill.fillStyle(COLORS.POWER_COLOR, 1);
    barFill.fillRect(72, 132, 126, 16);
    barFill.setScrollFactor(0).setDepth(1002);
    
    const valueText = this.scene.add.text(200, 130, '100%', {
      fontSize: '14px',
      color: '#ffdd00',
      fontFamily: 'Microsoft YaHei'
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(1002);
    
    this.elements.power = { label, barBg, barFill, valueText };
  }
  
  createPressureMeter() {
    const label = this.scene.add.text(20, 175, '压力', {
      fontSize: '16px',
      color: '#ff4444',
      fontFamily: 'Microsoft YaHei'
    }).setScrollFactor(0).setDepth(1001);
    
    const barBg = this.scene.add.graphics();
    barBg.fillStyle(0x330000, 1);
    barBg.fillRect(70, 175, 130, 20);
    barBg.lineStyle(1, 0xff4444, 0.5);
    barBg.strokeRect(70, 175, 130, 20);
    barBg.setScrollFactor(0).setDepth(1001);
    
    const barFill = this.scene.add.graphics();
    barFill.fillStyle(COLORS.PRESSURE_COLOR, 1);
    barFill.fillRect(72, 177, 0, 16);
    barFill.setScrollFactor(0).setDepth(1002);
    
    const valueText = this.scene.add.text(200, 175, '0%', {
      fontSize: '14px',
      color: '#ff4444',
      fontFamily: 'Microsoft YaHei'
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(1002);
    
    this.elements.pressure = { label, barBg, barFill, valueText };
  }
  
  createArmMeter() {
    const label = this.scene.add.text(20, 220, '机械臂', {
      fontSize: '16px',
      color: '#ff8800',
      fontFamily: 'Microsoft YaHei'
    }).setScrollFactor(0).setDepth(1001);
    
    const barBg = this.scene.add.graphics();
    barBg.fillStyle(0x331100, 1);
    barBg.fillRect(70, 220, 130, 20);
    barBg.lineStyle(1, 0xff8800, 0.5);
    barBg.strokeRect(70, 220, 130, 20);
    barBg.setScrollFactor(0).setDepth(1001);
    
    const barFill = this.scene.add.graphics();
    barFill.fillStyle(COLORS.ARM_COLOR, 1);
    barFill.fillRect(72, 222, 126, 16);
    barFill.setScrollFactor(0).setDepth(1002);
    
    const valueText = this.scene.add.text(200, 220, '100%', {
      fontSize: '14px',
      color: '#ff8800',
      fontFamily: 'Microsoft YaHei'
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(1002);
    
    const statusText = this.scene.add.text(70, 245, '状态：待机', {
      fontSize: '12px',
      color: '#aaaaaa',
      fontFamily: 'Microsoft YaHei'
    }).setScrollFactor(0).setDepth(1002);
    
    this.elements.arm = { label, barBg, barFill, valueText, statusText };
  }
  
  createRightPanel() {
    const panel = this.scene.add.graphics();
    panel.fillStyle(0x001122, 0.8);
    panel.fillRect(1070, 70, 200, 200);
    panel.lineStyle(2, 0x00aacc, 0.6);
    panel.strokeRect(1070, 70, 200, 200);
    panel.setScrollFactor(0);
    panel.setDepth(1000);
    
    const title = this.scene.add.text(1170, 80, '任务进度', {
      fontSize: '16px',
      color: '#00ffaa',
      fontFamily: 'Microsoft YaHei'
    }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(1001);
    
    this.elements.rightPanel = panel;
    this.elements.taskTitle = title;
  }
  
  createTaskPanel() {
    this.taskItems = [];
    
    const taskNames = ['清障', '焊接', '接线', '取样', '返航'];
    const taskIcons = ['⛏', '🔧', '⚡', '🧪', '🏠'];
    
    for (let i = 0; i < 5; i++) {
      const y = 115 + i * 32;
      
      const icon = this.scene.add.text(1085, y, taskIcons[i], {
        fontSize: '18px'
      }).setScrollFactor(0).setDepth(1001);
      
      const name = this.scene.add.text(1110, y + 2, taskNames[i], {
        fontSize: '14px',
        color: '#888888',
        fontFamily: 'Microsoft YaHei'
      }).setScrollFactor(0).setDepth(1001);
      
      const status = this.scene.add.text(1255, y + 2, '未完成', {
        fontSize: '12px',
        color: '#ff6666',
        fontFamily: 'Microsoft YaHei'
      }).setOrigin(1, 0).setScrollFactor(0).setDepth(1001);
      
      this.taskItems.push({ icon, name, status, completed: false });
    }
    
    this.elements.taskItems = this.taskItems;
  }
  
  createBottomBar() {
    const bar = this.scene.add.graphics();
    bar.fillStyle(0x000000, 0.6);
    bar.fillRect(0, 680, 1280, 40);
    bar.setScrollFactor(0);
    bar.setDepth(1000);
    
    const controlsText = this.scene.add.text(20, 695, 'WASD移动 | 空格机械臂 | L灯', {
      fontSize: '14px',
      color: '#88aacc',
      fontFamily: 'Microsoft YaHei'
    }).setScrollFactor(0).setDepth(1001);
    
    this.elements.bottomBar = bar;
    this.elements.controlsText = controlsText;
  }
  
  createCompass() {
    const compassBg = this.scene.add.graphics();
    compassBg.fillStyle(0x001122, 0.8);
    compassBg.fillCircle(1170, 550, 50);
    compassBg.lineStyle(2, 0x00aacc, 0.6);
    compassBg.strokeCircle(1170, 550, 50);
    compassBg.setScrollFactor(0).setDepth(1000);
    
    const label = this.scene.add.text(1170, 485, '回船方向', {
      fontSize: '14px',
      color: '#00ffaa',
      fontFamily: 'Microsoft YaHei'
    }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(1001);
    
    const needle = this.scene.add.graphics();
    needle.fillStyle(0x00ff88, 1);
    needle.beginPath();
    needle.moveTo(1170, 515);
    needle.lineTo(1163, 540);
    needle.lineTo(1177, 540);
    needle.closePath();
    needle.fillPath();
    needle.setScrollFactor(0).setDepth(1002);
    
    const center = this.scene.add.graphics();
    center.fillStyle(0x666666, 1);
    center.fillCircle(1170, 550, 8);
    center.setScrollFactor(0).setDepth(1003);
    
    const distanceText = this.scene.add.text(1170, 600, '距离: --m', {
      fontSize: '12px',
      color: '#88ffcc',
      fontFamily: 'Microsoft YaHei'
    }).setOrigin(0.5, 0).setScrollFactor(0).setDepth(1001);
    
    this.elements.compass = { bg: compassBg, needle, center, label, distanceText };
  }
  
  createWarningIndicators() {
    this.dangerIndicators = [];
    
    for (let i = 0; i < 3; i++) {
      const indicator = this.scene.add.graphics();
      indicator.fillStyle(0xff0000, 0.3);
      indicator.fillRect(0, 0, 1280, 720);
      indicator.setScrollFactor(0);
      indicator.setDepth(900);
      indicator.visible = false;
      
      this.dangerIndicators.push({
        type: '',
        active: false,
        sprite: indicator
      });
    }
    
    const dangerText = this.scene.add.text(640, 360, '', {
      fontSize: '28px',
      color: '#ff4444',
      fontFamily: 'Microsoft YaHei',
      fontWeight: 'bold',
      backgroundColor: 'rgba(0,0,0,0.5)',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setScrollFactor(0).setDepth(901);
    dangerText.visible = false;
    
    this.elements.dangerText = dangerText;
  }
  
  update(submarine, tasks, hazards, motherShipPos) {
    this.updateOxygenBar(submarine.oxygen);
    this.updatePowerBar(submarine.power);
    this.updatePressureBar(submarine.pressure);
    this.updateArmBar(submarine.mechanicalArm, submarine.isArmWorking);
    this.updateTaskList(tasks);
    this.updateCompass(submarine, motherShipPos);
    this.updateWarnings(submarine, hazards);
  }
  
  updateOxygenBar(value) {
    const ox = this.elements.oxygen;
    const percent = Math.max(0, Math.min(100, value));
    const width = 126 * (percent / 100);
    
    ox.barFill.clear();
    let color = COLORS.OXYGEN_COLOR;
    if (percent < 30) color = 0xff4444;
    else if (percent < 60) color = 0xffaa00;
    
    ox.barFill.fillStyle(color, 1);
    ox.barFill.fillRect(72, 87, width, 16);
    ox.valueText.setText(`${Math.floor(percent)}%`);
    
    if (percent < 30 && Math.floor(this.scene.time.now / 300) % 2 === 0) {
      ox.valueText.setColor('#ff0000');
    } else {
      ox.valueText.setColor(percent < 30 ? '#ff6666' : '#00ffaa');
    }
  }
  
  updatePowerBar(value) {
    const pw = this.elements.power;
    const percent = Math.max(0, Math.min(100, value));
    const width = 126 * (percent / 100);
    
    pw.barFill.clear();
    let color = COLORS.POWER_COLOR;
    if (percent < 30) color = 0xff4444;
    
    pw.barFill.fillStyle(color, 1);
    pw.barFill.fillRect(72, 132, width, 16);
    pw.valueText.setText(`${Math.floor(percent)}%`);
    
    if (percent < 20 && Math.floor(this.scene.time.now / 300) % 2 === 0) {
      pw.valueText.setColor('#ff0000');
    } else {
      pw.valueText.setColor(percent < 20 ? '#ff6666' : '#ffdd00');
    }
  }
  
  updatePressureBar(value) {
    const pr = this.elements.pressure;
    const percent = Math.max(0, Math.min(100, value));
    const width = 126 * (percent / 100);
    
    pr.barFill.clear();
    let color = COLORS.PRESSURE_COLOR;
    if (percent > 70) color = 0xff0000;
    
    pr.barFill.fillStyle(color, 1);
    pr.barFill.fillRect(72, 177, width, 16);
    pr.valueText.setText(`${Math.floor(percent)}%`);
    
    if (percent > 70 && Math.floor(this.scene.time.now / 200) % 2 === 0) {
      pr.valueText.setColor('#ff0000');
    } else {
      pr.valueText.setColor(percent > 70 ? '#ff4444' : '#ff6666');
    }
  }
  
  updateArmBar(value, isWorking) {
    const arm = this.elements.arm;
    const percent = Math.max(0, Math.min(100, value));
    const width = 126 * (percent / 100);
    
    arm.barFill.clear();
    arm.barFill.fillStyle(COLORS.ARM_COLOR, 1);
    arm.barFill.fillRect(72, 222, width, 16);
    arm.valueText.setText(`${Math.floor(percent)}%`);
    
    if (isWorking) {
      arm.statusText.setText('状态：工作中');
      arm.statusText.setColor('#00ff88');
    } else {
      arm.statusText.setText('状态：待机');
      arm.statusText.setColor('#aaaaaa');
    }
    
    if (percent < 20) {
      arm.valueText.setColor('#ff4444');
    }
  }
  
  updateTaskList(tasks) {
    tasks.forEach((task, index) => {
      if (index < this.taskItems.length) {
        const item = this.taskItems[index];
        
        if (task.completed) {
          item.name.setColor('#00ff88');
          item.status.setText('已完成');
          item.status.setColor('#00ff88');
          item.completed = true;
        } else if (task.active) {
          item.name.setColor('#ffdd00');
          item.status.setText('进行中');
          item.status.setColor('#ffdd00');
        } else {
          item.name.setColor('#888888');
          item.status.setText('未完成');
          item.status.setColor('#ff6666');
        }
      }
    });
    
    const returnTask = this.taskItems[4];
    const allMainTasksDone = tasks.filter(t => t.type !== 'return').every(t => t.completed);
    
    if (allMainTasksDone) {
      returnTask.name.setColor('#00ff88');
      returnTask.status.setText('可返航');
      returnTask.status.setColor('#00ff88');
    }
  }
  
  updateCompass(submarine, motherShipPos) {
    if (!motherShipPos || !this.elements.compass) return;
    
    const dx = motherShipPos.x - submarine.x;
    const dy = motherShipPos.y - submarine.y;
    const angle = Math.atan2(dy, dx);
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    const compass = this.elements.compass;
    compass.needle.rotation = angle + Math.PI / 2;
    
    compass.distanceText.setText(`距离: ${Math.floor(distance)}m`);
    
    if (distance < 150) {
      compass.distanceText.setColor('#00ff88');
    } else if (distance < 500) {
      compass.distanceText.setColor('#ffdd00');
    } else {
      compass.distanceText.setColor('#88ffcc');
    }
  }
  
  updateWarnings(submarine, hazards) {
    let inDanger = false;
    let dangerType = '';
    
    hazards.forEach(hazard => {
      if (hazard.active && hazard.isInside(submarine.x, submarine.y)) {
        inDanger = true;
        if (hazard.type === 'electric') {
          dangerType = '⚡ 漏电危险！';
        } else if (hazard.type === 'debris') {
          dangerType = '⚠ 碎石区域！';
        } else if (hazard.type === 'low_visibility') {
          dangerType = '🌫 低能见度！';
        }
      }
    });
    
    const dangerText = this.elements.dangerText;
    
    if (inDanger && dangerType) {
      dangerText.visible = true;
      dangerText.setText(dangerType);
      dangerText.alpha = 0.5 + Math.sin(this.scene.time.now / 100) * 0.3;
      
      this.dangerIndicators.forEach(indicator => {
        indicator.sprite.visible = true;
        indicator.sprite.alpha = 0.1 + Math.sin(this.scene.time.now / 150) * 0.05;
      });
    } else {
      dangerText.visible = false;
      this.dangerIndicators.forEach(indicator => {
        indicator.sprite.visible = false;
      });
    }
  }
  
  showMessage(text, duration = 2000) {
    if (this.messageText) {
      this.messageText.destroy();
    }
    
    this.messageText = this.scene.add.text(640, 100, text, {
      fontSize: '24px',
      color: '#00ffaa',
      fontFamily: 'Microsoft YaHei',
      backgroundColor: 'rgba(0,0,0,0.7)',
      padding: { x: 20, y: 10 }
    }).setOrigin(0.5).setScrollFactor(0).setDepth(1500);
    
    this.scene.tweens.add({
      targets: this.messageText,
      alpha: 0,
      delay: duration,
      duration: 500,
      onComplete: () => {
        if (this.messageText) {
          this.messageText.destroy();
          this.messageText = null;
        }
      }
    });
  }
}
