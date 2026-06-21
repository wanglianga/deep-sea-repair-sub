export const GAME_CONFIG = {
  WORLD_WIDTH: 3200,
  WORLD_HEIGHT: 2400,
  SUBMARINE_SPEED: 180,
  SUBMARINE_ACCELERATION: 300,
  SUBMARINE_DRAG: 0.92,
  
  OXYGEN_MAX: 100,
  OXYGEN_DRAIN_RATE: 0.15,
  
  POWER_MAX: 100,
  POWER_DRAIN_RATE: 0.08,
  LIGHT_POWER_DRAIN: 0.05,
  ARM_POWER_DRAIN: 0.1,
  
  PRESSURE_MAX: 100,
  PRESSURE_RATE: 0.03,
  PRESSURE_DEPTH_FACTOR: 0.02,
  
  MECHANICAL_ARM_MAX: 100,
  ARM_USE_RATE: 0.3,
  
  LIGHT_RANGE_MAX: 250,
  LIGHT_RANGE_MIN: 80,
  
  CURRENT_STRENGTH_MULTIPLIER: 2.5,
  CURRENT_POWER_SAVE_RATIO: 0.6,
  
  ANCHOR_GRAB_RANGE: 70,
  ANCHOR_STABILIZATION_RATIO: 0.85,
  ANCHOR_ARM_DRAIN_RATE: 0.15,
  ANCHOR_RETURN_RISK_INCREASE: 0.05,
  
  TASK_TYPES: {
    CLEAR_OBSTACLE: 'clear_obstacle',
    WELD: 'weld',
    WIRE: 'wire',
    SAMPLE: 'sample',
    PIPE_REPAIR: 'pipe_repair',
    TOWER_REPAIR: 'tower_repair'
  },
  
  PIPE_REPAIR_STEPS: [
    { id: 'clean', name: '清理碎屑', icon: '🧹' },
    { id: 'align', name: '对准焊点', icon: '🎯' },
    { id: 'pressure', name: '压力检测', icon: '📊' }
  ],
  
  TOWER_REPAIR_STEPS: [
    { id: 'rewire', name: '重接线路', icon: '🔌' },
    { id: 'calibrate', name: '校准频率', icon: '📡' }
  ],
  
  DANGER_TYPES: {
    DEBRIS: 'debris',
    ELECTRIC: 'electric',
    LOW_VISIBILITY: 'low_visibility'
  }
};

export const COLORS = {
  OCEAN_DEEP: 0x001122,
  OCEAN_MID: 0x002244,
  OCEAN_LIGHT: 0x004466,
  SUBMARINE_BODY: 0x4488cc,
  SUBMARINE_ACCENT: 0x66aaff,
  OXYGEN_COLOR: 0x00ffaa,
  POWER_COLOR: 0xffdd00,
  PRESSURE_COLOR: 0xff4444,
  ARM_COLOR: 0xff8800,
  TASK_COLOR: 0x00ff88,
  DANGER_COLOR: 0xff0000,
  LIGHT_COLOR: 0xffffcc,
  PIPE_COLOR: 0x556677,
  PIPE_RUST: 0x885533,
  TOWER_COLOR: 0x667788,
  MOTHERSHIP_COLOR: 0x8899aa,
  WRECK_COLOR: 0x775544
};
