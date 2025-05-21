import { ICardActions, IProduct } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Component } from "../base/components";
import { settings } from "../../utils/constants";

export class Card<T> extends Component <IProduct> {
    protected _category?: HTMLElement;
    protected _title: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _description?: HTMLElement;
    protected _price?: HTMLElement;
	protected _index?: HTMLElement;
	protected _categoryProduct = settings;
	protected _button?: HTMLButtonElement;

    constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);
		this._title = ensureElement<HTMLElement>(`.card__title`, container);
		this._image = container.querySelector('.card__image');
		this._category = container.querySelector('.card__category');
		this._button = container.querySelector(`.card__button`);
		this._price = ensureElement<HTMLImageElement>(`.card__price`, container);
		this._description = container.querySelector('.card__description');
		this._index = container.querySelector('basket__item-index');

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set index(value: string) {
		this.setText(this._index, value);
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}
	
	get title(): string {
		return this._title.textContent || '';
	}

	set image(value: string) {
        this.setImage(this._image, value, this._title.textContent);
    }

	set category(value: string) {
		this.setText(this._category, value);
		this._category.className = `card__category card__category_${this._categoryProduct[value]}`;
	}

	set price(value: number) {
		if (value === null) {
			this.setText(this._price, `Бесценно`);
		} else {
			this.setText(this._price, `${value} синапсов`);
		}
		if (this._button && !value) {
			this._button.disabled = true;
		}
	}

	set buttonTitle(value: boolean) {
		if (value === true) {
			this.setText(this._button, 'Товар в корзине');
			this._button.disabled = true;
		}
		else  {
			this.setText(this._button, 'Товар не продается');
		}
	}

	get price(): number {
		return Number(this._price.textContent)
	}

	set description (value: string) {
		if (Array.isArray(value)) {
			this._description.replaceWith(...value.map(str => {
			  const descriptionTemplate = this._description.cloneNode() as HTMLElement;
			  this.setText(descriptionTemplate, str);
			  return descriptionTemplate;
			}))
		  } else {
			this.setText(this._description, value);
		  }
	}
}

export type TCatalogItem = {
	selected: boolean;
};

export class CatalogItem extends Card<TCatalogItem> {
	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container, actions);
	}
}