import { IWatcher, IDep } from './interface/index.d'

let uid = 0

export default class Dep implements IDep{
    static target: IWatcher
    subs: Array<IWatcher>
    id: number

    constructor() {
        this.subs = []
        this.id = uid++
    }

    addSub(sub: IWatcher) {
        this.subs.push(sub)
    }

    depend() {
        if (Dep.target) {
            Dep.target.addDep(this)
        }
    }
    notify() {
        let subs = this.subs.slice()
        for (let i = 0; i < subs.length; i++) {
            this.subs[i].update()
        }
    }
}

Dep.target = null