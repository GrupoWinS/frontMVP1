import { useState } from "react";
import { Container } from "@/components/layout/container";
import { Section } from "@/components/layout/section";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, Send, CheckCircle, Loader2 } from "lucide-react";
import { useApp } from "@/contexts/app-context";

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

const subjects = [
  { value: "general", label: { en: "General Inquiry", pt: "Dúvida Geral" } },
  { value: "partnership", label: { en: "Partnership", pt: "Parceria" } },
  { value: "support", label: { en: "Support", pt: "Suporte" } },
  { value: "investment", label: { en: "Investment", pt: "Investimento" } },
];

export function ContactSection() {
  const { language } = useApp();
  const [form, setForm] = useState<ContactForm>({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || ''}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) throw new Error("Failed to send message");

      setStatus("success");
      setForm({ name: "", email: "", phone: "", subject: "", message: "" });
      
      setTimeout(() => setStatus("idle"), 5000);
    } catch (error) {
      setStatus("error");
      setErrorMsg(language === "pt" 
        ? "Erro ao enviar. Tente novamente ou envie email direto." 
        : "Failed to send. Please try again or email us directly."
      );
    }
  };

  const handleChange = (field: keyof ContactForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const t = {
    title: { en: "Get in Touch", pt: "Entre em Contato" },
    subtitle: {
      en: "Have questions? We would love to hear from you.",
      pt: "Tem dúvidas? Adoraríamos ouvir você.",
    },
    name: { en: "Name", pt: "Nome" },
    namePlaceholder: { en: "Your name", pt: "Seu nome" },
    email: { en: "Email", pt: "E-mail" },
    emailPlaceholder: { en: "your@email.com", pt: "seu@email.com" },
    phone: { en: "Phone (optional)", pt: "Telefone (opcional)" },
    phonePlaceholder: { en: "+1 (555) 000-0000", pt: "+55 (48) 99999-0000" },
    subject: { en: "Subject", pt: "Assunto" },
    subjectPlaceholder: { en: "Select a subject", pt: "Selecione um assunto" },
    message: { en: "Message", pt: "Mensagem" },
    messagePlaceholder: {
      en: "Tell us how we can help you...",
      pt: "Conte-nos como podemos ajudar...",
    },
    submit: { en: "Send Message", pt: "Enviar Mensagem" },
    sending: { en: "Sending...", pt: "Enviando..." },
    success: {
      en: "Message sent successfully! We'll get back to you soon.",
      pt: "Mensagem enviada com sucesso! Retornaremos em breve.",
    },
    contactEmail: { en: "Or email us directly at", pt: "Ou envie email direto para" },
  };

  return (
    <Section id="contact" className="py-20 md:py-32">
      <Container size="lg">
        <div className="text-center mb-12">
          <h2 className="text-h2 font-bold text-foreground mb-4">
            {t.title[language]}
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t.subtitle[language]}
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <GlassCard variant="glow" size="lg">
            {status === "success" ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-400" />
                </div>
                <p className="text-lg text-foreground">{t.success[language]}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t.name[language]} *
                    </label>
                    <Input
                      type="text"
                      placeholder={t.namePlaceholder[language]}
                      value={form.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t.email[language]} *
                    </label>
                    <Input
                      type="email"
                      placeholder={t.emailPlaceholder[language]}
                      value={form.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t.phone[language]}
                    </label>
                    <Input
                      type="tel"
                      placeholder={t.phonePlaceholder[language]}
                      value={form.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      {t.subject[language]} *
                    </label>
                    <Select
                      value={form.subject}
                      onValueChange={(value) => handleChange("subject", value)}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t.subjectPlaceholder[language]} />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject.value} value={subject.value}>
                            {subject.label[language]}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    {t.message[language]} *
                  </label>
                  <Textarea
                    placeholder={t.messagePlaceholder[language]}
                    value={form.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    rows={5}
                    required
                  />
                </div>

                {status === "error" && (
                  <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                    <p className="text-sm text-destructive">{errorMsg}</p>
                  </div>
                )}

                <Button
                  type="submit"
                  variant="hero"
                  size="lg"
                  className="w-full gap-2"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      {t.sending[language]}
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      {t.submit[language]}
                    </>
                  )}
                </Button>

                <div className="text-center pt-4 border-t border-border">
                  <p className="text-sm text-muted-foreground">
                    {t.contactEmail[language]}{" "}
                    <a
                      href="mailto:hello@singulai.site"
                      className="text-primary hover:underline"
                    >
                      hello@singulai.site
                    </a>
                  </p>
                </div>
              </form>
            )}
          </GlassCard>
        </div>
      </Container>
    </Section>
  );
}
