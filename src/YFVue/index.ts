import Watcher from './watcher'
import Observer from './observer'
import { query } from './utils'
import VNode from './vnode'

/**
 * 1. 缺少方法的卸载
 */

export default class YFVue {
    $el: Element
    $options: any
    _data: any
    _render: Function
    _events: any = {}
    vnode: VNode = null

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
    /**
     * 挂载
     * @param el 
     */
    $mount(el: string | Element) {
        el = query(el)
        this.mountComponent(el)
        return this
    }

    /**
     * 销毁
     */
    $deatory(event: string, fn?: Function) {
        this.callHook('beforeDestroy')
    }

    /**
     * 方法安装
     */
    $on() {

    }

    /**
     * 方法的卸载
     */
    $off() {

    }

    $watch(key: string, cb: Function) {
        new Watcher(this, key, cb)
    }

    patch(oldVnode: VNode, vnode: VNode) {
        if (this.sameVnode(oldVnode, vnode)) {
            // 相似节点打补丁（尽量复用dom节点）
            this.patchVnode(oldVnode, vnode)
        } else {
            // 不相似就整个覆盖
            let parent = oldVnode && oldVnode.elm ? oldVnode.elm.parentElement : this.$el
            // 插入新节点
            this.createElm(vnode, parent)
            // 删除老节点
            oldVnode && this.removeVnode(oldVnode)
        }
        this.vnode = vnode
        return vnode.elm
    }

    /**
     * 更新当前vnode对应的dom
     */
    patchVnode(oldVnode: VNode, vnode: VNode) {
        // 新旧node相等 直接返回
        if (oldVnode === vnode) return
        // 新节点的dom指向老节点
        let elm = vnode.elm = oldVnode.elm
        const oldChildren = oldVnode.children
        const children = vnode.children

        // 更新相关属性
        if (vnode.data) {
            this.updateAttrs(oldVnode, vnode)
        }
        // 如果是文本节点，肯定没有children属性
        if (vnode.text) {
            if (vnode.text !== oldVnode.text) elm.textContent = vnode.text
        } else {
            // 新节点不是文本节点，判断老节点是否为文本节点，清空对应的值
            if (oldVnode.text) {
                elm.textContent = ''
            }
            // 新老children都存在 更新children
            if (oldChildren && children) {
                this.updateChildren(elm, oldChildren, children)
            } else if (children) {
                // 将新children（vnode[]）插入到dom中
                // oldChildren不存在，原来可能是文本节点 需要清空text
                this.addVnodes(elm, children)
            } else if (oldChildren) {
                // 将老的children（vnode[]）从dom中删除
                this.removeVnodes(oldChildren)
            }
        }
        return vnode.elm
    }

    addVnodes(elm: Element, vnodes: Array<VNode>, refElm?: Element) {
        for (let vnode of vnodes) {
            this.createElm(vnode, elm, refElm)
        }
    }

    /**
     *  批量删除节点
     */
    removeVnodes(vnodes: Array<VNode>) {
        for (let vnode of vnodes) {
            this.removeVnode(vnode)
        }
    }

