import bcrypt

class Hash():
    @staticmethod
    def bcrypt(password: str):
        salt = bcrypt.gensalt()
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed_password.decode('utf-8')  

    @staticmethod
    def verify(plain_password: str, hashed_password: str):
        return bcrypt.checkpw(
            plain_password.encode('utf-8'),
            hashed_password.encode('utf-8')
        )