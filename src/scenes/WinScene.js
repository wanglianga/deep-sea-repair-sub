import Phaser from 'phaser';

export class WinScene extends Phaser.Scene {
  constructor() {
    super({ key: 'WinScene' });
  }

  init(data) {
    this.score = data.score || { oxygen: 100, power: 100, arm: 100 };
    this.tasksCompleted = data.tasksCompleted || 0;
    this.totalTasks = data.totalTasks || 4;
    this.taskDetails = data.taskDetails || [];
    this.returnPenalty = data.returnPenalty || 0;
    this.hasSecondaryFailure = data.hasSecondaryFailure || false;
    this.anchorReturnRisk = data.anchorReturnRisk || 0;
  }

  create() {
    this.add.rectangle(640, 360, 900, 620, 0x000000, 0.85).setOrigin(0.5);

    if (this.hasSecondaryFailure) {
      this.add.text(640, 100, '⚠ 返航途中发生二次故障 ⚠', {
        fontSize: '28px',
        color: '#ff6644',
        fontFamily: 'Microsoft YaHei',
        fontWeight: 'bold'
      }).setOrigin(0.5);
      
      this.add.text(640, 140, '部分维修质量不达标，返航时出现异常', {
        fontSize: '16px',
        color: '#ffaa88',
        fontFamily: 'Microsoft YaHei'
      }).setOrigin(0.5);
    } else {
      this.add.text(640, 120, '任务完成！', {
        fontSize: '52px',
        color: '#00ff88',
        fontFamily: 'Microsoft YaHei',
        fontWeight: 'bold'
      }).setOrigin(0.5);

      this.add.text(640, 175, '所有维修任务已成功完成', {
        fontSize: '22px',
        color: '#88ffcc',
        fontFamily: 'Microsoft YaHei'
      }).setOrigin(0.5);
    }

    const startY = this.hasSecondaryFailure ? 180 : 210;
    
    this.add.text(640, startY, `完成任务数：${this.tasksCompleted} / ${this.totalTasks}`, {
      fontSize: '20px',
      color: '#ffffff',
      fontFamily: 'Microsoft YaHei'
    }).setOrigin(0.5);

    this.add.text(640, startY + 35, `剩余氧气：${Math.floor(this.score.oxygen)}%`, {
      fontSize: '18px',
      color: '#00ffaa',
      fontFamily: 'Microsoft YaHei'
    }).setOrigin(0.5);

    this.add.text(640, startY + 60, `剩余电量：${Math.floor(this.score.power)}%`, {
      fontSize: '18px',
      color: '#ffdd00',
      fontFamily: 'Microsoft YaHei'
    }).setOrigin(0.5);

    this.add.text(640, startY + 85, `机械臂耐久：${Math.floor(this.score.arm)}%`, {
      fontSize: '18px',
      color: '#ff8800',
      fontFamily: 'Microsoft YaHei'
    }).setOrigin(0.5);

    if (this.taskDetails.length > 0) {
      this.add.text(200, startY + 125, '任务详情：', {
        fontSize: '16px',
        color: '#88ffcc',
        fontFamily: 'Microsoft YaHei',
        fontWeight: 'bold'
      }).setOrigin(0, 0.5);
      
      this.taskDetails.forEach((task, index) => {
        const y = startY + 155 + index * 30;
        const statusIcon = task.completed ? '✓' : '✗';
        const statusColor = task.completed ? '#00ff88' : '#ff6666';
        
        let detailText = `${statusIcon} ${task.name}`;
        
        if (task.isMultiStep && task.completed) {
          detailText += `  [${task.stepsCompleted}/${task.totalSteps}步骤]`;
        }
        
        if (task.hasSecondaryRisk) {
          detailText += `  ⚠质量:${task.quality}%`;
        }
        
        this.add.text(220, y, detailText, {
          fontSize: '14px',
          color: task.hasSecondaryRisk ? '#ffaa00' : statusColor,
          fontFamily: 'Microsoft YaHei'
        }).setOrigin(0, 0.5);
      });
    }

    const qualityScore = this.calculateQualityScore();
    const grade = this.getGrade(qualityScore);
    
    this.add.text(900, startY + 135, `综合评分：`, {
      fontSize: '16px',
      color: '#88ffcc',
      fontFamily: 'Microsoft YaHei',
      fontWeight: 'bold'
    }).setOrigin(1, 0.5);
    
    this.add.text(900, startY + 165, `${grade}`, {
      fontSize: '48px',
      color: this.getGradeColor(grade),
      fontFamily: 'Microsoft YaHei',
      fontWeight: 'bold'
    }).setOrigin(1, 0.5);
    
    this.add.text(900, startY + 210, `${qualityScore}分`, {
      fontSize: '18px',
      color: '#ffffff',
      fontFamily: 'Microsoft YaHei'
    }).setOrigin(1, 0.5);

    if (this.anchorReturnRisk > 0.01) {
      this.add.text(900, startY + 245, `锚点使用风险：+${Math.floor(this.anchorReturnRisk * 100)}%`, {
        fontSize: '12px',
        color: '#ffaa00',
        fontFamily: 'Microsoft YaHei'
      }).setOrigin(1, 0.5);
    }

    const replayText = this.add.text(640, 560, '再玩一次', {
      fontSize: '28px',
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
          this.hasSecondaryFailure ? 0xffaa66 : 0x88ffcc,
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
  
  calculateQualityScore() {
    let totalQuality = 0;
    let taskCount = 0;
    
    this.taskDetails.forEach(task => {
      if (task.completed) {
        totalQuality += task.quality || 100;
        taskCount++;
      }
    });
    
    if (taskCount === 0) return 0;
    
    let avgQuality = totalQuality / taskCount;
    
    avgQuality -= this.returnPenalty * 50;
    avgQuality -= this.anchorReturnRisk * 30;
    
    const resourceBonus = (this.score.oxygen + this.score.power + this.score.arm) / 30;
    avgQuality += resourceBonus * 0.3;
    
    return Math.max(0, Math.min(100, Math.floor(avgQuality)));
  }
  
  getGrade(score) {
    if (score >= 90) return 'S';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 40) return 'D';
    return 'F';
  }
  
  getGradeColor(grade) {
    const colors = {
      'S': '#ffdd00',
      'A': '#00ff88',
      'B': '#00aaff',
      'C': '#88ffaa',
      'D': '#ffaa00',
      'F': '#ff4444'
    };
    return colors[grade] || '#ffffff';
  }
}
