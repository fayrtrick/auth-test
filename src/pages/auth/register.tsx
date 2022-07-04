import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { trpc } from "../../utils/trpc";
import styles from "../../styles/auth.module.scss";
import { User, UserSchema } from "../../utils/models/auth";
import { useAuth } from "../../contexts/AuthContext";

const Login = () => {
  const { user, register, errors: APIError } = useAuth();

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<User>({ resolver: zodResolver(UserSchema) });

  const onSubmit = (data: User) => {
    register.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div>
        <div>User connected: {user.connected ? "True" : "False"}</div>
        <div>{APIError.error && APIError.message}</div>
        <h1>Register</h1>
        <ul>
          {<li>{errors.email?.message}</li>}
          {<li>{errors.forename?.message}</li>}
          {<li>{errors.surname?.message}</li>}
          {<li>{errors.password?.message}</li>}
        </ul>
        <input placeholder="Email" {...registerField("email")} />
        <input placeholder="Prénom" {...registerField("surname")} />
        <input placeholder="Nom" {...registerField("forename")} />
        <input placeholder="Password" {...registerField("password")} />
        <button type="submit">Envoyer</button>
      </div>
    </form>
  );
};

export default Login;
