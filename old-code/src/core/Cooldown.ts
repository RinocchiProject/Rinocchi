interface UserType {
    id: string;
    time: number;
    timeout: () => void;
}

export default class Cooldown {
    public static users: Map<string, UserType> = new Map();

    public static set(id: string, time: number = 5) {
        let user: UserType = {
            id: id,
            time: Date.now(),
            timeout: () => {
                setTimeout(() => {
                    this.users.delete(id);
                }, time * 1000);
            },
        };
        this.users.set(id, user);
        this.handleUser(id);
    }
    public static getTime(id: string): number {
        if (!this.users.has(id)) return 0;
        let user = this.users.get(id);
        return (Date.now() - user.time) / 1000;
    }
    public static handleUser(id: string): void {
        let user = this.users.get(id);
        user.timeout();
    }
}
