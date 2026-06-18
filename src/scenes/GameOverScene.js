import Phaser from 'phaser';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  init(data) {
    this.reason = data.reason || '任务失败';
  }

  create() {
    this.add.rectangle(640, 360, 800, 500, 0x000000, 0.8).setOrigin(0.5);

    this.add.text(640, 220, '任务失败', {
      fontSize: '56px',
      color: '#ff4444',
      fontFamily: 'Microsoft YaHei',
      fontWeight: 'bold'
    }).setOrigin(0.5);

    this.add.text(640, 300, this.reason, {
      fontSize: '24px',
      color: '#ff8888',
      fontFamily: 'Microsoft YaHei'
    }).setOrigin(0.5);

    this.add.text(640, 400, '深海危机四伏，请谨慎操作！', {
      fontSize: '20px',
      color: '#aaaaaa',
      fontFamily: 'Microsoft YaHei'
    }).setOrigin(0.5);

    const retryText = this.add.text(640, 500, '重新开始', {
      fontSize: '32px',
      color: '#00ffaa',
      fontFamily: 'Microsoft YaHei'
    }).setOrigin(0.5).setInteractive();

    retryText.on('pointerdown', () => {
      this.scene.start('GameScene');
    });

    this.tweens.add({
      targets: retryText,
      scale: 1.1,
      duration: 800,
      yoyo: true,
      repeat: -1
    });
  }
}
