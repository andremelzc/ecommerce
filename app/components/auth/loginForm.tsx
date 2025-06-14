"use client";

import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signIn } from "next-auth/react";
import AppRouteRouteModule from "next/dist/server/route-modules/app-route/module";

export default function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const onSubmit = handleSubmit(async (data) => {
    console.log(data);
    const res = await signIn('credentials',{
        email: data.email,
        password: data.password,
        redirect: false
    })
    if(res?.ok){
        console.log("redirigiendo aaaa")    ;
        router.push("/");
    }
    else{
        alert(res?.error);
    }
    
    
  });

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 bg-white p-6 rounded-xl shadow-md max-w-md mx-auto"
    >
      <h2 className="text-xl font-semibold text-gray-700 text-center">
        Iniciar Sesión
      </h2>

      <input
        type="email"
        placeholder="Correo electrónico"
        {...register("email", {
          required: { value: true, message: "El correo es obligatorio" },
        })}
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {typeof errors.email?.message === "string" && (
        <span className="text-red-500 text-sm">{errors.email.message}</span>
      )}

      <input
        type="password"
        placeholder="Contraseña"
        {...register("password", {
          required: { value: true, message: "La contraseña es obligatoria" },
        })}
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {typeof errors.password?.message === "string" && (
        <span className="text-red-500 text-sm">{errors.password.message}</span>
      )}

      {loginError && (
        <p className="text-red-500 text-sm text-center">{loginError}</p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
      >
        {loading ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
}
