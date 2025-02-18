"use server";
import { redirect } from "@/i18n/routing";
import { auth } from "@/server/auth";
import { getLocale } from "next-intl/server";
import { headers } from "next/headers";
import { z } from "zod";
import { user } from "../db/schema/auth-schema";

export const getUser = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session?.user;
};

type ReturnType = { user: typeof user | null; error: string | null };
export const signInEmail = async (
  email: string,
  password: string,
): Promise<ReturnType> => {
  try {
    const { user } = await auth.api.signInEmail({
      body: {
        email: email,
        password: password,
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.log(error);
    return {
      user: null,
      error: error.body.message,
    };
  }
  return { user, error: null };
};

export const redirectIfAuthenticated = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (session) {
    const locale = await getLocale();
    redirect({ href: "/dashboard", locale: locale });
  }
};

const signInSchema = z.object({
  email: z.string().email().min(3).max(255),
  password: z.string().min(8).max(100),
  social: z
    .enum([
      "github",
      "apple",
      "discord",
      "facebook",
      "microsoft",
      "google",
      "spotify",
      "twitch",
      "twitter",
      "dropbox",
      "linkedin",
      "gitlab",
      "reddit",
    ])
    .optional(),
});

export const signInAction = async (data: z.infer<typeof signInSchema>) => {
  const { email, password, social } = data;

  if (!social) {
    const { error } = await signInEmail(email, password);

    if (error) return { error };

    const locale = await getLocale();
    redirect({ href: "/dashboard", locale: locale });
  } else {
    await auth.api.signInSocial({
      body: {
        provider: social,
        callbackURL: "/dashboard",
      },
    });
  }
};

export const signOut = async () => {
  await auth.api.signOut({
    headers: await headers(),
  });
  const locale = await getLocale();
  redirect({ href: "/", locale: locale });
};
