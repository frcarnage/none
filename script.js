function init3DScene(){
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({antialias:true, alpha:true});
  renderer.setSize(window.innerWidth, 400);
  document.getElementById("scene").appendChild(renderer.domElement);

  // Main rotating heart
  const geometry = new THREE.TorusKnotGeometry(10,3,100,16);
  const material = new THREE.MeshStandardMaterial({color:0xff4081, roughness:0.5, metalness:0.6});
  const mainHeart = new THREE.Mesh(geometry, material);
  scene.add(mainHeart);

  // Floating clickable hearts
  const messagesData = [
    "I'm really sorry for everything.",
    "I miss the moments we shared.",
    "I want to make things right.",
    "You are very special to me.",
    "I hope we can start fresh."
  ];

  const floatingHearts = [];
  messagesData.forEach(msg=>{
    const geo = new THREE.TetrahedronGeometry(Math.random()*2+0.5);
    const mat = new THREE.MeshStandardMaterial({color:0xff69b4});
    const h = new THREE.Mesh(geo, mat);
    h.position.set(Math.random()*60-30, Math.random()*60-30, Math.random()*60-30);
    h.userData = { message: msg };
    scene.add(h);
    floatingHearts.push(h);
  });

  // Lights
  const light1 = new THREE.PointLight(0xff4081,1.2);
  light1.position.set(50,50,50);
  scene.add(light1);
  const light2 = new THREE.AmbientLight(0xffffff,0.6);
  scene.add(light2);

  camera.position.z=60;

  // Mouse drag
  let isDragging=false;
  let prev={x:0,y:0};
  renderer.domElement.addEventListener('mousedown',()=>isDragging=true);
  renderer.domElement.addEventListener('mouseup',()=>isDragging=false);
  renderer.domElement.addEventListener('mousemove', (e)=>{
    if(isDragging){
      let delta={x:e.offsetX-prev.x, y:e.offsetY-prev.y};
      mainHeart.rotation.y += delta.x*0.01;
      mainHeart.rotation.x += delta.y*0.01;
    }
    prev={x:e.offsetX, y:e.offsetY};
  });

  // Raycaster for clickable floating hearts
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  function onClick(event){
    mouse.x = (event.clientX / window.innerWidth)*2 -1;
    mouse.y = -(event.clientY / window.innerHeight)*2 +1;
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(floatingHearts);
    if(intersects.length>0){
      const heart = intersects[0].object;
      alert(heart.userData.message);
    }
  }

  window.addEventListener('click', onClick);

  // Animate
  function animate(){
    requestAnimationFrame(animate);
    mainHeart.rotation.y += 0.004;
    floatingHearts.forEach(h=>{
      h.position.y +=0.05;
      if(h.position.y>35) h.position.y=-35;
    });
    renderer.render(scene, camera);
  }
  animate();
}

// Initialize
window.addEventListener('DOMContentLoaded', ()=>{
  init3DScene();
});
