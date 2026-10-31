import { Order } from '../types';

export interface ShippingStage {
  id: Order['fulfilmentStatus'];
  label: string;
  description: string;
  milestoneText: string;
}

export const SHIPPING_STAGES: ShippingStage[] = [
  {
    id: 'unfulfilled',
    label: 'Order Confirmed',
    description: 'Payment authorized & verified via PayPal Sandbox',
    milestoneText: 'Order logged into fulfillment queue',
  },
  {
    id: 'processing',
    label: 'Processing & Packed',
    description: 'Items inspected & packaged in warehouse',
    milestoneText: 'Quality inspection passed, awaiting carrier pickup',
  },
  {
    id: 'shipped',
    label: 'In Transit',
    description: 'Dispatched with carrier partner',
    milestoneText: 'Departed regional sorting hub',
  },
  {
    id: 'delivered',
    label: 'Delivered',
    description: 'Delivered to destination address',
    milestoneText: 'Delivered to secure location / signed by recipient',
  },
];

export interface ShippingProgressInfo {
  stepIndex: number; // 0 to 3
  percentage: number; // 15% to 100%
  stageName: string;
  currentMilestone: string;
  isComplete: boolean;
  trackingNumber: string;
  estimatedDeliveryText: string;
}

export function getShippingStageProgress(
  status: Order['fulfilmentStatus'],
  orderId: string,
  createdAt: string
): ShippingProgressInfo {
  let stepIndex = 0;
  let percentage = 15;

  switch (status) {
    case 'unfulfilled':
      stepIndex = 0;
      percentage = 15;
      break;
    case 'processing':
      stepIndex = 1;
      percentage = 45;
      break;
    case 'shipped':
      stepIndex = 2;
      percentage = 78;
      break;
    case 'delivered':
      stepIndex = 3;
      percentage = 100;
      break;
    default:
      stepIndex = 0;
      percentage = 15;
  }

  const stage = SHIPPING_STAGES[stepIndex] || SHIPPING_STAGES[0];

  // Deterministic tracking number generated from order ID
  const cleanId = orderId.replace(/[^a-zA-Z0-9]/g, '');
  const trackingNumber = `1Z${cleanId}948201`;

  // Estimated delivery based on order creation date
  const orderDate = new Date(createdAt);
  const deliveryDate = new Date(orderDate.getTime() + 3 * 24 * 60 * 60 * 1000);
  const estimatedDeliveryText =
    status === 'delivered'
      ? `Delivered on ${deliveryDate.toLocaleDateString()}`
      : `Estimated Delivery: ${deliveryDate.toLocaleDateString()}`;

  return {
    stepIndex,
    percentage,
    stageName: stage.label,
    currentMilestone: stage.milestoneText,
    isComplete: status === 'delivered',
    trackingNumber,
    estimatedDeliveryText,
  };
}

export function getNextShippingStage(
  current: Order['fulfilmentStatus']
): Order['fulfilmentStatus'] {
  switch (current) {
    case 'unfulfilled':
      return 'processing';
    case 'processing':
      return 'shipped';
    case 'shipped':
      return 'delivered';
    case 'delivered':
      return 'unfulfilled';
    default:
      return 'processing';
  }
}
