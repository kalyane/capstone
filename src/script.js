import './style.css'

import Experience from './Experience/Experience.js'

const experience = new Experience(document.querySelector('canvas.webgl'))

const assets = document.querySelectorAll('.asset');

let model = null

assets.forEach(asset => {
  asset.addEventListener('click', function handleClick(event) {
    const modelName = asset.getAttributeNode("model").value;
    experience.world.addModel(modelName);
    //updateAddedAssets()
  });
});

document.querySelector('#turn').addEventListener('click', 
  function handleClick(event) {
    var name = window.document.querySelector("#name").value
    model = experience.world.dictModels[name]
    model.modelDragBox.geometry.rotateY(Math.PI / 2);
    model.model.rotation.y += Math.PI / 2
    //model.modelDragBox.updateMatrixWorld( true )
});

document.querySelector('#delete').addEventListener('click', 
  function handleClick(event) {
    var name = window.document.querySelector("#name").value
    model = experience.world.dictModels[name]
    const index = experience.world.objects.indexOf(model.modelDragBox);
    if (index > -1) { // only splice array when item is found
      experience.world.objects.splice(index, 1); // 2nd parameter means remove one item only
    }
    model.delete()
    delete experience.world.dictModels[name]
});

document.querySelector('#play').addEventListener('click', 
  function handleClick(event) {
    document.getElementById("modelSettings").style.visibility = "hidden"
    document.getElementById("gameModels").style.visibility = "hidden"
    document.getElementById("allModels").style.visibility = "hidden"
    document.getElementById("play").style.visibility = "hidden"

    experience.camera.controls.enabled = false
    experience.world.playing = true
    experience.world.setEnemies()
});