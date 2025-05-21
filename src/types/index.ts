export type TProductCategory = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил' ;
export type TPayment = 'онлайн' | 'при получении' | '';

export interface IProduct {
    id: string;
    category: TProductCategory;
    title: string;
    description: string;
    price: number;
    image?: string;
    selected: boolean
    index?: number;
}

export interface IPage {
    catalog: HTMLElement[];
    counter: number;
    locked: boolean;
}

export interface IOrderContact {
    email?: string;
    phone?: string;
}

export interface IOrderDelivery {
    payment?: TPayment;
    address?: string;
}

export interface IOrder extends IOrderContact, IOrderDelivery {
    items: string[],
    total: number | string;
}

export interface IOrderSuccess {
    id: string;
    total: number;
}

export interface IAppState {
    catalog: IProduct[];
    basket: IProduct[] | [];
    preview: string | null;
    order: IOrder | null;
    loading: boolean;
}

export interface ICardActions {
	onClick: (event: MouseEvent) => void;
}

export type FormError = Partial<Record<keyof IOrder, string>>