    updateChildren(parentElm: Element, oldChildren: Array<VNode>, newChildren: Array<VNode>) {
        let oldStartIdx = 0 // 旧(前)
        let oldEndIdx = oldChildren.length - 1 // 旧(后)
        let newStartIdx = 0 // 新(前)   
        let newEndIdx = newChildren.length - 1 // 新(后)
        // 新(前)-旧(前)、新(后)-旧(后)、新(后)-旧(前)、新(前)-旧(后)
        while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
            let oldStartVNode = oldChildren[oldStartIdx]
            let newStartVNode = newChildren[newStartIdx]
            let oldEndVNode = oldChildren[oldEndIdx]
            let newEndVnode = newChildren[newEndIdx]
            if (this.sameVnode(oldStartVNode, newStartVNode)) {
                // 新(前)-旧(前)
                this.patchVnode(oldStartVNode, newStartVNode)
                oldStartIdx++
                newStartIdx++
            } else if (this.sameVnode(oldEndVNode, newEndVnode)) {
                // 新(后)-旧(后)
                this.patchVnode(oldEndVNode, newEndVnode)
                oldEndIdx--
                newEndIdx--
            } else if (this.sameVnode(oldStartVNode, newEndVnode)) {
                //新(后)-旧(前)
                this.patchVnode(oldStartVNode, newEndVnode)
                if (oldEndVNode.elm.nextSibling) {
                    parentElm.insertBefore(oldStartVNode.elm, oldEndVNode.elm.nextSibling())
                } else {
                    parentElm.appendChild(oldEndVNode.elm)
                }
                oldStartIdx++
                newEndIdx--
            } else if (this.sameVnode(oldEndVNode, newStartVNode)) {
                // 新(前)-旧(后)
                this.patchVnode(oldStartVNode, newEndVnode)
                parentElm.insertBefore(oldEndVNode.elm, oldStartVNode.elm)
                oldEndIdx--
                newStartIdx++
            } else {
                let idx = this.findIdxInOld(newStartVNode, oldChildren, oldStartIdx + 1, oldEndIdx - 1)
                if (idx > -1) {
                    // 存在该节点
                    this.patch(oldChildren[idx], newStartVNode)
                    oldChildren[idx] = null // 避免被其他节点再次找到
                } else {
                    // 没有找到节点
                    this.createElm(newStartVNode, parentElm)
                }
                newStartIdx++
            }
        }

        if (oldStartIdx > oldEndIdx) {
            // oldChildren先循环完毕，newchildren中未循环的都需要插入
            this.addVnodes(parentElm,
                newChildren.filter((ele, idx) => idx >= newStartIdx && idx <= newEndIdx),
                newChildren[newEndIdx + 1] ? newChildren[newEndIdx + 1].elm : null)
        } else {
            // newchildren先循环完毕，oldChildren未循环的节点删除
            this.removeVnodes(oldChildren.filter((ele, idx) => idx >= oldStartIdx && idx <= oldEndIdx))
        }
    }

    /**
     * 在制定范围的旧节点中找节点
     * @param newStartVnode 
     * @param oldCh 
     * @param oldStartIdx 
     * @param oldEndIdx 
     */
    findIdxInOld(newStartVnode: VNode, oldCh: Array<VNode>, oldStartIdx: number, oldEndIdx: number) {
        let result = -1
        for (let i = oldStartIdx; i <= oldEndIdx; i++) {
            if (this.sameVnode(oldCh[i], newStartVnode)) {
                result = i
            }
        }
        return result
    }

    /**
     * 删除节点
     */
    removeVnode(vnode: VNode) {
        let elm = vnode.elm
        if (elm.parentElement) {
            elm.parentElement.removeChild(elm)
        }
    }

    /**
     * 更新属性
     */
    updateAttrs(oldVnode: VNode, vnode: VNode) {
        let elm = vnode.elm
        let oldAttrs = oldVnode.data.attrs || {}
        let attrs = vnode.data.attrs || {}

        for (let key in attrs) {
            if (attrs[key] !== oldAttrs[key]) {
                elm.setAttribute(key, attrs[key])
            }
        }

        for (let key in oldAttrs) {
            if (!attrs[key]) {
                elm.removeAttribute(key)
            }
        }
    }

    sameVnode(a: VNode, b: VNode) {
        return a && b && a.key === b.key && a.tag === b.tag
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
        // const vnode = this._render(this.createElement)
        // this.createElm(vnode, this.$el)
        new Watcher(this, () => {
            this.update()
        })
    }
    /**
     * 更新dom
     */
    update() {
        const vnode = this._render(this.createElement)
        // this.$el.innerHTML = ''
        // this.createElm(vnode, this.$el)
        this.patch(this.vnode, vnode)
    }

    /**
     * vnode转dom
     * @param vnode 
     * @param parentElm 
     */
    createElm(vnode: VNode, parentElm: Element, refElm?: Element) {
        let { tag, data = {}, children, text } = vnode
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
                if (this._events[key]) {
                    this._events[key].push(events[key])
                } else {
                    this._events[key] = [events[key]]
                }
            }
        }

        if (Array.isArray(children) && children.length > 0) {
            for (let subVNode of children) {
                this.createElm(subVNode, el)
            }
        }
        if (refElm) {
            parentElm.insertBefore(el, refElm)
        } else {
            parentElm.appendChild(el)
        }
        vnode.elm = el
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