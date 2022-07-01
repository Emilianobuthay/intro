import { useGLTF } from '@react-three/drei'
export function Memorial1(props) {
  const { scene } = useGLTF('/edificio.gltf')
  return <primitive object={scene} {...props} />
}
