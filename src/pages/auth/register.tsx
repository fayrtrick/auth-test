import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { registerSchema } from "../../utils/types";
import type { RegisterData } from "../../utils/types";
import { trpc } from "../../utils/trpc";

import styles from "../../styles/auth.module.scss";

interface RegisterTypes {
  email: string;
  forename: string;
  surname: string;
  password: string;
}

const Login = () => {
  const [apiErrors, setApiErrors] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterTypes>({ resolver: zodResolver(registerSchema) });

  const registerMutation = trpc.useMutation("auth-v1.register", {
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      setApiErrors(error.message);
    },
  });

  const onSubmit = (data: RegisterData) => {
    console.log(JSON.stringify(data));
    registerMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div>
        <h1>Register</h1>
        {apiErrors}
        <ul>
          {<li>{errors.email?.message}</li>}
          {<li>{errors.forename?.message}</li>}
          {<li>{errors.surname?.message}</li>}
          {<li>{errors.password?.message}</li>}
        </ul>
        <input placeholder="Email" {...register("email")} />
        <input placeholder="Prénom" {...register("surname")} />
        <input placeholder="Nom" {...register("forename")} />
        <input placeholder="Password" {...register("password")} />
        <button type="submit">Envoyer</button>
      </div>
    </form>
  );
};

export default Login;
