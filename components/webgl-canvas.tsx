"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"

interface WebGLCanvasProps {
  vertexShader: string
  fragmentShader: string
  uniforms?: Record<string, { value: any }>
  className?: string
  onAnimate?: (uniforms: Record<string, { value: any }>, time: number) => void
  pixelRatio?: number
}

export function WebGLCanvas({
  vertexShader,
  fragmentShader,
  uniforms: initialUniforms = {},
  className = "fixed top-0 left-0 w-full h-full block",
  onAnimate,
  pixelRatio = 1,
}: WebGLCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const sceneRef = useRef<{
    scene: THREE.Scene | null
    camera: THREE.OrthographicCamera | null
    renderer: THREE.WebGLRenderer | null
    mesh: THREE.Mesh | null
    uniforms: Record<string, { value: any }>
    animationId: number | null
    startTime: number
  }>({
    scene: null,
    camera: null,
    renderer: null,
    mesh: null,
    uniforms: {},
    animationId: null,
    startTime: Date.now(),
  })

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const { current: refs } = sceneRef

    const initScene = () => {
      // Initialize scene
      refs.scene = new THREE.Scene()
      refs.renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: false,
      })
      refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, pixelRatio))
      refs.renderer.setClearColor(new THREE.Color(0x000000), 0)

      // Setup orthographic camera for full-screen shader
      refs.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, -1)

      // Setup uniforms with defaults
      refs.uniforms = {
        resolution: { value: [window.innerWidth, window.innerHeight] },
        time: { value: 0.0 },
        ...initialUniforms,
      }

      // Create full-screen quad geometry
      const position = [-1.0, -1.0, 0.0, 1.0, -1.0, 0.0, -1.0, 1.0, 0.0, 1.0, -1.0, 0.0, -1.0, 1.0, 0.0, 1.0, 1.0, 0.0]

      const positions = new THREE.BufferAttribute(new Float32Array(position), 3)
      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute("position", positions)

      // Create shader material
      const material = new THREE.RawShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms: refs.uniforms,
        side: THREE.DoubleSide,
        transparent: true,
      })

      refs.mesh = new THREE.Mesh(geometry, material)
      refs.scene.add(refs.mesh)

      handleResize()
    }

    const animate = () => {
      const elapsed = (Date.now() - refs.startTime) / 1000

      if (refs.uniforms) {
        refs.uniforms.time.value = elapsed

        // Call custom animation callback if provided
        if (onAnimate) {
          onAnimate(refs.uniforms, elapsed)
        }
      }

      if (refs.renderer && refs.scene && refs.camera) {
        refs.renderer.render(refs.scene, refs.camera)
      }

      refs.animationId = requestAnimationFrame(animate)
    }

    const handleResize = () => {
      if (!refs.renderer || !refs.uniforms) return
      const width = window.innerWidth
      const height = window.innerHeight
      refs.renderer.setSize(width, height, false)
      refs.uniforms.resolution.value = [width, height]
    }

    initScene()
    animate()
    window.addEventListener("resize", handleResize)

    return () => {
      if (refs.animationId) cancelAnimationFrame(refs.animationId)
      window.removeEventListener("resize", handleResize)

      // Cleanup Three.js resources
      if (refs.mesh) {
        refs.scene?.remove(refs.mesh)
        refs.mesh.geometry.dispose()
        if (refs.mesh.material instanceof THREE.Material) {
          refs.mesh.material.dispose()
        }
      }
      refs.renderer?.dispose()
    }
  }, [vertexShader, fragmentShader, onAnimate, pixelRatio])

  return <canvas ref={canvasRef} className={className} />
}
