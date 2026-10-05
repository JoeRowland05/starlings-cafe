/**
 * Pigeons UK - 3D Plate & Food Component Models
 * Procedural Three.js geometries and textures for 6 authentic UK cafe dishes.
 */

const FoodModels = (() => {
  // Texture Generator Cache
  const textures = {};

  // Helper: Create a high-res procedural canvas texture
  function makeCanvasTexture(width, height, drawFn) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    drawFn(ctx, width, height);
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    return texture;
  }

  // --- Procedural Canvas Textures ---

  // 1. Stoneware Ceramic Plate (speckled oatmeal glaze)
  textures.stoneware = makeCanvasTexture(512, 512, (ctx, w, h) => {
    // Base warm cream
    ctx.fillStyle = '#F3EFE6';
    ctx.fillRect(0, 0, w, h);

    // Subtle concentric pottery turn rings
    ctx.strokeStyle = 'rgba(215, 205, 190, 0.25)';
    ctx.lineWidth = 1.5;
    const cx = w / 2, cy = h / 2;
    for (let r = 20; r < w * 0.7; r += 12) {
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Artisanal mineral speckles (terracotta, charcoal, umber)
    const speckleColors = ['#5A4232', '#7A5B46', '#2D2825', '#A47D62'];
    for (let i = 0; i < 900; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const radius = Math.random() < 0.85 ? Math.random() * 1.2 + 0.3 : Math.random() * 2.2 + 1.2;
      ctx.fillStyle = speckleColors[Math.floor(Math.random() * speckleColors.length)];
      ctx.globalAlpha = Math.random() * 0.6 + 0.2;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1.0;

    // Organic rim edge gradient
    const grad = ctx.createRadialGradient(cx, cy, w * 0.35, cx, cy, w * 0.49);
    grad.addColorStop(0, 'rgba(243, 239, 230, 0)');
    grad.addColorStop(0.85, 'rgba(210, 195, 175, 0.4)');
    grad.addColorStop(1, 'rgba(165, 140, 115, 0.85)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);
  });

  // 2. Sourdough Crust & Crumb
  textures.sourdough = makeCanvasTexture(512, 512, (ctx, w, h) => {
    ctx.fillStyle = '#EBD5B3';
    ctx.fillRect(0, 0, w, h);
    // Crumb bubbles
    ctx.fillStyle = '#D9BE98';
    for (let i = 0; i < 400; i++) {
      const x = Math.random() * w;
      const y = Math.random() * h;
      const r = Math.random() * 4 + 1;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    }
    // Flour dusting
    ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
    for (let i = 0; i < 300; i++) {
      ctx.fillRect(Math.random() * w, Math.random() * h, Math.random() * 3 + 1, Math.random() * 3 + 1);
    }
  });

  // 3. Panko Golden Crumb (Fish Fingers)
  textures.panko = makeCanvasTexture(256, 256, (ctx, w, h) => {
    ctx.fillStyle = '#DDA03B';
    ctx.fillRect(0, 0, w, h);
    // Golden crunchy flecks
    const colors = ['#C4831B', '#F4C066', '#A7680D', '#F9D88E'];
    for (let i = 0; i < 1200; i++) {
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.fillRect(Math.random() * w, Math.random() * h, Math.random() * 3 + 1, Math.random() * 3 + 1);
    }
  });

  // 4. Smoked Salmon Marbling
  textures.salmon = makeCanvasTexture(256, 256, (ctx, w, h) => {
    ctx.fillStyle = '#FA8072';
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = '#FADBD8';
    ctx.lineWidth = 3;
    for (let y = 0; y < h; y += 14) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.bezierCurveTo(w * 0.33, y + 6, w * 0.66, y - 6, w, y + 2);
      ctx.stroke();
    }
  });

  // 5. Bacon rasher streaks
  textures.bacon = makeCanvasTexture(256, 256, (ctx, w, h) => {
    ctx.fillStyle = '#8B2500';
    ctx.fillRect(0, 0, w, h);
    // Fat streaks
    ctx.fillStyle = '#F5DEB3';
    ctx.fillRect(0, 40, w, 28);
    ctx.fillRect(0, 110, w, 32);
    ctx.fillRect(0, 190, w, 22);
    // Crispy brown edges
    ctx.fillStyle = 'rgba(60, 20, 10, 0.4)';
    ctx.fillRect(0, 0, w, 15);
    ctx.fillRect(0, h - 15, w, 15);
  });

  // 6. Sausage Grill Marks
  textures.sausage = makeCanvasTexture(256, 256, (ctx, w, h) => {
    ctx.fillStyle = '#6E3219';
    ctx.fillRect(0, 0, w, h);
    // Subtle roasted speckle
    ctx.fillStyle = '#54220F';
    for (let i = 0; i < 400; i++) {
      ctx.fillRect(Math.random() * w, Math.random() * h, 2, 2);
    }
    // Grill scorch bars
    ctx.fillStyle = '#2B1107';
    for (let x = 30; x < w; x += 45) {
      ctx.fillRect(x, 0, 8, h);
    }
  });

  // Common Materials
  const materials = {
    ceramic: new THREE.MeshStandardMaterial({
      map: textures.stoneware,
      roughness: 0.38,
      metalness: 0.05,
    }),
    ceramicRim: new THREE.MeshStandardMaterial({
      color: 0x96785c,
      roughness: 0.65,
    }),
    ramekin: new THREE.MeshStandardMaterial({
      color: 0xEEE7DC,
      roughness: 0.25,
      metalness: 0.1,
    }),
    terracottaRamekin: new THREE.MeshStandardMaterial({
      color: 0xB85435,
      roughness: 0.7,
      metalness: 0.02,
    }),
    eggWhite: new THREE.MeshStandardMaterial({
      color: 0xFDFBF7,
      roughness: 0.35,
      metalness: 0.02,
    }),
    eggYolk: new THREE.MeshStandardMaterial({
      color: 0xF58505,
      roughness: 0.08,
      metalness: 0.05,
    }),
    toastCrust: new THREE.MeshStandardMaterial({
      color: 0x5E381C,
      roughness: 0.85,
    }),
    toastCrumb: new THREE.MeshStandardMaterial({
      map: textures.sourdough,
      roughness: 0.75,
    }),
    sausage: new THREE.MeshStandardMaterial({
      map: textures.sausage,
      roughness: 0.35,
      metalness: 0.08,
    }),
    bacon: new THREE.MeshStandardMaterial({
      map: textures.bacon,
      roughness: 0.42,
    }),
    tomato: new THREE.MeshStandardMaterial({
      color: 0xC82222,
      roughness: 0.22,
      metalness: 0.06,
    }),
    tomatoCore: new THREE.MeshStandardMaterial({
      color: 0x8C1414,
      roughness: 0.5,
    }),
    mushrooms: new THREE.MeshStandardMaterial({
      color: 0x483225,
      roughness: 0.36,
      metalness: 0.04,
    }),
    bakedBeans: new THREE.MeshStandardMaterial({
      color: 0xB63E16,
      roughness: 0.22,
    }),
    beanGrain: new THREE.MeshStandardMaterial({
      color: 0xD4663B,
      roughness: 0.28,
    }),
    fishFinger: new THREE.MeshStandardMaterial({
      map: textures.panko,
      roughness: 0.75,
    }),
    briocheBun: new THREE.MeshStandardMaterial({
      color: 0xD89B48,
      roughness: 0.3,
    }),
    briocheBase: new THREE.MeshStandardMaterial({
      color: 0xF3C98B,
      roughness: 0.7,
    }),
    peas: new THREE.MeshStandardMaterial({
      color: 0x58A33D,
      roughness: 0.45,
    }),
    tartare: new THREE.MeshStandardMaterial({
      color: 0xFAF6EB,
      roughness: 0.4,
    }),
    lemonSkin: new THREE.MeshStandardMaterial({
      color: 0xF7D02C,
      roughness: 0.4,
    }),
    lemonFlesh: new THREE.MeshStandardMaterial({
      color: 0xFFF066,
      roughness: 0.25,
    }),
    salmon: new THREE.MeshStandardMaterial({
      map: textures.salmon,
      roughness: 0.35,
    }),
    ricotta: new THREE.MeshStandardMaterial({
      color: 0xFAF7F0,
      roughness: 0.6,
    }),
    cucumber: new THREE.MeshStandardMaterial({
      color: 0x6DAE62,
      roughness: 0.3,
      transparent: true,
      opacity: 0.88,
    }),
    herbs: new THREE.MeshStandardMaterial({
      color: 0x2E6B34,
      roughness: 0.5,
    }),
    cheddar: new THREE.MeshStandardMaterial({
      color: 0xE8A027,
      roughness: 0.35,
    }),
    puffPastry: new THREE.MeshStandardMaterial({
      color: 0xD89E4C,
      roughness: 0.6,
    }),
    chutney: new THREE.MeshStandardMaterial({
      color: 0x662D15,
      roughness: 0.25,
    }),
    prawn: new THREE.MeshStandardMaterial({
      color: 0xF48FB1,
      roughness: 0.3,
    }),
    chicoryRed: new THREE.MeshStandardMaterial({
      color: 0x7E1D2D,
      roughness: 0.4,
    }),
  };

  // --- Reusable Item Builders ---

  // 1. Ceramic Plate Mesh
  function createPlate() {
    const group = new THREE.Group();
    group.name = 'Plate_Master';

    // Plate Base Rim (beveled shallow dish)
    // Points for LatheGeometry to create authentic Bristol stoneware rim
    const points = [
      new THREE.Vector2(0, 0),
      new THREE.Vector2(1.9, 0),
      new THREE.Vector2(2.1, 0.04),
      new THREE.Vector2(2.4, 0.22), // sloping rim
      new THREE.Vector2(2.55, 0.30), // rim lip
      new THREE.Vector2(2.52, 0.27),
      new THREE.Vector2(2.35, 0.12),
      new THREE.Vector2(1.85, -0.05),
      new THREE.Vector2(1.7, -0.09), // footring
      new THREE.Vector2(1.6, -0.09),
      new THREE.Vector2(1.5, -0.04),
      new THREE.Vector2(0, -0.04)
    ];

    const latheGeom = new THREE.LatheGeometry(points, 64);
    latheGeom.computeVertexNormals();

    const plateMesh = new THREE.Mesh(latheGeom, materials.ceramic);
    plateMesh.receiveShadow = true;
    plateMesh.castShadow = true;
    group.add(plateMesh);

    // Subtle unglazed bottom footring line
    const footringGeom = new THREE.TorusGeometry(1.65, 0.02, 16, 64);
    footringGeom.rotateX(Math.PI / 2);
    const footring = new THREE.Mesh(footringGeom, materials.ceramicRim);
    footring.position.y = -0.08;
    group.add(footring);

    return group;
  }

  // Helper: Wrapper for food component
  function wrapItem(name, details, mesh, radius = 0.5) {
    const group = new THREE.Group();
    group.name = name;
    group.userData = {
      isFoodItem: true,
      itemName: name,
      itemDetails: details,
      footprintRadius: radius,
      hoverElevation: 0.12,
      dragElevation: 0.42,
    };
    group.add(mesh);
    return group;
  }

  // --- Specific Food Items ---

  // Sunny-side Fried Egg
  function createFriedEgg() {
    const eggGroup = new THREE.Group();

    // White albumen with organic wobble
    const shape = new THREE.Shape();
    const pts = 24;
    for (let i = 0; i <= pts; i++) {
      const angle = (i / pts) * Math.PI * 2;
      const r = 0.65 + Math.sin(angle * 3) * 0.12 + Math.cos(angle * 2) * 0.08;
      const x = Math.cos(angle) * r;
      const y = Math.sin(angle) * r;
      if (i === 0) shape.moveTo(x, y);
      else shape.lineTo(x, y);
    }
    const extrudeSettings = { depth: 0.04, bevelEnabled: true, bevelSegments: 3, steps: 1, bevelSize: 0.03, bevelThickness: 0.02 };
    const whiteGeom = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    whiteGeom.rotateX(-Math.PI / 2);
    const whiteMesh = new THREE.Mesh(whiteGeom, materials.eggWhite);
    whiteMesh.castShadow = true;
    whiteMesh.receiveShadow = true;
    eggGroup.add(whiteMesh);

    // Golden runny yolk
    const yolkGeom = new THREE.SphereGeometry(0.24, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const yolkMesh = new THREE.Mesh(yolkGeom, materials.eggYolk);
    yolkMesh.position.set(0.06, 0.04, -0.04);
    yolkMesh.scale.set(1, 0.75, 1);
    yolkMesh.castShadow = true;
    eggGroup.add(yolkMesh);

    // Pepper flecks
    const pepperCount = 18;
    const pepGeom = new THREE.BoxGeometry(0.015, 0.005, 0.015);
    const pepMat = new THREE.MeshBasicMaterial({ color: 0x222222 });
    for (let i = 0; i < pepperCount; i++) {
      const pep = new THREE.Mesh(pepGeom, pepMat);
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.random() * 0.22;
      pep.position.set(0.06 + Math.cos(angle) * dist, 0.18 * (1 - dist), -0.04 + Math.sin(angle) * dist);
      eggGroup.add(pep);
    }

    return wrapItem('Free-Range Fried Egg', 'Golden runny yolk, crisp lacy edges', eggGroup, 0.65);
  }

  // Cumberland Sausage
  function createSausage(length = 1.0, curve = 0.15) {
    const sGroup = new THREE.Group();
    // Curved path for sausage
    class CurvePath extends THREE.Curve {
      getPoint(t) {
        const x = (t - 0.5) * length;
        const z = Math.sin(t * Math.PI) * curve;
        return new THREE.Vector3(x, 0.12, z);
      }
    }
    const path = new CurvePath();
    const geom = new THREE.TubeGeometry(path, 32, 0.12, 16, false);
    const mesh = new THREE.Mesh(geom, materials.sausage);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    sGroup.add(mesh);

    // Rounded ends
    const endGeom = new THREE.SphereGeometry(0.118, 16, 16);
    const end1 = new THREE.Mesh(endGeom, materials.sausage);
    end1.position.set(-length * 0.5, 0.12, 0);
    sGroup.add(end1);

    const end2 = new THREE.Mesh(endGeom, materials.sausage);
    end2.position.set(length * 0.5, 0.12, 0);
    sGroup.add(end2);

    return wrapItem('West Country Cumberland Sausage', 'Rare breed British pork seasoned with cracked pepper & sage', sGroup, 0.55);
  }

  // Crispy Smoked Streaky Bacon
  function createBacon() {
    const bGroup = new THREE.Group();
    const width = 0.32;
    const length = 1.1;

    const baconGeom = new THREE.PlaneGeometry(length, width, 24, 4);
    const pos = baconGeom.attributes.position;
    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const wave = Math.sin((x / length) * Math.PI * 4) * 0.06 + Math.sin((x / length) * Math.PI * 8) * 0.02;
      pos.setZ(i, wave);
    }
    baconGeom.computeVertexNormals();
    baconGeom.rotateX(-Math.PI / 2);

    const mesh = new THREE.Mesh(baconGeom, materials.bacon);
    mesh.position.y = 0.08;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    bGroup.add(mesh);

    return wrapItem('Smoked Streaky Bacon', 'Sanridge Farm dry-cured beechwood smoked bacon', bGroup, 0.5);
  }

  // Grilled Sourdough Slice
  function createSourdoughSlice(scale = 1.0) {
    const group = new THREE.Group();

    // Sourdough bread slice shape
    const shape = new THREE.Shape();
    shape.moveTo(-0.5, -0.4);
    shape.bezierCurveTo(-0.6, 0.1, -0.55, 0.45, -0.1, 0.55);
    shape.bezierCurveTo(0.2, 0.6, 0.5, 0.45, 0.55, 0.0);
    shape.bezierCurveTo(0.6, -0.35, 0.4, -0.45, 0.0, -0.42);
    shape.lineTo(-0.5, -0.4);

    const extrude = { depth: 0.12, bevelEnabled: true, bevelSegments: 2, steps: 1, bevelSize: 0.02, bevelThickness: 0.02 };
    const geom = new THREE.ExtrudeGeometry(shape, extrude);
    geom.rotateX(-Math.PI / 2);
    geom.scale(scale, scale, scale);

    const mesh = new THREE.Mesh(geom, materials.toastCrumb);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);

    return wrapItem('Grilled Sourdough', 'Clifton artisan sourdough charred on the flat top with salted butter', group, 0.6 * scale);
  }

  // Procedural Grilled Tomato Face
  textures.tomatoFace = makeCanvasTexture(256, 256, (ctx, w, h) => {
    // Rich red tomato flesh
    const grad = ctx.createRadialGradient(w/2, h/2, 10, w/2, h/2, w/2);
    grad.addColorStop(0, '#C22828');
    grad.addColorStop(0.7, '#A51B1B');
    grad.addColorStop(1, '#680F0F');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // Seed gel pockets (4 chambers)
    ctx.fillStyle = '#611111';
    for (let a = 0; a < 4; a++) {
      const ang = (a * Math.PI) / 2 + Math.PI / 4;
      const x = w/2 + Math.cos(ang) * 55;
      const y = h/2 + Math.sin(ang) * 55;
      ctx.beginPath();
      ctx.arc(x, y, 24, 0, Math.PI * 2);
      ctx.fill();

      // Yellowish tomato seeds
      ctx.fillStyle = '#DFB15B';
      for (let s = 0; s < 3; s++) {
        ctx.beginPath();
        ctx.arc(x + (s - 1) * 8, y + (s % 2) * 5, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#611111';
    }

    // Grill scorch marks
    ctx.strokeStyle = 'rgba(25, 12, 8, 0.85)';
    ctx.lineWidth = 14;
    ctx.lineCap = 'round';
    [-45, 0, 45].forEach(offset => {
      ctx.beginPath();
      ctx.moveTo(35, h/2 + offset);
      ctx.lineTo(w - 35, h/2 + offset);
      ctx.stroke();
    });

    // Thyme herb flakes
    ctx.fillStyle = '#264E24';
    for (let i = 0; i < 25; i++) {
      ctx.fillRect(Math.random() * (w - 60) + 30, Math.random() * (h - 60) + 30, 4, 2);
    }
  });

  materials.tomatoFace = new THREE.MeshStandardMaterial({
    map: textures.tomatoFace,
    roughness: 0.38,
  });

  // Grilled Heritage Tomato Half
  function createGrilledTomato() {
    const group = new THREE.Group();
    const radius = 0.32;
    // Ripe red curved skin
    const geom = new THREE.SphereGeometry(radius, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const skin = new THREE.Mesh(geom, materials.tomato);
    skin.rotation.x = Math.PI;
    skin.position.y = radius * 0.7;
    skin.castShadow = true;
    group.add(skin);

    // Textured grilled cut face
    const faceGeom = new THREE.CircleGeometry(radius, 32);
    faceGeom.rotateX(-Math.PI / 2);
    const face = new THREE.Mesh(faceGeom, materials.tomatoFace);
    face.position.y = radius * 0.7 + 0.002;
    face.receiveShadow = true;
    group.add(face);

    // Slight tilt so the grilled face is appetizingly visible
    group.rotation.x = 0.25;
    group.rotation.z = -0.15;

    return wrapItem('Slow-Roasted Heritage Tomato', 'Sweet roasted plum tomato with fresh garden thyme & sea salt', group, 0.35);
  }

  // Sautéed Thyme Mushrooms
  function createMushrooms() {
    const group = new THREE.Group();
    // 3 mushrooms grouped
    const offsets = [
      { x: -0.15, z: 0.0, s: 0.22, rot: 0.2 },
      { x: 0.15, z: 0.1, s: 0.18, rot: -0.3 },
      { x: 0.02, z: -0.16, s: 0.2, rot: 0.1 },
    ];

    offsets.forEach(cfg => {
      const mSub = new THREE.Group();
      // Cap
      const capGeom = new THREE.SphereGeometry(cfg.s, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.55);
      const cap = new THREE.Mesh(capGeom, materials.mushrooms);
      cap.position.y = cfg.s * 0.6;
      cap.castShadow = true;
      mSub.add(cap);

      // Stem
      const stemGeom = new THREE.CylinderGeometry(cfg.s * 0.3, cfg.s * 0.35, cfg.s * 0.6, 12);
      const stem = new THREE.Mesh(stemGeom, materials.mushrooms);
      stem.position.y = cfg.s * 0.3;
      mSub.add(stem);

      mSub.position.set(cfg.x, 0, cfg.z);
      mSub.rotation.z = cfg.rot;
      group.add(mSub);
    });

    return wrapItem('Pan-Sautéed Thyme Mushrooms', 'Chestnut field mushrooms glazed in garlic & British herb butter', group, 0.4);
  }

  // Ramekin of Homemade Smoky Baked Beans
  function createBeansRamekin() {
    const group = new THREE.Group();
    // Ceramic pot
    const potGeom = new THREE.CylinderGeometry(0.38, 0.32, 0.3, 32);
    const pot = new THREE.Mesh(potGeom, materials.terracottaRamekin);
    pot.position.y = 0.15;
    pot.castShadow = true;
    pot.receiveShadow = true;
    group.add(pot);

    // Sauce surface
    const sauceGeom = new THREE.CylinderGeometry(0.35, 0.35, 0.04, 32);
    const sauce = new THREE.Mesh(sauceGeom, materials.bakedBeans);
    sauce.position.y = 0.28;
    group.add(sauce);

    // Individual visible beans poking out
    const beanGeom = new THREE.SphereGeometry(0.06, 12, 8);
    beanGeom.scale(1.4, 0.8, 0.9);
    for (let i = 0; i < 9; i++) {
      const bean = new THREE.Mesh(beanGeom, materials.beanGrain);
      const angle = (i / 9) * Math.PI * 2 + Math.random() * 0.3;
      const rad = Math.random() * 0.22;
      bean.position.set(Math.cos(angle) * rad, 0.3, Math.sin(angle) * rad);
      bean.rotation.set(Math.random(), Math.random(), Math.random());
      group.add(bean);
    }

    return wrapItem('Smoky Haricot Beans Ramekin', 'House slow-cooked beans in rich smoked paprika & cider tomato glaze', group, 0.42);
  }

  // Golden Fish Finger
  function createFishFinger(label = 'Crispy Fish Finger') {
    const group = new THREE.Group();
    const geom = new THREE.BoxGeometry(0.35, 0.18, 1.05);
    const mesh = new THREE.Mesh(geom, materials.fishFinger);
    mesh.position.y = 0.09;
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    group.add(mesh);

    return wrapItem(label, 'Day-boat cod fillet in golden crunchy panko crumb', group, 0.5);
  }

  // Brioche Bun Half (Top or Bottom)
  function createBriocheBun(isTop = true) {
    const group = new THREE.Group();
    if (isTop) {
      const topGeom = new THREE.SphereGeometry(0.65, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
      topGeom.scale(1, 0.5, 1);
      const topMesh = new THREE.Mesh(topGeom, materials.briocheBun);
      topMesh.position.y = 0.02;
      topMesh.castShadow = true;
      group.add(topMesh);

      // Sesame seeds
      const seedGeom = new THREE.BoxGeometry(0.02, 0.01, 0.04);
      const seedMat = new THREE.MeshBasicMaterial({ color: 0xFDFBF7 });
      for (let i = 0; i < 35; i++) {
        const seed = new THREE.Mesh(seedGeom, seedMat);
        const u = Math.random() * Math.PI * 2;
        const v = Math.random() * 0.45;
        seed.position.set(Math.cos(u) * Math.cos(v) * 0.62, Math.sin(v) * 0.32 + 0.02, Math.sin(u) * Math.cos(v) * 0.62);
        seed.rotation.y = u;
        group.add(seed);
      }
      return wrapItem('Glazed Brioche Bun Top', 'Toasted Clifton bakery brioche bun crown with golden glaze', group, 0.65);
    } else {
      const bGeom = new THREE.CylinderGeometry(0.65, 0.6, 0.16, 24);
      const bMesh = new THREE.Mesh(bGeom, materials.briocheBase);
      bMesh.position.y = 0.08;
      bMesh.castShadow = true;
      group.add(bMesh);
      return wrapItem('Buttered Brioche Heel', 'Toasted with West Country farm butter', group, 0.65);
    }
  }

  // Crushed Minted Peas Quenelle
  function createMintedPeas() {
    const group = new THREE.Group();
    // Quenelle egg-like shape
    const geom = new THREE.SphereGeometry(0.3, 16, 16);
    geom.scale(1.2, 0.65, 0.7);
    const mesh = new THREE.Mesh(geom, materials.peas);
    mesh.position.y = 0.12;
    mesh.castShadow = true;
    group.add(mesh);

    // Fresh mint sprig
    const leafGeom = new THREE.ConeGeometry(0.08, 0.18, 5);
    leafGeom.rotateX(Math.PI * 0.4);
    const leaf = new THREE.Mesh(leafGeom, materials.herbs);
    leaf.position.set(0, 0.24, 0);
    group.add(leaf);

    return wrapItem('Crushed Minted Peas', 'Sweet English garden peas smashed with fresh garden mint & lemon zest', group, 0.35);
  }

  // House Tartare Sauce Ramekin
  function createTartarePot() {
    const group = new THREE.Group();
    const potGeom = new THREE.CylinderGeometry(0.28, 0.24, 0.22, 24);
    const pot = new THREE.Mesh(potGeom, materials.ramekin);
    pot.position.y = 0.11;
    pot.castShadow = true;
    group.add(pot);

    const sauceGeom = new THREE.CylinderGeometry(0.26, 0.26, 0.02, 24);
    const sauce = new THREE.Mesh(sauceGeom, materials.tartare);
    sauce.position.y = 0.21;
    group.add(sauce);

    // Caper bits
    const caperGeom = new THREE.SphereGeometry(0.035, 8, 8);
    for (let i = 0; i < 4; i++) {
      const caper = new THREE.Mesh(caperGeom, materials.herbs);
      caper.position.set((Math.random() - 0.5) * 0.25, 0.22, (Math.random() - 0.5) * 0.25);
      group.add(caper);
    }

    return wrapItem('Cornish Tartare Sauce', 'Creamy homemade mayo with capers, shallots, gherkins & dill', group, 0.32);
  }

  // Fresh Lemon Wedge
  function createLemonWedge() {
    const group = new THREE.Group();
    const geom = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 16, 1, false, 0, Math.PI * 0.35);
    geom.rotateX(Math.PI / 2);
    const mesh = new THREE.Mesh(geom, materials.lemonSkin);
    mesh.castShadow = true;
    group.add(mesh);

    const flesh = new THREE.Mesh(new THREE.CylinderGeometry(0.26, 0.26, 0.21, 16, 1, false, 0.05, Math.PI * 0.3), materials.lemonFlesh);
    flesh.rotateX(Math.PI / 2);
    group.add(flesh);

    return wrapItem('Juicy Lemon Wedge', 'Sun-ripened unwaxed lemon to squeeze over crispy seafood', group, 0.3);
  }

  // Smoked Salmon Ribbon Fold
  function createSalmonRibbon(label = 'Severn & Wye Smoked Salmon') {
    const group = new THREE.Group();
    // Flowing wavy ribbon
    const geom = new THREE.CylinderGeometry(0.35, 0.4, 0.18, 18, 2, true);
    geom.scale(1, 0.6, 0.7);
    const mesh = new THREE.Mesh(geom, materials.salmon);
    mesh.position.y = 0.1;
    mesh.rotation.x = 0.4;
    mesh.castShadow = true;
    group.add(mesh);

    // Inner fold
    const inner = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.25, 0.14, 14, 1, true), materials.salmon);
    inner.position.set(0.05, 0.12, -0.05);
    inner.rotation.z = -0.3;
    group.add(inner);

    return wrapItem(label, 'Severn & Wye estuary cured salmon delicately sliced', group, 0.45);
  }

  // Whipped Ricotta Quenelle
  function createRicottaQuenelle() {
    const group = new THREE.Group();
    const geom = new THREE.SphereGeometry(0.28, 16, 16);
    geom.scale(1.2, 0.6, 0.75);
    const mesh = new THREE.Mesh(geom, materials.ricotta);
    mesh.position.y = 0.12;
    mesh.castShadow = true;
    group.add(mesh);

    // Dill garnish
    const dillGeom = new THREE.BoxGeometry(0.02, 0.005, 0.15);
    for (let i = 0; i < 5; i++) {
      const dill = new THREE.Mesh(dillGeom, materials.herbs);
      dill.position.set((Math.random() - 0.5) * 0.2, 0.24, (Math.random() - 0.5) * 0.2);
      dill.rotation.y = Math.random() * Math.PI;
      group.add(dill);
    }

    return wrapItem('Whipped Lemon & Tarragon Ricotta', 'Light creamy curds folded with zest, tarragon & cold-pressed oil', group, 0.35);
  }

  // Pickled Cucumber Ribbon
  function createCucumberRibbon() {
    const group = new THREE.Group();
    const geom = new THREE.TorusGeometry(0.25, 0.06, 8, 24, Math.PI * 1.4);
    geom.scale(1.2, 0.5, 0.8);
    geom.rotateX(Math.PI / 2);
    const mesh = new THREE.Mesh(geom, materials.cucumber);
    mesh.position.y = 0.05;
    mesh.castShadow = true;
    group.add(mesh);

    return wrapItem('Pickled Cucumber Ribbons', 'Crisp local cucumber steeped in cider vinegar & dill seed', group, 0.3);
  }

  // Smoky Beans Heap (for Beans on Toast)
  function createBeansHeap() {
    const group = new THREE.Group();
    // Rich stew mound
    const baseGeom = new THREE.SphereGeometry(0.55, 24, 16, 0, Math.PI * 2, 0, Math.PI * 0.5);
    baseGeom.scale(1.1, 0.35, 0.9);
    const base = new THREE.Mesh(baseGeom, materials.bakedBeans);
    base.position.y = 0.05;
    base.castShadow = true;
    group.add(base);

    // Whole visible beans
    const bGeom = new THREE.SphereGeometry(0.07, 10, 8);
    bGeom.scale(1.4, 0.8, 0.9);
    for (let i = 0; i < 16; i++) {
      const b = new THREE.Mesh(bGeom, materials.beanGrain);
      const ang = Math.random() * Math.PI * 2;
      const r = Math.random() * 0.38;
      b.position.set(Math.cos(ang) * r, 0.12 + Math.random() * 0.06, Math.sin(ang) * r);
      b.rotation.set(Math.random(), Math.random(), Math.random());
      group.add(b);
    }

    return wrapItem('Smoky Tomato & Borlotti Beans', 'Rich braised Italian borlotti & cannellini in smoked paprika ragù', group, 0.55);
  }

  // Melted Montgomery Cheddar Shavings
  function createCheddarMelt() {
    const group = new THREE.Group();
    const geom = new THREE.BoxGeometry(0.4, 0.04, 0.25);
    const mesh1 = new THREE.Mesh(geom, materials.cheddar);
    mesh1.position.set(0, 0.04, 0);
    mesh1.rotation.y = 0.4;
    group.add(mesh1);

    const mesh2 = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.03, 0.2), materials.cheddar);
    mesh2.position.set(0.1, 0.07, 0.05);
    mesh2.rotation.y = -0.3;
    group.add(mesh2);

    return wrapItem('24-Month Montgomery Cheddar', 'Sharp, nutty cave-aged Somerset unpasteurised cheddar curls', group, 0.38);
  }

  // Fish Pie Crostini (Tribute to Jamie Oliver bake!)
  function createFishPieCrostini() {
    const group = new THREE.Group();
    // Golden puff crostini boat
    const crustGeom = new THREE.CylinderGeometry(0.55, 0.48, 0.22, 28);
    crustGeom.scale(1.2, 1, 0.85);
    const crust = new THREE.Mesh(crustGeom, materials.puffPastry);
    crust.position.y = 0.11;
    crust.castShadow = true;
    crust.receiveShadow = true;
    group.add(crust);

    // Bubbly broiled cheesy topping
    const topGeom = new THREE.CylinderGeometry(0.5, 0.5, 0.04, 24);
    topGeom.scale(1.15, 1, 0.8);
    const top = new THREE.Mesh(topGeom, materials.cheddar);
    top.position.y = 0.22;
    group.add(top);

    // Curled pink king prawn on top
    const prawnGeom = new THREE.TorusGeometry(0.18, 0.06, 12, 18, Math.PI * 1.3);
    const prawn = new THREE.Mesh(prawnGeom, materials.prawn);
    prawn.position.set(-0.05, 0.28, 0);
    prawn.rotation.x = Math.PI / 2;
    prawn.rotation.z = 0.5;
    prawn.castShadow = true;
    group.add(prawn);

    return wrapItem("Jamie's Fish Pie Velouté Crostini", 'Smoked haddock, salmon, king prawns, sweet leeks & bubbling cheddar', group, 0.65);
  }

  // Chicory & Wild Rocket Salad
  function createChicorySalad() {
    const group = new THREE.Group();
    // Chicory leaves
    for (let i = 0; i < 4; i++) {
      const leafGeom = new THREE.ConeGeometry(0.12, 0.45, 8);
      leafGeom.scale(1.2, 1, 0.3);
      const leaf = new THREE.Mesh(leafGeom, materials.chicoryRed);
      const ang = (i / 4) * Math.PI * 2 + 0.3;
      leaf.position.set(Math.cos(ang) * 0.15, 0.12, Math.sin(ang) * 0.15);
      leaf.rotation.z = Math.cos(ang) * 0.6;
      leaf.rotation.x = Math.sin(ang) * 0.6;
      leaf.castShadow = true;
      group.add(leaf);
    }

    // Rocket sprigs
    const rocket = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.35, 5), materials.herbs);
    rocket.position.set(0, 0.18, 0);
    group.add(rocket);

    return wrapItem('Red Chicory & Peppery Rocket', 'Dressed in Somerset cider vinegar & cold-pressed rapeseed oil', group, 0.4);
  }

  // Artisan Pork & Apple Sausage Roll
  function createSausageRoll(halfIndex = 1) {
    const group = new THREE.Group();
    const radius = 0.28;
    const length = 0.65;

    // Golden fluted cylinder
    const rollGeom = new THREE.CylinderGeometry(radius, radius, length, 24);
    rollGeom.rotateZ(Math.PI / 2);
    const roll = new THREE.Mesh(rollGeom, materials.puffPastry);
    roll.position.y = radius;
    roll.castShadow = true;
    roll.receiveShadow = true;
    group.add(roll);

    // Meat filling cross-section
    const coreGeom = new THREE.CircleGeometry(radius * 0.72, 20);
    coreGeom.rotateY(halfIndex === 1 ? -Math.PI / 2 : Math.PI / 2);
    const core = new THREE.Mesh(coreGeom, materials.sausage);
    core.position.set(halfIndex === 1 ? length / 2 + 0.005 : -length / 2 - 0.005, radius, 0);
    group.add(core);

    // Nigella seeds on top
    const seedGeom = new THREE.BoxGeometry(0.015, 0.015, 0.015);
    const seedMat = new THREE.MeshBasicMaterial({ color: 0x111111 });
    for (let i = 0; i < 20; i++) {
      const s = new THREE.Mesh(seedGeom, seedMat);
      s.position.set((Math.random() - 0.5) * (length * 0.8), radius * 2 + 0.005, (Math.random() - 0.5) * 0.2);
      group.add(s);
    }

    const title = halfIndex === 1 ? 'Pork & Apple Roll (Half)' : 'Pork & Apple Roll (Cut Half)';
    return wrapItem(title, 'Flaky all-butter puff pastry stuffed with free-range pork & Bramley apples', group, 0.45);
  }

  // Spiced Apple & Cider Chutney Dish
  function createAppleChutney() {
    const group = new THREE.Group();
    const potGeom = new THREE.CylinderGeometry(0.3, 0.25, 0.2, 24);
    const pot = new THREE.Mesh(potGeom, materials.terracottaRamekin);
    pot.position.y = 0.1;
    pot.castShadow = true;
    group.add(pot);

    const chGeom = new THREE.CylinderGeometry(0.28, 0.28, 0.02, 24);
    const chutney = new THREE.Mesh(chGeom, materials.chutney);
    chutney.position.y = 0.19;
    group.add(chutney);

    return wrapItem('Bramley Apple & Cider Chutney', 'Slow-steeped Somerset apples, mustard seed, allspice & cider vinegar', group, 0.35);
  }

  // Cornichon Pickles Pair
  function createCornichons() {
    const group = new THREE.Group();
    for (let i = 0; i < 2; i++) {
      const cGeom = new THREE.CapsuleGeometry(0.06, 0.25, 8, 12);
      cGeom.rotateZ(Math.PI / 2);
      const pickle = new THREE.Mesh(cGeom, materials.herbs);
      pickle.position.set(0, 0.06, i * 0.14 - 0.07);
      pickle.rotation.y = (i === 0 ? 0.3 : -0.2);
      pickle.castShadow = true;
      group.add(pickle);
    }
    return wrapItem('Dill Cornichons', 'Crispy baby pickles with mustard seeds', group, 0.3);
  }

  // Watercress Bunch
  function createWatercress() {
    const group = new THREE.Group();
    for (let i = 0; i < 6; i++) {
      const leafGeom = new THREE.CircleGeometry(0.08, 8);
      leafGeom.rotateX(-Math.PI * 0.3);
      const leaf = new THREE.Mesh(leafGeom, materials.herbs);
      const ang = (i / 6) * Math.PI * 2;
      leaf.position.set(Math.cos(ang) * 0.16, 0.1 + Math.random() * 0.05, Math.sin(ang) * 0.16);
      group.add(leaf);
    }
    return wrapItem('Crisp Dressed Watercress', 'Peppery Hampshire watercress sprigs', group, 0.35);
  }

  // --- 6 DISH DEFINITIONS ---

  const DISHES = [
    {
      id: 'full-english',
      name: 'The Pigeons Full English',
      tagline: 'The Quintessential Bristolian Morning Feast',
      price: '£14.50',
      timeServed: 'Served All Day (8:00am - 3:30pm)',
      badges: ['Locally Sourced', 'GF Option Available', 'Bristol Roast Pairing'],
      pairing: 'BS1 Espresso Flat White or Pigeons Bloody Mary',
      description: 'Handmade Cumberland pork sausage, Sanridge Farm dry-cured streaky bacon, free-range fried egg with runny golden yolk, slow-roasted heritage tomato, thyme field mushrooms, house smoky baked beans and grilled artisan sourdough.',
      quote: '“The gold standard of Bristol brunching — every ingredient has a story.”',
      items: [
        { create: createFriedEgg, defaultPos: { x: -0.45, y: 0.02, z: 0.35 }, defaultRot: { x: 0, y: 0.2, z: 0 } },
        { create: createSausage, defaultPos: { x: 0.55, y: 0.02, z: 0.2 }, defaultRot: { x: 0, y: -0.6, z: 0 } },
        { create: createBacon, defaultPos: { x: 0.1, y: 0.02, z: -0.7 }, defaultRot: { x: 0, y: 0.4, z: 0 } },
        { create: () => createSourdoughSlice(1.0), defaultPos: { x: -0.85, y: 0.02, z: -0.4 }, defaultRot: { x: 0, y: 0.8, z: 0 } },
        { create: createGrilledTomato, defaultPos: { x: 0.75, y: 0.02, z: -0.5 }, defaultRot: { x: 0, y: 0, z: 0 } },
        { create: createMushrooms, defaultPos: { x: 0.0, y: 0.02, z: 0.7 }, defaultRot: { x: 0, y: 0.5, z: 0 } },
        { create: createBeansRamekin, defaultPos: { x: -0.2, y: 0.02, z: -0.2 }, defaultRot: { x: 0, y: 0, z: 0 } },
      ]
    },
    {
      id: 'fish-fingers',
      name: 'Crispy Day-Boat Fish Finger Sandwich',
      tagline: 'Artisanal Panko Cod, Minted Peas & House Tartare',
      price: '£13.25',
      timeServed: 'Served From 11:30am',
      badges: ['Sustainable Catch', 'British Classic', 'House Pickles'],
      pairing: 'Lost and Grounded Keller Pils or Elderflower Spritz',
      description: 'Thick day-boat British cod loins in golden crunchy panko crumb, served inside a toasted Clifton bakery brioche bun with crushed minted garden peas, homemade Cornish tartare sauce and fresh lemon.',
      quote: '“Takes the nostalgic childhood sandwich and turns it into pure culinary joy.”',
      items: [
        { create: () => createBriocheBun(false), defaultPos: { x: -0.4, y: 0.02, z: 0.1 }, defaultRot: { x: 0, y: 0.1, z: 0 } },
        { create: () => createFishFinger('Golden Cod Finger I'), defaultPos: { x: -0.4, y: 0.18, z: 0.15 }, defaultRot: { x: 0, y: 0.4, z: 0 } },
        { create: () => createFishFinger('Golden Cod Finger II'), defaultPos: { x: -0.3, y: 0.28, z: -0.05 }, defaultRot: { x: 0, y: 0.25, z: 0 } },
        { create: () => createBriocheBun(true), defaultPos: { x: 0.7, y: 0.02, z: 0.45 }, defaultRot: { x: 0, y: -0.3, z: 0 } },
        { create: createMintedPeas, defaultPos: { x: 0.4, y: 0.02, z: -0.55 }, defaultRot: { x: 0, y: 0.2, z: 0 } },
        { create: createTartarePot, defaultPos: { x: -0.55, y: 0.02, z: -0.7 }, defaultRot: { x: 0, y: 0, z: 0 } },
        { create: createLemonWedge, defaultPos: { x: 0.85, y: 0.02, z: -0.1 }, defaultRot: { x: 0, y: 1.2, z: 0 } },
      ]
    },
    {
      id: 'beans-on-toast',
      name: 'Smoky Sourdough Beans & Montgomery Cheddar',
      tagline: 'Slow-Braised Heirloom Beans on Charred Sourdough',
      price: '£10.50',
      timeServed: 'Served All Day',
      badges: ['Vegetarian', 'Vegan Option', 'Cave-Aged Cheddar'],
      pairing: 'Oat Flat White or Bristol Craft Cider',
      description: 'Heirloom borlotti and cannellini beans gently stewed in a rich tomato, roasted garlic and smoked pimentón reduction, ladled over charred garlic sourdough and smothered in shavings of 24-month Montgomery Somerset cheddar.',
      quote: '“The humble UK cafe beans on toast elevated to bistro perfection.”',
      items: [
        { create: () => createSourdoughSlice(1.2), defaultPos: { x: -0.1, y: 0.02, z: 0.0 }, defaultRot: { x: 0, y: 0.3, z: 0 } },
        { create: createBeansHeap, defaultPos: { x: 0.0, y: 0.14, z: 0.05 }, defaultRot: { x: 0, y: 0, z: 0 } },
        { create: createCheddarMelt, defaultPos: { x: 0.1, y: 0.28, z: -0.05 }, defaultRot: { x: 0, y: 0.5, z: 0 } },
        { create: createFriedEgg, defaultPos: { x: 0.8, y: 0.02, z: -0.4 }, defaultRot: { x: 0, y: -0.4, z: 0 } },
        { create: createGrilledTomato, defaultPos: { x: -0.85, y: 0.02, z: 0.5 }, defaultRot: { x: 0, y: 0.8, z: 0 } },
        { create: createMushrooms, defaultPos: { x: -0.7, y: 0.02, z: -0.6 }, defaultRot: { x: 0, y: -0.2, z: 0 } },
      ]
    },
    {
      id: 'smoked-salmon',
      name: 'Severn & Wye Smoked Salmon & Herbed Ricotta',
      tagline: 'Artisanal Cold-Smoked Salmon on Seeded Rye',
      price: '£13.95',
      timeServed: 'Served All Day',
      badges: ['Severn & Wye Smokery', 'High Protein', 'Gluten-Free Available'],
      pairing: 'Chilled Buck’s Fizz or Sparkling English Cyder',
      description: 'Locally cured oak-smoked salmon ribbons from Gloucestershire, paired with whipped lemon-tarragon ricotta, pickled cucumber ribbons, caper berries and fresh baby dill on toasted seeded rye.',
      quote: '“Delicate, vibrant, and celebrates the produce of the Severn estuary.”',
      items: [
        { create: () => createSourdoughSlice(1.05), defaultPos: { x: -0.3, y: 0.02, z: -0.1 }, defaultRot: { x: 0, y: 0.4, z: 0 } },
        { create: () => createSalmonRibbon('Salmon Ribbon I'), defaultPos: { x: -0.25, y: 0.16, z: -0.1 }, defaultRot: { x: 0, y: 0.2, z: 0 } },
        { create: () => createSalmonRibbon('Salmon Ribbon II'), defaultPos: { x: 0.5, y: 0.02, z: 0.25 }, defaultRot: { x: 0, y: -0.7, z: 0 } },
        { create: createRicottaQuenelle, defaultPos: { x: -0.2, y: 0.16, z: 0.4 }, defaultRot: { x: 0, y: 0.5, z: 0 } },
        { create: createCucumberRibbon, defaultPos: { x: 0.35, y: 0.02, z: -0.6 }, defaultRot: { x: 0, y: 0.1, z: 0 } },
        { create: createLemonWedge, defaultPos: { x: 0.85, y: 0.02, z: -0.2 }, defaultRot: { x: 0, y: -0.9, z: 0 } },
      ]
    },
    {
      id: 'fish-pie-bake',
      name: "Jamie's Comfort Fish Pie Crostini & Greens",
      tagline: 'Smoked Haddock, Salmon & King Prawn Cheddar Gratin',
      price: '£14.00',
      timeServed: 'Served From 12:00pm Lunch',
      badges: ["Inspired by Jamie's Bake", 'Hearty Comfort', 'Local Seafood'],
      pairing: 'Crisp Sauvignon Blanc or Pigeons Apple Spritz',
      description: 'Inspired by Jamie Oliver’s hearty fish pie bake: tender smoked haddock, flaked salmon and sweet king prawns folded in creamy leek velouté, bubbling beneath a grilled Montgomery cheddar crust on golden puff pastry, with chicory rocket salad.',
      quote: '“Deeply comforting, rich seafood indulgence with peppery garden leaves.”',
      items: [
        { create: createFishPieCrostini, defaultPos: { x: -0.3, y: 0.02, z: 0.0 }, defaultRot: { x: 0, y: 0.2, z: 0 } },
        { create: createChicorySalad, defaultPos: { x: 0.65, y: 0.02, z: 0.2 }, defaultRot: { x: 0, y: -0.4, z: 0 } },
        { create: createLemonWedge, defaultPos: { x: 0.6, y: 0.02, z: -0.6 }, defaultRot: { x: 0, y: 0.7, z: 0 } },
        { create: createTartarePot, defaultPos: { x: -0.75, y: 0.02, z: -0.65 }, defaultRot: { x: 0, y: 0, z: 0 } },
        { create: createCucumberRibbon, defaultPos: { x: -0.7, y: 0.02, z: 0.6 }, defaultRot: { x: 0, y: 0.9, z: 0 } },
      ]
    },
    {
      id: 'sausage-roll',
      name: 'Pork & Bramley Apple Sausage Roll & Chutney',
      tagline: 'All-Butter Flaky Pastry, West Country Pork & Cider Apple',
      price: '£9.75',
      timeServed: 'Served All Day From the Bakery Counter',
      badges: ['Freshly Baked Daily', 'West Country Pork', 'House Chutney'],
      pairing: 'Pigeons House Batch Brew or Somerset Cider',
      description: 'Golden puff pastry freshly baked every morning, packed with free-range pork shoulder, sage, fennel and sweet Bramley apples, served warm with house-made cider apple chutney and peppery watercress.',
      quote: '“The pastry is impossibly flaky; the filling juicy and perfumed with sage.”',
      items: [
        { create: () => createSausageRoll(1), defaultPos: { x: -0.45, y: 0.02, z: 0.1 }, defaultRot: { x: 0, y: 0.5, z: 0 } },
        { create: () => createSausageRoll(2), defaultPos: { x: 0.15, y: 0.02, z: -0.2 }, defaultRot: { x: 0, y: -0.4, z: 0 } },
        { create: createAppleChutney, defaultPos: { x: 0.65, y: 0.02, z: 0.4 }, defaultRot: { x: 0, y: 0, z: 0 } },
        { create: createCornichons, defaultPos: { x: -0.5, y: 0.02, z: -0.65 }, defaultRot: { x: 0, y: 0.8, z: 0 } },
        { create: createWatercress, defaultPos: { x: 0.45, y: 0.02, z: -0.65 }, defaultRot: { x: 0, y: -0.2, z: 0 } },
      ]
    }
  ];

  return {
    materials,
    createPlate,
    DISHES,
  };
})();

window.FoodModels = FoodModels;
