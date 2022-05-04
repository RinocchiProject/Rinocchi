type User = {
    id: string;
    username: string;
    discriminator: string;
    avatar: string;
    system?: boolean;
    bot?: boolean;
    mfa_enabled?: boolean;
    banner?: string;
    accent_color?: number;
    locale?: string;
    verified?: boolean;
    email?: string;
    flags?: number;
    premium_type?: number;
    public_flags?: number;
};

export default User;
