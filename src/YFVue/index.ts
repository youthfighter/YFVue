import Watcher from './watcher'
import Observer from './observer'

export default class YFVue {

    _data: any
    private render: Function

    constructor(options: any) {
        this.render = options.render
        this._data = options.data()
        this.initData()
        new Observer(this._data) as any
    }

    $mount() {
        new Watcher(this, this.render)
    }
    /**
     * 代理this 访问this可直接访问data中的属性
     */
    initData () {
        console.log('initData', this._data)
        for(let key in this._data) {
            console.log(key)
            this.proxy(`_data`, key)
        }
    }

    proxy (sourceKey: string, key: string) {
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