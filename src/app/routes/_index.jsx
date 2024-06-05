import { Link } from "@remix-run/react";

export const meta = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export default function Index() {
  return (
    <div>
      <div>
        <Link to="/account/login">Login</Link>
      </div>
      <div>
        <Link to="/account/login">Register</Link>
      </div>
    </div>
  );
}
