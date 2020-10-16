export function getParent(element, selector) {
    let current = element;
    while (current) {
        if (current.matches(selector)) {
            return current;
        }
        current = current.parentElement;
    }

    return null;
};
export function removeChildAt(parent, index) {
    return parent.removeChild(parent.children[index]);
}

export function addChildAt (parent, child, index) {
    if (index >= parent.children.length) {
        parent.appendChild(child);
    } else {
        parent.insertBefore(child, parent.children[index]);
    }
}