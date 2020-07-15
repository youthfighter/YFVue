import VNode from './vnode'

class YFVue {
    $options: any
    $el: any
    proxy: YFVue
    methods: any
    private dataNotifyChain = {}
    private collected = {}


    constructor(options: object = {}) {
        this.$options = options
        this.proxy = this.initDataProxy()
        this.triggerLifeCycle('created')
        return this.proxy
    }

    $watch(key, cb) {
        this.dataNotifyChain[key] ? this.dataNotifyChain[key].push(cb) : this.dataNotifyChain[key] = [cb]
    }

    $mount(root: string | Element) {
        this.triggerLifeCycle('beforeMount')
        let render = this.$options.render
        if (render) {
            const vnode = render.call(this.proxy, this.createElement.bind(this))
            this.$el = this.createDom(vnode)
            if (typeof root === 'string' && document.querySelector(root)) {
                document.querySelector(root).appendChild(this.$el)
            }
        }
        this.triggerLifeCycle('mounted')
        return this
    }

    $destory() {
        this.triggerLifeCycle('beforeDestory')
    }

    private update() {
        console.log('---update---')
        let render = this.$options.render
        if (render) {
            const vnode = render.call(this.proxy, this.createElement.bind(this))
            const parent = this.$el.parentNode
            let pre = this.$el
            this.$el = this.createDom(vnode)
            if (parent) {
                parent.replaceChild(this.$el, pre)
            }
        }
    }

    private triggerLifeCycle(name) {
        const fun = this.$options[name]
        console.log(name, this.proxy)
        fun && fun.call(this.proxy)
    }

    notifyDataChange(key: any, pre: any, val: any) {
        if (!this.dataNotifyChain[key]) return
        this.dataNotifyChain[key].forEach((cb: Function) => {
            cb(pre, val)
        })
    }

    createElement(tag: string, data: any, children: VNode[]) {
        return new VNode(tag, data, children)
    }

    collect(key) {
        if (!this.collected[key]) {
            this.$watch(key, this.update.bind(this))
            this.collected[key] = true
        }
    }

    createDom(vnode: VNode) {
        const el = document.createElement(vnode.tag)
        for (let key in vnode.data) {
            el.setAttribute(key, vnode.data[key]);
        }

        // set dom eventlistener
        const events = (vnode.data || {}).on || {}
        for (let key in events) {
            el.addEventListener(key, events[key])
        }

        if (Array.isArray(vnode.children)) {
            vnode.children.forEach(child => {
                el.appendChild(this.createDom(child))
            })
        } else {
            el.textContent = vnode.children + ''
        }
        return el
    }

    createDataProxy(data: object, basePath?: string) {
        return new Proxy(data, {
            get: (target: any, key: string) => {
                const fullPath = basePath ? `${basePath}.${key}` : key
                this.collect(fullPath)
                if (typeof target[key] === 'object' && target[key] !== null) {
                    return this.createDataProxy(data[key], fullPath)
                } else {
                    return target[key]
                }
            },
            set: (target: any, key: string, val: any) => {
                const fullPath = basePath ? `${basePath}.${key}` : key
                let pre = target[key]
                target[key] = val
                if (pre !== val) this.notifyDataChange(fullPath, pre, val)
                return true
            }
        })
    }

    private initDataProxy() {
        const data = this.$options.data ? this.$options.data() : {}
        const methods = this.$options.methods || {}

        for (let key in data) {
            this[key] = data[key]
        }

        for (let key in methods) {
            this[key] = methods[key]
        }

        

        return new Proxy(this, {
            get: (_, key) => {
                if (key in data) {
                    return  this.createDataProxy(data)
                } else if (key in methods) {
                    return methods[key].bind(this.proxy)
                } else {
                    return this[key]
                }
            },
            set: (_, key, val) => {
                console.log('set', key)
                let pre
                if (key in data) {
                    pre = data[key]
                    data[key] = val
                } else {
                    pre = this[key]
                    this[key] = val
                }
                if (pre !== val) this.notifyDataChange(key, pre, val)
                return true
            }
        })
    }
}

export default YFVue


