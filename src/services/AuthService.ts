import {compare} from 'bcrypt'

class AuthService{

    private replaceAlgoFlag(hashedString: string): string
    {
        const replaceFlag = '$2y$'
        const withFlag = '$2a$'

        if(!hashedString.startsWith( replaceFlag )){
            return hashedString
        }

        return hashedString.replace(replaceFlag, withFlag)
    }

    async compare(plainText: string, hashed: string): Promise<boolean>
    {
        return await compare(plainText, this.replaceAlgoFlag(hashed))
    }

}

export default AuthService
