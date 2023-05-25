import type {
    RESTError,
    RESTErrorFieldInformation,
    RESTErrorGroupWrapper,
} from 'discord-api-types/v10';
import type { HTTPMethods, RequestBody } from '@paqujs/rest';
import type { Arrayable } from '@paqujs/shared';

export class DiscordAPIError extends Error {
    public status: number;
    public code: number;
    public method: HTTPMethods;
    public url: string;
    public override message: string;
    public errors: RESTError[];
    public body: RequestBody;

    public constructor(
        status: number,
        code: number,
        method: HTTPMethods,
        url: string,
        message: string,
        requestBody: RequestBody,
        errors: RESTError[],
    ) {
        super(message);

        this.status = status;
        this.code = code;
        this.method = method;
        this.url = url;

        const flattened = this.flattenErrors(errors);
        this.message = `${message}${flattened.length ? `\n${flattened.join('\n')}` : ''}`;

        this.body = requestBody;
    }

    public override get name(): string {
        return `${this.constructor.name}[${this.code}]`;
    }

    private flattenErrors(
        errors: Arrayable<RESTError> | RESTErrorGroupWrapper,
        prefix = '',
    ): string[] {
        const messages = [];

        for (const fieldName in errors) {
            const field = errors[fieldName] as RESTErrorGroupWrapper;

            if (field._errors) {
                messages.push(
                    field._errors
                        .map(
                            (error: RESTErrorFieldInformation) =>
                                `${prefix}${fieldName}[${error.code}]: ${error.message}`,
                        )
                        .join('\n'),
                );
            } else if (typeof field === 'object') {
                messages.push(...this.flattenErrors(field, `${prefix}${fieldName}.`));
            }
        }

        return messages;
    }
}
