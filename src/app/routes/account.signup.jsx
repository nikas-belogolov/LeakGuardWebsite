import { redirect } from "@remix-run/node";
import { Form, Link, useActionData, useNavigation } from "@remix-run/react";
import FormInput from "src/app/components/Input";
import User from "src/server/models/User";
import bcrypt from "bcryptjs"

import accountStyles from "~/styles/account.css?url"

export const links = () => [
    { rel: "stylesheet", href: accountStyles },
];

export async function action({
    request,
    context: { login }
}) {
    try {
        const formData = await request.formData();
        console.log(Object.fromEntries(formData))

        const { username, email, password } = Object.fromEntries(formData);


        let newUser = new User({
            email,
            username,
            password
        });

        await newUser.validate();

        bcrypt.hash(newUser.password, 10).then(async hash => {
            newUser.password = hash;
            await newUser.save();
        })


        login(newUser, (err) => {
            if (err) throw err;
            return redirect('/dashboard')
        })
  
      } catch (errors) {
        console.log(errors.errors)
        return errors.errors;  
      }
}

export async function loader({ context: { isAuthenticated } }) {
    // If the user is already authenticated redirect to /dashboard directly
    if (isAuthenticated()) {
        return redirect("/dashboard");
    }

    return null
}

export default function Register() {
    const error = useActionData();
    const navigation = useNavigation();

    console.log(error)

    return (
        <div className="flex h-screen">
            <main className="w-screen h-screen md:w-1/2 lg:w-1/3 p-5">
                <h1>Sign up</h1>
                <Form method="post" className="mb-3">
                    <fieldset disabled={navigation.state === "submitting"}>
                        <div className="mb-3">
                            <FormInput
                                inputProps={{
                                    name: "username",
                                }}
                                label= "Username:"
                                errorMessage={error?.username?.message}
                            />
                        </div>
                        <div className="mb-3">
                            <FormInput
                                inputProps={{
                                    name: "email",
                                }}
                                label= "Email:"
                                errorMessage={error?.email?.message}
                            />
                        </div>
                        <div className="mb-3">
                            <FormInput
                                inputProps={{
                                    name: "password",
                                    type: "password"
                                }}
                                label= "Password:"
                                errorMessage={error?.password?.message}
                            />
                        </div>
                        <button type="submit" className="btn btn-success">
                            {navigation.state === "submitting"
                                ? "Signing up..."
                                : "Sign up"}
                        </button>
                    </fieldset>
                </Form>
                <p>Already have an account? <Link to="/account/login">Sign in</Link></p>
            </main>
        </div>
    )
}