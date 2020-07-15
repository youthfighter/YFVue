import Dep from './dep'
export default class Observer {
    constructor(data: object) {
        for (let key in data) {
            this.defineReactive(data, key)
        }
    }

    defineReactive(obj: object, key: string) {
        let dep = new Dep()
        let val = obj[key]
        
        if(typeof val === 'object'){
            new Observer(val)
        }

        Object.defineProperty(obj, key, {
            // 设置当前描述属性为可被循环
            enumerable: true,
            // 设置当前描述属性可被修改
            configurable: true,
            get() {
                console.log('get', obj, key)
                dep.depend()
                return val
            },
            set(value: any) {
                if (value === val) return
                val = value
                dep.notify()
                return true
            }
        })
    }
}