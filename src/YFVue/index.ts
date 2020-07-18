import Watcher from './watcher'
import Observer from './observer'
import { query } from './utils'
import VNode from './vnode'
import { isArray } from 'util';

export default class YFVue {
    $el: Element
    $options: any
    _data: any
    _render: Function

    constructor(options: any) {
        this._render = options.render
        this._data = options.data()
        this.$options = options
        this.callHook('beforeCreate')
        this.initData()
        this.initMethods()
        new Observer(this._data) as any
        this.initComputed()
        this.initWatch()
        this.callHook('created')
    }

    $mount(el: string | Element) {
        el = query(el)
        this.mountComponent(el)
        return this
    }

    $watch(key: string, cb: Function) {
        new Watcher(this, key, cb)
    }

    /**
     * 渲染组件
     */
    mountComponent(el: Element) {
        const oldEl = this.$el
        this.$el = el
        const parent = el.parentElement
        if (!oldEl) {
            parent.appendChild(this.$el)
        } else {
            parent.replaceChild(this.$el, oldEl)
        }
        new Watcher(this, () => {
            this.update()
        })
    }
    /**
     * 更新dom
     */
    update() {
        const vnode = this._render(this.createElement)
        this.$el.innerHTML = ''
        this.createEle(vnode, this.$el)
    }

    /**
     * vnode转dom
     * @param vnode 
     * @param parentElm 
     */
    createEle(vnode: VNode, parentElm: Element) {
        let { tag, data = {}, children, text } = vnode
        console.log('createEle', vnode)
        let el
        if (!tag) {
            el = document.createTextNode(text)
        } else {
            el = document.createElement(vnode.tag)

            // set dom attributes
            const attributes = data.attrs || {}
            for (let key in attributes) {
                el.setAttribute(key, attributes[key]);
            }

            // set class
            const classname = data.class
            if (classname) {
                el.setAttribute('class', classname);
            }

            // set dom eventlistener
            const events = data.on || {}
            for (let key in events) {
                el.addEventListener(key, events[key])
            }
        }

        if (isArray(children) && children.length > 0) {
            for (let subVNode of children) {
                this.createEle(subVNode, el)
            }
        }
        parentElm.appendChild(el)
        return el

    }

    /**
     * render转vnode
     * @param tag 
     * @param data 
     * @param children 
     */
    createElement(tag: string, data: any, children: any, text: string): VNode {
        return new VNode(tag, data, children, text)
    }

    /**
     * 代理this 访问this可直接访问data中的属性
     */
    initData() {
        console.log('initData', this._data)
        for (let key in this._data) {
            console.log(key)
            this.proxy(`_data`, key)
        }
    }
    /**
     * 将methods挂载到this上
     */
    initMethods() {
        console.log('initMethods', this.$options.methods)
        if (!this.$options.methods) return
        for (let key in this.$options.methods) {
            this[key] = this.$options.methods[key].bind(this)
        }
    }
    /**
     * 初始化计算属性
     */
    initComputed() {
        const computed = this.$options.computed
        if (!computed) return
        new Observer(computed) as any
        for (const key in computed) {
            const fun = computed[key]
            Object.defineProperty(this, key, {
                enumerable: true,
                configurable: true,
                get() {
                    return fun.call(this)
                }
            })
            this.$watch(key, fun)
        }
    }
    /**
     * 初始化watch
     */
    initWatch() {
        let watch = this.$options.watch
        if (!watch) return
        for (const key in watch) {
            this.$watch(key, watch[key])
        }
    }
    /**
     * 代理到this上
     * @param sourceKey 
     * @param key 
     */
    proxy(sourceKey: string, key: string) {
        Object.defineProperty(this, key, {
            enumerable: true,
            configurable: true,
            get() {
                return this[sourceKey][key]
            },
            set(val) {
                this[sourceKey][key] = val
            }
        })
    }

    /**
     * 钩子函数调用
     */
    callHook(hook: string) {
        const fun = this.$options[hook]
        fun && fun.call(this)
    }
}