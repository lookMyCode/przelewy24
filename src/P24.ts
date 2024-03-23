import axios, { AxiosInstance } from 'axios';
import { CONFIG_DEFAULT_VALUES } from './constants/CONFIG_DEFAULT_VALUES';
import { PRZELEWY24_IP_LIST } from './constants/PRZELEWY24_IP_LIST';
import { SignUtils } from './SignUtils';
import { VerifyTransactionConfig } from './types/VerifyTransactionConfig';
import { RefundConfig } from './types/RefundConfig';
import { RefundNotificationConfig } from './types/RefundNotificationConfig';
import { PaymentMethodsConfig } from './types/PaymentMethodsConfig';
import { PaymentMethodsResponse } from './types/PaymentMethodsResponse';
import { RegisterTransactionConfig } from './types/RegisterTransactionConfig';
import { RegisterTransactionResponse } from './types/RegisterTransactionResponse';
import { TransactionNotificationConfig } from './types/TransactionNotificationConfig';
import { RefundResponse } from './types/RefundResponse';
import { P24ConfigDefaultValues } from './types/P24ConfigDefaultValues';
import { P24Config } from './types/P24Config';
import { PayWithCardConfig } from './types/PayWithCardConfig';
import { PayWithCardResponse } from './types/PayWithCardResponse';
import { CardInfoResponse } from './types/CardInfoResponse';


const PROD_BASE_URL = 'https://secure.przelewy24.pl';
const PROD_API_BASE_URL = PROD_BASE_URL + '/api/v1';
const DEV_BASE_URL = 'https://sandbox.przelewy24.pl';
const DEV_API_BASE_URL = DEV_BASE_URL + '/api/v1';


export class P24 {
  private prod: boolean;
  private baseURL: string;
  private baseApiURL: string;
  private merchantId: number;
  private posId: number;
  private apiKey: string;
  private crc: string;

  private defaultValues: P24ConfigDefaultValues;

  private axiosInstance!: AxiosInstance;

  private signUtils: SignUtils;

  /**
 * Creates an instance of the P24 class, which provides functionality for interacting with the Przelewy24 payment gateway.
 *
 * @class
 * @name P24
 *
 * @param {P24Config} data - Configuration data for initializing the P24 instance.
 * @param {boolean} data.prod - Indicates whether to use the production or sandbox environment.
 * @param {number} data.merchantId - The merchant ID assigned by Przelewy24.
 * @param {number} [data.posId] - The point of sale (POS) ID assigned by Przelewy24. Defaults to the merchant ID if not provided.
 * @param {string} data.apiKey - The API key provided by Przelewy24 for authentication.
 * @param {string} data.crc - The CRC key provided by Przelewy24 for generating checksums.
 * @param {P24ConfigDefaultValues} data.defaultValues - Default values for transaction parameters.
 *
 * @throws {Error} Throws an error if the required configuration data is missing.
 *
 * @example
 * const p24 = new P24({
 *   prod: true,
 *   merchantId: YOUR_MERCHANT_ID,
 *   apiKey: 'YOUR_API_KEY',
 *   crc: 'YOUR_CRC_KEY',
 *   defaultValues: {
 *     currency: 'PLN',
 *     country: 'PL',
 *     language: 'pl',
 *   },
 * });
 */
  constructor(data: P24Config) {
    this.prod = data.prod;
    this.baseURL = data.prod ? PROD_BASE_URL : DEV_BASE_URL
    this.baseApiURL = data.prod ? PROD_API_BASE_URL : DEV_API_BASE_URL

    this.merchantId = data.merchantId;
    this.posId = data.posId ? data.posId : data.merchantId;
    this.apiKey = data.apiKey;
    this.crc = data.crc;
    
    this.defaultValues = {
      ...CONFIG_DEFAULT_VALUES,
      ...data.defaultValues
    };

    this.createAxiosInstance();
    this.signUtils = new SignUtils({
      merchantId: this.merchantId, 
      posId: this.posId,
      crc: this.crc,
    });
  }

    /**
 * Checks the accessibility of the Przelewy24 API.
 *
 * @async
 * @function
 * @name P24#testAccess
 *
 * @throws {Error} Throws an error if there is an issue accessing the API.
 *
 * @returns {Promise<void>} A Promise that resolves when the API is accessible.
 *
 * @example
 * const p24 = new P24({
 *   prod: true,
 *   merchantId: YOUR_MERCHANT_ID,
 *   apiKey: 'YOUR_API_KEY',
 *   crc: 'YOUR_CRC_KEY',
 *   defaultValues: {
 *     currency: 'PLN',
 *     country: 'PL',
 *     language: 'pl',
 *   },
 * });
 *
 * try {
 *   await p24.testAccess();
 *   console.log('API is accessible.');
 * } catch (error) {
 *   console.error('Error accessing API:', error.message);
 * }
 */
  async testAccess() {
    await this.axiosInstance.get('/testAccess');
  }

