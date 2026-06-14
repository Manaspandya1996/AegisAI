import React, { useEffect, useRef } from "react";
import * as THREE from "three";

interface Props {
  zoom: number; // Controlled zoom multiplier from parent buttons
}

export default function BlastRadiusCanvas({ zoom }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const groupRef = useRef<THREE.Group | null>(null);
  const ringRef = useRef<THREE.Mesh | null>(null);
  const innerCoreRef = useRef<THREE.Mesh | null>(null);
  const satellitesRef = useRef<{ pivot: THREE.Group; mesh: THREE.Mesh; speed: number }[]>([]);

  // Smoothly interpolate zoom levels
  useEffect(() => {
    if (cameraRef.current) {
      // Calculate target camera Z coordinate based on zoom multiplier
      const targetZ = 5 / zoom;
      cameraRef.current.position.z = THREE.MathUtils.lerp(cameraRef.current.position.z, targetZ, 0.3);
    }
  }, [zoom]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 300;
    const height = container.clientHeight || 400;

    // Initialize Scene, Camera, Renderer
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.z = 5 / zoom;
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: "high-performance" });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const group = new THREE.Group();
    scene.add(group);
    groupRef.current = group;

    // central secure core (Wireframe Sphere)
    const coreGeom = new THREE.SphereGeometry(1.2, 24, 24);
    const coreMat = new THREE.MeshPhongMaterial({
      color: 0x00f0ff,
      emissive: 0x00f0ff,
      emissiveIntensity: 0.5,
      transparent: true,
      opacity: 0.7,
      wireframe: true,
    });
    const core = new THREE.Mesh(coreGeom, coreMat);
    group.add(core);

    // Inner Solid pulsing core
    const innerGeom = new THREE.SphereGeometry(0.7, 16, 16);
    const innerMat = new THREE.MeshBasicMaterial({ color: 0x00f0ff, transparent: true, opacity: 0.95 });
    const innerCore = new THREE.Mesh(innerGeom, innerMat);
    group.add(innerCore);
    innerCoreRef.current = innerCore;

    // Glowing Firewall boundaries (torus)
    const ringGeom = new THREE.TorusGeometry(2, 0.04, 8, 48);
    const ringMat = new THREE.MeshPhongMaterial({
      color: 0xff00ff,
      emissive: 0xff00ff,
      emissiveIntensity: 0.8,
      transparent: true,
      opacity: 0.9,
    });
    const ring = new THREE.Mesh(ringGeom, ringMat);
    ring.rotation.x = Math.PI / 2.2; // slight tilted view
    group.add(ring);
    ringRef.current = ring;

    // Data packets (Satellites orbiting in the infrastructure mesh)
    const satelliteCount = 10;
    const s_list: { pivot: THREE.Group; mesh: THREE.Mesh; speed: number }[] = [];
    for (let i = 0; i < satelliteCount; i++) {
      const satGeom = new THREE.BoxGeometry(0.12, 0.12, 0.12);
      const satMat = new THREE.MeshPhongMaterial({
        color: i % 2 === 0 ? 0x00f0ff : 0xff00ff,
        emissive: i % 2 === 0 ? 0x00f0ff : 0xff00ff,
        emissiveIntensity: 0.6,
      });
      const sat = new THREE.Mesh(satGeom, satMat);
      
      const pivot = new THREE.Group();
      pivot.rotation.y = (i / satelliteCount) * Math.PI * 2;
      pivot.rotation.x = (Math.random() - 0.5) * 0.4;
      
      sat.position.x = 2.4 + Math.random() * 0.4;
      pivot.add(sat);
      group.add(pivot);
      s_list.push({ pivot, mesh: sat, speed: 0.01 + Math.random() * 0.012 });
    }
    satellitesRef.current = s_list;

    // Ambient & Point Lighting
    const ambientLight = new THREE.AmbientLight(0x222222);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x00f0ff, 2.5, 30);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const pinkLight = new THREE.PointLight(0xff00ff, 1.5, 20);
    pinkLight.position.set(-5, -3, 3);
    scene.add(pinkLight);

    // Mouse interactive rotation
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const bounds = container.getBoundingClientRect();
      const x = e.clientX - bounds.left;
      const y = e.clientY - bounds.top;
      mouseX = (x / bounds.width) * 2 - 1;
      mouseY = -(y / bounds.height) * 2 + 1;
    };

    container.addEventListener("mousemove", handleMouseMove);

    // Animation Loop
    let animationFrameId = 0;
    let time = 0;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      time += 0.015;

      // Slow dynamic spin combined with mouse tracking
      if (group) {
        group.rotation.y += 0.003;
        group.rotation.x = THREE.MathUtils.lerp(group.rotation.x, mouseY * 0.6, 0.05);
        group.rotation.y = THREE.MathUtils.lerp(group.rotation.y, group.rotation.y + mouseX * 0.03, 0.05);
      }

      // Pulse inner core mesh
      if (innerCore) {
        const scaleVal = 1 + Math.sin(time * 2.5) * 0.08;
        innerCore.scale.set(scaleVal, scaleVal, scaleVal);
      }

      // Rotate protection ring
      if (ring) {
        ring.rotation.z -= 0.005;
      }

      // Update orbiting satellites
      s_list.forEach((s) => {
        s.pivot.rotation.y += s.speed;
        s.mesh.rotation.y += 0.02;
        s.mesh.rotation.x += 0.01;
      });

      renderer.render(scene, camera);
    };

    animate();

    // Responsive Canvas Resizing via ResizeObserver
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const entry = entries[0];
      const w = entry.contentRect.width;
      const h = entry.contentRect.height;
      if (cameraRef.current && rendererRef.current) {
        cameraRef.current.aspect = w / h;
        cameraRef.current.updateProjectionMatrix();
        rendererRef.current.setSize(w, h);
      }
    });
    resizeObserver.observe(container);

    // Component Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener("mousemove", handleMouseMove);
      resizeObserver.disconnect();

      // Dispose geometries & materials
      nestedDispose(scene);

      if (rendererRef.current) {
        if (rendererRef.current.domElement && container.contains(rendererRef.current.domElement)) {
          container.removeChild(rendererRef.current.domElement);
        }
        rendererRef.current.dispose();
      }
    };
  }, []);

  // Recursive dispose helper to prevent WebGL GPU leaks on rapid routes changes
  const nestedDispose = (obj: any) => {
    if (!obj) return;
    if (obj.geometry) obj.geometry.dispose();
    if (obj.material) {
      if (Array.isArray(obj.material)) {
        obj.material.forEach((mat) => mat.dispose());
      } else {
        obj.material.dispose();
      }
    }
    if (obj.children) {
      obj.children.forEach((child: any) => nestedDispose(child));
    }
  };

  return (
    <div className="relative w-full h-full select-none cursor-grab active:cursor-grabbing">
      {/* 3D Canvas wrapper */}
      <div ref={containerRef} className="w-full h-full min-h-[350px] relative z-0"></div>

      {/* Futuristic ambient corner lines overlay */}
      <div className="absolute inset-x-4 top-4 flex justify-between text-[11px] font-mono text-info-cyan/40 pointer-events-none">
        <span>🔴 CORE_BEAT: LIVE</span>
        <span>RADAR_SECURE: OK_96.5</span>
      </div>
      <div className="absolute inset-x-4 bottom-4 flex justify-between text-[10px] font-mono text-danger-magenta/40 pointer-events-none">
        <span>MATRIX: ACTIVE</span>
        <span>LATENCY: 12ms</span>
      </div>
    </div>
  );
}
