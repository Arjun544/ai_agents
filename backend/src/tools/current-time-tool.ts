import { tool } from '@openai/agents';
import { z } from 'zod';


export const currentTimeTool = tool({
    name: 'get_current_time',
    description: 'Returns the current time',
    parameters: z.object({}),
    async execute({}) {
        return new Date().toLocaleString();
    },
});