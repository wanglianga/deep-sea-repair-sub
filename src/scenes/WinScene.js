import Phaser from 'phaser';

export class WinScene extends Phaser.Scene {
  constructor() {
    super({ key: 'WinScene' });
  }

  init(data) {
    this.score = data.score || 0;
    this.tasksCompleted = data.tasksCompleted || 0;
  }

  create() {
    this.add.rectangle(640, 360, 800, 550, 0x000000, 0.8).setOrigin(0.5);

    this.add.text(640, 180, '任务完成！', {
      fontSize: '56px',
      color: '#00ff88',
      fontFamily: 'Microsoft YaHei',
      fontWeight: 'bold'
    }).setOrigin(0.5);

    this.add.text(640, 260, '所有维修任务已成功完成', {
      fontSize: '24px',
      color: '#88ffcc',
      fontFamily: 'Microsoft YaHei'
    }).setOrigin(0.5);

    this.add.text(640, 340, `完成任务数：${this.tasksCompleted} / 5`, {
      fontSize: '22px',
      color: '#ffffff',
      fontFamily: 'Microsoft YaHei'
    }).setOrigin(0.5);

    this.add.text(640, 380, `剩余氧气：${Math.floor(this.score.oxygen)}%`, {
      fontSize: '20px',
      color: '#00ffaa',
      fontFamily: 'Microsoft YaHei'
    }).setOrigin(0.5);

    this.add.text(640, 410, `剩余电量：${Math.floor(this.score.power)}%`, {
      fontSize: '20px',
      color: '#ffdd00',
      fontFamily: 'Microsoft YaHei'
    }).setOrigin(0.5);

    this.add.text(640, 440, `机械臂耐久：${Math.floor(this.score.arm)}%`, {
      fontSize: '20px',
      color: '#ff8800',
      fontFamily: 'Microsoft YaHei'
    }).setOrigin(0.5);

    const replayText = this.add.text(640, 520, '再玩一次', {
      fontSize: '32px',
      color: '#00ffaa',
      fontFamily: 'Microsoft YaHei'
    }).setOrigin(0.5).setInteractive();

    replayText.on('pointerdown', () => {
      this.scene.start('GameScene');
    });

    this.tweens.add({
      targets: replayText,
      scale: 1.1,
      duration: 800,
      yoyo: true,
      repeat: -1
    });

    for (let i = 0; i < 30; i++) {
      this.time.delayedCall(i * 100, () => {
        const bubble = this.add.circle(
          Phaser.Math.Between(200, 1080),
          700,
          Phaser.Math.Between(5, 15),
          0x88ffcc,
          0.3
        );
        this.tweens.add({
          targets: bubble,
          y: -50,
          alpha: 0,
          duration: Phaser.Math.Between(2000, 4000),
          onComplete: () => bubble.destroy()
        });
      });
    }
  }
}
