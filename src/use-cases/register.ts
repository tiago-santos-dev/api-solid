import { UsersRepository } from "@/repositories/user-repository";
import { hash } from "bcryptjs";
import { UserAlreadyExistsError } from "./errors/user-already-exists-error";

interface RegisterUseCaseRequest {
    name: string;
    email: string;
    password: string;
}

export class RegisterUseCase {
    constructor(private usersRepository: UsersRepository) { }

    async execute({ email, name, password }: RegisterUseCaseRequest) {
        const userExists = await this.usersRepository.findByEmail(email);

        if (userExists) {
            throw new UserAlreadyExistsError()
        }

        const password_hash = await hash(password, 6);

        await this.usersRepository.create({
            name,
            email,
            password_hash
        })
    }
}
