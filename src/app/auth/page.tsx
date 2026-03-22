'use client';

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AuthPage() {
  const router = useRouter();

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) router.push('/dashboard');
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 p-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold text-blue-900 mb-6 text-center">כניסה / הרשמה</h1>
        <Auth
          supabaseClient={supabase}
          appearance={{ theme: ThemeSupa }}
          providers={[]}
          onlyThirdPartyProviders={false}
          view="sign_in"
          localization={{
            variables: {
              sign_in: {
                button: 'כניסה',
                email_label: 'אימייל',
                password_label: 'סיסמה',
              },
              sign_up: {
                button: 'הרשמה',
                email_label: 'אימייל',
                password_label: 'סיסמה',
              },
            },
          }}
        />
      </div>
    </div>
  );
}