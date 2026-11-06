import * as THREE from "three";

export interface HorusEyeController {
  group: THREE.Group;
  setOpenProgress: (progress: number) => void; // 0 = closed, 1 = fully open
  setMouseLook: (normX: number, normY: number) => void;
  update: (elapsedTime: number) => void;
  dispose: () => void;
}

export function create3DHorusEye(): HorusEyeController {
  const rootGroup = new THREE.Group();
  rootGroup.name = "HorusEyeRoot";

  // --- Premium Materials ---
  const goldMaterial = new THREE.MeshStandardMaterial({
    color: 0xf59e0b, // Vibrant warm 24k gold
    emissive: 0x78350f,
    emissiveIntensity: 0.25,
    metalness: 0.95,
    roughness: 0.18,
  });

  const goldRimMaterial = new THREE.MeshStandardMaterial({
    color: 0xfcd34d,
    emissive: 0xb45309,
    emissiveIntensity: 0.35,
    metalness: 0.98,
    roughness: 0.12,
  });

  const lidSkinMaterial = new THREE.MeshStandardMaterial({
    color: 0x0f766e, // Deep oasis teal casing
    emissive: 0x042f2e,
    emissiveIntensity: 0.2,
    metalness: 0.88,
    roughness: 0.28,
  });

  const scleraMaterial = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.1,
    metalness: 0.05,
  });

  const irisBaseMaterial = new THREE.MeshStandardMaterial({
    color: 0x0d9488, // Radiant turquoise
    emissive: 0x14b8a6,
    emissiveIntensity: 0.55,
    roughness: 0.12,
    metalness: 0.65,
  });

  const irisGemMaterial = new THREE.MeshStandardMaterial({
    color: 0x059669, // Emerald inner depth
    emissive: 0x10b981,
    emissiveIntensity: 0.45,
    metalness: 0.85,
    roughness: 0.15,
  });

  const pupilMaterial = new THREE.MeshBasicMaterial({
    color: 0x021815,
  });

  const corneaMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.42,
    roughness: 0.05,
    metalness: 0.1,
    transmission: 0.88,
    ior: 1.35,
    clearcoat: 1.0,
    clearcoatRoughness: 0.05,
  });

  // ==========================================
  // 1. THE 3D SPHERICAL EYEBALL (Look-Tracked)
  // ==========================================
  const eyeballGroup = new THREE.Group();
  eyeballGroup.name = "EyeballSphereGroup";
  rootGroup.add(eyeballGroup);

  // 1A. Sclera: True 3D Sphere
  const scleraRadius = 1.95;
  const scleraGeo = new THREE.SphereGeometry(scleraRadius, 64, 48);
  const scleraMesh = new THREE.Mesh(scleraGeo, scleraMaterial);
  eyeballGroup.add(scleraMesh);

  // 1B. Iris Assembly (Recessed & Concave on the front of the sphere)
  const irisGroup = new THREE.Group();
  irisGroup.position.set(0, 0, scleraRadius * 0.94);
  eyeballGroup.add(irisGroup);

  // Outer Gold Filigree Ring
  const irisOuterRingGeo = new THREE.TorusGeometry(0.92, 0.06, 16, 48);
  const irisOuterRing = new THREE.Mesh(irisOuterRingGeo, goldMaterial);
  irisGroup.add(irisOuterRing);

  // Main Crystalline Turquoise Iris Disc (Slightly dished)
  const irisDiscGeo = new THREE.RingGeometry(0.38, 0.90, 48);
  const irisDisc = new THREE.Mesh(irisDiscGeo, irisBaseMaterial);
  irisDisc.position.z = 0.02;
  irisGroup.add(irisDisc);

  // Inner Emerald Star / Geometric Accents
  const irisInnerRingGeo = new THREE.RingGeometry(0.38, 0.65, 36);
  const irisInnerRing = new THREE.Mesh(irisInnerRingGeo, irisGemMaterial);
  irisInnerRing.position.z = 0.03;
  irisGroup.add(irisInnerRing);

  // Sacred Horus Concentric Micro-Rings
  const microRing1Geo = new THREE.TorusGeometry(0.65, 0.025, 12, 40);
  const microRing1 = new THREE.Mesh(microRing1Geo, goldMaterial);
  microRing1.position.z = 0.04;
  irisGroup.add(microRing1);

  const microRing2Geo = new THREE.TorusGeometry(0.48, 0.02, 12, 36);
  const microRing2 = new THREE.Mesh(microRing2Geo, goldMaterial);
  microRing2.position.z = 0.045;
  irisGroup.add(microRing2);

  // Pupil Group (Dilates dynamically)
  const pupilGroup = new THREE.Group();
  pupilGroup.position.z = 0.05;
  irisGroup.add(pupilGroup);

  const pupilGeo = new THREE.CircleGeometry(0.38, 48);
  const pupilMesh = new THREE.Mesh(pupilGeo, pupilMaterial);
  pupilGroup.add(pupilMesh);

  // Specular Star Glint on Pupil
  const glintGeo = new THREE.CircleGeometry(0.08, 16);
  const glintMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const glintMesh = new THREE.Mesh(glintGeo, glintMat);
  glintMesh.position.set(0.12, 0.12, 0.02);
  pupilGroup.add(glintMesh);

  // 1C. Cornea: Glass Bulge Dome over the Iris
  const corneaGeo = new THREE.SphereGeometry(1.05, 48, 24, 0, Math.PI * 2, 0, Math.PI * 0.45);
  const corneaMesh = new THREE.Mesh(corneaGeo, corneaMaterial);
  corneaMesh.position.set(0, 0, scleraRadius * 0.88);
  corneaMesh.scale.set(1.0, 1.0, 0.55);
  eyeballGroup.add(corneaMesh);

  // Internal Luminous Teal PointLight radiating from pupil
  const eyeLight = new THREE.PointLight(0x2dd4bf, 1.2, 5);
  eyeLight.position.set(0, 0, scleraRadius + 0.1);
  eyeballGroup.add(eyeLight);

  // ==========================================
  // 2. TRUE 3D VOLUMETRIC ROTATING EYELIDS
  // ==========================================
  // The eyelids are spherical shells that physically wrap over the eyeball
  // and rotate open around the X-axis along the curvature of the sphere!

  const lidRadius = scleraRadius + 0.06;

  // 2A. Upper Eyelid Group
  const upperLidPivot = new THREE.Group();
  upperLidPivot.name = "UpperLidPivot";
  rootGroup.add(upperLidPivot);

  // Spherical shell for upper eyelid
  const upperLidGeo = new THREE.SphereGeometry(
    lidRadius,
    48,
    24,
    0,
    Math.PI * 2,
    0,
    Math.PI * 0.52
  );
  const upperLidMesh = new THREE.Mesh(upperLidGeo, lidSkinMaterial);
  upperLidPivot.add(upperLidMesh);

  // Golden Rim along Upper Eyelid edge
  const upperRimGeo = new THREE.TorusGeometry(lidRadius * 0.99, 0.055, 16, 48, Math.PI);
  const upperRimMesh = new THREE.Mesh(upperRimGeo, goldRimMaterial);
  upperRimMesh.rotation.x = Math.PI / 2;
  upperRimMesh.position.y = -0.02;
  upperLidPivot.add(upperRimMesh);

  // 2B. Lower Eyelid Group
  const lowerLidPivot = new THREE.Group();
  lowerLidPivot.name = "LowerLidPivot";
  rootGroup.add(lowerLidPivot);

  // Spherical shell for lower eyelid
  const lowerLidGeo = new THREE.SphereGeometry(
    lidRadius - 0.01,
    48,
    24,
    0,
    Math.PI * 2,
    Math.PI * 0.48,
    Math.PI * 0.52
  );
  const lowerLidMesh = new THREE.Mesh(lowerLidGeo, lidSkinMaterial);
  lowerLidPivot.add(lowerLidMesh);

  // Golden Rim along Lower Eyelid edge
  const lowerRimGeo = new THREE.TorusGeometry(lidRadius * 0.98, 0.05, 16, 48, Math.PI);
  const lowerRimMesh = new THREE.Mesh(lowerRimGeo, goldRimMaterial);
  lowerRimMesh.rotation.x = -Math.PI / 2;
  lowerRimMesh.rotation.z = Math.PI;
  lowerRimMesh.position.y = 0.02;
  lowerLidPivot.add(lowerRimMesh);

  // ==========================================
  // 3. 3D DIMENSIONAL HORUS REGALIA
  // ==========================================
  const regaliaGroup = new THREE.Group();
  regaliaGroup.position.z = 0.2;
  rootGroup.add(regaliaGroup);

  // 3A. Sculpted 3D Gold Eyebrow Arch
  const browCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-2.4, 1.4, 0.2),
    new THREE.Vector3(-1.1, 2.15, 0.4),
    new THREE.Vector3(0.6, 2.25, 0.4),
    new THREE.Vector3(2.35, 1.5, 0.2),
  ]);
  const browGeo = new THREE.TubeGeometry(browCurve, 48, 0.09, 14, false);
  const browMesh = new THREE.Mesh(browGeo, goldMaterial);
  regaliaGroup.add(browMesh);

  // 3B. Sculpted 3D Falcon Teardrop Column
  const teardropCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.35, -1.2, 0.2),
    new THREE.Vector3(-0.42, -1.8, 0.3),
    new THREE.Vector3(-0.48, -2.4, 0.2),
  ]);
  const teardropGeo = new THREE.TubeGeometry(teardropCurve, 32, 0.075, 14, false);
  const teardropMesh = new THREE.Mesh(teardropGeo, goldMaterial);
  regaliaGroup.add(teardropMesh);

  const teardropBulbGeo = new THREE.SphereGeometry(0.14, 20, 20);
  const teardropBulb = new THREE.Mesh(teardropBulbGeo, goldMaterial);
  teardropBulb.position.set(-0.48, -2.42, 0.2);
  regaliaGroup.add(teardropBulb);

  // 3C. Sculpted 3D Falcon Spiral Tail
  const spiralCurve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(-0.35, -1.35, 0.2),
    new THREE.Vector3(0.4, -1.65, 0.3),
    new THREE.Vector3(1.2, -1.85, 0.35),
    new THREE.Vector3(1.9, -1.65, 0.3),
    new THREE.Vector3(2.1, -1.25, 0.25),
    new THREE.Vector3(1.7, -0.95, 0.2),
  ]);
  const spiralGeo = new THREE.TubeGeometry(spiralCurve, 48, 0.07, 14, false);
  const spiralMesh = new THREE.Mesh(spiralGeo, goldMaterial);
  regaliaGroup.add(spiralMesh);

  // Outer Radiant Torus Halo (Horus Sanctuary Aura)
  const haloGeo = new THREE.TorusGeometry(2.7, 0.045, 16, 64);
  const haloMat = new THREE.MeshStandardMaterial({
    color: 0x2dd4bf,
    emissive: 0x0f766e,
    emissiveIntensity: 0.5,
    roughness: 0.2,
    metalness: 0.9,
    transparent: true,
    opacity: 0.65,
  });
  const haloMesh = new THREE.Mesh(haloGeo, haloMat);
  haloMesh.position.set(0, 0, -0.2);
  rootGroup.add(haloMesh);

  // Floating Golden Sparkles around Eye
  const sparkleCount = 50;
  const sparkleGeo = new THREE.BufferGeometry();
  const sparklePos = new Float32Array(sparkleCount * 3);
  for (let i = 0; i < sparkleCount; i++) {
    sparklePos[i * 3] = (Math.random() - 0.5) * 5.5;
    sparklePos[i * 3 + 1] = (Math.random() - 0.5) * 4.5;
    sparklePos[i * 3 + 2] = (Math.random() - 0.5) * 2.5;
  }
  sparkleGeo.setAttribute("position", new THREE.BufferAttribute(sparklePos, 3));
  const sparkleMat = new THREE.PointsMaterial({
    color: 0xf59e0b,
    size: 0.11,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
  });
  const sparkles = new THREE.Points(sparkleGeo, sparkleMat);
  rootGroup.add(sparkles);

  // ==========================================
  // CONTROLLER STATE & METHODS
  // ==========================================
  let currentOpen = 0; // 0 = closed, 1 = fully open
  let targetOpen = 0;
  let mouseTargetX = 0;
  let mouseTargetY = 0;
  let mouseCurrentX = 0;
  let mouseCurrentY = 0;

  const setOpenProgress = (progress: number) => {
    targetOpen = Math.max(0, Math.min(1, progress));
  };

  const setMouseLook = (normX: number, normY: number) => {
    mouseTargetX = normX;
    mouseTargetY = normY;
  };

  const update = (elapsedTime: number) => {
    // Smooth lerp for eyelid open motion
    currentOpen += (targetOpen - currentOpen) * 0.1;

    // Eyelid rotation physics:
    // Upper eyelid rotates upward/backward around the X-axis over the sphere
    const maxUpperAngle = Math.PI * 0.52;
    upperLidPivot.rotation.x = -maxUpperAngle * currentOpen;

    // Lower eyelid rotates downward around the X-axis under the sphere
    const maxLowerAngle = Math.PI * 0.42;
    lowerLidPivot.rotation.x = maxLowerAngle * currentOpen;

    // Dynamic pupil dilation: expands as the eye opens wide
    const pupilScale = 0.55 + currentOpen * 0.55;
    pupilGroup.scale.set(pupilScale, pupilScale, 1);

    // Eye internal glow intensifies when open
    eyeLight.intensity = currentOpen * 2.8;

    // Eyeball gaze tracks mouse with natural limits
    mouseCurrentX += (mouseTargetX - mouseCurrentX) * 0.06;
    mouseCurrentY += (mouseTargetY - mouseCurrentY) * 0.06;

    // Look rotation is active primarily when eye is opening/open
    const gazeWeight = Math.max(0.2, currentOpen);
    eyeballGroup.rotation.y = mouseCurrentX * 0.42 * gazeWeight;
    eyeballGroup.rotation.x = -mouseCurrentY * 0.32 * gazeWeight;

    // Subtle breathing / floating motion for root
    rootGroup.position.y = 0.3 + Math.sin(elapsedTime * 1.5) * 0.04;
    haloMesh.rotation.z = elapsedTime * 0.15;
  };

  const dispose = () => {
    [
      goldMaterial,
      goldRimMaterial,
      lidSkinMaterial,
      scleraMaterial,
      irisBaseMaterial,
      irisGemMaterial,
      pupilMaterial,
      corneaMaterial,
      haloMat,
      sparkleMat,
    ].forEach((mat) => mat.dispose());

    [
      scleraGeo,
      irisOuterRingGeo,
      irisDiscGeo,
      irisInnerRingGeo,
      microRing1Geo,
      microRing2Geo,
      pupilGeo,
      glintGeo,
      corneaGeo,
      upperLidGeo,
      upperRimGeo,
      lowerLidGeo,
      lowerRimGeo,
      browGeo,
      teardropGeo,
      teardropBulbGeo,
      spiralGeo,
      haloGeo,
      sparkleGeo,
    ].forEach((geo) => geo.dispose());
  };

  return {
    group: rootGroup,
    setOpenProgress,
    setMouseLook,
    update,
    dispose,
  };
}
