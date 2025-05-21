import { Component } from "../base/components";
import { IPage} from "../../types";
import { IEvents } from "../base/events";
import { ensureElement } from "../../utils/utils";

export class Page extends Component <IPage> {
    protected _catalog: HTMLElement;
    protected _counter: HTMLElement;
    protected _basket: HTMLElement;
    protected _wrapper: HTMLElement;

    constructor (container: HTMLElement, protected events: IEvents) {
        super(container);

        this._catalog = ensureElement<HTMLElement>('.gallery');
        this._counter = ensureElement<HTMLElement>('.header__basket-counter');
        this._basket = ensureElement<HTMLElement>('.header__basket');
        this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
        this._basket.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
    }

    set catalog(items: HTMLElement[]) {
		this._catalog.replaceChildren(...items);
	}

    set counter(value: number) {
		this.setText(this._counter, String(value));
	}

    set locked(value: boolean) {
        this.toggleClass(this._wrapper, 'page__wrapper_locked', value);
    };
}