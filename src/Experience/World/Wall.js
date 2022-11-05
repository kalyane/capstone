import * as THREE from 'three'
import Experience from '../Experience.js'
import Solid from './Solid.js'

export default class Wall extends Solid
{
    constructor(name)
    {
        super('wallModel', name)
        this.preSetModel()
    }

    preSetModel(){
        // creates a copy of the original model
        this.model = this.resource.scene.clone()
        this.model.scale.set(2, 2, 2)

        // creates a box to cover the model
        const boxGeo = new THREE.BoxGeometry(8, 6, 1)
        boxGeo.applyMatrix4( new THREE.Matrix4().makeTranslation( 0, 3, 0 ) )
        this.modelDragBox = new THREE.Mesh(
            boxGeo,
            new THREE.MeshBasicMaterial({ transparent: true, opacity: 0 })
        )
        this.modelDragBox.geometry.computeBoundingBox()

        this.setModel()
    }
}