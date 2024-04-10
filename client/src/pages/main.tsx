import { Button, Link } from "@chakra-ui/react";
import React from "react";

const Main: React.FC = () => {
  return (
    <div>
      <Link href="/register">
        <Button>Register Account</Button>
      </Link>
      <Link href="/login">
        <Button>Login</Button>
      </Link>
    </div>
  );
};
export default Main;
