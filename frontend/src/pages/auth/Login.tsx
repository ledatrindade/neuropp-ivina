import { type FormEvent, useState } from "react";
import { Eye, EyeOff, Loader2, LogIn, ShieldCheck } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { apiRequest, getErrorMessage, getFieldErrors } from "../../services/api";
import { saveAuthUser } from "../../services/authStorage";
import type { LoginResponse } from "../../types/auth";
import { FeedbackMessage } from "../../components/ui/FeedbackMessage";

export function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const redirectParam = params.get("redirect");
  const sessionExpired = params.get("reason") === "session-expired";
  const registered = params.get("registered") === "1";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  function safeRedirect(role: LoginResponse["role"]) {
    const defaultPath = role === "ADMIN" ? "/admin" : "/responsavel";
    if (!redirectParam?.startsWith("/") || redirectParam.startsWith("//")) return defaultPath;
    if (role === "ADMIN" && !redirectParam.startsWith("/admin")) return defaultPath;
    if (role === "RESPONSIBLE" && redirectParam.startsWith("/admin")) return defaultPath;
    return redirectParam;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setFieldErrors({});

    if (!email.trim() || !password) {
      setErrorMessage("Preencha o e-mail e a senha.");
      return;
    }

    try {
      setIsLoading(true);
      const response = await apiRequest<LoginResponse>("/auth/login", {
        method: "POST",
        body: { email: email.trim().toLowerCase(), password },
      });
      saveAuthUser(response);
      navigate(safeRedirect(response.role), { replace: true });
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Não foi possível realizar o login."));
      setFieldErrors(getFieldErrors(error));
    } finally {
      setIsLoading(false);
    }
  }

  const registerUrl = redirectParam
    ? `/cadastro?redirect=${encodeURIComponent(redirectParam)}`
    : "/cadastro";

  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-5 py-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-stretch">
      <section className="relative overflow-hidden rounded-[2.25rem] bg-[#3E8E91] p-8 text-white md:p-10">
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-white/10" />
        <div className="absolute -bottom-24 -left-16 h-72 w-72 rounded-full bg-[#E84545]/25" />
        <div className="relative">
          <span className="inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">Área segura</span>
          <h1 className="mt-6 text-4xl font-bold md:text-5xl">Acompanhe cada etapa com tranquilidade.</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-white/80">Entre para acompanhar agendamentos, reagendar quando permitido e acessar documentos liberados pela profissional.</p>
          <div className="mt-8 grid gap-3">
            {[
              "Acesso protegido por autenticação",
              "Histórico de agendamentos organizado",
              "Documentos privados disponíveis somente para sua conta",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-2xl bg-white/10 p-4"><ShieldCheck size={21} /><span className="font-medium">{item}</span></div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-[2.25rem] bg-white p-6 shadow-sm md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#E84545]">Conta NeuroPP</p>
        <h2 className="mt-3 text-3xl font-bold text-[#333333]">Entrar na minha conta</h2>
        <p className="mt-3 text-[#333333]/65">Use o e-mail e a senha cadastrados.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
          {sessionExpired && !errorMessage && (
            <FeedbackMessage type="info">Sua sessão terminou. Entre novamente para continuar.</FeedbackMessage>
          )}
          {registered && !errorMessage && (
            <FeedbackMessage type="success">Cadastro criado. Entre com seu e-mail e senha.</FeedbackMessage>
          )}
          {errorMessage && <FeedbackMessage type="error">{errorMessage}</FeedbackMessage>}

          <div>
            <label htmlFor="email" className="field-label">E-mail</label>
            <input id="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="field-input" placeholder="voce@exemplo.com" aria-invalid={Boolean(fieldErrors.email)} />
            {fieldErrors.email && <p className="field-error">{fieldErrors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="field-label">Senha</label>
            <div className="relative">
              <input id="password" type={showPassword ? "text" : "password"} autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="field-input pr-12" placeholder="Digite sua senha" aria-invalid={Boolean(fieldErrors.password)} />
              <button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-[#333333]/50 hover:bg-white" aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}>
                {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
              </button>
            </div>
            {fieldErrors.password && <p className="field-error">{fieldErrors.password}</p>}
          </div>

          <button type="submit" disabled={isLoading} className="primary-button w-full">
            {isLoading ? <><Loader2 className="animate-spin" size={20} />Entrando...</> : <><LogIn size={20} />Entrar</>}
          </button>

          <p className="text-center text-sm text-[#333333]/70">Ainda não tem conta? <Link to={registerUrl} className="font-semibold text-[#3E8E91] hover:underline">Criar cadastro</Link></p>
        </form>
      </section>
    </main>
  );
}
