'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { RectAreaLightUniformsLib } from 'three/examples/jsm/lights/RectAreaLightUniformsLib.js';

if (typeof window !== 'undefined') {
  RectAreaLightUniformsLib.init();
}

const LOOP_DISTANCE = 80;
const WALK_SPEED = 6;

const useFabricTexture = (palette: { base: string; mid: string; highlight: string; weave: string }) => {
  const { gl } = useThree();

  return useMemo(() => {
    if (typeof document === 'undefined') {
      return new THREE.Texture();
    }

    const canvas = document.createElement('canvas');
    canvas.width = 2048;
    canvas.height = 2048;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return new THREE.Texture();
    }

    const gradient = ctx.createLinearGradient(0, 0, 2048, 2048);
    gradient.addColorStop(0, palette.base);
    gradient.addColorStop(0.45, palette.mid);
    gradient.addColorStop(0.55, palette.mid);
    gradient.addColorStop(1, palette.highlight);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 2048, 2048);

    const imageData = ctx.getImageData(0, 0, 2048, 2048);
    const data = imageData.data;
    for (let y = 0; y < 2048; y += 1) {
      for (let x = 0; x < 2048; x++) {
        const idx = (y * 2048 + x) * 4;
        const weaveNoise = (Math.sin(x * 0.03) + Math.cos(y * 0.05)) * 5;
        data[idx] = Math.min(255, data[idx] + weaveNoise);
        data[idx + 1] = Math.min(255, data[idx + 1] + weaveNoise * 0.6);
        data[idx + 2] = Math.min(255, data[idx + 2] + weaveNoise * 0.35);
      }
    }
    ctx.putImageData(imageData, 0, 0);

    ctx.fillStyle = `${palette.weave}24`;
    for (let i = 0; i < 3200; i++) {
      const x = (i * 53) % 2048;
      const y = (i * 97) % 2048;
      ctx.fillRect(x, y, 1, 8);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1.6, 1.9);
    texture.anisotropy = gl.capabilities.getMaxAnisotropy();
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.needsUpdate = true;

    return texture;
  }, [gl, palette.base, palette.highlight, palette.mid, palette.weave]);
};

const StudioLights = () => {
  const sweepingKeyLight = useRef<THREE.SpotLight>(null);
  const rimLight = useRef<THREE.RectAreaLight>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (sweepingKeyLight.current) {
      sweepingKeyLight.current.position.x = Math.sin(t * 0.4) * 12;
      sweepingKeyLight.current.target.position.set(0, 2.5, -10 + Math.cos(t * 0.4) * 12);
      sweepingKeyLight.current.target.updateMatrixWorld();
    }

    if (rimLight.current) {
      rimLight.current.position.set(0, 9, -22);
      rimLight.current.lookAt(0, 3, 0);
      rimLight.current.rotation.y = Math.PI + Math.sin(t * 0.2) * 0.02;
    }
  });

  return (
    <>
      <ambientLight intensity={0.42} />
      <hemisphereLight args={['#4f5b86', '#0f0f14', 0.6]} position={[0, 10, 0]} />
      <spotLight
        ref={sweepingKeyLight}
        color="#f5f5f0"
        intensity={6}
        angle={Math.PI / 6}
        penumbra={0.6}
        position={[10, 14, 16]}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
      />
      <rectAreaLight ref={rimLight} color="#9bb7ff" intensity={80} width={18} height={6} />
      <spotLight
        color="#ffe9d6"
        intensity={3.5}
        angle={Math.PI / 7}
        penumbra={0.7}
        position={[-8, 10, -12]}
        castShadow
      />
      <pointLight color="#89a7ff" intensity={2} position={[5, 5, 18]} />
      <pointLight color="#ff9b70" intensity={2} position={[-5, 5, 18]} />
    </>
  );
};