  /**
 * Retrieves available payment methods from Przelewy24.
 *
 * @async
 * @function
 * @name P24#getPaymentMethods
 *
 * @param {PaymentMethodsConfig} data - Configuration for fetching payment methods.
 * @param {'en' | 'pl'} data.lang - The language in which to retrieve payment methods ('en' for English, 'pl' for Polish).
 * @param {number} [data.amount] - The transaction amount for specific payment methods (optional).
 * @param {string} [data.currency] - The currency code for the transaction (optional).
 *
 * @throws {Error} Throws an error if there is an issue fetching payment methods.
 *
 * @returns {Promise<PaymentMethodsResponse>} A Promise that resolves with the available payment methods.
 *
 * @example
 *  * const p24 = new P24({
 *   prod: true,
 *   merchantId: YOUR_MERCHANT_ID,
 *   apiKey: 'YOUR_API_KEY',
 *   crc: 'YOUR_CRC_KEY',
 *   defaultValues: {
 *     currency: 'PLN',
 *     country: 'PL',
 *     language: 'pl',
 *   },
 * });
 *
 * try {
 *   const paymentMethods = await p24.getPaymentMethods({
 *     lang: 'en',
 *     amount: 1000,
 *     currency: 'USD',
 *   });
 *   console.log('Available payment methods:', paymentMethods);
 * } catch (error) {
 *   console.error('Error fetching payment methods:', error.message);
 * }
 */
  async getPaymentMethods(data: PaymentMethodsConfig): Promise<PaymentMethodsResponse> {
    const { lang, ...params } = data;
    const res = await this.axiosInstance.get(`/payment/methods/${lang}`, {params});
    return res.data;
  }

  /**
 * Registers a new transaction with Przelewy24.
 *
 * @async
 * @function
 * @name P24#registerTransaction
 *
 * @param {RegisterTransactionConfig} data - Configuration for registering a new transaction.
 * @param {string} data.sessionId - Unique identifier for the transaction session.
 * @param {number} data.amount - The transaction amount in grosz (1 PLN = 100 grosz).
 * @param {string} data.description - Description of the transaction.
 * @param {string} data.email - Email address of the customer.
 * @param {string} data.urlReturn - URL to which the customer is redirected after the payment process.
 * @param {string} [data.urlStatus] - URL for receiving transaction status notifications (optional).
 * @param {string} [data.currency] - The currency code for the transaction (optional).
 * @param {string} [data.client] - Client information (optional).
 * @param {string} [data.address] - Customer's address (optional).
 * @param {string} [data.zip] - Customer's ZIP code (optional).
 * @param {string} [data.city] - Customer's city (optional).
 * @param {string} [data.country] - Customer's country (optional).
 * @param {string} [data.phone] - Customer's phone number (optional).
 * @param {string} [data.language] - Language code for the payment process (optional).
 * @param {number} [data.method] - Payment method ID (optional).
 * @param {number} [data.timeLimit] - Time limit for the payment process in minutes (optional).
 * @param {number} [data.channel] - Channel ID (optional).
 * @param {boolean} [data.waitForResult] - Flag indicating whether to wait for the transaction result (optional).
 * @param {boolean} [data.regulationAccept] - Flag indicating whether the customer accepts regulations (optional).
 * @param {number} [data.shipping] - Shipping method ID (optional).
 * @param {string} [data.transferLabel] - Transfer label (optional).
 * @param {string} [data.encoding] - Character encoding (optional).
 * @param {string} [data.methodRefId] - Token obtained from Apple Pay encoded with base64 (optional).
 * @param {Array<{ sellerId: string, sellerCategory: string, name?: string, description?: string, quantity?: number, price?: number, number?: string }>} [data.cart] - Array of cart items (optional).
 * @param {{ shipping: { type: 0 | 1 | 2 | 3, address: string, zip: string, city: string, country: string } }} [data.additional] - Additional information, such as shipping details (optional).
 *
 * @throws {Error} Throws an error if there is an issue registering the transaction.
 *
 * @returns {Promise<RegisterTransactionResponse>} A Promise that resolves with the transaction token and redirect URL.
 *
 * @example
 * const p24 = new P24({
 *   prod: true,
 *   merchantId: YOUR_MERCHANT_ID,
 *   apiKey: 'YOUR_API_KEY',
 *   crc: 'YOUR_CRC_KEY',
 *   defaultValues: {
 *     currency: 'PLN',
 *     country: 'PL',
 *     language: 'pl',
 *   },
 * });
 *
 * try {
 *   const transactionData = await p24.registerTransaction({
 *     sessionId: Date.now().toString(),
 *     amount: 1000,
 *     description: 'Description of the transaction',
 *     email: 'customer@example.com',
 *     urlReturn: 'https://www.example.com/return',
 *     urlStatus: 'https://www.example.com/status',
 *     currency: 'PLN',
 *   });
 *   console.log('Transaction registered successfully:', transactionData);
 * } catch (error) {
 *   console.error('Error registering transaction:', error.message);
 * }
 */
  async registerTransaction(data: RegisterTransactionConfig): Promise<RegisterTransactionResponse> {
    const req = {
      ...data,
      merchantId: this.merchantId,
      posId: this.posId,
      sign: '',
    }

    if (!req.country && this.defaultValues.country) req.country = this.defaultValues.country;
    if (!req.language && this.defaultValues.language) req.language = this.defaultValues.language;
    if (!req.waitForResult && req.waitForResult !== false && typeof(this.defaultValues.waitForResult) === 'boolean') req.waitForResult = this.defaultValues.waitForResult;
    if (!req.regulationAccept && req.regulationAccept !== false && typeof(this.defaultValues.regulationAccept) === 'boolean') req.regulationAccept = this.defaultValues.regulationAccept;

    req.sign = this.signUtils.getRegisterTransactionSign({
      sessionId: req.sessionId,
      amount: req.amount,
      currency: req.currency,
    });
    
    const res = await this.axiosInstance.post('/transaction/register', req);
    const resData = res.data;
    const token = resData.data.token;

    return {
      token, redirectUrl: `${this.baseURL}/trnRequest/${token}`,
    }
  }

