import { PrismaUsersRepository } from "@/repositories/prisma-users-repository";
import { UserAlreadyExistsError } from "@/use-cases/errors/user-already-exists-error";
import { RegisterUseCase } from "@/use-cases/register";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function register(request: FastifyRequest, reply: FastifyReply) {
    const registerBodySchema = z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(6)
    })

    const { email, name, password } = registerBodySchema.parse(request.body);

    try {
        const userRepository = new PrismaUsersRepository();

        const registerUseCases = new RegisterUseCase(userRepository);

        await registerUseCases.execute({
            email,
            name,
            password
        })

    } catch (error) {
        if (error instanceof UserAlreadyExistsError) {
            reply.status(409).send(error.message);
        }

        throw error;
    }

    reply.status(201).send();
}