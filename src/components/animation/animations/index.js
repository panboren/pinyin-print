/**
 * 动画模块导出文件
 * 统一导出所有动画函数
 */

import animateEpicDive from './epic-dive'
import animateDimensionFold from './dimension-fold'
import animateEnergyWave from './energy-wave'
import animateDizzyCam from './dizzy-cam'
import animateHyperspace from './hyperspace'
import animateTimeRift from './time-rift'
import animatePlanetExplosion from './planet-explosion'
import animateQuantumEntanglement from './quantum-entanglement'
import animateVirtualReality from './virtual-reality'
import animateSceneRoaming from './scene-roaming'
import animateOrbitalRotation from './orbital-rotation'
import animateDimensionalPortal from './dimensional-portal'
import animateTimeTravel from './time-travel'
import animateBlackHole from './black-hole'
import animateCosmicBigBang from './cosmic-big-bang'
import animateDimensionCollapse from './dimension-collapse'
import animateTimeRewind from './time-rewind'
import animateSpaceWarp from './space-warp'
import animateMatrixHack from './matrix-hack'
import animateQuantumShift from './quantum-shift'
import { ANIMATION_CONFIG } from './utils'

/**
 * 动画函数映射表
 * 将动画类型字符串映射到对应的动画函数
 */
export const animations = {
  [ANIMATION_CONFIG.EPIC_DIVE]: animateEpicDive,
  [ANIMATION_CONFIG.SPACE_WARP]: animateSpaceWarp,
  [ANIMATION_CONFIG.MATRIX_HACK]: animateMatrixHack,
  [ANIMATION_CONFIG.QUANTUM_SHIFT]: animateQuantumShift,
  [ANIMATION_CONFIG.DIMENSION_FOLD]: animateDimensionFold,
  [ANIMATION_CONFIG.ENERGY_WAVE]: animateEnergyWave,
  [ANIMATION_CONFIG.DIZZY_CAM]: animateDizzyCam,
  [ANIMATION_CONFIG.HYPERSPACE]: animateHyperspace,
  [ANIMATION_CONFIG.TIME_RIFT]: animateTimeRift,
  [ANIMATION_CONFIG.PLANET_EXPLOSION]: animatePlanetExplosion,
  [ANIMATION_CONFIG.QUANTUM_ENTANGLEMENT]: animateQuantumEntanglement,
  [ANIMATION_CONFIG.VIRTUAL_REALITY]: animateVirtualReality,
  [ANIMATION_CONFIG.SCENE_ROAMING]: animateSceneRoaming,
  [ANIMATION_CONFIG.ORBITAL_ROTATION]: animateOrbitalRotation,
  [ANIMATION_CONFIG.DIMENSIONAL_PORTAL]: animateDimensionalPortal,
  [ANIMATION_CONFIG.TIME_TRAVEL]: animateTimeTravel,
  [ANIMATION_CONFIG.BLACK_HOLE]: animateBlackHole,
  [ANIMATION_CONFIG.COSMIC_BIG_BANG]: animateCosmicBigBang,
  [ANIMATION_CONFIG.DIMENSION_COLLAPSE]: animateDimensionCollapse,
  [ANIMATION_CONFIG.TIME_REWIND]: animateTimeRewind
}

/**
 * 获取所有可用的动画类型
 */
export const getAnimationTypes = () => Object.keys(animations)

/**
 * 默认导出
 */
export default animations
