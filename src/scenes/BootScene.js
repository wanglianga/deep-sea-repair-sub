import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    this.loadingText = this.add.text(640, 360, '正在加载资源...', {
      fontSize: '32px',
      color: '#00ffaa',
      fontFamily: 'Microsoft YaHei'
    }).setOrigin(0.5);

    this.progressBar = this.add.graphics();
    this.progressBox = this.add.graphics();
    this.progressBox.fillStyle(0x224466, 0.8);
    this.progressBox.fillRect(440, 400, 400, 30);

    this.load.on('progress', (value) => {
      this.progressBar.clear();
      this.progressBar.fillStyle(0x00ffaa, 1);
      this.progressBar.fillRect(445, 405, 390 * value, 20);
    });

    this.load.on('complete', () => {
      this.progressBar.destroy();
      this.progressBox.destroy();
      this.loadingText.destroy();
    });
  }

  create() {
    this.add.text(640, 280, '深海维修潜航', {
      fontSize: '64px',
      color: '#00ffaa',
      fontFamily: 'Microsoft YaHei',
      fontWeight: 'bold'
    }).setOrigin(0.5);

    this.add.text(640, 360, 'Deep Sea Repair Submarine', {
      fontSize: '24px',
      color: '#66aaff',
      fontFamily: 'Arial'
    }).setOrigin(0.5);

    this.add.text(640, 450, '操作说明：', {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'Microsoft YaHei'
    }).setOrigin(0.5);

    this.add.text(640, 490, 'WASD / 方向键 - 移动潜航器', {
      fontSize: '18px',
      color: '#aaddff',
      fontFamily: 'Microsoft YaHei'
    }).setOrigin(0.5);

    this.add.text(640, 520, '空格键 - 使用机械臂 / 执行任务', {
      fontSize: '18px',
      color: '#aaddff',
      fontFamily: 'Microsoft YaHei'
    }).setOrigin(0.5);

    this.add.text(640, 550, 'L 键 - 开关照明灯', {
      fontSize: '18px',
      color: '#aaddff',
      fontFamily: 'Microsoft YaHei'
    }).setOrigin(0.5);

    const startText = this.add.text(640, 620, '点击开始游戏', {
      fontSize: '28px',
      color: '#00ffaa',
      fontFamily: 'Microsoft YaHei'
    }).setOrigin(0.5).setInteractive();

    startText.on('pointerdown', () => {
      this.scene.start('GameScene');
    });

    this.tweens.add({
      targets: startText,
      alpha: 0.5,
      duration: 1000,
      yoyo: true,
      repeat: -1
    });
  }
}
