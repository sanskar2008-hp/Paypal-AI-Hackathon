export interface Product {
  id: string;
  name: string;
  description: string;
  category: 'Electronics' | 'Home Office' | 'Audio & Wearables' | 'Accessories' | 'Lifestyle';
  price: number;
  currency: string;
  imageUrl: string;
  images?: string[];
  inStock: boolean;
  stockQuantity: number;
  rating: number;
  reviewCount: number;
  attributes: {
    brand?: string;
    batteryLife?: string;
    connectivity?: string;
    dimensions?: string;
    weight?: string;
    warranty?: string;
    color?: string;
    useCase?: string;
    [key: string]: string | number | boolean | undefined;
  };
  isDemoProduct: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
}

export interface CartTotals {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
  isDemoEstimate: boolean;
  itemCount: number;
}

export interface OrderItem {
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  lineTotal: number;
  imageUrl?: string;
}

export interface Order {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  currency: string;
  paymentStatus: 'COMPLETED' | 'PENDING' | 'CANCELLED' | 'FAILED';
  paymentMethod: 'paypal_sandbox' | 'sandbox_simulated';
  paypalOrderId?: string;
  paypalCaptureId?: string;
  fulfilmentStatus: 'unfulfilled' | 'processing' | 'shipped' | 'delivered';
  isDemoOrder: boolean;
  shippingAddress?: {
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface FulfilmentTask {
  id: string;
  orderId: string;
  title: string;
  description: string;
  assignedTo: string;
  dueDate: string;
  status: 'pending' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
}

export interface ProposedCartItem {
  productId: string;
  quantity: number;
  reason: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  recommendedProductIds?: string[];
  proposedCart?: ProposedCartItem[];
  comparisonProductIds?: string[];
  isCartApplied?: boolean;
}

export interface SellerAnalytics {
  totalOrders: number;
  verifiedSales: number;
  averageOrderValue: number;
  ordersByStatus: {
    completed: number;
    pending: number;
    cancelled: number;
  };
  fulfilmentBreakdown: {
    unfulfilled: number;
    processing: number;
    shipped: number;
    delivered: number;
  };
  salesOverTime: {
    date: string;
    sales: number;
    orders: number;
  }[];
  categorySales: {
    category: string;
    amount: number;
    units: number;
  }[];
  topProducts: {
    productId: string;
    name: string;
    unitsSold: number;
    revenue: number;
  }[];
  isDemoData: boolean;
}
