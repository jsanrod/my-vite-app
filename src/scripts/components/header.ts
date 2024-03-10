class Header {

    private _headerElement: HTMLElement;


    constructor() {
        this._headerElement = document.querySelector("header") as HTMLElement;

        console.log("header", this._headerElement);
    }
}

new Header();