const Runway = () => {
  const runwayMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#15161b',
        metalness: 0.55,
        roughness: 0.2,
        envMapIntensity: 1.4,
      }),
    []
  );

  const stageMaterial = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: '#0d0e12',
        metalness: 0.3,
        roughness: 0.7,
      }),
    []
  );

  return (
    <group>
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[14, 160, 64, 64]} />
        <primitive attach="material" object={runwayMaterial} />
      </mesh>

      <mesh position={[0, -0.4, 0]} receiveShadow>
        <boxGeometry args={[20, 0.5, 160]} />
        <primitive attach="material" object={stageMaterial} />
      </mesh>

      <mesh position={[0, 6, -40]} receiveShadow>
        <planeGeometry args={[18, 10]} />
        <meshStandardMaterial color="#14141c" emissive="#050a1a" emissiveIntensity={0.6} roughness={0.9} />
      </mesh>

      <group>
        {[-1, 1].map((side) => (
          <mesh key={side} position={[side * 7.5, 2.5, 0]} rotation={[0, side * 0.03, 0]} receiveShadow>
            <boxGeometry args={[1.2, 5, 160]} />
            <meshStandardMaterial color="#090a10" metalness={0.2} roughness={0.8} />
          </mesh>
        ))}
      </group>
      <mesh position={[0, 3.4, -48]} rotation={[0, 0, 0]}>
        <ringGeometry args={[6, 5.4, 64]} />
        <meshBasicMaterial color="#5162ff" transparent opacity={0.15} />
      </mesh>
    </group>
  );
};

const createLatheProfile = () => {
  const points: THREE.Vector2[] = [];
  points.push(new THREE.Vector2(0.0, -1.8));
  points.push(new THREE.Vector2(0.55, -1.8));
  points.push(new THREE.Vector2(0.7, -1.4));
  points.push(new THREE.Vector2(0.78, -1.0));
  points.push(new THREE.Vector2(0.8, -0.4));
  points.push(new THREE.Vector2(0.78, 0.1));
  points.push(new THREE.Vector2(0.75, 0.7));
  points.push(new THREE.Vector2(0.68, 1.25));
  points.push(new THREE.Vector2(0.55, 1.65));
  points.push(new THREE.Vector2(0.32, 1.95));
  points.push(new THREE.Vector2(0.15, 2.05));
  return points;
};

const Jacket = ({ material }: { material: THREE.MeshStandardMaterial }) => {
  const torsoGeometry = useMemo(() => new THREE.LatheGeometry(createLatheProfile(), 160), []);
  const hoodGeometry = useMemo(() => new THREE.SphereGeometry(0.9, 96, 64, 0, Math.PI * 2, 0, Math.PI / 1.3), []);
  const zipperStripGeometry = useMemo(() => new THREE.BoxGeometry(0.05, 3.4, 0.06), []);
  const pocketFlapGeometry = useMemo(() => new THREE.BoxGeometry(0.7, 0.18, 0.05), []);

  return (
    <group>
      <mesh geometry={torsoGeometry} position={[0, 2.2, 0]} castShadow receiveShadow>
        <primitive attach="material" object={material} />
      </mesh>
      <mesh geometry={hoodGeometry} position={[0, 3.4, 0]} castShadow receiveShadow>
        <primitive attach="material" object={material} />
      </mesh>
      <mesh geometry={zipperStripGeometry} position={[0, 2.2, 0.76]} castShadow>
        <meshStandardMaterial color="#d9e1f2" metalness={0.9} roughness={0.1} />
      </mesh>
      {[-0.6, 0.6].map((x) => (
        <mesh key={x} geometry={pocketFlapGeometry} position={[x, 1.6, 0.7]} castShadow>
          <meshStandardMaterial color="#172330" roughness={0.5} metalness={0.2} />
        </mesh>
      ))}
    </group>
  );
};

