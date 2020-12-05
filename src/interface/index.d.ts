export interface IComponent {
    data: Function
    $options: any
    _self: IComponent
    _data: Object
    _vnode: IVNode
    $el: Element
    $mount: (el: string) => Element
    _update: (vnode: IVNode) => void
    _render: () => IVNode
    __patch__: (oldVNode: IVNode, newVNode: IVNode) => Element
}

export interface IWatcher {
    vm: IComponent
    getter: Function
    value: any
    cb: Function
    get: () => any
    addDep: (dep: IDep) => void
    update: () => void
}

export interface IDep {
    id: number
    subs: Array<IWatcher>
    addSub: (sub: IWatcher) => void
    depend: () => void
    notify: () => void
}

export interface IVNode {
    tag?: string
    data?: any
    children?: Array<IVNode>
    text?: string
    elm: Element
}