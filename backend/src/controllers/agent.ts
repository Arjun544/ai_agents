import { Agent, run } from '@openai/agents';
import { Server as SocketIOServer } from 'socket.io';
import { COACH_PROMPT } from '../prompts/coach';
import { FINANCE_PROMPT } from '../prompts/finance';
import { HEALTH_PROMPT } from '../prompts/health';
import { PERSONAL_PROMPT } from '../prompts/personal';
import { PLANNER_PROMPT } from '../prompts/planner';

import { Request, Response } from 'express';
import { currentTimeTool } from '../tools/current-time-tool';
import { DrizzleSession } from '../utils/drizzle-session';

const AGENT_PROMPTS: Record<string, string> = {
    'Personal': PERSONAL_PROMPT,
    'Planner': PLANNER_PROMPT,
    'Coach': COACH_PROMPT,
    'Health': HEALTH_PROMPT,
    'Finance': FINANCE_PROMPT,
};

export const agentController = {
    chat: async (req: Request, res: Response) => {
        try {
            const body = req.body as { message?: string; socketId?: string; agent?: string; userId?: string; conversationId?: string };
            const userId = body?.userId;
            const userMessage = body?.message || 'Hello! How can I help you today?';
            const socketId = body?.socketId;
            const conversationId = body?.conversationId;
            const agentName = body?.agent || 'Personal';

            const session = new DrizzleSession(agentName, conversationId, userId);

            // Get Socket.IO instance
            const io = (globalThis as any).io as SocketIOServer;

            if (!io) {
                return res.status(500).json({
                    message: 'Socket.IO server not initialized.',
                    success: false,
                });
            }

            const agent = new Agent({
                name: agentName,
                instructions: AGENT_PROMPTS[agentName] || PERSONAL_PROMPT,
                tools: [currentTimeTool],
            });

            const result = await run(
                agent,
                userMessage, {
                stream: true,
                session,
            }
            );

            // If socketId is provided, stream via Socket.IO
            if (socketId) {
                const stream = result.toTextStream({
                    compatibleWithNodeStreams: true,
                });

                // Stream chunks to the specific socket using Node.js stream API
                return new Promise((resolve, reject) => {
                    stream.on('data', (chunk: Buffer) => {
                        // Emit chunk to the specific socket
                        io.to(socketId).emit('stream:chunk', {
                            chunk: chunk.toString(),
                            done: false,
                        });
                    });

                    stream.on('end', () => {
                        // Stream complete
                        io.to(socketId).emit('stream:chunk', {
                            chunk: '',
                            done: true,
                        });
                        io.to(socketId).emit('stream:complete', {
                            message: result.finalOutput,
                        });
                        resolve(
                            res.json({
                                message: 'Streaming completed',
                                socketId,
                                success: true,
                            })
                        );

                    });

                    stream.on('error', (streamError: Error) => {
                        io.to(socketId).emit('stream:error', {
                            error: streamError instanceof Error
                                ? streamError.message
                                : String(streamError),
                        });
                        reject(streamError);
                    });
                });
            }

            // Fallback: return final output if no socketId provided
            return res.json({
                message: result.finalOutput,
                success: true,
            });
        } catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : String(error);

            // Emit error to socket if socketId was provided
            const body = req.body as { message?: string; socketId?: string };
            const socketId = body?.socketId;
            if (socketId) {
                const io = (globalThis as any).io as SocketIOServer;
                if (io) {
                    io.to(socketId).emit('stream:error', {
                        error: errorMessage,
                    });
                }
            }

            return res.status(500).json({
                message: 'An error occurred while processing your request.',
                error: errorMessage,
                success: false,
            });
        }
    },
};
