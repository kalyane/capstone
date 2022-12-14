import * as THREE from 'three'
import Experience from '../Experience.js'
import CharacterControl from './CharacterControl.js'

export default class Solid
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
        this.name = name

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

    update()
    {
        this.model.position.copy(this.modelDragBox.position)
        this.boxHelper.update()
    }

    delete()
    {
        this.scene.remove(this.model)
        this.scene.remove(this.modelDragBox)
        this.scene.remove(this.boxHelper)
    }
}