/**
 * Starlings UK - Interactive Three.js Plate Experience
 * Controls the 3D scene, realistic food dragging, physics collisions, and GSAP transitions.
 */

class PlateScene {
  constructor(containerElement, initialDish = 'full-english') {
    this.container = containerElement;
    this.currentDishId = initialDish;
    this.items = []; // Active food items on plate
    this.plate = null;
    this.draggedItem = null;
    this.hoveredItem = null;
    this.isDragging = false;
    this.plane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2(-999, -999);
    this.intersectionPoint = new THREE.Vector3();
    this.dragOffset = new THREE.Vector3();
    this.viewMode = 'bistro'; // 'bistro' | 'topdown' | 'closeup'

    this.plateRadius = 1.75; // Boundary radius for food on plate bed

    this.initScene();
    this.initLights();
    this.initPlate();
    this.initEvents();
    this.loadDish(initialDish, false);
    this.animate();
  }

  initScene() {
    this.scene = new THREE.Scene();
    this.scene.background = null; // Transparent to blend with warm linen canvas

    const width = this.container.clientWidth;
    const height = this.container.clientHeight;

    this.camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    this.setCameraView('bistro', 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;

    this.container.appendChild(this.renderer.domElement);

    // Food Items Container
    this.foodGroup = new THREE.Group();
    this.foodGroup.name = 'FoodItems_Container';
    this.scene.add(this.foodGroup);

    // Contact Shadow Ground Plane (under the plate)
    const groundGeom = new THREE.PlaneGeometry(12, 12);
    const groundMat = new THREE.ShadowMaterial({ opacity: 0.18 });
    const ground = new THREE.Mesh(groundGeom, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.15;
    ground.receiveShadow = true;
    this.scene.add(ground);
  }

  initLights() {
    // Ambient Warm Fill
    const ambientLight = new THREE.AmbientLight(0xfff6ec, 1.4);
    this.scene.add(ambientLight);

    // Main Warm Key Light
    this.keyLight = new THREE.DirectionalLight(0xffefe0, 2.4);
    this.keyLight.position.set(4, 7, 3);
    this.keyLight.castShadow = true;
    this.keyLight.shadow.mapSize.width = 2048;
    this.keyLight.shadow.mapSize.height = 2048;
    this.keyLight.shadow.camera.near = 1;
    this.keyLight.shadow.camera.far = 18;
    this.keyLight.shadow.camera.left = -3;
    this.keyLight.shadow.camera.right = 3;
    this.keyLight.shadow.camera.top = 3;
    this.keyLight.shadow.camera.bottom = -3;
    this.keyLight.shadow.bias = -0.001;
    this.scene.add(this.keyLight);

    // Soft Blue-Sky Rim Light for crisp highlights on ceramics & food
    const rimLight = new THREE.DirectionalLight(0xdbe6f5, 0.9);
    rimLight.position.set(-4, 4, -4);
    this.scene.add(rimLight);

    // Warm Front Fill
    const frontFill = new THREE.DirectionalLight(0xffecd2, 0.6);
    frontFill.position.set(0, 3, 5);
    this.scene.add(frontFill);
  }

  initPlate() {
    this.plate = FoodModels.createPlate();
    this.scene.add(this.plate);
  }

  setCameraView(mode, duration = 1.0) {
    this.viewMode = mode;
    let targetPos = { x: 0, y: 5.4, z: 4.4 };
    let targetLook = { x: 0, y: -0.15, z: 0.1 };

    if (mode === 'topdown') {
      targetPos = { x: 0, y: 6.8, z: 0.05 };
      targetLook = { x: 0, y: 0, z: 0 };
    } else if (mode === 'closeup') {
      targetPos = { x: 0, y: 3.2, z: 3.1 };
      targetLook = { x: 0, y: 0.1, z: 0.2 };
    }

    if (duration > 0 && window.gsap) {
      gsap.to(this.camera.position, {
        x: targetPos.x,
        y: targetPos.y,
        z: targetPos.z,
        duration: duration,
        ease: 'power3.inOut'
      });
      gsap.to(this.camera, {
        duration: duration,
        onUpdate: () => this.camera.lookAt(targetLook.x, targetLook.y, targetLook.z)
      });
    } else {
      this.camera.position.set(targetPos.x, targetPos.y, targetPos.z);
      this.camera.lookAt(targetLook.x, targetLook.y, targetLook.z);
    }
  }

  // Smooth 360 degree turntable spin of the plate
  spinPlate() {
    if (!this.plate || !window.gsap) return;
    if (window.cafeSounds) window.cafeSounds.playSwoosh();

    gsap.to(this.plate.rotation, {
      y: this.plate.rotation.y + Math.PI * 2,
      duration: 1.4,
      ease: 'power2.inOut'
    });
    // Also spin food items with the plate
    gsap.to(this.foodGroup.rotation, {
      y: this.foodGroup.rotation.y + Math.PI * 2,
      duration: 1.4,
      ease: 'power2.inOut'
    });
  }

  loadDish(dishId, animateTransition = true) {
    const dishData = FoodModels.DISHES.find(d => d.id === dishId);
    if (!dishData) return;

    this.currentDishId = dishId;
    if (window.cafeSounds) {
      window.cafeSounds.playSwoosh();
    }

    // Clear tooltip if any
    this.updateHUD(null);

    // Cancel existing tweens
    this.items.forEach(item => {
      if (window.gsap) {
        gsap.killTweensOf(item.group.position);
        gsap.killTweensOf(item.group.scale);
      }
    });

    const oldGroups = this.items.map(i => i.group);
    this.items = [];

    const removeOldGroups = () => {
      oldGroups.forEach(grp => this.foodGroup.remove(grp));
    };

    // Spin plate subtly
    if (animateTransition && window.gsap && this.plate) {
      gsap.to(this.plate.rotation, {
        y: this.plate.rotation.y + Math.PI * 0.5,
        duration: 0.8,
        ease: 'power2.out'
      });
    }

    if (animateTransition && oldGroups.length > 0 && window.gsap) {
      oldGroups.forEach((grp, i) => {
        gsap.to(grp.position, {
          y: grp.position.y + 0.8,
          duration: 0.22,
          delay: i * 0.02,
          ease: 'power2.in'
        });
        gsap.to(grp.scale, {
          x: 0.01,
          y: 0.01,
          z: 0.01,
          duration: 0.22,
          delay: i * 0.02,
          ease: 'power2.in',
          onComplete: () => {
            this.foodGroup.remove(grp);
          }
        });
      });
    } else {
      removeOldGroups();
    }

    // Spawn new items
    const delayBase = animateTransition && oldGroups.length > 0 ? 0.18 : 0.0;

    dishData.items.forEach((itemDef, idx) => {
      const itemGroup = itemDef.create();
      const targetY = itemDef.defaultPos.y;
      const startY = animateTransition ? 2.8 + idx * 0.2 : targetY;

      itemGroup.position.set(itemDef.defaultPos.x, startY, itemDef.defaultPos.z);
      itemGroup.rotation.set(itemDef.defaultRot.x, itemDef.defaultRot.y, itemDef.defaultRot.z);

      if (animateTransition) {
        itemGroup.scale.set(0.6, 0.6, 0.6);
      }

      this.foodGroup.add(itemGroup);

      const itemObj = {
        group: itemGroup,
        defaultPos: { ...itemDef.defaultPos },
        defaultRot: { ...itemDef.defaultRot },
        radius: itemGroup.userData.footprintRadius || 0.45,
        name: itemGroup.userData.itemName,
        details: itemGroup.userData.itemDetails,
      };

      this.items.push(itemObj);

      // Animate drop with bouncy landing
      if (animateTransition && window.gsap) {
        gsap.to(itemGroup.position, {
          y: targetY,
          duration: 0.65,
          delay: delayBase + idx * 0.05,
          ease: 'bounce.out',
          onComplete: () => {
            if (window.cafeSounds && idx < 3) {
              window.cafeSounds.playPlop(1.0 + Math.random() * 0.4);
            }
          }
        });
        gsap.to(itemGroup.scale, {
          x: 1,
          y: 1,
          z: 1,
          duration: 0.5,
          delay: delayBase + idx * 0.05,
          ease: 'back.out(1.8)'
        });
      }
    });
  }

  // Animate items back to chef's plating arrangement
  resetPlating() {
    if (!this.items.length || !window.gsap) return;
    if (window.cafeSounds) window.cafeSounds.playSwoosh();

    this.items.forEach((item, idx) => {
      gsap.to(item.group.position, {
        x: item.defaultPos.x,
        y: item.defaultPos.y,
        z: item.defaultPos.z,
        duration: 0.7,
        delay: idx * 0.05,
        ease: 'elastic.out(1, 0.65)'
      });

      gsap.to(item.group.rotation, {
        x: item.defaultRot.x,
        y: item.defaultRot.y,
        z: item.defaultRot.z,
        duration: 0.6,
        delay: idx * 0.05,
        ease: 'power2.out',
        onComplete: () => {
          if (idx === this.items.length - 1 && window.cafeSounds) {
            window.cafeSounds.playPlop(1.1);
          }
        }
      });
    });
  }

  // Playful scatter around the plate
  scatterItems() {
    if (!this.items.length || !window.gsap) return;
    if (window.cafeSounds) window.cafeSounds.playSwoosh();

    this.items.forEach((item, idx) => {
      const angle = (idx / this.items.length) * Math.PI * 2 + (Math.random() - 0.5) * 0.8;
      const dist = 0.4 + Math.random() * (this.plateRadius - 0.55);
      const targetX = Math.cos(angle) * dist;
      const targetZ = Math.sin(angle) * dist;
      const targetRotY = Math.random() * Math.PI * 2;

      gsap.to(item.group.position, {
        x: targetX,
        y: item.defaultPos.y,
        z: targetZ,
        duration: 0.65,
        delay: idx * 0.04,
        ease: 'back.out(1.5)',
      });

      gsap.to(item.group.rotation, {
        y: targetRotY,
        duration: 0.6,
        ease: 'power2.out',
      });
    });
  }

  // --- Interaction: Raycasting & Dragging ---

  getPointerPos(event) {
    const rect = this.container.getBoundingClientRect();
    const clientX = event.clientX !== undefined ? event.clientX : (event.touches && event.touches[0] ? event.touches[0].clientX : 0);
    const clientY = event.clientY !== undefined ? event.clientY : (event.touches && event.touches[0] ? event.touches[0].clientY : 0);

    return {
      x: ((clientX - rect.left) / rect.width) * 2 - 1,
      y: -((clientY - rect.top) / rect.height) * 2 + 1,
      clientX,
      clientY
    };
  }

  findFoodParent(obj) {
    let cur = obj;
    while (cur) {
      if (cur.userData && cur.userData.isFoodItem) {
        return cur;
      }
      cur = cur.parent;
    }
    return null;
  }

  initEvents() {
    const dom = this.container;

    const onPointerMove = (e) => {
      const p = this.getPointerPos(e);
      this.mouse.x = p.x;
      this.mouse.y = p.y;

      this.raycaster.setFromCamera(this.mouse, this.camera);

      if (this.isDragging && this.draggedItem) {
        // Dragging in progress: intersect with horizontal plane at elevated Y
        const dragY = this.draggedItem.group.userData.dragElevation || 0.4;
        this.plane.constant = -dragY;

        if (this.raycaster.ray.intersectPlane(this.plane, this.intersectionPoint)) {
          let newX = this.intersectionPoint.x - this.dragOffset.x;
          let newZ = this.intersectionPoint.z - this.dragOffset.z;

          // Clamp within plate boundary
          const dist = Math.sqrt(newX * newX + newZ * newZ);
          if (dist > this.plateRadius) {
            newX = (newX / dist) * this.plateRadius;
            newZ = (newZ / dist) * this.plateRadius;
          }

          this.draggedItem.group.position.x = newX;
          this.draggedItem.group.position.z = newZ;

          // Gentle collision push against neighbouring items
          this.items.forEach(other => {
            if (other === this.draggedItem) return;
            const dx = other.group.position.x - newX;
            const dz = other.group.position.z - newZ;
            const distBetween = Math.sqrt(dx * dx + dz * dz);
            const minDist = (this.draggedItem.radius + other.radius) * 0.72;

            if (distBetween < minDist && distBetween > 0.01) {
              const push = (minDist - distBetween) * 0.18;
              const pushX = (dx / distBetween) * push;
              const pushZ = (dz / distBetween) * push;

              other.group.position.x += pushX;
              other.group.position.z += pushZ;

              // Keep other inside plate as well
              const otherDist = Math.sqrt(other.group.position.x ** 2 + other.group.position.z ** 2);
              if (otherDist > this.plateRadius) {
                other.group.position.x = (other.group.position.x / otherDist) * this.plateRadius;
                other.group.position.z = (other.group.position.z / otherDist) * this.plateRadius;
              }
            }
          });
        }
      } else {
        // Hover Detection
        const intersects = this.raycaster.intersectObjects(this.foodGroup.children, true);
        if (intersects.length > 0) {
          const foodParent = this.findFoodParent(intersects[0].object);
          if (foodParent) {
            const foundItem = this.items.find(i => i.group === foodParent);
            if (foundItem) {
              if (this.hoveredItem !== foundItem) {
                this.hoveredItem = foundItem;
                dom.style.cursor = 'grab';
                this.updateHUD(foundItem, p.clientX, p.clientY);
              }
              return;
            }
          }
        }

        if (this.hoveredItem) {
          this.hoveredItem = null;
          dom.style.cursor = 'default';
          this.updateHUD(null);
        }
      }
    };

    const onPointerDown = (e) => {
      const p = this.getPointerPos(e);
      this.mouse.x = p.x;
      this.mouse.y = p.y;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.foodGroup.children, true);

      if (intersects.length > 0) {
        const foodParent = this.findFoodParent(intersects[0].object);
        if (foodParent) {
          const foundItem = this.items.find(i => i.group === foodParent);
          if (foundItem) {
            this.isDragging = true;
            this.draggedItem = foundItem;
            dom.style.cursor = 'grabbing';

            if (window.cafeSounds) {
              window.cafeSounds.playPick();
            }

            // Calculate intersection with plane at item's current Y
            const curY = foundItem.group.position.y;
            this.plane.constant = -curY;
            if (this.raycaster.ray.intersectPlane(this.plane, this.intersectionPoint)) {
              this.dragOffset.set(
                this.intersectionPoint.x - foundItem.group.position.x,
                0,
                this.intersectionPoint.z - foundItem.group.position.z
              );
            }

            // Lift item smoothly with GSAP
            if (window.gsap) {
              gsap.to(foundItem.group.position, {
                y: foundItem.group.userData.dragElevation || 0.42,
                duration: 0.18,
                ease: 'power2.out'
              });
              gsap.to(foundItem.group.scale, {
                x: 1.05,
                y: 1.05,
                z: 1.05,
                duration: 0.15,
                ease: 'power1.out'
              });
            }

            e.preventDefault();
          }
        }
      }
    };

    const onPointerUp = () => {
      if (this.isDragging && this.draggedItem) {
        const item = this.draggedItem;
        this.isDragging = false;
        this.draggedItem = null;
        dom.style.cursor = this.hoveredItem ? 'grab' : 'default';

        if (window.cafeSounds) {
          window.cafeSounds.playPlop(1.0 + Math.random() * 0.3);
        }

        // Drop item down with bouncy landing
        if (window.gsap) {
          gsap.to(item.group.position, {
            y: item.defaultPos.y,
            duration: 0.38,
            ease: 'bounce.out'
          });
          gsap.to(item.group.scale, {
            x: 1.0,
            y: 1.0,
            z: 1.0,
            duration: 0.2,
            ease: 'power2.out'
          });
        } else {
          item.group.position.y = item.defaultPos.y;
          item.group.scale.set(1, 1, 1);
        }
      }
    };

    dom.addEventListener('pointermove', onPointerMove);
    dom.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('pointercancel', onPointerUp);

    // Resize Handler
    window.addEventListener('resize', () => {
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      if (w && h) {
        this.camera.aspect = w / h;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(w, h);
      }
    });
  }

  updateHUD(item) {
    const badge = document.getElementById('food-inspector-badge');
    const titleEl = document.getElementById('inspector-title');
    const detailsEl = document.getElementById('inspector-desc');

    if (!badge || !titleEl || !detailsEl) return;

    if (item) {
      titleEl.textContent = item.name;
      detailsEl.textContent = item.details;
      badge.classList.add('visible');
    } else {
      badge.classList.remove('visible');
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    // Subtle gentle breathing drift
    if (this.plate && !this.isDragging) {
      const time = performance.now() * 0.0006;
      this.foodGroup.position.y = Math.sin(time) * 0.015;
      this.plate.position.y = Math.sin(time) * 0.015;
    }

    this.renderer.render(this.scene, this.camera);
  }
}

window.PlateScene = PlateScene;
