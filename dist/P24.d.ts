import { VerifyTransactionConfig } from './types/VerifyTransactionConfig';
import { RefundConfig } from './types/RefundConfig';
import { RefundNotificationConfig } from './types/RefundNotificationConfig';
import { PaymentMethodsConfig } from './types/PaymentMethodsConfig';
import { PaymentMethodsResponse } from './types/PaymentMethodsResponse';
import { RegisterTransactionConfig } from './types/RegisterTransactionConfig';
import { RegisterTransactionResponse } from './types/RegisterTransactionResponse';
import { TransactionNotificationConfig } from './types/TransactionNotificationConfig';
import { RefundResponse } from './types/RefundResponse';
import { P24Config } from './types/P24Config';
export declare class P24 {
    private prod;
    private baseURL;
    private baseApiURL;
    private merchantId;
    private posId;
    private apiKey;
    private crc;
    private defaultValues;
    private axiosInstance;
    private signUtils;
    constructor(data: P24Config);
    testAccess(): Promise<void>;
    getPaymentMethods(data: PaymentMethodsConfig): Promise<PaymentMethodsResponse>;
    registerTransaction(data: RegisterTransactionConfig): Promise<RegisterTransactionResponse>;
    validateIP(ip: string): boolean;
    verifyTransactionNotification(data: TransactionNotificationConfig): boolean;
    verifyTransaction(data: VerifyTransactionConfig): Promise<boolean>;
    verifyNotificationAndTransaction(data: TransactionNotificationConfig & VerifyTransactionConfig): Promise<boolean>;
    refund(data: RefundConfig): Promise<RefundResponse[]>;
    verifyRefundNotification(data: RefundNotificationConfig): boolean;
    private createAxiosInstance;
}