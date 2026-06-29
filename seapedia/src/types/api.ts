export interface ApiMeta {
  total?: number;
  page?: number;
  limit?: number;
  totalPages?: number;
  status?: number;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  metadata?: ApiMeta;
}

export interface Product {
  id: number;
  name: string;
  description: string;
  price: string | number;
  stock: number;
  image: string | null;
  storeId: number;
  store?: {
    id: number;
    storeName: string;
    sellerId: number;
  };
}

export interface User {
  id: number;
  name: string;
  email: string;
  activeRole: string;
  roles: string[];
}

export interface CartItem {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  product: Product;
}

export interface Cart {
  id: number;
  buyerId: number;
  items: CartItem[];
}
