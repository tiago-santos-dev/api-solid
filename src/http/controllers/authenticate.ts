import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials-error";
import { makeAuthenticateUseCase } from "@/use-cases/factories/make-authenticate-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
    const authenticateBodySchema = z.object({
        email: z.string().email(),
        password: z.string().min(6)
    })

    const { email, password } = authenticateBodySchema.parse(request.body);

    try {

        const authenticateUseCases = makeAuthenticateUseCase();

        await authenticateUseCases.execute({
            email,
            password
        })

    } catch (error) {
        if (error instanceof InvalidCredentialsError) {
            reply.status(400).send(error.message);
        }

        throw error;
    }

    reply.status(200).send();
}