  /**
 * Validates whether the provided IP address is in the list of Przelewy24 server IP addresses.
 *
 * @method
 * @name P24#validateIP
 *
 * @param {string} ip - The IP address to validate.
 *
 * @returns {boolean} Returns true if the IP address is valid, otherwise false.
 *
 * @example
 * const isValidIP = p24.validateIP('91.216.191.181');
 * if (isValidIP) {
 *   console.log('Valid IP address');
 * } else {
 *   console.log('Invalid IP address');
 * }
 */
  validateIP(ip: string): boolean {
    return PRZELEWY24_IP_LIST.includes(ip);
  }

  /**
 * Verifies the integrity of a transaction notification by checking the signature.
 *
 * @method
 * @name P24#verifyTransactionNotification
 *
 * @param {TransactionNotificationConfig} data - The transaction notification data.
 *
 * @returns {boolean} Returns true if the signature is valid, otherwise false.
 *
 * @example
 * const notificationData = {
 *   sessionId: '123456789',
 *   amount: 5000,
 *   originAmount: 5000,
 *   currency: 'PLN',
 *   orderId: 123456789,
 *   methodId: 1,
 *   statement: 'Payment for order #123456789',
 *   sign: 'valid_signature',
 * };
 *
 * const isValid = p24.verifyTransactionNotification(notificationData);
 * if (isValid) {
 *   console.log('Valid transaction notification');
 * } else {
 *   console.log('Invalid transaction notification');
 * }
 */
  verifyTransactionNotification(data: TransactionNotificationConfig): boolean {
    const notificationData = {...data};
    const sign = this.signUtils.getTransactionNotificationSign(notificationData);
    return sign === data.sign;
  }

  /**
 * Verifies the status of a transaction by communicating with the Przelewy24 API.
 *
 * @method
 * @name P24#verifyTransaction
 *
 * @param {VerifyTransactionConfig} data - The data required for verifying the transaction.
 *
 * @returns {Promise<boolean>} A Promise that resolves to true if the transaction is verified successfully, otherwise false.
 *
 * @example
 * const verificationData = {
 *   sessionId: '123456789',
 *   orderId: 123456789,
 *   amount: 5000,
 *   currency: 'PLN',
 * };
 *
 * const isVerified = await p24.verifyTransaction(verificationData);
 * if (isVerified) {
 *   console.log('Transaction verified successfully');
 * } else {
 *   console.log('Transaction verification failed');
 * }
 */
  async verifyTransaction(data: VerifyTransactionConfig): Promise<boolean> {
    const verifyData = {...data};

    const req = {
      ...verifyData, 
      merchantId: this.merchantId,
      posId: this.posId,
      sign: this.signUtils.getVerifySign(verifyData)
    }

    const res = await this.axiosInstance.put('/transaction/verify', req);
    const status = res.data?.data?.status;
    return status === 'success';
  }

