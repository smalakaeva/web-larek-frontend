import { IEvents } from "../base/events";
import { IOrderContact, IOrderDelivery } from "../../types";
import { ensureElement } from "../../utils/utils";
import { Form } from "./form";

export class OrderForm extends Form<IOrderDelivery> {
    protected _paymentContainer: HTMLDivElement;
    protected _paymentButton: HTMLButtonElement[];
    protected _addressInput: HTMLInputElement;

    constructor (container: HTMLFormElement, events:IEvents) {
        super(container, events);

        this._paymentContainer = ensureElement<HTMLDivElement>('.order__buttons', this.container);
        this._paymentButton = Array.from(this._paymentContainer.querySelectorAll('.button_alt'));
        this._addressInput = this.container.elements.namedItem('address') as HTMLInputElement;
    
        this._paymentContainer.addEventListener('click', (evt: MouseEvent) => {
          const target = evt.target as HTMLButtonElement;
          this.setToggleClassPayment(target.name)
          events.emit(`order.payment:change`, {target: target.name}) 
        })
      }
    
      setToggleClassPayment(name: string) {
        this._paymentButton.forEach(button => {
          this.toggleClass(button, 'button_alt-active', button.name === name);
      });
      }
    
      set address(value: string) {
        this._addressInput.value = value;
      }
}

export class Contacts extends Form<IOrderContact> {
    protected _phoneInput: HTMLInputElement;
    protected _emailInput: HTMLInputElement;
  
    constructor(container: HTMLFormElement, events: IEvents) {
      super(container, events);
      this._phoneInput = this.container.elements.namedItem('phone') as HTMLInputElement;
      this._emailInput = this.container.elements.namedItem('email') as HTMLInputElement;
    }
  
    set email(value: string) {
      this._emailInput.value = value;
    }; 

    set phone(value: string) {
      this._phoneInput.value = value;
    };
  }