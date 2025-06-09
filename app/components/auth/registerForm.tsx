"use client";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";

export default function RegisterForm() {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  //es para redirigir a otra URL
  const Router = useRouter();
  const onSubmit = handleSubmit(async(data) => {
    try {
      const response = await fetch ("/api/auth/register",
        {
          method: 'POST',
          body: JSON.stringify(data),
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )

      const resJSON = await response.json();
      console.log("debugging");
      console.log(response);
      if (response.ok){
        Router.push('/auth/login');
      }
    }
    catch {

    }
  });

  const password = watch("contrasena");

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4 bg-white p-6 rounded-xl shadow-md max-w-md mx-auto"
    >
      <h2 className="text-xl font-semibold text-gray-700 text-center">Registro</h2>

      <input
        type="text"
        placeholder="Nombre"
        {...register("nombre", {
          required: { value: true, message: "El nombre es obligatorio" },
        })}
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {typeof errors.nombre?.message === "string" && (
        <span className="text-red-500 text-sm">{errors.nombre.message}</span>
      )}

      <input
        type="text"
        placeholder="Apellido"
        {...register("apellido", {
          required: { value: true, message: "El apellido es obligatorio" },
        })}
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {typeof errors.apellido?.message === "string" && (
        <span className="text-red-500 text-sm">{errors.apellido.message}</span>
      )}

      <select
        {...register("tipo_identificacion", {
          required: { value: true, message: "Selecciona un tipo de identificación" },
        })}
        className="w-full px-4 py-2 border rounded-md bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">Selecciona tipo de identificación</option>
        <option value="DNI">DNI</option>
        <option value="Carnet de extranjeria">Carnet de extranjería</option>
      </select>
      {typeof errors.tipo_identificacion?.message === "string" && (
        <span className="text-red-500 text-sm">{errors.tipo_identificacion.message}</span>
      )}

      <input
        type="text"
        placeholder="Número de Identificación"
        {...register("identificacion", {
          required: { value: true, message: "El número de identificación es obligatorio" },
        })}
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {typeof errors.identificacion?.message === "string" && (
        <span className="text-red-500 text-sm">{errors.identificacion.message}</span>
      )}

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
        type="tel"
        placeholder="Teléfono"
        {...register("telefono", {
          required: { value: true, message: "El teléfono es obligatorio" },
          minLength: { value: 9, message: "Debe tener 9 dígitos" },
          maxLength: { value: 9, message: "Debe tener 9 dígitos" },
          pattern: { value: /^[0-9]+$/, message: "Solo se permiten números" },
        })}
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {typeof errors.telefono?.message === "string" && (
        <span className="text-red-500 text-sm">{errors.telefono.message}</span>
      )}

      <input
        type="password"
        placeholder="Contraseña"
        {...register("contrasena", {
          required: { value: true, message: "La contraseña es obligatoria" },
        })}
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {typeof errors.contrasena?.message === "string" && (
        <span className="text-red-500 text-sm">{errors.contrasena.message}</span>
      )}

      <input
        type="password"
        placeholder="Confirmar contraseña"
        {...register("confirmPassword", {
          required: { value: true, message: "Confirma tu contraseña" },
          validate: (value) =>
            value === password || "Las contraseñas no coinciden",
        })}
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {typeof errors.confirmPassword?.message === "string" && (
        <span className="text-red-500 text-sm">{errors.confirmPassword.message}</span>
      )}

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
      >
        Registrarse
      </button>
    </form>
  );
}
