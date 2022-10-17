import Experience from '../Experience.js'

export default class Player

{
    constructor()
    {
        this.experience = new Experience()
        this.input = this.experience.input

        //this.decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
        //this.acceleration = new THREE.Vector3(1, 0.125, 50.0);
        //this.velocity = new THREE.Vector3(0, 0, 0);
        //this.position = new THREE.Vector3();

        this.states = {}
        this.currState = null

        // key pressed
        this.input.on('keyDown', () =>
        {
            this.keyDown()
        })

        // key released
        this.input.on('keyUp', () =>
        {
            this.keyUp()
        })

    }

    getState()
    {
        forward: false,
        backward: false,
        left: false,
        right: false,
        space: false,
        shift: false
        // walking
        if (this.input.keys.forward || this.input.keys.backward){
            // running
            if (this.input.keys.shift){

            }
        }
        // turning
        if (this.input.keys.left || this.input.keys.right){

        }
        // attacking
        if (this.input.keys.space){

        }

        if 
    }

    listStates()
    {
        this.addState('idle', player_state.IdleState);
        this.addState('walk', player_state.WalkState);
        this.addState('run', player_state.RunState);
        this.addState('attack', player_state.AttackState);
        this.addState('death', player_state.DeathState);
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

    setAnimation()
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