const Sleeve = ({ material, side }: { material: THREE.MeshStandardMaterial; side: 1 | -1 }) => {
  const sleeveGeometry = useMemo(() => new THREE.CylinderGeometry(0.43, 0.52, 2.2, 88, 32, true), []);
  const cuffGeometry = useMemo(() => new THREE.TorusGeometry(0.43, 0.05, 32, 64), []);

  return (
    <group position={[side * 0.95, 2.3, 0]} rotation={[0, 0, side * -0.12]}>
      <mesh geometry={sleeveGeometry} rotation={[Math.PI / 2, 0, 0]} castShadow receiveShadow>
        <primitive attach="material" object={material} />
      </mesh>
      <mesh geometry={cuffGeometry} position={[0, -1.1, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <meshStandardMaterial color="#0f1826" metalness={0.2} roughness={0.5} />
      </mesh>
    </group>
  );
};

const PantLeg = ({ material, side }: { material: THREE.MeshStandardMaterial; side: 1 | -1 }) => {
  const upperLeg = useMemo(() => new THREE.CylinderGeometry(0.42, 0.5, 1.6, 88, 32, true), []);
  const lowerLeg = useMemo(() => new THREE.CylinderGeometry(0.35, 0.4, 1.4, 88, 32, true), []);
  const bootGeometry = useMemo(() => {
    const shape = new THREE.Shape([
      new THREE.Vector2(-0.38, -0.22),
      new THREE.Vector2(0.52, -0.22),
      new THREE.Vector2(0.66, 0.12),
      new THREE.Vector2(0.4, 0.32),
      new THREE.Vector2(-0.28, 0.32),
    ]);
    return new THREE.ExtrudeGeometry(shape, {
      steps: 4,
      depth: 0.58,
      bevelEnabled: true,
      bevelThickness: 0.1,
      bevelSize: 0.07,
      bevelSegments: 6,
    });
  }, []);

  return (
    <group position={[side * 0.45, 0.8, 0]} rotation={[0, 0, side * 0.03]}>
      <mesh geometry={upperLeg} position={[0, 0.6, 0]} castShadow receiveShadow>
        <primitive attach="material" object={material} />
      </mesh>
      <mesh geometry={lowerLeg} position={[0, -0.25, 0.06]} rotation={[0.12, 0, 0]} castShadow receiveShadow>
        <primitive attach="material" object={material} />
      </mesh>
      <mesh
        geometry={bootGeometry}
        position={[side * 0.02, -1.35, 0.02]}
        rotation={[0, side === 1 ? Math.PI : 0, 0]}
        castShadow
        receiveShadow
      >
        <meshStandardMaterial color="#20242f" metalness={0.2} roughness={0.6} />
      </mesh>
    </group>
  );
};

const GarmentFigure = ({
  jacketMaterial,
  pantMaterial,
}: {
  jacketMaterial: THREE.MeshStandardMaterial;
  pantMaterial: THREE.MeshStandardMaterial;
}) => {
  const root = useRef<THREE.Group>(null);
  const leftArm = useRef<THREE.Group>(null);
  const rightArm = useRef<THREE.Group>(null);
  const leftLeg = useRef<THREE.Group>(null);
  const rightLeg = useRef<THREE.Group>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (!root.current) return;

    const loopTime = LOOP_DISTANCE / WALK_SPEED;
    const phase = (t % loopTime) / loopTime;
    const startZ = 40;
    const endZ = -40;
    const currentZ = startZ + (endZ - startZ) * phase;
    root.current.position.set(0, 1.4 + Math.sin(t * 2.2) * 0.08, currentZ);
    root.current.rotation.y = Math.PI + Math.sin(phase * Math.PI * 2) * 0.08;

    const armSwing = Math.sin(t * 2.8) * 0.45;
    const legSwing = Math.sin(t * 2.8 + Math.PI / 2) * 0.38;

    if (leftArm.current && rightArm.current && leftLeg.current && rightLeg.current) {
      leftArm.current.rotation.x = armSwing;
      rightArm.current.rotation.x = -armSwing;

      leftLeg.current.rotation.x = legSwing;
      rightLeg.current.rotation.x = -legSwing;

      leftLeg.current.position.z = Math.cos(t * 2.8 + Math.PI / 2) * 0.12;
      rightLeg.current.position.z = Math.cos(t * 2.8) * 0.12;
    }
  });

  const collarGeometry = useMemo(() => new THREE.TorusGeometry(0.6, 0.08, 48, 96), []);
  const faceGeometry = useMemo(() => new THREE.SphereGeometry(0.32, 64, 64), []);
  const visorGeometry = useMemo(() => new THREE.CylinderGeometry(0.34, 0.34, 0.06, 48, 1, true), []);
  const beltGeometry = useMemo(() => new THREE.TorusGeometry(0.58, 0.04, 32, 96), []);

  return (
    <group ref={root}>
      <group ref={leftArm}>
        <Sleeve material={jacketMaterial} side={1} />
      </group>
      <group ref={rightArm}>
        <Sleeve material={jacketMaterial} side={-1} />
      </group>
      <group ref={leftLeg}>
        <PantLeg material={pantMaterial} side={1} />
      </group>
      <group ref={rightLeg}>
        <PantLeg material={pantMaterial} side={-1} />
      </group>
      <Jacket material={jacketMaterial} />
      <mesh geometry={collarGeometry} position={[0, 3.05, 0]} castShadow>
        <meshStandardMaterial color="#1a2332" roughness={0.4} metalness={0.3} />
      </mesh>
      <mesh geometry={faceGeometry} position={[0, 3.35, 0]} castShadow>
        <meshStandardMaterial color="#d3c4b9" roughness={0.68} />
      </mesh>
      <mesh geometry={visorGeometry} position={[0, 3.33, 0.27]} rotation={[0, Math.PI, 0]} castShadow>
        <meshStandardMaterial color="#243044" opacity={0.8} transparent roughness={0.2} metalness={0.3} />
      </mesh>
      <mesh geometry={beltGeometry} position={[0, 1.6, 0]} castShadow>
        <meshStandardMaterial color="#101721" roughness={0.3} metalness={0.5} />
      </mesh>
    </group>
  );
};

