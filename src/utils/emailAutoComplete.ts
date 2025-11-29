// utils/emailAutoComplete.ts
export const emailProviders = [
  "gmail.com",
  "outlook.com",
  "hotmail.com",
  "yahoo.com",
  "icloud.com"
];

export function emailSuggestion(email: string) {
  const [name, domain] = email.split("@");

  if (!domain) return [];
  if (domain.includes(".")) return [];

  return emailProviders
    .filter((prov) => prov.startsWith(domain))
    .map((prov) => `${name}@${prov}`);
}
