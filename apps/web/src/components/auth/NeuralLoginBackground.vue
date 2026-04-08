<template>
  <div class="absolute inset-0 overflow-hidden">
    <div
      ref="mountNode"
      class="h-full w-full scale-105 blur-[4px]"
    />
    <div class="absolute inset-0 bg-slate-950/45" />
    <div class="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_42%)]" />
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import * as THREE from "three";

import { useThemeStore } from "@/stores/theme";

const mountNode = ref<HTMLDivElement | null>(null);
const themeStore = useThemeStore();

const glowFrequency = 0.1;
const neuralFlow = 0.8;
const networkDensity = 262;

let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let animationFrame = 0;
let networkGroup: THREE.Group | null = null;
let checkMaterial: THREE.MeshBasicMaterial | null = null;
const pulses: Array<{
  mesh: THREE.Mesh<THREE.SphereGeometry, THREE.MeshBasicMaterial>;
  start: THREE.Vector3;
  end: THREE.Vector3;
  progress: number;
  speed: number;
}> = [];

const palette = () => ({
  base: new THREE.Color("#020c2c"),
  peak: new THREE.Color("#8af7ff"),
  node: new THREE.Color("#0b3b96"),
  line: new THREE.Color("#06184d"),
});

const buildScene = () => {
  if (!mountNode.value) {
    return;
  }

  scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x000000, 0.001);

  camera = new THREE.PerspectiveCamera(75, mountNode.value.clientWidth / mountNode.value.clientHeight, 0.1, 1000);
  camera.position.z = 30;

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(mountNode.value.clientWidth, mountNode.value.clientHeight);
  mountNode.value.innerHTML = "";
  mountNode.value.appendChild(renderer.domElement);

  networkGroup = new THREE.Group();
  scene.add(networkGroup);

  const shape = new THREE.Shape();
  shape.moveTo(-4, 0);
  shape.lineTo(-1, -3);
  shape.lineTo(5, 4);
  shape.lineTo(3, 5);
  shape.lineTo(-1, 0);
  shape.lineTo(-2, 1);
  shape.lineTo(-4, 0);

  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: 1,
    bevelEnabled: true,
    bevelSegments: 2,
    steps: 2,
    bevelSize: 0.1,
    bevelThickness: 0.1,
  });
  geometry.center();
  checkMaterial = new THREE.MeshBasicMaterial({
    color: palette().base,
    transparent: true,
    opacity: 0.9,
  });
  const checkmark = new THREE.Mesh(geometry, checkMaterial);
  scene.add(checkmark);

  rebuildNetwork();
};

const rebuildNetwork = () => {
  if (!networkGroup) {
    return;
  }

  networkGroup.clear();
  pulses.splice(0, pulses.length);

  const points: number[] = [];
  const linePositions: number[] = [];
  const connections: Array<{ start: THREE.Vector3; end: THREE.Vector3 }> = [];
  const nodeColor = palette().node;
  const lineColor = palette().line;

  for (let index = 0; index < networkDensity; index += 1) {
    points.push((Math.random() - 0.5) * 80, (Math.random() - 0.5) * 60, (Math.random() - 0.5) * 40 - 10);
  }

  for (let left = 0; left < networkDensity; left += 1) {
    for (let right = left + 1; right < networkDensity; right += 1) {
      const dx = points[left * 3] - points[right * 3];
      const dy = points[left * 3 + 1] - points[right * 3 + 1];
      const dz = points[left * 3 + 2] - points[right * 3 + 2];
      const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (distance < 12) {
        linePositions.push(
          points[left * 3],
          points[left * 3 + 1],
          points[left * 3 + 2],
          points[right * 3],
          points[right * 3 + 1],
          points[right * 3 + 2],
        );
        connections.push({
          start: new THREE.Vector3(points[left * 3], points[left * 3 + 1], points[left * 3 + 2]),
          end: new THREE.Vector3(points[right * 3], points[right * 3 + 1], points[right * 3 + 2]),
        });
      }
    }
  }

  const pointGeometry = new THREE.BufferGeometry();
  pointGeometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
  const pointMaterial = new THREE.PointsMaterial({
    color: nodeColor,
    size: 0.45,
    transparent: true,
    blending: THREE.AdditiveBlending,
  });
  networkGroup.add(new THREE.Points(pointGeometry, pointMaterial));

  const lineGeometry = new THREE.BufferGeometry();
  lineGeometry.setAttribute("position", new THREE.Float32BufferAttribute(linePositions, 3));
  const lineMaterial = new THREE.LineBasicMaterial({
    color: lineColor,
    transparent: true,
    opacity: 0.32,
    blending: THREE.AdditiveBlending,
  });
  networkGroup.add(new THREE.LineSegments(lineGeometry, lineMaterial));

  const pulseMaterial = new THREE.MeshBasicMaterial({ color: palette().peak });
  const pulseGeometry = new THREE.SphereGeometry(0.22, 8, 8);
  for (let index = 0; index < connections.length; index += 6) {
    const pulseMesh = new THREE.Mesh(pulseGeometry, pulseMaterial.clone());
    networkGroup.add(pulseMesh);
    pulses.push({
      mesh: pulseMesh,
      start: connections[index].start,
      end: connections[index].end,
      progress: Math.random(),
      speed: 0.004 + Math.random() * 0.008,
    });
  }
};

const animate = () => {
  if (!renderer || !scene || !camera || !networkGroup || !checkMaterial) {
    return;
  }

  const time = performance.now() * 0.001;
  const colors = palette();
  const intensity = (Math.sin(time * glowFrequency * 2) + 1) / 2;
  checkMaterial.color.copy(colors.base).lerp(colors.peak, intensity);

  pulses.forEach((pulse) => {
    pulse.mesh.material.color.copy(colors.peak);
    pulse.progress += pulse.speed * neuralFlow;
    if (pulse.progress >= 1) {
      pulse.progress = 0;
    }
    pulse.mesh.position.copy(pulse.start).lerp(pulse.end, pulse.progress);
  });

  networkGroup.rotation.y = Math.sin(time * 0.1) * 0.1;
  networkGroup.rotation.x = Math.cos(time * 0.1) * 0.05;
  renderer.render(scene, camera);
  animationFrame = window.requestAnimationFrame(animate);
};

const handleResize = () => {
  if (!renderer || !camera || !mountNode.value) {
    return;
  }
  camera.aspect = mountNode.value.clientWidth / mountNode.value.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(mountNode.value.clientWidth, mountNode.value.clientHeight);
};

const teardown = () => {
  window.cancelAnimationFrame(animationFrame);
  window.removeEventListener("resize", handleResize);
  renderer?.dispose();
  renderer = null;
  scene = null;
  camera = null;
  networkGroup = null;
  checkMaterial = null;
};

onMounted(() => {
  buildScene();
  animate();
  window.addEventListener("resize", handleResize);
});

watch(
  () => themeStore.currentTheme,
  () => {
    if (scene) {
      buildScene();
    }
  },
);

onBeforeUnmount(() => {
  teardown();
});
</script>
