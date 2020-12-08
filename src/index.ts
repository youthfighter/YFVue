import { VNode } from './vnode';
import { IComponent, IVNode, IDep } from './interface/index';
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
    mountComponent(this, document.querySelector(el))
}

YFVue.prototype._render = function (): IVNode {
    const vm: IComponent = this
    const { render } = vm.$options
    return render.call(vm, createElement)
}



YFVue.prototype._update = function (vnode: IVNode) {
    let vm: IComponent = this
    const preEl = vm._vnode
    vm._vnode = vnode
    vm.__patch__(preEl, vnode)
}

YFVue.prototype.__patch__ = function (oldVnode: IVNode, newVNode: IVNode) {
    const vm = this
    if (!oldVnode) {
        createElm(newVNode, vm.$el)
    } else {
        vm.$el.innerText = newVNode.text
    }
    console.log(vm, 'haha')
}


function createElm(vnode: IVNode, parentElm?: Element) {
    const { tag, text } = vnode
    let elm
    if (tag) {
        elm = document.createElement(vnode.tag)
    } else {
        elm = document.createTextNode(text)
    }
    console.log('createElm', elm)
    vnode.elm = elm
    parentElm.appendChild(elm)
}

function mountComponent(vm: IComponent, el: Element) {
    vm.$el = el
    new Watcher(vm, () => {
        vm._update(vm._render())
    }, () => {
        console.log('cb')
    })
}

function createElement(tag: string, data: any, children: any, text: string) {
    return new VNode(tag, data, children, text)
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

function observe(obj) {
    if (obj === null || typeof obj !== 'object') {
        return
    }
    let ob = new Observer(obj)
    return ob
}

class Observer {
    value: any
    constructor(value) {
        this.value = value
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
    const childOb = observe(val)
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


