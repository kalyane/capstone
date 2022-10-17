import * as THREE from 'three'
import Experience from '../Experience.js'
import EventEmitter from '../Utils/EventEmitter.js'

export default class Warrior extends EventEmitter
{
    constructor()
    {
        super()

        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.debug = this.experience.debug
        this.input = this.experience.input

        // Resource
        this.resource = this.resources.items.warriorModel

        this.setModel()
        this.setAnimation()

        this.trigger("ready")

        // 
        this.distance = 0.1
        this.rotation = 0.1

        // key pressed
        this.input.on('keyDown', () =>
        {
            this.setState()
        })

        // key released
        this.input.on('keyUp', () =>
        {
            this.setState()
        })
    }

    setState()
    {
        const nothingPressed = Object.values(this.input.keys).every(
            value => value === false
        );

        if (nothingPressed) {
            this.playAnimation("idle")
        }
        if (this.input.keys.left){
            this.playAnimation("idle")
            this.model.rotation.y += this.rotation
        }
        if (this.input.keys.right){
            this.playAnimation("idle")
            this.model.rotation.y -= this.rotation
        }
        if (this.input.keys.forward){
            this.playAnimation("walk")

            let position = new THREE.Vector3(0, 0, this.distance);

            position.applyQuaternion(this.model.quaternion);
            position.normalize();
            position.add(this.model.position)

            this.model.position.copy(position)
        }
        if (this.input.keys.backward){
            this.playAnimation("walk")
            let position = new THREE.Vector3(0, 0, -this.distance);

            position.applyQuaternion(this.model.quaternion);
            position.normalize();
            position.add(this.model.position)

            this.model.position.copy(position)
        }
        if (this.input.keys.space){
            this.playAnimation("slash")
        }
    }

    setModel()
    {
        this.model = this.resource.scene
        //this.model.scale.set(0.02, 0.02, 0.02)
        this.scene.add(this.model)

        this.model.traverse((child) =>
        {
            if(child instanceof THREE.Mesh)
            {
                child.castShadow = true
            }
        })
    }

    async setAnimation()
    {
        this.animation = {}
        
        // Mixer
        this.animation.mixer = new THREE.AnimationMixer(this.model)
        
        // Actions
        this.animation.actions = {}
        
        this.animation.actions.death = this.animation.mixer.clipAction(this.resource.animations[0])
        this.animation.actions.idle = this.animation.mixer.clipAction(this.resource.animations[1])
        this.animation.actions.impact = this.animation.mixer.clipAction(this.resource.animations[2])
        this.animation.actions.run = this.animation.mixer.clipAction(this.resource.animations[3])
        this.animation.actions.slash = this.animation.mixer.clipAction(this.resource.animations[4])
        this.animation.actions.walk = this.animation.mixer.clipAction(this.resource.animations[6])
        
        //console.log(this.animation.actions.idle)

        this.animation.actions.current = this.animation.actions.run
        this.animation.actions.current.play()
        //const delay = ms => new Promise(res => setTimeout(res, ms));
        //await delay(5000);
        
    }

    // Play the action
    playAnimation(name)
    {
        const newAction = this.animation.actions[name]
        const oldAction = this.animation.actions.current

        if (newAction != oldAction){
            newAction.reset()
            newAction.play()
            newAction.crossFadeFrom(oldAction, 1)

            this.animation.actions.current = newAction
        }
        
    }

    update()
    {
        this.animation.mixer.update(this.time.delta * 0.001)
    }
}