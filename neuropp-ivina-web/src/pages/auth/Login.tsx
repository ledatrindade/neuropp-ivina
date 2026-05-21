import { FormEvent, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { LogIn, Loader2 } from "lucide-react";
import { apiRequest } from "../../services/api";
import { saveAuthUser } from "../../services/authStorage";
import type { LoginResponse } from "../../types/auth";

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();

  const redirectParam = new URLSearchParams(location.search).get("redirect");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  function getRedirectByRole(role: LoginResponse["role"]) {
    if (role === "ADMIN") {
      if (redirectParam && redirectParam.startsWith("/admin")) {
        return redirectParam;
      }

      return "/admin";
    }

    /*
     * Se o responsável veio do fluxo de agendamento,
     * volta para a tela de confirmação.
     */
    if (
      redirectParam &&
      redirectParam.startsWith("/") &&
      !redirectParam.startsWith("/admin")
    ) {
      return redirectParam;
    }

    /*
     * Login comum pelo botão do topo:
     * responsável vai para a área dele.
     */
    return "/responsavel";
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setIsLoading(true);
      setErrorMessage("");

      const response = await apiRequest<LoginResponse>("/auth/login", {
        method: "POST",
        body: {
          email,
          password,
        },
      });

      saveAuthUser(response);

      navigate(getRedirectByRole(response.role));
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Não foi possível realizar o login.";

      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="mx-auto grid max-w-5xl gap-10 px-5 py-12 md:grid-cols-[0.9fr_1.1fr] md:items-center">
      <section>
        <span className="mb-4 inline-flex rounded-full bg-[#3E8E91]/10 px-4 py-2 text-sm font-semibold text-[#3E8E91]">
          Área do responsável
        </span>

        <h1 className="text-4xl font-bold text-[#3E8E91] md:text-5xl">
          Entrar na minha conta
        </h1>

        <p className="mt-5 text-lg leading-8 text-[#333333]/75">
          Acesse sua conta para acompanhar agendamentos, cadastrar crianças e
          visualizar documentos liberados pela profissional.
        </p>
      </section>

      <section className="rounded-[2rem] bg-white p-6 shadow-sm md:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
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
              placeholder="Digite sua senha"
              className="w-full rounded-2xl border border-[#3E8E91]/20 bg-[#F7F3EA] px-4 py-3 outline-none transition focus:border-[#3E8E91]"
            />
          </div>

          {errorMessage && (
            <div className="rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-700">
              {errorMessage}
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
                Entrando...
              </>
            ) : (
              <>
                <LogIn size={20} />
                Entrar
              </>
            )}
          </button>

          <p className="text-center text-sm text-[#333333]/70">
            Ainda não tem conta?{" "}
            <Link
              to="/cadastro"
              className="font-semibold text-[#3E8E91] hover:underline"
            >
              Criar cadastro
            </Link>
          </p>
        </form>
      </section>
    </main>
  );
}