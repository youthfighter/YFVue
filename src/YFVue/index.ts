import Watcher from './watcher'
import Observer from './observer'
import { query } from './utils'

export default class YFVue {
    $el: Element
    _data: any
    _render: Function

    constructor(options: any) {
        this._render = options.render
        this._data = options.data()
        this.initData()
        new Observer(this._data) as any
    }

    $mount(el: string | Element) {
        el = query(el)
        this.mountComponent(el)
        return this
    }

    /**
     * 渲染组件
     */
    mountComponent (el: Element) {
        const oldEl = this.$el
        this.$el = el        
        const parent = el.parentElement
        if (!oldEl) {
            parent.appendChild(this.$el)
        } else {
            parent.replaceChild(this.$el, oldEl)
        }   
        new Watcher(this, this.update)
    }
    /**
     * 更新dom
     */
    update() {
        let text = this._render()
        this.$el.innerHTML = `<h2>${text}</h2>`
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
}