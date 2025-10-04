// GalaxyThree.jsx
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import "./Galaxy.css"; // reuse your css

const vertexShader = `
precision highp float;

varying vec2 vUv;
attribute vec2 uv;

void main() {
  vUv = uv;
  // position here is the geometry position (PlaneGeometry covers -1..1)
  gl_Position = vec4(position.xy, 0.0, 1.0);
}
`;

// Fragment shader: identical math to your OGL shader but with bools => floats
const fragmentShader = `
precision highp float;

uniform float uTime;
uniform vec3 uResolution;
uniform vec2 uFocal;
uniform vec2 uRotation;
uniform float uStarSpeed;
uniform float uDensity;
uniform float uHueShift;
uniform float uSpeed;
uniform vec2 uMouse;
uniform float uGlowIntensity;
uniform float uSaturation;
uniform float uMouseRepulsion; // 0.0 or 1.0
uniform float uTwinkleIntensity;
uniform float uRotationSpeed;
uniform float uRepulsionStrength;
uniform float uMouseActiveFactor;
uniform float uAutoCenterRepulsion;
uniform float uTransparent; // 0.0 or 1.0

varying vec2 vUv;

#define NUM_LAYER 4.0
#define STAR_COLOR_CUTOFF 0.2
#define MAT45 mat2(0.7071, -0.7071, 0.7071, 0.7071)
#define PERIOD 3.0

float Hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float tri(float x) {
  return abs(fract(x) * 2.0 - 1.0);
}

float tris(float x) {
  float t = fract(x);
  return 1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0));
}

float trisn(float x) {
  float t = fract(x);
  return 2.0 * (1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0))) - 1.0;
}

vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

float Star(vec2 uv, float flare) {
  float d = length(uv);
  float m = (0.05 * uGlowIntensity) / d;
  float rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * flare * uGlowIntensity;
  uv *= MAT45;
  rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * 0.3 * flare * uGlowIntensity;
  m *= smoothstep(1.0, 0.2, d);
  return m;
}

vec3 StarLayer(vec2 uv) {
  vec3 col = vec3(0.0);

  vec2 gv = fract(uv) - 0.5; 
  vec2 id = floor(uv);

  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 offset = vec2(float(x), float(y));
      vec2 si = id + vec2(float(x), float(y));
      float seed = Hash21(si);
      float size = fract(seed * 345.32);
      float glossLocal = tri(uStarSpeed / (PERIOD * seed + 1.0));
      float flareSize = smoothstep(0.9, 1.0, size) * glossLocal;

      float red = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 1.0)) + STAR_COLOR_CUTOFF;
      float blu = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 3.0)) + STAR_COLOR_CUTOFF;
      float grn = min(red, blu) * seed;
      vec3 base = vec3(red, grn, blu);
      
      float hue = atan(base.g - base.r, base.b - base.r) / (2.0 * 3.14159) + 0.5;
      hue = fract(hue + uHueShift / 360.0);
      float sat = length(base - vec3(dot(base, vec3(0.299, 0.587, 0.114)))) * uSaturation;
      float val = max(max(base.r, base.g), base.b);
      base = hsv2rgb(vec3(hue, sat, val));

      vec2 pad = vec2(tris(seed * 34.0 + uTime * uSpeed / 10.0), tris(seed * 38.0 + uTime * uSpeed / 30.0)) - 0.5;

      float star = Star(gv - offset - pad, flareSize);
      vec3 color = base;

      float twinkle = trisn(uTime * uSpeed + seed * 6.2831) * 0.5 + 1.0;
      twinkle = mix(1.0, twinkle, uTwinkleIntensity);
      star *= twinkle;
      
      col += star * size * color;
    }
  }

  return col;
}

void main() {
  vec2 focalPx = uFocal * uResolution.xy;
  vec2 uv = (vUv * uResolution.xy - focalPx) / uResolution.y;

  vec2 mouseNorm = uMouse - vec2(0.5);
  
  if (uAutoCenterRepulsion > 0.0) {
    vec2 centerUV = vec2(0.0, 0.0);
    float centerDist = length(uv - centerUV);
    vec2 repulsion = normalize(uv - centerUV) * (uAutoCenterRepulsion / (centerDist + 0.1));
    uv += repulsion * 0.05;
  } else if (uMouseRepulsion > 0.5) {
    vec2 mousePosUV = (uMouse * uResolution.xy - focalPx) / uResolution.y;
    float mouseDist = length(uv - mousePosUV);
    vec2 repulsion = normalize(uv - mousePosUV) * (uRepulsionStrength / (mouseDist + 0.1));
    uv += repulsion * 0.05 * uMouseActiveFactor;
  } else {
    vec2 mouseOffset = mouseNorm * 0.1 * uMouseActiveFactor;
    uv += mouseOffset;
  }

  float autoRotAngle = uTime * uRotationSpeed;
  mat2 autoRot = mat2(cos(autoRotAngle), -sin(autoRotAngle), sin(autoRotAngle), cos(autoRotAngle));
  uv = autoRot * uv;

  uv = mat2(uRotation.x, -uRotation.y, uRotation.y, uRotation.x) * uv;

  vec3 col = vec3(0.0);

  for (float i = 0.0; i < 1.0; i += 1.0 / NUM_LAYER) {
    float depth = fract(i + uStarSpeed * uSpeed);
    float scale = mix(20.0 * uDensity, 0.5 * uDensity, depth);
    float fade = depth * smoothstep(1.0, 0.9, depth);
    col += StarLayer(uv * scale + i * 453.32) * fade;
  }

  if (uTransparent > 0.5) {
    float alpha = length(col);
    alpha = smoothstep(0.0, 0.3, alpha);
    alpha = min(alpha, 1.0);
    gl_FragColor = vec4(col, alpha);
  } else {
    gl_FragColor = vec4(col, 1.0);
  }
}
`;

