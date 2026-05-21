import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router";
import { Loader2, UserPlus } from "lucide-react";
import { apiRequest } from "../../services/api";
import type { RegisterResponsibleResponse } from "../../types/auth";

export function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [phone, setPhone] = useState("");

  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      await apiRequest<RegisterResponsibleResponse>("/responsibles", {
        method: "POST",
        body: {
          name,
          email,
          phone,
          password,
        },
      });

      setSuccessMessage("Cadastro criado com sucesso! Redirecionando para login...");

      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível criar o cadastro.";

      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="mx-auto grid max-w-5xl gap-10 px-5 py-12 md:grid-cols-[0.9fr_1.1fr] md:items-center">
      <section>
        <span className="mb-4 inline-flex rounded-full bg-[#3E8E91]/10 px-4 py-2 text-sm font-semibold text-[#3E8E91]">
          Cadastro do responsável
        </span>

        <h1 className="text-4xl font-bold text-[#3E8E91] md:text-5xl">
          Criar minha conta
        </h1>

        <p className="mt-5 text-lg leading-8 text-[#333333]/75">
          O cadastro deve ser feito pelo responsável pela criança. Essas
          informações serão usadas para confirmar agendamentos e contato.
        </p>
      </section>

      <section className="rounded-[2rem] bg-white p-6 shadow-sm md:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-semibold text-[#333333]"
            >
              Nome completo
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Digite seu nome completo"
              className="w-full rounded-2xl border border-[#3E8E91]/20 bg-[#F7F3EA] px-4 py-3 outline-none transition focus:border-[#3E8E91]"
            />
          </div>

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-[#333333]"
            >
              E-mail
            </label>

            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="Digite seu e-mail"
              className="w-full rounded-2xl border border-[#3E8E91]/20 bg-[#F7F3EA] px-4 py-3 outline-none transition focus:border-[#3E8E91]"
            />
          </div>

          <div>
            <label
              htmlFor="phone"
              className="mb-2 block text-sm font-semibold text-[#333333]"
            >
              WhatsApp
            </label>

            <input
              id="phone"
              type="text"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              placeholder="Ex: 81999990000"
              className="w-full rounded-2xl border border-[#3E8E91]/20 bg-[#F7F3EA] px-4 py-3 outline-none transition focus:border-[#3E8E91]"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-semibold text-[#333333]"
            >
              Senha
            </label>

            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Crie uma senha"
              className="w-full rounded-2xl border border-[#3E8E91]/20 bg-[#F7F3EA] px-4 py-3 outline-none transition focus:border-[#3E8E91]"
            />
          </div>

          {errorMessage && (
            <div className="rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-700">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="rounded-2xl bg-green-50 p-4 text-sm font-medium text-green-700">
              {successMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#E84545] px-6 py-3 font-semibold text-white transition hover:brightness-95 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                Criando cadastro...
              </>
            ) : (
              <>
                <UserPlus size={20} />
                Criar conta
              </>
            )}
          </button>

          <p className="text-center text-sm text-[#333333]/70">
            Já tenho cadastro.{" "}
            <Link
              to="/login"
              className="font-semibold text-[#3E8E91] hover:underline"
            >
              Entrar na conta
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}