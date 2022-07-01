import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { loginSchema } from "../../utils/types";
import type { LoginData } from "../../utils/types";

import styles from "../../styles/auth.module.scss";
import { useAuth } from "../../contexts/AuthContext";
import { trpc } from "../../utils/trpc";

type LoginTypes = {
  email: string;
  password: string;
};

const Login = () => {
  const { user, login } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginTypes>({ resolver: zodResolver(loginSchema) });

  const onSubmit = (data: LoginData) => {
    login();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div>
        <div>User connected: {user.connected}</div>
        <h1>Login</h1>
        <ul>
          {errors.email && <li>{errors.email.message}</li>}
          {errors.password && <li>{errors.password.message}</li>}
        </ul>
        <input placeholder="Email" {...register("email")} />
        <input placeholder="Password" {...register("password")} />
        <button type="submit">Envoyer</button>
      </div>
    </form>
  );
};

export default Login;
