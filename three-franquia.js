import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

const canvas = document.querySelector("#franquiaWebgl");

if (canvas) {
    const container = canvas.parentElement;

    const scene = new THREE.Scene();

    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 1;

    const renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true
    });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const loader = new THREE.TextureLoader();

    const texturaSuja = loader.load("./img/tenis-corrida-sujo.png");
    const texturaLimpa = loader.load("./img/tenis-corrida-limpo.png");

    texturaSuja.colorSpace = THREE.SRGBColorSpace;
    texturaLimpa.colorSpace = THREE.SRGBColorSpace;

    const mouse = new THREE.Vector2(0.5, 0.5);
    const mouseSuave = new THREE.Vector2(0.5, 0.5);

    let hover = 0;
    let hoverAlvo = 0;

    const material = new THREE.ShaderMaterial({
        uniforms: {
            uTextureDirty: { value: texturaSuja },
            uTextureClean: { value: texturaLimpa },
            uMouse: { value: mouseSuave },
            uHover: { value: hover },
            uTime: { value: 0 },
            uAspect: { value: 1 },
            uImageAspect: { value: 1.75 }
        },
        vertexShader: `
            varying vec2 vUv;

            uniform vec2 uMouse;
            uniform float uHover;

            void main() {
                vUv = uv;

                vec3 pos = position;

                float dist = distance(uv, uMouse);
                float influence = smoothstep(0.45, 0.0, dist) * uHover;

                pos.z += influence * 0.08;

                gl_Position = vec4(pos, 1.0);
            }
        `,
        fragmentShader: `
            precision highp float;

            uniform sampler2D uTextureDirty;
            uniform sampler2D uTextureClean;
            uniform vec2 uMouse;
            uniform float uHover;
            uniform float uTime;
            uniform float uAspect;

            varying vec2 vUv;

            void main() {
                vec2 uv = vUv;

                vec2 correctedUv = vec2(
                    (uv.x - uMouse.x) * uAspect,
                    uv.y - uMouse.y
                );

                float dist = length(correctedUv);

                float radius = mix(0.0, 0.18, uHover);
                float edge = 0.025;

                float mask = 1.0 - smoothstep(radius, radius + edge, dist);

                float wave = sin((dist * 55.0) - (uTime * 4.0)) * 0.004 * mask;

                vec2 distortedUv = uv + normalize(correctedUv + 0.0001) * wave;

                vec4 dirty = texture2D(uTextureDirty, uv);
                vec4 clean = texture2D(uTextureClean, distortedUv);

                vec4 color = mix(dirty, clean, mask);

                float ring = 1.0 - smoothstep(0.004, 0.018, abs(dist - radius));
                color.rgb += vec3(0.05, 0.55, 1.0) * ring * uHover * 0.55;

                gl_FragColor = color;
            }
        `
    });

    const geometry = new THREE.PlaneGeometry(2, 2, 80, 80);
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    function redimensionar() {
        const largura = container.clientWidth;
        const altura = container.clientHeight;

        renderer.setSize(largura, altura, false);
        material.uniforms.uAspect.value = largura / altura;
    }

    redimensionar();
    window.addEventListener("resize", redimensionar);

    container.addEventListener("mousemove", (event) => {
        const rect = container.getBoundingClientRect();

        mouse.x = (event.clientX - rect.left) / rect.width;
        mouse.y = 1.0 - ((event.clientY - rect.top) / rect.height);

        hoverAlvo = 1;
    });

    container.addEventListener("mouseleave", () => {
        hoverAlvo = 0;
    });

    const clock = new THREE.Clock();

    function animar() {
        const tempo = clock.getElapsedTime();

        mouseSuave.x += (mouse.x - mouseSuave.x) * 0.15;
        mouseSuave.y += (mouse.y - mouseSuave.y) * 0.15;

        hover += (hoverAlvo - hover) * 0.12;

        material.uniforms.uMouse.value = mouseSuave;
        material.uniforms.uHover.value = hover;
        material.uniforms.uTime.value = tempo;

        renderer.render(scene, camera);
        requestAnimationFrame(animar);
    }

    animar();
}