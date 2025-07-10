//create enum por paymentStatus
export enum PaymentStatus {
  pending = 'pending',
  paid = 'paid',
  expired = 'expired',
  failed = 'failed',
  canceled = 'canceled',
  
  completed = 'completed',
  inactive = 'inactive',
  refunded = 'refunded',
  
  dispute_created = 'dispute_created',
  dispute_reinstated = 'dispute_reinstated',
  dispute_closed = 'dispute_closed',
  dispute_won = 'dispute_won',
  dispute_lost = 'dispute_lost'
}

export enum PagosType {
  donacion = 'donacion',
  tienda = 'tienda',
}

//create enum por paymentMethod

export interface IPagos {
  userId: string;
  type: PagosType;
  stripeCostumerId: string;
  stripePaymentId: string;
  paymentMethod: string;
  paymentAmount: number;
  paymentDate: Date;
  paymentStatus: PaymentStatus;
}

export const statusGroups = {
  success: [
    PaymentStatus.paid,
    PaymentStatus.completed,
  ],
  pending: [
    PaymentStatus.pending,
    PaymentStatus.expired,
    PaymentStatus.inactive,
  ],
  cancelled: [
    PaymentStatus.failed,
    PaymentStatus.canceled,
  ],
  refunded: [
    PaymentStatus.refunded,
  ],
  dispute: [
    PaymentStatus.dispute_created,
    PaymentStatus.dispute_reinstated,
    PaymentStatus.dispute_closed,
    PaymentStatus.dispute_won,
    PaymentStatus.dispute_lost
  ]
};
