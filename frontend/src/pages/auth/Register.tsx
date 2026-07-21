import { type FormEvent, useMemo, useState } from "react";
import { CheckCircle, Eye, EyeOff, Loader2, UserPlus } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { apiRequest, getErrorMessage, getFieldErrors } from "../../services/api";
import type { RegisterResponsibleResponse } from "../../types/auth";
import { FeedbackMessage } from "../../components/ui/FeedbackMessage";

function normalizePhone(value: string) {
  return value.replace(/\D/g, "").slice(0, 15);
}

export function Register() {
  const navigate = useNavigate();
  const location = useLocation();
  const redirect = new URLSearchParams(location.search).get("redirect");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const requirements = useMemo(() => ({
    length: password.length >= 12 && password.length <= 72,
    matches: password.length > 0 && password === passwordConfirmation,
  }), [password, passwordConfirmation]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setFieldErrors({});

    if (!requirements.length) {
      setErrorMessage("A senha precisa ter entre 12 e 72 caracteres.");
      return;
    }
    if (!requirements.matches) {
      setErrorMessage("A confirmação da senha não confere.");
      return;
    }

    try {
      setIsLoading(true);
      await apiRequest<RegisterResponsibleResponse>("/responsibles", {
        method: "POST",
        body: {
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: normalizePhone(phone),
          password,
        },
      });
      const loginPath = redirect
        ? `/login?registered=1&redirect=${encodeURIComponent(redirect)}`
        : "/login?registered=1";
      navigate(loginPath, { replace: true });
    } catch (error) {
      setErrorMessage(getErrorMessage(error, "Não foi possível criar o cadastro."));
      setFieldErrors(getFieldErrors(error));
    } finally {
      setIsLoading(false);
    }
  }

  const loginUrl = redirect ? `/login?redirect=${encodeURIComponent(redirect)}` : "/login";

  return (
    <main className="mx-auto grid max-w-6xl gap-8 px-5 py-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
      <section className="rounded-[2.25rem] bg-[#3E8E91] p-8 text-white lg:sticky lg:top-28 md:p-10">
        <span className="inline-flex rounded-full bg-white/15 px-4 py-2 text-sm font-semibold">Cadastro do responsável</span>
        <h1 className="mt-6 text-4xl font-bold md:text-5xl">Uma conta para organizar todo o acompanhamento.</h1>
        <p className="mt-5 text-lg leading-8 text-white/80">Os dados cadastrados identificam o responsável e são usados para confirmação e contato sobre os atendimentos.</p>
        <div className="mt-8 rounded-3xl bg-white/10 p-5 text-sm leading-7 text-white/85">Nunca compartilhe sua senha. Documentos liberados ficam disponíveis somente após autenticação.</div>
      </section>

      <section className="rounded-[2.25rem] bg-white p-6 shadow-sm md:p-10">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#E84545]">Nova conta</p>
        <h2 className="mt-3 text-3xl font-bold text-[#333333]">Criar meu cadastro</h2>
        <form onSubmit={handleSubmit} className="mt-8 space-y-5" noValidate>
          {errorMessage && <FeedbackMessage type="error">{errorMessage}</FeedbackMessage>}

          <div><label htmlFor="name" className="field-label">Nome completo</label><input id="name" type="text" autoComplete="name" required minLength={3} maxLength={150} value={name} onChange={(event) => setName(event.target.value)} className="field-input" placeholder="Digite seu nome completo" />{fieldErrors.name && <p className="field-error">{fieldErrors.name}</p>}</div>
          <div><label htmlFor="email" className="field-label">E-mail</label><input id="email" type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} className="field-input" placeholder="voce@exemplo.com" />{fieldErrors.email && <p className="field-error">{fieldErrors.email}</p>}</div>
          <div><label htmlFor="phone" className="field-label">WhatsApp com DDD</label><input id="phone" type="tel" inputMode="numeric" autoComplete="tel" required value={phone} onChange={(event) => setPhone(normalizePhone(event.target.value))} className="field-input" placeholder="81999990000" />{fieldErrors.phone && <p className="field-error">{fieldErrors.phone}</p>}</div>

          <div>
            <label htmlFor="password" className="field-label">Senha</label>
            <div className="relative"><input id="password" type={showPassword ? "text" : "password"} autoComplete="new-password" required minLength={12} maxLength={72} value={password} onChange={(event) => setPassword(event.target.value)} className="field-input pr-12" placeholder="No mínimo 12 caracteres" /><button type="button" onClick={() => setShowPassword((value) => !value)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-2 text-[#333333]/50 hover:bg-white" aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}>{showPassword ? <EyeOff size={19} /> : <Eye size={19} />}</button></div>
            {fieldErrors.password && <p className="field-error">{fieldErrors.password}</p>}
          </div>
          <div><label htmlFor="passwordConfirmation" className="field-label">Confirmar senha</label><input id="passwordConfirmation" type={showPassword ? "text" : "password"} autoComplete="new-password" required value={passwordConfirmation} onChange={(event) => setPasswordConfirmation(event.target.value)} className="field-input" placeholder="Repita a senha" /></div>

          <div className="grid gap-2 rounded-2xl bg-[#F7F3EA] p-4 text-sm">
            <Requirement checked={requirements.length} label="Entre 12 e 72 caracteres" />
            <Requirement checked={requirements.matches} label="As duas senhas são iguais" />
          </div>

          <button type="submit" disabled={isLoading} className="primary-button w-full">{isLoading ? <><Loader2 className="animate-spin" size={20} />Criando cadastro...</> : <><UserPlus size={20} />Criar conta</>}</button>
          <p className="text-center text-sm text-[#333333]/70">Já tem cadastro? <Link to={loginUrl} className="font-semibold text-[#3E8E91] hover:underline">Entrar na conta</Link></p>
        </form>
      </section>
    </main>
  );
}

function Requirement({ checked, label }: { checked: boolean; label: string }) {
  return <div className={`flex items-center gap-2 ${checked ? "text-green-700" : "text-[#333333]/55"}`}><CheckCircle size={17} />{label}</div>;
}
