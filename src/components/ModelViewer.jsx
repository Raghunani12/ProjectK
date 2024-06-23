import React, { Suspense, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

function Model({ url }) {
  const { scene, nodes } = useGLTF(url);
  
  useFrame(() => {
    // Example to adjust the position of the hand bones
    const leftHand = nodes["Hand_L"];
    const rightHand = nodes["Hand_R"];

    if (leftHand) {
      leftHand.position.set(-0.5, 0, 0); // Adjust the position as needed
    }

    if (rightHand) {
      rightHand.position.set(0.5, 0, 0); // Adjust the position as needed
    }
  });

  const clipPlane = useMemo(() => {
    const plane = new THREE.Plane(new THREE.Vector3(0, -1, 0), -0.3);
    return [plane];
  }, []);

  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.material.clippingPlanes = clipPlane;
      child.material.clipIntersection = true;
    }
  });

  return <primitive object={scene} scale={0.5} />;
}

function ModelViewer({ modelUrl }) {
  return (
    <div className="w-full h-full">
      <Canvas>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Suspense fallback={null}>
          <Model url={modelUrl} />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  );
}

export default ModelViewer;
