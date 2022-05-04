import { Request, Response } from 'express';
import Client from '../../core/Client';

export default class Handler {
    public static route: string = '/guild/info/:id'; // Rota de teste
    public client: any;
    constructor(client: Client) {
        this.client = client;
        this.handle = this.handle.bind(this);
    }
    public async handle(req: Request, res: Response) {
        res.json(await this.client.users.fetch(req.params.id));
    }
}
