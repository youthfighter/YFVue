import Dep from './dep'

export default class Watcher {
    private vm: any
    private cb: Function

    constructor(vm: any, cb: Function) {
        Dep.target = this
        this.vm = vm
        this.cb = cb
        cb.call(vm)
        Dep.target = null
    }

    addToDep(dep: Dep) {
        dep.addSub(this)
    }

    update() {
        this.cb.call(this.vm)
    }
}