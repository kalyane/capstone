import * as THREE from 'three'
import Experience from '../Experience.js'
import * as SkeletonUtils from 'three/examples/jsm/utils/SkeletonUtils.js'
import CharacterControl from './CharacterControl.js'

export default class Character
{
    /**
     * 
     * @param {*} model exact model name used in sources.js
     * @param {*} name  unique name to be used in the environment to refer to this model
     */
    constructor(model, name)
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.life = 100
        this.attackPower = 10
        this.name = name
        this.enemies = []

        // Resource
        this.resource = this.resources.items[model]
    }

    setModel()
    {
        // set shadow property
        this.model.traverse((child) =>
        {
            if(child instanceof THREE.Mesh)
            {
                child.castShadow = true
            }
        })
        
        // sets previous position for the current one
        this.previousPosition = new THREE.Vector3()
        this.previousPosition.copy(this.modelDragBox.position)

        // creates a box to help positioning when editing
        this.boxHelper = new THREE.BoxHelper(this.modelDragBox, 0xffff00)
        this.boxHelper.visible = true

        // saves an argument referencing the name of the model for easy access later
        this.model.userData = this.name
        this.modelDragBox.userData = this.name
        this.boxHelper.userData = this.name

        // adds objects to the scene
        this.scene.add(this.modelDragBox)
        this.scene.add(this.boxHelper)
        this.scene.add(this.model)
    }

    /**
     * 
     * @param {*} input object that sets when keys are pressed
     */
    setControl(input){
        this.input = input
        this.control = new CharacterControl(this.input)
    }

    updateState(){
        // gets new state from the control
        var newState = this.control.currentState

        // adds rotation to the model
        // TODO: something is odd with rotation
        this.model.rotation.y += newState.rotation

        if (newState.position.z!=0){
            // get new position and update with current position
            let position = new THREE.Vector3().copy(newState.position)
            position.applyQuaternion(this.model.quaternion)
            position.normalize();
            position.add(this.model.position)

            // sets new position
            this.model.position.copy(position) // TODO: maybe use lerp?
            this.modelDragBox.position.copy(this.model.position)
            this.modelDragBox.rotation.copy(this.model.rotation)

            // check if the position is valid
            var bb = this.experience.world.calculateExactBoundingBox(this.modelDragBox)
            var gridPosition = this.experience.world.translatePositionToGrid(bb)
            if (!this.experience.world.checkValidPosition(gridPosition)){
                // if not valid, copy previous valid position
                this.model.position.copy(this.previousPosition)
                this.modelDragBox.position.copy(this.model.position)
                this.modelDragBox.rotation.copy(this.model.rotation)
            }else{
                // saves new valid position
                this.previousPosition.copy(this.modelDragBox.position)
            }
        }
        
        // plays state animation
        this.playAnimation(newState.animation)
    }

    setAnimation(idle, walk, attack, death)
    {
        // dict of animation
        this.animation = {}
        
        // Mixer
        this.animation.mixer = new THREE.AnimationMixer(this.model)
        
        // Actions
        this.animation.actions = {} 
        this.animation.actions.attack = this.animation.mixer.clipAction(attack)
        //this.animation.actions.attack.setLoop(THREE.LoopOnce);
        this.animation.actions.death = this.animation.mixer.clipAction(death)
        this.animation.actions.death.setLoop(THREE.LoopOnce);
        this.animation.actions.death.clampWhenFinished = true
        this.animation.actions.idle = this.animation.mixer.clipAction(idle)
        this.animation.actions.walk = this.animation.mixer.clipAction(walk)
        // TODO: add Impact and Run animations

        // initial animation
        this.animation.actions.current = this.animation.actions.idle
        this.animation.actions.current.play()

        this.animation.mixer.addEventListener('loop', (e) =>
        {
            if (this.animation.actions.attack == e.action){
                this.endAttack()
            }
        })
    }

    // Play the action
    playAnimation(name)
    {
        const newAction = this.animation.actions[name]
        const oldAction = this.animation.actions.current

        // only change animation if it is different than current
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
        this.model.position.copy(this.modelDragBox.position)
        this.boxHelper.update()
        if (this.input){
            this.input.update()
        }
        if (this.life <= 0){
            this.playAnimation('death')
        }
    }

    delete()
    {
        this.scene.remove(this.model)
        this.scene.remove(this.modelDragBox)
        this.scene.remove(this.boxHelper)
    }

    endAttack()
    {
        let modelBox = new THREE.Box3();
        modelBox.copy(this.modelDragBox.geometry.boundingBox);
        modelBox.applyMatrix4(this.modelDragBox.matrixWorld);

        for(var i=0; i<this.enemies.length; i++) {
            var otherModel = this.enemies[i]
            let otherBox = new THREE.Box3();
            otherBox.copy(otherModel.modelDragBox.geometry.boundingBox);
            otherBox.applyMatrix4(otherModel.modelDragBox.matrixWorld);
            if (modelBox.intersectsBox(otherBox)){
                this.enemies[i].life -= this.attackPower
            }
        }
    }
}