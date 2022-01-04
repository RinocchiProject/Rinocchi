import User from './UserApiType';

interface WelcomeScreen {
    description: string;
    welcome_channels: [
        {
            description: string;
            emoji_name: string;
            emoji_id: string;
        }
    ];
}
interface PartialGuild {
    id: string;
    name: string;
    icon: string;
    banner?: string;
    splash?: string;
    description?: string;
    features?: string[];
    vanity_url_code?: string;
    welcome_screen?: WelcomeScreen;
    nsfw: boolean;
    nsfw_level: number;
}
interface Invite {
    code: string;
    guild?: PartialGuild;
    inviter?: User;
    approximate_presence_count?: number;
    approximate_member_count?: number;
    expires_at: string | null;
}

export default Invite;
