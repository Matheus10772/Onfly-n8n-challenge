import {
	IExecuteFunctions,
	IHttpRequestOptions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

export class Random implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Random',
		name: 'random',
		icon: 'file:random.svg',
		group: ['transform'],
		version: 1,
		description: 'Generates a true random integer using the Random.org API.',
		defaults: {
			name: 'Random Number',
			color: '#1A82e2',
		},
		inputs: ['main'],
		outputs: ['main'],
		properties: [
			// Node properties which the user can configure
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'True Random Number Generator',
						value: 'generate',
						description: 'Generate a single true random integer',
						action: 'Generate a true random integer',
					},
				],
				default: 'generate',
			},
			{
				displayName: 'Min',
				name: 'min',
				type: 'number',
				default: 1,
				required: true,
				description: 'The minimum value for the random number (inclusive).',
				displayOptions: {
					show: {
						operation: ['generate'],
					},
				},
			},
			{
				displayName: 'Max',
				name: 'max',
				type: 'number',
				default: 100,
				required: true,
				description: 'The maximum value for the random number (inclusive).',
				displayOptions: {
					show: {
						operation: ['generate'],
					},
				},
			},
		],
	};

	// The function below is called when the workflow gets executed.
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const min = this.getNodeParameter('min', i, 0) as number;
				const max = this.getNodeParameter('max', i, 0) as number;

				if (min > max) {
					throw new NodeApiError(this.getNode(), { message: 'Min value cannot be greater than Max value.' });
				}

				const apiUrl = 'https://www.random.org/integers/';
				const options: IHttpRequestOptions = {
					method: 'GET',
					url: `${apiUrl}?num=1&min=${min}&max=${max}&col=1&base=10&format=plain&rnd=new`,
					json: false, // We expect plain text
				};

				// Utiliza  helper httpRequest do n8n, conforme as melhores práticas
				const response = await this.helpers.httpRequest(options);

				// O resultado é uma string com o número e uma quebra de linha (\n)
				const randomNumber = parseInt(response.trim(), 10);

				if (isNaN(randomNumber)) {
					throw new NodeApiError(this.getNode(), { message: 'Failed to parse a valid number from Random.org API response.' });
				}

				// Anexa o resultado ao item original
				const newItem: INodeExecutionData = {
					json: {
						...items[i].json,
						randomNumber: randomNumber,
					},
					pairedItem: { item: i },
				};

				returnData.push(newItem);

			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}