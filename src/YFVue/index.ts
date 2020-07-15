import Watcher from './watcher'
import Observer from './observer'

export default class YFVue {

    data: any
    private render: Function

    constructor(options) {
        this.render = options.render
        this.data = options.data()
        new Observer(this.data)
    }

    $mount() {
        new Watcher(this, this.render)
    }
}