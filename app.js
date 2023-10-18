import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';

let scene, camera, renderer, controls;

function init() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Add OrbitControls for camera interaction
    controls = new OrbitControls(camera, renderer.domElement);

    // Position the camera
    camera.position.set(0, 0, 700);

    // Add a basketball court texture
    const loader = new THREE.TextureLoader();
    const courtTexture = loader.load('court_texture.jpg');
    const courtGeometry = new THREE.PlaneGeometry(600, 900);  // Adjust size as needed
    const courtMaterial = new THREE.MeshBasicMaterial({ map: courtTexture });
    const court = new THREE.Mesh(courtGeometry, courtMaterial);
    scene.add(court);

    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x404040);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight.position.set(1, 1, 1);
    scene.add(directionalLight);

    // Create the basketball hoop
    const ringGeometry = new THREE.TorusGeometry(23, 2, 16, 100);
    const ringMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    ring.position.set(0, -370, 80);  // Adjust position as needed
    scene.add(ring);

    const poleGeometry = new THREE.CylinderGeometry(2, 2, 80, 32);
    const poleMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
    const pole = new THREE.Mesh(poleGeometry, poleMaterial);
    pole.rotation.x = Math.PI / 2;  // Rotate the pole 90 degrees around the X-axis
    pole.position.set(0, -393, 40);  // Adjust position as needed
    scene.add(pole);


    // Fetch the shot data
fetch('shots_data.json')
    .then(response => response.json())
    .then(data => {
        const scaleFactor = 0.9;  // Adjust this value as needed
        const xOffset = 0;  // Adjust this value as needed
        const yOffset = -360;  // Adjust this value as needed

        data.forEach(shot => {
            const geometry = new THREE.SphereGeometry(5, 32, 32);
            const material = new THREE.MeshLambertMaterial({ color: shot['SHOT_MADE_FLAG'] === 1 ? 0x00ff00 : 0xff0000 });
            const sphere = new THREE.Mesh(geometry, material);
            sphere.position.set(shot['LOC_X'] * scaleFactor + xOffset, shot['LOC_Y'] * scaleFactor + yOffset, 5);
            scene.add(sphere);

            // Create an arc line from shot position to hoop
            const start = new THREE.Vector3(shot['LOC_X'] * scaleFactor + xOffset, shot['LOC_Y'] * scaleFactor + yOffset, 5);
            const end = new THREE.Vector3(0, -370, 80);  // Hoop position
            const control = new THREE.Vector3((start.x + end.x) / 2, (start.y + end.y) / 2, 200);  // Adjust the z-value to control the height of the arc

            const curve = new THREE.QuadraticBezierCurve3(start, control, end);
            const points = curve.getPoints(50);
            const arcGeometry = new THREE.BufferGeometry().setFromPoints(points);
            const arcMaterial = new THREE.LineBasicMaterial({color: 0xff0000});
            const arcLine = new THREE.Line(arcGeometry, arcMaterial);
            scene.add(arcLine);
    });

    animate();
});

}

function animate() {
    requestAnimationFrame(animate);
    controls.update();  // Update OrbitControls
    renderer.render(scene, camera);
}

init();