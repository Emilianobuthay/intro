import * as THREE from 'three'
import React, { Suspense, useEffect, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Reflector, Text, useTexture } from '@react-three/drei'
import Overlay from './Overlay'

import { useControls } from 'leva'
import { ColorPickerPlugin } from './LevaColorPlugin'
import { VideoPlugin } from './LevaVideoPlugin'

import { Carla } from './carla'
import { Camera } from './camera'
import { Memorial1 } from './memorial'

function VideoText({ clicked, ...props }) {
  const [video] = useState(() => Object.assign(document.createElement('video'), { src: '/drei.mp4', crossOrigin: 'Anonymous', loop: true }))
  useEffect(() => void (clicked && video.play()), [video, clicked])
  const { myText } = useControls(() => ({
    myText: 'Mariko',
    myVid: VideoPlugin({ video: video })
  }))
  return (
    <group>
      <mesh position={[-0.7, 1.8, -8]}>
        <planeGeometry args={[5.2, 2.7]} {...props} />
        <meshBasicMaterial toneMapped={false}>
          <videoTexture attach="map" args={[video]} encoding={THREE.sRGBEncoding} />
        </meshBasicMaterial>
      </mesh>
    </group>
  )
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <spotLight position={[0, 10, 0]} intensity={0.3} />
      <directionalLight position={[-20, 0, -10]} intensity={0.7} />
    </>
  )
}

function Ground() {
  const [floor, normal] = useTexture(['/SurfaceImperfections003_1K_var1.jpg', '/SurfaceImperfections003_1K_Normal.jpg'])
  return (
    <Reflector blur={[400, 100]} resolution={512} args={[40, 15]} mirror={0.5} mixBlur={6} mixStrength={1.5} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
      {(Material, props) => <Material color="#a0a0a0" metalness={0.4} roughnessMap={floor} normalMap={normal} normalScale={[2, 2]} {...props} />}
    </Reflector>
  )
}

export default function App() {
  const [clicked, setClicked] = useState(false)
  const [ready, setReady] = useState(false)
  const store = { clicked, setClicked, ready, setReady }
  const [{ myColor }, setLeva] = useControls(() => ({
    myColor: ColorPickerPlugin({ color: '#000' })
  }))

  return (
    <>
      <Canvas concurrent gl={{ alpha: false }} pixelRatio={[1, 1.5]} camera={{ position: [0, 0, 8], fov: 18}}>
        <color attach="background" args={[myColor.color]} />
        <fog attach="fog" args={['black', 19, 48]} />
        <Suspense fallback={null}>
          <group position={[0, -1, 0]}>
            
            <Memorial1 rotation={[0, 6.2, 0]} position={[0.5, 13.8, -1.5]} scale={[1.50, 1.5, 1.26]} />
            {/*<Camera rotation={[0.4, 0.7, 0]} position={[-3, -1, -19]} scale={[1.46, 1.96, 1.66]} />   rotation={[0, 1.5, 0]} position={[6, 3.7, -4]} scale={[1.66, 1.3, 1.26]} */}
            <Carla rotation={[0, Math.PI - 0.3, 0]} position={[-1.6, 0, 0]} scale={[0.26, 0.26, 0.26]} />
            <VideoText {...store} position={[4, 1.3, -2]} />
            <Ground />
          </group>
          <Lights />
          <Intro start={ready && clicked} set={setReady} />
        </Suspense>
        
      </Canvas>
      <Overlay {...store} />
    </>
  )
}

function Intro({ start, set }) {
  const [vec] = useState(() => new THREE.Vector3())
  useEffect(() => setTimeout(() => set(true), 500), [])
  return useFrame((state) => {
    if (start) {
      state.camera.position.lerp(vec.set(state.mouse.x * 3, 3 + state.mouse.y * 2, 14), 0.04)
      state.camera.lookAt(0, 0, 0)
    }
  })
}
