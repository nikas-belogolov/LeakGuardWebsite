import { redirect } from "@remix-run/node"

export function loader({ context: { logout } }) {
    logout();    
    return redirect('/account/login');
}