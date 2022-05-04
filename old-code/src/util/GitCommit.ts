// Isso vai ser usado para armazenar informações em um servidor git privado.
// Para facilitar a leitura depois.
// Você pode apenas ignorar e remover do código caso não queira fazer o seu.

import Fetch from 'node-fetch';
import Client from '../core/Client';

interface OptionsTypes {
    author: {
        name: string;
        email: string;
    };
    branch: string;
    committer: {
        name: string;
        email: string;
    };
    owner: string;
    repo: string;
    file_path: string;
}

class GitService {
    // Esse código utiliza a API do Gitea, talvez você tenha que mudar dependendo do serviço que você for utilizar
    private options: OptionsTypes;
    private client: Client;
    constructor(options: OptionsTypes, client: Client) {
        this.options = options;
        this.client = client;
    }
    public async appendLine(content: string, commit: string): Promise<boolean> {
        let info = await this.fetchFileInfo(),
            fileContent = this.decodeBase64(info.content),
            newContent = this.encodeBase64(`${fileContent}\n${content}`),
            request = await Fetch(
                `${this.client.settings.GIT_API}/repos/${this.options.owner}/${this.options.repo}/contents/${this.options.file_path}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: `Basic ${this.client.settings.GIT_AUTH}`,
                        accept: 'application/json',
                    },
                    body: JSON.stringify({
                        author: {
                            email: this.options.author.email,
                            name: this.options.author.name,
                        },
                        branch: this.options.branch,
                        committer: {
                            email: this.options.committer.email,
                            name: this.options.committer.name,
                        },
                        content: newContent,
                        message: commit,
                        sha: info.sha,
                        signoff: true,
                    }),
                }
            );
        if (request.ok) return true;
        else return false;
    }
    public async fetchFileInfo(): Promise<{ sha: string; content: string }> {
        let request = await Fetch(
                `${this.client.settings.GIT_API}/repos/${this.options.owner}/${this.options.repo}/contents/${this.options.file_path}`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        authorization: `Basic ${this.client.settings.GIT_AUTH}`,
                        accept: 'application/json',
                    },
                }
            ),
            response = await request.json();

        return { sha: response.sha, content: response.content };
    }
    private decodeBase64(base64: string): string {
        return Buffer.from(base64, 'base64').toString('utf8');
    }
    private encodeBase64(content: string): string {
        return Buffer.from(content, 'utf8').toString('base64');
    }
}

export default GitService;
