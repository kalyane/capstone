import Experience from '../Experience.js'
import EventEmitter from '../Utils/EventEmitter.js'
import Environment from './Environment.js'
import Floor from './Floor.js'
import Fox from './Fox.js'
import Warrior from './Warrior.js'

export default class World extends EventEmitter
{
    constructor()
    {
        super()
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources

        // Wait for resources
        this.resources.on('ready', () =>
        {
            // Setup
            this.floor = new Floor()
            this.warrior = new Warrior()
            // this.fox = new Fox()
            this.environment = new Environment()
        })

        this.trigger("ready")
    }

    update()
    {
        if(this.fox)
            this.fox.update()

        if(this.warrior)
            this.warrior.update()
    }
}