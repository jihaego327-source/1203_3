/**
 * @file payment.ts
 * @description 결제 관련 타입 정의
 *
 * Toss Payments API와 연동하기 위한 타입 정의입니다.
 */

/**
 * 결제 요청 정보
 */
export interface PaymentRequest {
  orderId: string;
  orderName: string;
  customerEmail: string;
  customerName: string;
  customerMobilePhone: string;
  amount: number;
  successUrl: string;
  failUrl: string;
}

/**
 * 결제 성공 콜백 파라미터
 */
export interface PaymentSuccessParams {
  paymentKey: string;
  orderId: string;
  amount: string;
}

/**
 * 결제 실패 콜백 파라미터
 */
export interface PaymentFailParams {
  code: string;
  message: string;
  orderId?: string;
}

/**
 * 결제 승인 요청
 */
export interface ConfirmPaymentRequest {
  paymentKey: string;
  orderId: string;
  amount: number;
}

/**
 * 결제 승인 응답 (Toss Payments API 응답 기반)
 */
export interface PaymentResponse {
  mId: string;
  version: string;
  paymentKey: string;
  status: string;
  lastTransactionKey: string;
  orderId: string;
  orderName: string;
  requestedAt: string;
  approvedAt: string;
  useEscrow: boolean;
  cultureExpense: boolean;
  card?: {
    issuerCode: string;
    acquirerCode: string;
    number: string;
    installmentPlanMonths: number;
    isInterestFree: boolean;
    approveNo: string;
    useCardPoint: boolean;
    cardType: string;
    ownerType: string;
    acquireStatus: string;
    amount: number;
  };
  virtualAccount?: any;
  transfer?: any;
  mobilePhone?: any;
  giftCertificate?: any;
  cashReceipt?: any;
  cashReceipts?: any;
  discount?: any;
  cancels?: any;
  secret?: string;
  type: string;
  easyPay?: any;
  country: string;
  failure?: {
    code: string;
    message: string;
  };
  isPartialCancelable: boolean;
  receipt?: {
    url: string;
  };
  checkout?: {
    url: string;
  };
  currency: string;
  totalAmount: number;
  balanceAmount: number;
  suppliedAmount: number;
  vat: number;
  taxFreeAmount: number;
  metadata?: any;
  method: string;
}

