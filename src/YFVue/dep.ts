export default class Dep {
    static target: any
    subs: Array<any>

    constructor() {
        this.subs = []
    }

    addSub(sub: any) {
        this.subs.push(sub)
    }

    removeSub(sub) {
        if (this.subs.length) {
            let idx = this.subs.indexOf(sub)
            this.subs.splice(idx, 1)
        }
    }

    depend() {
        console.log('---depend---', Dep.target)
        if (Dep.target) {
            Dep.target.addToDep(this)
        }
    }

    notify() {
        console.log('---notify---', this.subs)
        this.subs.forEach((ele: any) => {
            console.log(ele)
            return ele.update()
        })
    }

}