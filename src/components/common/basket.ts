import { Component } from "../base/components";
import { EventEmitter } from "../base/events";
import { ensureElement, createElement } from "../../utils/utils";
import { ICardActions } from "../../types";
import { CatalogItem } from "./card";

interface IBasketView {
    items: HTMLElement[];
    selected: string[];
    total: number;
}

export class Basket extends Component<IBasketView> {
    protected _list: HTMLElement;
    protected _total: HTMLElement;
    protected _button: HTMLElement;

    constructor(container: HTMLElement, protected events: EventEmitter) {
        super(container);

        this._list = ensureElement<HTMLElement>('.basket__list', this.container);
        this._total = this.container.querySelector('.basket__price');
        this._button = this.container.querySelector('.basket__button');

        if (this._button) {
            this._button.addEventListener('click', () => {
                events.emit('order:open');
            });
        }
        this.items = []
    }

      set items(items: HTMLElement[]) {
        if (items.length) {
          this._list.replaceChildren(...items);
          this.setDisabled(this._button, false)
        } else {
          this._list.replaceChildren(createElement<HTMLParagraphElement>('p', {
              textContent: 'Корзина пуста'
              }));
          this.setDisabled(this._button, true);
        }
      }

      set selected(items: string[]) {
        if (items.length) {
          this.setDisabled(this._button, false);
        } else {
          this.setDisabled(this._button, true);
        }
      }

	      set total(total: number) {
		      this.setText(this._total, `${total.toString()}` + ' синапсов');
	      }

	      get total(): number {
		      return this.total;
	      }     
  }

export interface IBasketItem {
    title: string;
    price: number;
    index?: number;
    description: string;
    category: string;
    id?: string
    selected: CatalogItem[]
  }

export class BasketItem extends Component<IBasketItem> {
  protected _index: HTMLElement;
  protected _title: HTMLElement;
  protected _price: HTMLElement;
  protected _button: HTMLButtonElement;
  selected: CatalogItem[];

constructor(container: HTMLElement, action?: ICardActions ) {
  super(container);

    this._index = ensureElement<HTMLElement>('.basket__item-index', container);
    this._title = ensureElement<HTMLElement>('.card__title', container);
    this._price = ensureElement<HTMLElement>('.card__price', container);
    this._button = ensureElement<HTMLButtonElement>(`.basket__item-delete`, container);
  
  if(action?.onClick) {
    if(this._button) {
      this._button.addEventListener('click', (action.onClick));
    }
  }
}

set index(value: number) {
  this.setText(this._index, value)
}

set title(value: string) {
  this.setText(this._title, value)
}

set price(value: number) {
  this.setText(this._price, value + 'синапсов');
}
}