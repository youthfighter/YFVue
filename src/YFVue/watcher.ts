const deepGet = require('lodash.get');
import Dep from './dep'

export default class Watcher {
    private vm: any
    private cb: Function
    value: any
    private key: string | Function
    getter: Function

    constructor(vm: any, key: string | Function, cb: Function = () => { }) {
        Dep.target = this
        this.vm = vm
        this.cb = cb
        cb.call(vm)
        this.getter = typeof key === 'string' ? () => deepGet(vm, key) : key
        this.value = this.getter.call(vm)
        Dep.target = null
    }

    addToDep(dep: Dep) {
        dep.addSub(this)
    }

    update() {
        const oldValue = this.value
        this.value = this.getter()
        this.cb.call(this.vm, this.value, oldValue)
    }
}