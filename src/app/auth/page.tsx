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
      if (session) {
        // שים לב: שיניתי לנתיב הראשי "/" כי שם נמצא הדשבורד החדש שלך
        router.push('/');
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black p-4 font-sans">
      <div className="w-full max-w-md bg-zinc-900 p-10 rounded-[2.5rem] shadow-2xl border border-white/5">
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-cyan-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(8,145,178,0.4)] mb-4">
             <span className="text-3xl font-black text-black italic">א</span>
          </div>
          <h1 className="text-3xl font-black text-white italic tracking-tighter">אלף המגן</h1>
          <p className="text-gray-500 text-sm font-medium mt-1">התחברות למערכת ההגנה</p>
        </div>

        <Auth
          supabaseClient={supabase}
          appearance={{ 
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#0891b2',
                  brandAccent: '#06b6d4',
                }
              }
            }
          }}
          providers={[]}
          onlyThirdPartyProviders={false}
          view="sign_in"
          theme="dark"
          localization={{
            variables: {
              sign_in: {
                button_label: 'כניסה למערכת',
                email_label: 'כתובת אימייל',
                password_label: 'סיסמה',
                email_input_placeholder: 'הכנס אימייל...',
                password_input_placeholder: 'הכנס סיסמה...',
                link_text: 'כבר יש לך חשבון? התחבר',
              },
              sign_up: {
                button_label: 'הרשמה למערכת',
                email_label: 'כתובת אימייל',
                password_label: 'סיסמה',
                email_input_placeholder: 'בחר אימייל...',
                password_input_placeholder: 'בחר סיסמה חזקה...',
                link_text: 'אין לך חשבון? הירשם עכשיו',
              },
              forgotten_password: {
                button_label: 'שלח הוראות לאיפוס',
                link_text: 'שכחת סיסמה?',
                email_label: 'כתובת אימייל',
                email_input_placeholder: 'הכנס אימייל לשחזור...',
              }
            },
          }}
        />
      </div>
    </div>
  );
}