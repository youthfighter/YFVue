import { IComponent, IVNode } from './interface/index';
import Dep from './dep';
import Watcher from './watcher';
export default function YFVue(options: any = {}) {
    const vm: IComponent = this
    vm.$options = options
    vm._self = vm

    initState(vm)

    // 挂载节点
    vm.$mount(vm.$options.el)
}

YFVue.prototype.$mount = function (el: string) {
    return mountComponent(this, document.querySelector(el))
}

YFVue.prototype._render = function (vnode: IVNode) {
    const vm: IComponent = this
    const { render } = vm.$options
    render.call(vm)
}

function mountComponent(vm: IComponent, el: Element) {
    new Watcher(vm, ()=>{
        vm._update(vm._render())
    })
}

function createElement(tag: string, data: any, children: any) {
    
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
    walk(obj: Object) {
        let keys = Object.keys(obj)
        for (let key of keys) {
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
        set(newVal) {
            if (newVal === val) {
                return
            }
            val = newVal
            dep.notify()
        }
    })
}