const GarmentShowcase = () => {
  const jacketTexture = useFabricTexture({
    base: '#1b2a36',
    mid: '#273b4a',
    highlight: '#42566b',
    weave: '#cde3ff',
  });

  const pantTexture = useFabricTexture({
    base: '#242f2f',
    mid: '#1e2627',
    highlight: '#3c4b4c',
    weave: '#d0e5d5',
  });

  const jacketMaterial = useMemo(() => {
    const material = new THREE.MeshStandardMaterial({
      map: jacketTexture,
      roughness: 0.45,
      metalness: 0.25,
      envMapIntensity: 0.8,
    });
    return material;
  }, [jacketTexture]);

  const pantMaterial = useMemo(() => {
    const material = new THREE.MeshStandardMaterial({
      map: pantTexture,
      roughness: 0.52,
      metalness: 0.18,
      envMapIntensity: 0.7,
    });
    return material;
  }, [pantTexture]);

  return <GarmentFigure jacketMaterial={jacketMaterial} pantMaterial={pantMaterial} />;
};

export const RunwayScene = () => (
  <div className="w-full h-full">
    <Canvas
      shadows
      dpr={[1, 2]}
      camera={{ position: [0, 4, 18], fov: 42, near: 0.1, far: 200 }}
      gl={{ toneMapping: THREE.ACESFilmicToneMapping, outputColorSpace: THREE.SRGBColorSpace }}
    >
      <color attach="background" args={['#04050a']} />
      <fog attach="fog" args={['#04050a', 28, 120]} />
      <Suspense fallback={null}>
        <StudioLights />
        <Runway />
        <GarmentShowcase />
      </Suspense>
      <OrbitControls
        maxPolarAngle={Math.PI / 2.2}
        minPolarAngle={Math.PI / 3}
        enablePan={false}
        enableDamping
        dampingFactor={0.08}
        minDistance={12}
        maxDistance={26}
      />
    </Canvas>
  </div>
);
