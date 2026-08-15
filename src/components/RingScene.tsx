import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, ContactShadows, Float, OrbitControls, Sparkles } from '@react-three/drei'
import * as THREE from 'three'
import { useRef } from 'react'
import { useMouse } from '../hooks/useMouse'

function Diamond({ scale = 1 }: { scale?: number }) {
  const ref = useRef<THREE.Mesh>(null)
  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.22
  })
  return (
    <mesh ref={ref} scale={scale} position={[0, 0.22, 0]}>
      <octahedronGeometry args={[0.48, 2]} />
      <meshPhysicalMaterial
        color="#ffffff"
        transmission={1}
        thickness={0.35}
        roughness={0.03}
        ior={2.4}
        reflectivity={1}
        clearcoat={1}
        clearcoatRoughness={0.02}
      />
    </mesh>
  )
}

function Ring() {
  const group = useRef<THREE.Group>(null)
  const mouse = useMouse()

  useFrame((_, delta) => {
    if (!group.current) return
    group.current.rotation.y = THREE.MathUtils.damp(group.current.rotation.y, mouse.current.x * 0.38, 3.2, delta)
    group.current.rotation.x = THREE.MathUtils.damp(group.current.rotation.x, -mouse.current.y * 0.16, 3.2, delta)
    group.current.position.y = THREE.MathUtils.damp(group.current.position.y, mouse.current.y * 0.08, 2, delta)
  })

  return (
    <group ref={group} rotation={[0.12, -0.3, 0.1]}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.22, 0.105, 64, 160]} />
        <meshPhysicalMaterial color="#e5e3dd" metalness={1} roughness={0.16} clearcoat={1} />
      </mesh>
      <mesh position={[0, 0.22, 0]}>
        <torusGeometry args={[0.34, 0.09, 48, 96]} />
        <meshPhysicalMaterial color="#e5e3dd" metalness={1} roughness={0.12} />
      </mesh>
      <Diamond scale={1.25}/>
      {[-0.42, 0.42].map((x) => <Diamond key={x} scale={0.32}/>)}
    </group>
  )
}

export default function RingScene() {
  return (
    <div className="ring-canvas">
      <Canvas camera={{ position: [0, 0.1, 4.2], fov: 34 }} dpr={[1, 2]}>
        <ambientLight intensity={0.25}/>
        <spotLight position={[4, 5, 5]} intensity={8} angle={0.35} penumbra={1}/>
        <spotLight position={[-4, 1, 2]} intensity={5} angle={0.45} penumbra={1}/>
        <pointLight position={[0, -2, 2]} intensity={2}/>
        <Environment preset="studio"/>
        <Float speed={0.7} rotationIntensity={0.08} floatIntensity={0.18}>
          <Ring/>
        </Float>
        <ContactShadows position={[0, -1.55, 0]} opacity={0.28} scale={4} blur={2.5} far={4}/>
        <Sparkles count={28} scale={4.5} size={0.55} speed={0.18} opacity={0.22}/>
        <OrbitControls enablePan={false} enableZoom={false} enableRotate={false}/>
      </Canvas>
    </div>
  )
}
