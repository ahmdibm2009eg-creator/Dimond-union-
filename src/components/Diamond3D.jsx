import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Diamond3D({ className = '' }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 200;
    const height = mount.clientHeight || 200;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0.8, 4.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    mount.appendChild(renderer.domElement);

    // Diamond profile (2D outline revolved around Y-axis) — perfectly symmetrical
    const points = [
      new THREE.Vector2(0, 0.95),      // table center (top)
      new THREE.Vector2(0.55, 0.95),   // table edge
      new THREE.Vector2(1.2, 0.45),    // girdle (widest point)
      new THREE.Vector2(0, -0.95),     // culet (bottom point)
    ];
    const geometry = new THREE.LatheGeometry(points, 8);
    geometry.computeVertexNormals();

    // Diamond material — faceted gemstone with burgundy tint
    const material = new THREE.MeshPhysicalMaterial({
      color: 0x991e23,
      metalness: 0.3,
      roughness: 0.02,
      clearcoat: 1,
      clearcoatRoughness: 0.0,
      reflectivity: 1,
      envMapIntensity: 1.5,
      flatShading: true,
    });

    const diamond = new THREE.Mesh(geometry, material);
    diamond.scale.set(0, 0, 0);
    scene.add(diamond);

    // Gold edge highlights for sparkle
    const edges = new THREE.EdgesGeometry(geometry);
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: 0xd4af37,
      transparent: true,
      opacity: 0.5,
    });
    const wireframe = new THREE.LineSegments(edges, edgeMaterial);
    diamond.add(wireframe);

    // Lights — studio setup for gemstone reflections
    scene.add(new THREE.AmbientLight(0xffffff, 0.3));

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.8);
    keyLight.position.set(3, 5, 4);
    scene.add(keyLight);

    const goldLight = new THREE.PointLight(0xffd700, 2.5, 25);
    goldLight.position.set(-4, 3, 3);
    scene.add(goldLight);

    const burgundyLight = new THREE.PointLight(0xcc2222, 2, 25);
    burgundyLight.position.set(4, -2, -3);
    scene.add(burgundyLight);

    const fillLight = new THREE.DirectionalLight(0x99bbff, 0.6);
    fillLight.position.set(-2, -3, 2);
    scene.add(fillLight);

    // Animation
    let frameId;
    let currentScale = 0;

    const animate = () => {
      frameId = requestAnimationFrame(animate);

      // Emerge animation (ease-out cubic)
      if (currentScale < 1) {
        currentScale = Math.min(currentScale + 0.02, 1);
        const eased = 1 - Math.pow(1 - currentScale, 3);
        diamond.scale.set(eased, eased, eased);
      }

      // Continuous auto-rotation
      diamond.rotation.y += 0.008;

      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const handleResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (w > 0 && h > 0) {
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      mount.removeChild(renderer.domElement);
      geometry.dispose();
      material.dispose();
      edges.dispose();
      edgeMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className={className} style={{ width: '100%', height: '100%' }} />;
}