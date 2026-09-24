export type User = {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    avatar?: string;
    whatsapp?: string | null;
    address?: string | null;
    role_names?: string[];
    two_factor_enabled?: boolean;
    created_at: string;
    updated_at: string;
    [key: string]: unknown;
};

export type Auth = {
    user: User;
    permissions?: string[];
};

export type Passkey = {
    id: number;
    name: string;
    authenticator: string | null;
    created_at_diff: string;
    last_used_at_diff: string | null;
};

export type TwoFactorSetupData = {
    svg: string;
    url: string;
};

export type TwoFactorSecretKey = {
    secretKey: string;
};
