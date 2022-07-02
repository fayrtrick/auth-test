import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuth } from "../../contexts/AuthContext";
import { UserDetails, UserDetailsSchema } from "../../utils/models/auth";
import styles from "../../styles/auth.module.scss";
import { trpc } from "../../utils/trpc";

const Login = () => {
  const { user, login, errors: APIError } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserDetails>({ resolver: zodResolver(UserDetailsSchema) });

  const onSubmit = (data: UserDetails) => {
    login.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div>
        <div>User connected: {user.connected ? "True" : " False"}</div>
        <div>{APIError.error && APIError.message}</div>
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
