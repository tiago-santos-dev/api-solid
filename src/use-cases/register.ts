import { UsersRepository } from "@/repositories/user-repository";
import { User } from "@prisma/client";
import { hash } from "bcryptjs";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

interface RegisterUseCaseRequest {
    name: string;
    email: string;
    password: string;
}

interface RegisterUseCaseResponse {
    user: User
}

export class RegisterUseCase {
    constructor(private usersRepository: UsersRepository) { }

    async execute({ email, name, password }: RegisterUseCaseRequest): Promise<RegisterUseCaseResponse> {
        const userExists = await this.usersRepository.findByEmail(email);

        if (userExists) {
            throw new UserAlreadyExistsError()
        }

        const password_hash = await hash(password, 6);

        const user = await this.usersRepository.create({
            name,
            email,
            password_hash
        })

        return {
            user
        }
    }
}
