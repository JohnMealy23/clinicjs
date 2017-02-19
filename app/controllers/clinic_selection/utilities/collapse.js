(function() {
    const buttonOffset = this.elems.collapseButton.offsetWidth * 1.5;
    const collapseAmount = this.elems.leftTray.offsetWidth - buttonOffset;
    let isCollapsed = false;
    return () => {
        if(isCollapsed === false) {
            isCollapsed = true;
            this.elems.collapseButton.innerHTML = '>>';
            this.elems.leftTray.style.left = `${-1 * collapseAmount}px`;
            this.elems.bottomTray.style.paddingLeft = `${buttonOffset + 30}px`;
        } else {
            isCollapsed = false;
            this.elems.collapseButton.innerHTML = '<<';
            this.elems.leftTray.style.left = 0;
            this.elems.bottomTray.style.paddingLeft = `${collapseAmount + 90}px`;
        }
    }
});