import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { LarekApi} from "./components/LarekApi";
import { EventEmitter } from './components/base/events';
import { ensureElement, cloneTemplate } from './utils/utils';
import { Page } from './components/common/page';
import { Card } from './components/common/card';
import { AppState, CatalogChangeEvent, Product } from './components/common/appState';
import { Basket, BasketItem } from './components/common/basket';
import { Modal } from './components/common/modal';
import { IProduct, IOrderDelivery, IOrderContact} from './types';
import { Contacts, OrderForm } from './components/common/order';
import { Success } from './components/common/success';


const api = new LarekApi(CDN_URL, API_URL);
const events = new EventEmitter();

//все шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const appData = new AppState({}, events);

const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const order = new OrderForm(cloneTemplate(orderTemplate), events);
const contacts = new Contacts(cloneTemplate(contactsTemplate), events);

//отображение товаров
events.on<CatalogChangeEvent>('items:changed', () => {
	page.catalog = appData.catalog.map((item) => {
		const card = new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => { events.emit('card:select', item)
			},
		});
		return card.render({
            category: item.category,
			id: item.id,
			title: item.title,
			image: item.image,
			price: item.price
		});
	});
});

// превью товара
events.on('card:select', (item: Product) => {
	appData.setPreview(item);
});

// изменен открытый выбранный товар
events.on('card:select', (item: Product) => {
	const card = new Card(cloneTemplate(cardPreviewTemplate), {
		onClick: () => events.emit('add:product', item),
	});
	
	modal.render({
		content: card.render({
			title: item.title,
			image: item.image,
			description: item.description,
			category: item.category,
			price: item.price, 
			selected: item.selected
		}),
	});

	if (item.price === null) {
		card.buttonTitle = false;
	}
	if (appData.basket.includes(item)) {
		card.buttonTitle = true;
	}
});

// открытие корзины
events.on('basket:open', () => {
	modal.render({
	  content: basket.render({})
	})
  });

// изменение в корзине
events.on('basket:changed', () => {
	page.counter = appData.getProducts().length
	let total = 0
	basket.items = appData.getProducts().map((item) => {
	  const card = new BasketItem(cloneTemplate(cardBasketTemplate), {
		  onClick: () => {
			appData.removeFromBasket(item)
		  },
	  });
	  total += item.price;
	  return card.render({
		title: item.title,
		price: item.price,
	  })
	})
	basket.total = total;
	appData.order.total = total;	
  });

// добавление элемента в корзину
events.on('add:product', (item: IProduct) => {
	appData.addToBasket(item);
	modal.close();
	page.counter = appData.getProducts().length;
});

// удаление товара из корзины
events.on('card:delete', (item: IProduct) => {
	appData.removeFromBasket(item);
	page.counter = appData.getProducts().length;
});

// нажимаем на кнопку оформить
events.on('order:open', () => {
	modal.render({
		content: order.render({
			valid: order.valid,
			errors: order.errors,
			address: '',
			payment: ''
		})
	})
})

// Переключение способов оплаты в доставке
events.on('order.payment:change', (data: { target: string }) => {
	appData.setPaymentMethod(data.target);
});

// Изменение поля доставки
events.on('order.address:change', (data: { value: string }) => {
	appData.setOrderDeliveryField(data.value);
});

// Валидация полей доставки
events.on('deliveryFormError:change', (errors: Partial<IOrderDelivery>) => {
  const { payment, address } = errors;
  order.valid = !payment && !address
  order.errors = Object.values({ payment, address }).filter(i => !!i).join('; ');
});

//нажимаем на кнопку далее
events.on('order:submit', () => {
	appData.getTotal()
	appData.setItems();
	modal.render({
		content: contacts.render({
			valid: contacts.valid,
			errors: contacts.errors,
			email: '',
			phone: ''
		})
	})
})

//изменение поля email
events.on('contacts.email:change', (data: {value:string}) => {
	appData.setOrderEmail(data.value);
});

//изменение поля phone
events.on('contacts.phone:change', (data: {value:string}) => {
	appData.setOrderPhone(data.value);
})

// Валидация полей контактов
events.on('contactsFormError:change', (errors: Partial<IOrderContact>) => {
	const { email, phone } = errors;
	contacts.valid = !email && !phone
	contacts.errors = Object.values({ email, phone }).filter(i => !!i).join('; ');
  });
  
//нажимаем на кнопку оплатить, открывается модальное окно 'заказ оформлен'
events.on('contacts:submit', () => {
	api.orderResult(appData.order)
	  .then((result) => {
		appData.clearBasket()
		appData.clearOrder() 
		const success = new Success(cloneTemplate(successTemplate), {
		  onClick: () => {
			modal.close()
		  }
		})
		modal.render({
		  content: success.render({
			total: result.total,
		  })
		})
	  })
	  .catch(err => {
		console.error(err);
	  });
  });

  events.on('modal:open', () => {
	page.locked = true; 
  });
  
  events.on('modal:close', () => {
	page.locked = false; 
  });
 
  
api
	.getProductList()
	.then(appData.setCatalog.bind(appData))
	.catch((err) => {
		console.error(err)
	});