import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

// Aqui se hacen las configuraciones necesarias
// Aca se manejan proveedores, como github, google al momento de hacer login,
// pero como veremos usuarios autenticados en nuestra BD, esto no sera necesario
// Por que ya hize la pagina de registro.

const authOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email",placeholder:"email@gmail.com" },
                password: { label: "Password", type: "password",placeholder:"******"  }
            },
            //credentials agarra el email y el password colocados
            authorize(credentials,req){
                console.log(credentials);
                return null
            }
        })
    ]
}

//esto nos arroja una funcion, geneerlmente un handler
const handler = NextAuth(authOptions);
//depende de que necesitamos se llamaria a la funcion
export {handler as GET, handler as POST}