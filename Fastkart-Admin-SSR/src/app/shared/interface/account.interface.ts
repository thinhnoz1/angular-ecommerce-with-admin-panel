import { Attachment } from "./attachment.interface";
import { PaymentDetails } from "./payment-details.interface";
import { Role, Permission } from "./role.interface";
import { Stores } from "./store.interface";
import { UserAddress } from "./user.interface";
import { Wallet } from "./wallet.interface";

export interface AccountUser {
    id: number;
    name: string;
    email: string;
    status: boolean;
    country_code: number;
    phone: string;
    profile: string;
    profile_image?: Attachment;
    profile_image_id?: number;
    email_verified_at?: string;
    store?: Stores;
    vendor_wallet: Wallet;
    created_at?: string;
    updated_at?: string;
    deleted_at?: string;
    permission: Permission[];
    role?: Role;
    role_id?: number;
    role_name?: string;
    address?: UserAddress[];
    is_approved?: boolean;
    payment_account?: PaymentDetails;
}

export interface AccountUserUpdatePassword {
    current_password: string;
    new_password: string;
    confirm_password: string;
}