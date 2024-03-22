export interface PayWithCardResponse {
    orderId: number;
    redirectUrl?: string;
    requires3DSRedirection: boolean;
}
