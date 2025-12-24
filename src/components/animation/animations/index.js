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
// 新增特效动画
import animateParticleExplosion from './particle-explosion'
import animateParticleExplosion1 from './particle-explosion1'
import animateGlitchEffect from './glitch-effect'
import animateFireStorm from './fire-storm'
import animateTunnelEffect from './tunnel-effect'
import animateCrystalShards from './crystal-shards'
import animateLightningChain from './lightning-chain'

import { ANIMATION_CONFIG } from './utils'
import animateCherryBlossom from '@components/animation/animations/cherry-blossom'
import animateButterflySwarm from '@components/animation/animations/butterfly-swarm'
import animateOceanAurora from '@components/animation/animations/ocean-aurora'
import animateGalaxyVortex from '@components/animation/animations/galaxy-vortex'
import animateAuroraFluid from '@components/animation/animations/aurora-fluid'

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
  [ANIMATION_CONFIG.TIME_REWIND]: animateTimeRewind,
  // 新增特效动画
  'particle-explosion': animateParticleExplosion,
  'particle-explosion1': animateParticleExplosion1,
  'glitch-effect': animateGlitchEffect,
  'fire-storm': animateFireStorm,
  'tunnel-effect': animateTunnelEffect,
  'crystal-shards': animateCrystalShards,
  'lightning-chain': animateLightningChain,
  'cherry-blossom': animateCherryBlossom,
  'butterfly-swarm': animateButterflySwarm,
  'ocean-aurora': animateOceanAurora,
  'galaxy-vortex': animateGalaxyVortex,
  'aurora-fluid': animateAuroraFluid
}

/**
 * 获取所有可用的动画类型
 */
export const getAnimationTypes = () => Object.keys(animations)

/**
 * 默认导出
 */
export default animations
