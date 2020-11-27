export interface IComponent {
    data: Function;
    $options: any;
    _self: IComponent;
    _data: Object;
}

export interface IWatcher {
    vm: IComponent;
    getter: Function;
    value: any;
    get: () => any
    addDep: (dep: IDep) => void;
    update: () => void;
}

export interface IDep {
    subs: Array<IWatcher>;
    addSub: (sub: IWatcher) => void;
    depend: () => void;
    notify: () => void;
}