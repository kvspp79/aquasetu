import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function ThreeBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 });
  const targetMouseRef = useRef<{ x: number; y: number }>({ x: 0.5, y: 0.5 });
  const mouseVelRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const mouseInfluenceRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    const width = container.clientWidth || window.innerWidth;
    const height = container.clientHeight || window.innerHeight;

    // Create Scene
    const scene = new THREE.Scene();

    // Create Camera
    const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 100);
    camera.position.set(0, 3, 7.5);
    camera.lookAt(0, 0, -1);

    // Create WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Large water plane geometry to guarantee 100% full-screen perspective coverage
    const geometry = new THREE.PlaneGeometry(35, 35, 180, 180);
    geometry.rotateX(-Math.PI / 2); // Lay flat on ground

    // Custom Shader Material uniforms
    const waterUniforms = {
      u_time: { value: 0.0 },
      u_mouse: { value: new THREE.Vector2(0.5, 0.5) },
      u_mouse_vel: { value: new THREE.Vector2(0.0, 0.0) },
      u_mouse_influence: { value: 0.0 },
    };

    const waterMaterial = new THREE.ShaderMaterial({
      uniforms: waterUniforms,
      vertexShader: `
        uniform float u_time;
        uniform vec2 u_mouse;
        uniform vec2 u_mouse_vel;
        uniform float u_mouse_influence;
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying float vMouseDist;

        // Simple high-speed hash function for procedural micro-waves
        float hash(vec2 p) {
          return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }

        // 2D Noise for organic current ripples
        float noise(vec2 p) {
          vec2 i = floor(p);
          vec2 f = fract(p);
          vec2 u = f * f * (3.0 - 2.0 * f);
          return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
                     mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
        }

        void main() {
          vUv = uv;
          vec3 pos = position;

          float waveTime = u_time * 1.1;

          // Layer 1: Long flowing slow current
          float wave1 = sin(pos.x * 0.45 + waveTime) * cos(pos.z * 0.4 + waveTime * 0.85) * 0.25;
          // Layer 2: Medium frequency counter-waves
          float wave2 = sin(pos.z * 0.85 - waveTime * 1.2) * 0.14;
          // Layer 3: High frequency procedural micro-ripples
          float wave3 = noise(pos.xz * 2.2 + vec2(waveTime * 0.5, -waveTime * 0.35)) * 0.08;

          // Mouse coordinate world-mapping
          // Map 0..1 normalized mouse space to plane bounds (-17.5 to 17.5)
          vec2 mouseWorld = (u_mouse - 0.5) * vec2(28.0, 20.0);
          float dist = distance(pos.xz, mouseWorld);
          vMouseDist = dist;

          // Dynamic flow suction and ripple perturbations on mouse drag
          float mouseRipple = 0.0;
          if (dist < 6.5) {
            float strength = u_mouse_influence * (1.0 - dist / 6.5);
            // Harmonic wave propagation centered on mouse
            mouseRipple = sin(dist * 5.0 - u_time * 7.5) * 0.38 * strength;
            
            // Apply vortex swirl to make flow viscous & responsive
            pos.x += cos(dist * 2.5 - u_time * 3.0) * 0.15 * strength;
            pos.z += sin(dist * 2.5 - u_time * 3.0) * 0.15 * strength;
          }

          pos.y += wave1 + wave2 + wave3 + mouseRipple;
          
          // Approximate normals for outstanding specular highlights
          vec3 offX = vec3(pos.x + 0.1, pos.y, pos.z);
          vec3 offZ = vec3(pos.x, pos.y, pos.z + 0.1);
          
          float hX = sin(offX.x * 0.45 + waveTime) * cos(offX.z * 0.4 + waveTime * 0.85) * 0.25 + sin(offX.z * 0.85 - waveTime * 1.2) * 0.14;
          float hZ = sin(offZ.x * 0.45 + waveTime) * cos(offZ.z * 0.4 + waveTime * 0.85) * 0.25 + sin(offZ.z * 0.85 - waveTime * 1.2) * 0.14;
          
          offX.y += hX;
          offZ.y += hZ;

          vec3 tangentX = normalize(offX - pos);
          vec3 tangentZ = normalize(offZ - pos);
          vNormal = normalize(cross(tangentZ, tangentX));

          vPosition = pos;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform float u_time;
        varying vec2 vUv;
        varying vec3 vPosition;
        varying vec3 vNormal;
        varying float vMouseDist;

        void main() {
          // Pristine deep-aquatic navy, slate teal & cyan palette
          // Pristine warm-sandy golden beach & sunlit current palette
          vec3 deepOcean = vec3(0.97, 0.94, 0.87);
          vec3 shallowAqua = vec3(0.98, 0.88, 0.62);
          vec3 flowTeal = vec3(0.99, 0.83, 0.45);
          vec3 highlightWhite = vec3(1.0, 1.0, 1.0);

          // Ray vectors for lighting calculations
          vec3 viewDir = normalize(vec3(0.0, 5.0, 6.0) - vPosition);
          vec3 lightDir = normalize(vec3(4.0, 12.0, 3.0));
          vec3 halfDir = normalize(lightDir + viewDir);

          // Specular light calculations for Gerstner sparkles
          float specular = pow(max(dot(vNormal, halfDir), 0.0), 95.0) * 1.6;
          
          // Fresnel effect for deep water glance angles
          float fresnel = pow(1.0 - max(dot(vNormal, viewDir), 0.0), 4.5);

          // Height mix factor for water depth
          float heightFactor = smoothstep(-0.25, 0.25, vPosition.y);

          // Shimmer noise pattern
          float shimmer = sin(vPosition.x * 6.0 + u_time * 1.4) * cos(vPosition.z * 6.0 - u_time * 1.1) * 0.5 + 0.5;
          shimmer += sin(vPosition.z * 12.0 + u_time * 2.2) * 0.25;

          // Glowing trails near the cursor
          float mouseGlow = smoothstep(6.0, 0.0, vMouseDist);

          vec3 color = mix(deepOcean, shallowAqua, heightFactor);
          color = mix(color, flowTeal, fresnel * 0.5);

          // Add specular highlights & caustics sparkles
          color += highlightWhite * (specular * 1.5);
          color += vec3(1.0, 0.92, 0.70) * shimmer * 0.12;

          // Add responsive mouse movement trail glow
          color += vec3(1.0, 0.85, 0.3) * mouseGlow * 0.45;

          // Deep horizon fog fade to blend perfectly with deep-slate backgrounds
          float horizonFade = 1.0 - smoothstep(10.0, 24.0, length(vPosition.xz));

          gl_FragColor = vec4(color, 0.55 * horizonFade);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const water = new THREE.Mesh(geometry, waterMaterial);
    scene.add(water);

    // Dynamic Rain streak system
    const rainCount = 420;
    const rainGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(rainCount * 3);
    const speeds = new Float32Array(rainCount);
    const rainSpeeds = new Float32Array(rainCount);

    for (let i = 0; i < rainCount; i++) {
      // Wide flat spread across screen coordinate system
      positions[i * 3] = (Math.random() - 0.5) * 12.0;
      positions[i * 3 + 1] = Math.random() * 8.0; // Y height
      positions[i * 3 + 2] = (Math.random() - 0.5) * 12.0;
      
      const speed = 0.12 + Math.random() * 0.16;
      speeds[i] = speed;
      rainSpeeds[i] = speed;
    }

    rainGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    rainGeometry.setAttribute('a_speed', new THREE.BufferAttribute(rainSpeeds, 1));

    // High fidelity vertical rain streak shader
    const rainMaterial = new THREE.ShaderMaterial({
      uniforms: {
        u_time: { value: 0 },
      },
      vertexShader: `
        attribute float a_speed;
        varying float vSpeed;
        varying vec3 vPos;
        void main() {
          vSpeed = a_speed;
          vPos = position;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          
          // Attenuate point size so closer rain drops look wider/longer
          gl_PointSize = 16.0 * (1.2 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying float vSpeed;
        varying vec3 vPos;
        void main() {
          // Circular horizontal boundaries and stretched vertical bounds
          float x = gl_PointCoord.x - 0.5;
          float y = gl_PointCoord.y - 0.5;

          // Draw vertical raindrop streak
          if (abs(x) > 0.035) discard;

          // Fade out rain at the ends of each point segment
          float alpha = (1.0 - abs(y) * 2.0) * 0.65;
          
          // Soft glowing golden sunlit rainfall
          vec3 rainColor = vec3(1.0, 0.88, 0.45);
          gl_FragColor = vec4(rainColor, alpha);
        }
      `,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });

    const rainSystem = new THREE.Points(rainGeometry, rainMaterial);
    scene.add(rainSystem);

    // Subtle atmospheric lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.75);
    directionalLight.position.set(4, 12, 4);
    scene.add(directionalLight);

    // Handle Resize
    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', handleResize);

    // Track mouse coordinates with velocity & touch support
    let lastTime = performance.now();
    let lastMouse = { x: 0.5, y: 0.5 };

    const handleInputMove = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width;
      const y = 1.0 - ((clientY - rect.top) / rect.height);
      targetMouseRef.current = { x, y };

      const now = performance.now();
      const dt = Math.max(1.0, now - lastTime);

      const dx = x - lastMouse.x;
      const dy = y - lastMouse.y;
      const speed = Math.sqrt(dx * dx + dy * dy) / dt;

      mouseVelRef.current = { x: dx / dt, y: dy / dt };
      
      // Highly dynamic, responsive scaling factor
      mouseInfluenceRef.current = Math.min(1.0, mouseInfluenceRef.current + speed * 125.0);

      lastMouse = { x, y };
      lastTime = now;
    };

    const handleMouseMove = (event: MouseEvent) => {
      handleInputMove(event.clientX, event.clientY);
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (event.touches.length > 0) {
        handleInputMove(event.touches[0].clientX, event.touches[0].clientY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smoothly interpolate mouse coordinate target values
      mouseRef.current.x += (targetMouseRef.current.x - mouseRef.current.x) * 0.12;
      mouseRef.current.y += (targetMouseRef.current.y - mouseRef.current.y) * 0.12;

      // Decay mouse influence smoothly over time so waves naturally relax
      mouseInfluenceRef.current *= 0.965;

      // Update shader uniforms
      waterUniforms.u_time.value = elapsedTime;
      waterUniforms.u_mouse.value.set(mouseRef.current.x, mouseRef.current.y);
      waterUniforms.u_mouse_vel.value.set(mouseVelRef.current.x, mouseVelRef.current.y);
      waterUniforms.u_mouse_influence.value = mouseInfluenceRef.current;

      // Update rain particle positions
      const positionsArray = rainGeometry.attributes.position.array as Float32Array;
      for (let i = 0; i < rainCount; i++) {
        positionsArray[i * 3 + 1] -= speeds[i]; // move down (Y axis)

        // Reset if raindrop falls below water level
        if (positionsArray[i * 3 + 1] < -0.2) {
          positionsArray[i * 3 + 1] = 6.5 + Math.random() * 2.0;
          positionsArray[i * 3] = (Math.random() - 0.5) * 12.0;
          positionsArray[i * 3 + 2] = (Math.random() - 0.5) * 12.0;
        }
      }
      rainGeometry.attributes.position.needsUpdate = true;

      // Subtle parallax camera rotation for enhanced 3D immersion
      const angle = elapsedTime * 0.04;
      camera.position.x = Math.sin(angle) * 0.45;
      camera.lookAt(0, 0, -1);

      renderer.render(scene, camera);
    };

    animate();

    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      waterMaterial.dispose();
      rainGeometry.dispose();
      rainMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div 
      ref={containerRef} 
      className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden opacity-55"
      style={{ mixBlendMode: 'normal' }}
    />
  );
}
