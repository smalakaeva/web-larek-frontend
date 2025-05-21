import { Model } from "../base/model";
import { IProduct, TProductCategory, IAppState, IOrder, FormError, TPayment } from "../../types";

export type CatalogChangeEvent = {
	catalog: IProduct[]
}

export class Product extends Model<IProduct> implements IProduct {
    id: string;
    category: TProductCategory;
    title: string;
    description: string;
    price: number ;
    image?: string;
    selected: boolean;
}

export class AppState extends Model<IAppState> {
    catalog: IProduct[];
    basket: IProduct[] = [];
    preview: string | null;
    order: IOrder = {
      payment: '',
      items: [],
      total: 0,
      email: "",
      phone: "",
      address: ""
    }
    formError: FormError = {};

    setCatalog (items: IProduct[]) {
        this.catalog = items.map(item => new Product(item, this.events));
        this.emitChanges('items:changed', { catalog: this.catalog });
    }

    setPreview(item: IProduct) {
		  this.preview = item.id;
		  this.emitChanges('preview:changed', item);
    }

    getProducts(): IProduct[] {
      return this.catalog.filter((item) => this.basket.includes(item));
	  }

    addToBasket(item: IProduct) {
      if(!this.basket.includes(item)) {
        this.basket.push(item)
        this.updateBasket();
      }
    }

    removeFromBasket(item: IProduct) {
      if (!this.basket.includes(item)) return;
      const index = this.basket.findIndex((i) => i === item);
      this.basket.splice(index, 1);
      this.emitChanges('basket:open', { catalog: this.catalog });
      this.emitChanges('basket:changed', { catalog: this.catalog });
    }
    
    getTotal() {
      return this.order.items.reduce((total, item) => total + this.catalog.find(it => it.id === item).price, 0)
    }

    setItems() {
      this.order.items = this.basket.map((item) => item.id);
    }

    clearBasket() {
      this.basket = [];
      this.updateBasket();
    }

    updateBasket() {
      this.emitChanges('counter:changed', this.basket);
      this.emitChanges('basket:changed', this.basket);
    }

    setPaymentMethod(method: string) {
      this.order.payment = method as TPayment;
      this.validateDelivery();
    }

    setOrderDeliveryField(value: string) {
      this.order.address = value;
      this.validateDelivery();
    };

    setOrderEmail(value: string) {
      this.order.email = value;
      this.validateContact();
    }

    setOrderPhone(value: string) {
      this.order.phone = value;
      this.validateContact();
    }

    validateDelivery() {
      const errors: typeof this.formError = {};
      if(!this.order.payment) {
			  errors.payment = 'Необходимо указать способ оплаты'
		  }
      if(!this.order.address) {
        errors.address = 'Необходимо указать адрес'
      }
      this.formError = errors;
      this.events.emit('deliveryFormError:change', this.formError)
      return Object.keys(errors).length === 0
    }

    validateContact() {
      const errors: typeof this.formError = {};
      if(!this.order.email) {
        errors.email = 'Необходимо указать email'
      }
      if(!this.order.phone) {
        errors.phone = 'Необходимо указать телефон'
      }
      this.formError = errors;
      this.events.emit('contactsFormError:change', this.formError)
      return Object.keys(errors).length === 0
    }

    clearOrder(): void {
      this.order = {
        payment: 'онлайн',
        address: '',
        email: '',
        phone: '',
        total: 0,
        items: [],
      };
    }
}