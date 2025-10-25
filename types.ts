
export interface Product {
  id: number;
  name: string;
  seller: string;
  price: number;
  imageUrl: string;
  description: string;
  occasion: string[];
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Occasion {
  id: string;
  name: string;
  emoji: string;
}

export interface GiftIdea {
    name: string;
    description: string;
}
