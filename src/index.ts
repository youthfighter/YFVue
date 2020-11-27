import { IComponent } from './interface/index';
import Dep from './dep';
export default function YFVue(options: any = {}) {
    const vm: IComponent = this
    vm.$options = options
    vm._self = vm

    initState(vm)
}

function initState(vm: IComponent) {
    initData(vm)
}

function initData(vm: IComponent) {
    let data = vm.$options.data
    data = data.call(vm, vm) || {}
    vm._data = data
    for (let key in data) {
        proxy(vm, '_data', key)
    }
    observe(data)
}

function proxy(vm: IComponent, sourceKey: string, key: string) {
    Object.defineProperty(vm, key, {
        get() { return this[sourceKey][key] },
        set(val) { this[sourceKey][key] = val },
        enumerable: true,
        configurable: true,
    })
}

function observe(value) {

    let ob = new Observer(value)
}

class Observer {
    value: any
    constructor(value) {
        this.value = value;
        this.walk(value)
    }
    walk(obj:Object) {
        let keys = Object.keys(obj)
        for(let key of keys) {
            defineReactive(obj, key)
        }
    }
}

function defineReactive(obj: object, key: string) {
    const dep = new Dep()
    let val = obj[key]
    Object.defineProperty(obj, key, {
        enumerable: true,
        configurable: true,
        get() {
            if (Dep.target) {
                dep.depend()
            }
            return val
        },
        set(newVal){
            if (newVal === val) {
                return
            }
            val = newVal
            dep.notify()
        }
    })
}


