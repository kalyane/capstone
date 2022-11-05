import * as THREE from 'three'
import Experience from './Experience.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default class Camera
{
    constructor()
    {
        this.experience = new Experience()
        this.sizes = this.experience.sizes
        this.scene = this.experience.scene
        this.canvas = this.experience.canvas
        this.resources = this.experience.resources
        // TODO: need to change size camera when playing to fixed
        this.gameRatio = 16/9
        
        this.currentPosition = new THREE.Vector3()
        this.currentLookat = new THREE.Vector3()

        this.setInstance()
        this.setControls()
    }

    setInstance()
    {
        this.instance = new THREE.PerspectiveCamera(35, this.sizes.width / this.sizes.height, 0.1, 1000)
        this.instance.position.set(30, 30, 30)
        this.scene.add(this.instance)
    }

    offset()
    {
        const idealOffset = new THREE.Vector3(-5, 5, -20)
        idealOffset.applyQuaternion(this.player.quaternion)
        idealOffset.add(this.player.position)

        return idealOffset
    }

    lookat()
    {
        const idealLookat = new THREE.Vector3(-1, 5, 5)
        idealLookat.applyQuaternion(this.player.quaternion)
        idealLookat.add(this.player.position)

        return idealLookat
    }

    followPlayer()
    {
        const idealOffset = this.offset()
        const idealLookat = this.lookat()

        this.currentPosition.copy(idealOffset)
        this.currentLookat.copy(idealLookat)
        this.instance.position.copy(this.currentPosition)
        this.instance.lookAt(this.currentLookat)
    }

    setControls()
    {
        this.controls = new OrbitControls(this.instance, this.canvas)
        this.controls.enableDamping = true
    }

    resize()
    {
        this.instance.aspect = this.sizes.width / this.sizes.height
        this.instance.updateProjectionMatrix()
    }

    update()
    {
        if (this.experience.world.playing){
            this.player = this.experience.world.player.model
            this.followPlayer()
        } else {
            this.controls.update()
        }
    }
}