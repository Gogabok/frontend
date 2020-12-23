/* eslint-disable  @typescript-eslint/no-explicit-any */
const getParents = (
    el: Node,
    parentSelector?: Node, /* optional */
): any[] => {
    if (parentSelector === undefined) {
        parentSelector = document;
    }
    const parents: unknown[] = [];
    let p = el.parentNode;
    while (p !== parentSelector) {
        const o = p;
        parents.push(o);
        if(o) {
            p = o.parentNode;
        } else {
            break;
        }
    }
    parents.push(parentSelector);
    return parents;
};

function findInParents<T>(
    parents: T[],
    item: T,
): T | undefined {
    return parents.find(parent => parent == item);
}

const addToClassList = (
    el: HTMLElement,
    className: string,
): void => {
    el.classList.add(className);
};

const removeFromClassList = (
    el: HTMLElement,
    className: string,
): void => {
    el.classList.remove(className);
};

export {
    getParents,
    findInParents,
    addToClassList,
    removeFromClassList,
};
