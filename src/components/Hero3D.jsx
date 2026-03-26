import { Canvas, useFrame } from '@react-three/fiber';
import { RoundedBox, Html, Environment, Float, ContactShadows } from '@react-three/drei';
import { useRef } from 'react';

function PhoneModel() {
  const group = useRef();
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    group.current.rotation.y = Math.sin(t / 4) * 0.5 + t * 0.2;
    group.current.rotation.x = Math.max(0, Math.sin(t / 2) * 0.1);
  });

  return (
    <group ref={group}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={1.5}>
        <RoundedBox args={[2.8, 5.8, 0.3]} radius={0.2} smoothness={4}>
          <meshStandardMaterial color="#0A0A0A" metalness={0.8} roughness={0.2} />
        </RoundedBox>
        {/* Screen */}
        <RoundedBox args={[2.7, 5.6, 0.32]} radius={0.15} position={[0, 0, 0.01]} smoothness={4}>
          <meshStandardMaterial color="#000" metalness={0.9} roughness={0.1} emissive="#0f172a" emissiveIntensity={0.5} />
        </RoundedBox>

        {/* Floating Spec Cards */}
        <Html position={[1.8, 1.5, 0.5]} center>
          <div className="glass px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap text-white border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)] backdrop-blur-md">
            🚀 16GB RAM + 512GB
          </div>
        </Html>
        <Html position={[-1.8, 0, 0.5]} center>
          <div className="glass px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap text-white border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.3)] backdrop-blur-md">
            📸 200MP Quad Camera
          </div>
        </Html>
        <Html position={[1.5, -1.5, 0.5]} center>
          <div className="glass px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap text-white border border-green-500/30 shadow-[0_0_15px_rgba(34,197,94,0.3)] backdrop-blur-md">
            ⚡ 5000mAh + 120W
          </div>
        </Html>
      </Float>
    </group>
  );
}

export default function Hero3D() {
  return (
    <div className="h-[500px] w-full relative">
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#3B82F6" />
        <PhoneModel />
        <Environment preset="city" />
        <ContactShadows position={[0, -3.5, 0]} opacity={0.4} scale={20} blur={2} far={4} />
      </Canvas>
    </div>
  );
}
