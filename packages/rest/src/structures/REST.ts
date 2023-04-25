import { AsyncQueue } from '@sapphire/async-queue';
import fetch, { Response, FormData } from 'node-fetch';

export interface RESTOptions {}

export class REST {
    #options: RESTOptions;
}
