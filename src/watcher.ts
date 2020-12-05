import { IWatcher, IComponent, IDep } from "./interface/index.d"
import Dep from "./dep"

export default class Watcher implements IWatcher {
    vm: IComponent
    getter: Function
    value: any
    cb: Function
    newDepIds: Array<number> = []

    constructor(vm: IComponent, expOrFn: string | Function, cb: Function) {
        this.vm = vm
        this.getter = typeof expOrFn === 'function' ? expOrFn : parsePath(expOrFn)
        this.value = this.get()
        this.cb = cb
    }

    get() {
        Dep.target = this
        let value = this.getter.call(this.vm, this.vm)
        Dep.target = null
        return value
    }

    addDep(dep: IDep) {
        if (this.newDepIds.indexOf(dep.id) === -1) {
            this.newDepIds.push(dep.id)
            dep.addSub(this)
        }

    }

    update() {
        console.log('update')
        this.run()
    }

    run() {
        const value = this.get()
        if (value !== this.value) {
            const oldValue = this.value
            this.value = value
            this.cb.call(this.vm, value, oldValue)
        }
    }
}

export const unicodeRegExp = /a-zA-Z\u00B7\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u037D\u037F-\u1FFF\u200C-\u200D\u203F-\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD/

/**
 * Parse simple path.
 */
const bailRE = new RegExp(`[^${unicodeRegExp.source}.$_\\d]`)
export function parsePath(path: string): any {
    if (bailRE.test(path)) {
        return
    }
    const segments = path.split('.')
    return function (obj) {
        for (let i = 0; i < segments.length; i++) {
            if (!obj) return
            obj = obj[segments[i]]
        }
        return obj
    }
}