  /**
 * Verifies both the transaction notification and the status of a transaction by communicating with the Przelewy24 API.
 *
 * @method
 * @name P24#verifyNotificationAndTransaction
 *
 * @param {TransactionNotificationConfig & VerifyTransactionConfig} data - The combined data for verifying the notification and transaction.
 *
 * @returns {Promise<boolean>} A Promise that resolves to true if both the notification and transaction are verified successfully, otherwise false.
 *
 * @example
 * const verificationData = {
 *   sessionId: '123456789',
 *   orderId: 123456789,
 *   amount: 5000,
 *   originAmount: 5000,
 *   currency: 'PLN',
 *   methodId: 1,
 *   statement: 'Payment for order #123456789',
 *   sign: 'abcdefgh123456789',
 * };
 *
 * const isVerified = await p24.verifyNotificationAndTransaction(verificationData);
 * if (isVerified) {
 *   console.log('Notification and transaction verified successfully');
 * } else {
 *   console.log('Verification failed');
 * }
 */
  async verifyNotificationAndTransaction(data: TransactionNotificationConfig & VerifyTransactionConfig): Promise<boolean> {
    const isValid = this.verifyTransactionNotification({
      sessionId: data.sessionId,
      amount: data.amount,
      originAmount: data.originAmount,
      currency: data.currency,
      methodId: data.methodId,
      orderId: data.orderId,
      statement: data.statement,
      sign: data.sign,
    });

    if (!isValid) return false;
    return await this.verifyTransaction({
      sessionId: data.sessionId,
      amount: data.amount,
      currency: data.currency,
      orderId: data.orderId,
    });
  }

  /**
 * Initiates a refund for a previously registered transaction.
 *
 * @method
 * @name P24#refund
 *
 * @param {RefundConfig} data - The data needed to process the refund, including the requestId, refundsUuid, and details of the refunds.
 *
 * @returns {Promise<RefundResponse[]>} A Promise that resolves to an array of RefundResponse objects containing the status and message for each refund.
 *
 * @example
 * const refundData = {
 *   requestId: 'refund123',
 *   refundsUuid: 'refundUuid123',
 *   urlStatus: 'https://www.example.com/refund-status',
 *   refunds: [
 *     {
 *       orderId: 123456789,
 *       sessionId: 'refundSession123',
 *       amount: 2500,
 *       description: 'Refund for order #123456789',
 *     },
 *   ],
 * };
 *
 * const refundResponse = await p24.refund(refundData);
 * console.log(refundResponse);
 */
  async refund(data: RefundConfig): Promise<RefundResponse[]> {
    const res = await this.axiosInstance.post('/transaction/refund', data);
    return res.data.data;
  }

  /**
 * Verifies the authenticity of a refund notification based on the provided data and signature.
 *
 * @method
 * @name P24#verifyRefundNotification
 *
 * @param {RefundNotificationConfig} data - The data received in the refund notification.
 *
 * @returns {boolean} A boolean indicating whether the refund notification is authentic or not.
 *
 * @example
 * const refundNotificationData = {
 *   orderId: 123456789,
 *   sessionId: 'refundSession123',
 *   requestId: 'refund123',
 *   refundsUuid: 'refundUuid123',
 *   amount: 2500,
 *   currency: 'PLN',
 *   timestamp: 1643626375000,
 *   status: 1,
 *   sign: 'generatedSignature',
 * };
 *
 * const isAuthentic = p24.verifyRefundNotification(refundNotificationData);
 * console.log(isAuthentic); // true or false
 */
  verifyRefundNotification(data: RefundNotificationConfig) {
    const notificationData = {...data};
    const sign = this.signUtils.getRefundNotificationSign(notificationData);
    return sign === data.sign;
  }

  async payWithCard(data: PayWithCardConfig): Promise<PayWithCardResponse> {
    const res = await this.axiosInstance.post('/card/pay', data);
    const resp: PayWithCardResponse = {
      ...res.data.data,
      requires3DSRedirection: res.status === 201,
    }
    
    return resp;
  }

  async getCardInfo(orderId: number | string): Promise<CardInfoResponse> {
    const res = await this.axiosInstance.get(`/card/info/${orderId}`);
    return res.data.data;
  }

  private createAxiosInstance() {
    this.axiosInstance = axios.create({
      baseURL: this.baseApiURL,
      headers: {
        'Content-Type': 'application/json',
      },
      auth: {
        username: this.posId.toString(),
        password: this.apiKey,
      },
    });
  }
}