export default function GalaxyThree({
  focal = [0.5, 0.5],
  rotation = [1.0, 0.0],
  starSpeed = 0.5,
  density = 1,
  hueShift = 140,
  disableAnimation = false,
  speed = 1.0,
  mouseInteraction = true,
  glowIntensity = 0.3,
  saturation = 0.0,
  mouseRepulsion = true,
  repulsionStrength = 2,
  twinkleIntensity = 0.3,
  rotationSpeed = 0.1,
  autoCenterRepulsion = 0,
  transparent = true,
  ...rest
}) {
  const containerRef = useRef(null);
  const smoothMouse = useRef({ x: 0.5, y: 0.5 });
  const targetMouse = useRef({ x: 0.5, y: 0.5 });
  const smoothActive = useRef(0.0);
  const targetActive = useRef(0.0);
  const rendererRef = useRef(null);
  const materialRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: transparent, premultipliedAlpha: false });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    renderer.domElement.style.display = "block";
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Scene & Camera
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1); // fullscreen quad camera

    // Geometry: full-screen plane
    const geometry = new THREE.PlaneGeometry(2, 2);

    // Uniform defaults
    const uniforms = {
      uTime: { value: 0 },
      uResolution: { value: new THREE.Vector3(renderer.domElement.width, renderer.domElement.height, renderer.domElement.width / renderer.domElement.height) },
      uFocal: { value: new THREE.Vector2(focal[0], focal[1]) },
      uRotation: { value: new THREE.Vector2(rotation[0], rotation[1]) },
      uStarSpeed: { value: starSpeed },
      uDensity: { value: density },
      uHueShift: { value: hueShift },
      uSpeed: { value: speed },
      uMouse: { value: new THREE.Vector2(smoothMouse.current.x, smoothMouse.current.y) },
      uGlowIntensity: { value: glowIntensity },
      uSaturation: { value: saturation },
      uMouseRepulsion: { value: mouseRepulsion ? 1.0 : 0.0 },
      uTwinkleIntensity: { value: twinkleIntensity },
      uRotationSpeed: { value: rotationSpeed },
      uRepulsionStrength: { value: repulsionStrength },
      uMouseActiveFactor: { value: 0.0 },
      uAutoCenterRepulsion: { value: autoCenterRepulsion },
      uTransparent: { value: transparent ? 1.0 : 0.0 }
    };

    // Material (ShaderMaterial)
    const material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      side: THREE.DoubleSide
    });
    materialRef.current = material;

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Resize helper
    function onResize() {
      const w = container.offsetWidth;
      const h = container.offsetHeight;
      renderer.setSize(w, h);
      if (uniforms.uResolution) {
        uniforms.uResolution.value.set(renderer.domElement.width, renderer.domElement.height, renderer.domElement.width / renderer.domElement.height);
      }
    }
    window.addEventListener("resize", onResize, false);
    onResize();

    // Animation loop
    let started = performance.now();
    function animate(now) {
      frameRef.current = requestAnimationFrame(animate);

      if (!disableAnimation) {
        uniforms.uTime.value = now * 0.001;
        uniforms.uStarSpeed.value = (now * 0.001 * starSpeed) / 10.0;
      }

      // mouse smoothing
      const lerp = 0.05;
      smoothMouse.current.x += (targetMouse.current.x - smoothMouse.current.x) * lerp;
      smoothMouse.current.y += (targetMouse.current.y - smoothMouse.current.y) * lerp;
      smoothActive.current += (targetActive.current - smoothActive.current) * lerp;

      uniforms.uMouse.value.set(smoothMouse.current.x, smoothMouse.current.y);
      uniforms.uMouseActiveFactor.value = smoothActive.current;

      renderer.render(scene, camera);
    }
    frameRef.current = requestAnimationFrame(animate);

    // Mouse events
    function handleMove(e) {
      const rect = container.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1.0 - (e.clientY - rect.top) / rect.height;
      targetMouse.current = { x, y };
      targetActive.current = 1.0;
    }
    function handleLeave() {
      targetActive.current = 0.0;
    }
    if (mouseInteraction) {
      container.addEventListener("mousemove", handleMove);
      container.addEventListener("mouseleave", handleLeave);
    }

    // Cleanup
    return () => {
      cancelAnimationFrame(frameRef.current);
      window.removeEventListener("resize", onResize);
      if (mouseInteraction) {
        container.removeEventListener("mousemove", handleMove);
        container.removeEventListener("mouseleave", handleLeave);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      if (renderer.domElement && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []); // run once on mount

  // Keep uniforms in sync when props change
  useEffect(() => {
    const mat = materialRef.current;
    if (!mat) return;
    const u = mat.uniforms;
    if (u) {
      u.uFocal.value.set(focal[0], focal[1]);
      u.uRotation.value.set(rotation[0], rotation[1]);
      u.uStarSpeed.value = starSpeed;
      u.uDensity.value = density;
      u.uHueShift.value = hueShift;
      u.uSpeed.value = speed;
      u.uGlowIntensity.value = glowIntensity;
      u.uSaturation.value = saturation;
      u.uMouseRepulsion.value = mouseRepulsion ? 1.0 : 0.0;
      u.uRepulsionStrength.value = repulsionStrength;
      u.uTwinkleIntensity.value = twinkleIntensity;
      u.uRotationSpeed.value = rotationSpeed;
      u.uAutoCenterRepulsion.value = autoCenterRepulsion;
      u.uTransparent.value = transparent ? 1.0 : 0.0;
    }
  }, [
    focal,
    rotation,
    starSpeed,
    density,
    hueShift,
    speed,
    glowIntensity,
    saturation,
    mouseRepulsion,
    repulsionStrength,
    twinkleIntensity,
    rotationSpeed,
    autoCenterRepulsion,
    transparent
  ]);

  return <div ref={containerRef} className="galaxy-container" {...rest} />;
      }
