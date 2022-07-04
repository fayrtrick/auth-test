import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuth } from "../../contexts/AuthContext";
import { UserLogin, UserLoginSchema } from "../../utils/models/auth";
import styles from "../../styles/auth.module.scss";
import { trpc } from "../../utils/trpc";
import axios from "axios";

const Login = () => {
  const { user, login } = useAuth();

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");

  const {
    register: form,
    handleSubmit,
    formState: { errors: formErrors },
  } = useForm<UserLogin>({ resolver: zodResolver(UserLoginSchema) });

  const onSubmit = (data: UserLogin) => {
    login(data).then((err: string) => setErrors(err));
  };

  const test = () => {
    axios.get("/api/user/reconnect").then((data) => console.log(data));
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div>
        <div>{errors}</div>
        <div>User connected: {user.connected ? "True" : " False"}</div>
        <h1>Login</h1>
        <ul>
          {formErrors.email && <li>{formErrors.email.message}</li>}
          {formErrors.password && <li>{formErrors.password.message}</li>}
        </ul>
        <input placeholder="Email" {...form("email")} />
        <input placeholder="Password" {...form("password")} />
        <button type="submit">Envoyer</button>
        <br />
        <button onClick={test}>Reconnect</button>
      </div>
    </form>
  );
};

export default Login;
