import * as THREE from 'three'
import Experience from '../Experience.js'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js'

export default class Guard
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug

        // Debug
        if(this.debug.active)
        {
            this.debugFolder = this.debug.ui.addFolder('guard')
        }

        // Resource
        this.resource = this.resources.items.guardModel

        this.setModel()
        this.loadAnimation()
        //this.setAnimation()
    }

    setModel()
    {
        this.model = this.resource
        this.model.scale.set(0.02, 0.02, 0.02)
        this.scene.add(this.model)

        this.model.traverse((child) =>
        {
            if(child instanceof THREE.Mesh)
            {
                child.castShadow = true
            }
        })
    }

    loadAnimation()
    {
        this.animation = {}
        
        // Mixer
        this.animation.mixer = new THREE.AnimationMixer(this.model)

        // Actions
        this.animation.actions = {}

        this.anims = []

        const _OnLoad = (animName, anim) => {
          const clip = anim.animations[0];
          const action = this.animation.mixer.clipAction(clip);

          this.actions.push(action)
    
          this.animation.actions[animName] = {
            clip: clip,
            action: action,
          };
        };
  
        const loader = new FBXLoader();
        loader.setPath('models/Guard/');
        
        loader.load('Sword And Shield Idle.fbx', (a) => { 
            //console.log(a.animations[0])
            this.animation.actions.idle = this.animation.mixer.clipAction(a.animations[0])
            //console.log(this.animation.actions.idle)
        });
        //loader.load('Sword And Shield Run.fbx', (a) => { _OnLoad('run', a); });
        //loader.load('Sword And Shield Walk.fbx', (a) => { _OnLoad('walk', a); });
        //loader.load('Sword And Shield Slash.fbx', (a) => { _OnLoad('attack', a); });
        //loader.load('Sword And Shield Death.fbx', (a) => { _OnLoad('death', a); });

        
        console.log(this.animation.actions.idle)
    }

    setAnimation()
    {
        this.animation.actions.current = this.animation.actions.idle
        this.animation.actions.current.play()

        // Play the action
        this.animation.play = (name) =>
        {
            const newAction = this.animation.actions[name]
            const oldAction = this.animation.actions.current

            newAction.reset()
            newAction.play()
            newAction.crossFadeFrom(oldAction, 1)

            this.animation.actions.current = newAction
        }

        // Debug
        if(this.debug.active)
        {
            const debugObject = {
                playIdle: () => { this.animation.play('idle') },
                playWalking: () => { this.animation.play('walking') },
                playRunning: () => { this.animation.play('running') }
            }
            this.debugFolder.add(debugObject, 'playIdle')
            this.debugFolder.add(debugObject, 'playWalking')
            this.debugFolder.add(debugObject, 'playRunning')
        }
    }

    update()
    {
        this.animation.mixer.update(this.time.delta * 0.001)
    }
}