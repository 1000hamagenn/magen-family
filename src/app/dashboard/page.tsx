'use client';

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import { 
  Shield, Users, MapPin, LogOut, AlertTriangle, CheckCircle, 
  Globe, Battery, Download, X, Check, Flashlight, Clock, 
  Info, Crown, Settings, Share2, Siren, Navigation, Phone, 
  Bell, Lock, Home, MessageCircle, Send
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const MapComponent = dynamic(() => import('./MapComponent'), { 
  ssr: false, 
  loading: () => <div className="h-full w-full bg-slate-900 animate-pulse rounded-3xl" /> 
});

// שפות + דגלים
const languages = [
  { code: 'he', name: 'עברית', flag: '🇮🇱' },
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'ar', name: 'العربية', flag: '🇸🇦' },
  { code: 'am', name: 'አማርኛ', flag: '🇪🇹' },
];

// ערים + זמני התרעה
const citiesWithTime = [
  { name: 'תל אביב', time: 90 },
  { name: 'ירושלים', time: 90 },
  { name: 'חיפה', time: 60 },
  { name: 'אשדוד', time: 30 },
  { name: 'נתניה', time: 60 },
  { name: 'באר שבע', time: 60 },
  { name: 'אשקלון', time: 30 },
  { name: 'שדרות', time: 15 },
  { name: 'קרית שמונה', time: 0 },
];

// תרגומים מלאים - ללא קיצורים
const translations = {
  he: {
    title: 'אלף המגן',
    createFamily: 'צור משפחה חדשה',
    joinFamily: 'הצטרף למשפחה',
    codePlaceholder: 'קוד הזמנה',
    nicknamePlaceholder: 'כינוי',
    cityPlaceholder: 'עיר',
    streetPlaceholder: 'רחוב',
    joinButton: 'הצטרף',
    imSafe: 'אני בטוח',
    endEvent: 'סיים אירוע',
    familyActive: 'משפחה פעילה',
    inviteCode: 'קוד הזמנה',
    members: 'חברים',
    noMembers: 'אין חברים עדיין',
    safe: 'בטוח',
    notReported: 'לא דיווח',
    timeLeft: 'זמן שנותר',
    instructions: 'הוראות חירום',
    premium: 'פרימיום',
    installApp: 'התקן',
    flashlight: 'פנס',
    flashlightOff: 'כבה פנס',
    settings: 'פרופיל והרשאות',
    save: 'שמור',
    logout: 'התנתק',
    startAlert: 'התחל אזעקה',
    stopAlert: 'עצור אזעקה',
    shareLink: 'שיתוף משפחתי',
    locationSaved: 'מיקום נשמר',
    help: 'זקוק לעזרה',
  },
  en: {
    title: 'Magen Family',
    createFamily: 'Create Family',
    joinFamily: 'Join Family',
    codePlaceholder: 'Invite Code',
    nicknamePlaceholder: 'Nickname',
    cityPlaceholder: 'City',
    streetPlaceholder: 'Street',
    joinButton: 'Join',
    imSafe: "I'm Safe",
    endEvent: 'End Event',
    familyActive: 'Family Active',
    inviteCode: 'Invite Code',
    members: 'Members',
    noMembers: 'No members yet',
    safe: 'Safe',
    notReported: 'Not reported',
    timeLeft: 'Time left',
    instructions: 'Emergency Instructions',
    premium: 'Premium',
    installApp: 'Install',
    flashlight: 'Flashlight',
    flashlightOff: 'Flashlight Off',
    settings: 'Settings',
    save: 'Save',
    logout: 'Logout',
    startAlert: 'Start Alert',
    stopAlert: 'Stop Alert',
    shareLink: 'Share Link',
    locationSaved: 'Location Saved',
    help: 'Need Help',
  },
  ar: {
    title: 'ألف المَغَن',
    createFamily: 'إنشاء عائلة',
    joinFamily: 'الانضمام إلى عائلة',
    codePlaceholder: 'رمز الدعوة',
    nicknamePlaceholder: 'اللقب',
    cityPlaceholder: 'المدينة',
    streetPlaceholder: 'الشارع',
    joinButton: 'انضم',
    imSafe: 'أنا آمن',
    endEvent: 'إنهاء الحدث',
    familyActive: 'العائلة نشطة',
    inviteCode: 'رمز الدعوة',
    members: 'الأعضاء',
    noMembers: 'لا أعضاء بعد',
    safe: 'آمن',
    notReported: 'لم يبلغ',
    timeLeft: 'الوقت المتبقي',
    instructions: 'تعليمات الطوارئ',
    premium: 'بريميوم',
    installApp: 'تثبيت',
    flashlight: 'مصباح',
    flashlightOff: 'إيقاف المصباح',
    settings: 'الإعدادات',
    save: 'حفظ',
    logout: 'تسجيل الخروج',
    startAlert: 'بدء الإنذار',
    stopAlert: 'إيقاف الإنذار',
    shareLink: 'مشاركة الرابط',
    locationSaved: 'تم حفظ الموقع',
    help: 'أحتاج مساعدة',
  },
  am: {
    title: 'አልፍ መጠን',
    createFamily: 'አዲስ ቤተሰብ ፍጠር',
    joinFamily: 'ቤተሰብ ተቀላቀል',
    codePlaceholder: 'የግብዣ ኮድ',
    nicknamePlaceholder: 'ቅፅል ስም',
    cityPlaceholder: 'ከተማ',
    streetPlaceholder: 'ጎዳና',
    joinButton: 'ተቀላቀል',
    imSafe: 'ደህና ነኝ',
    endEvent: 'ክስተት ጨርስ',
    familyActive: 'ቤተሰብ ንቁ',
    inviteCode: 'የግብዣ ኮድ',
    members: 'አባላት',
    noMembers: 'አባላት የሉም',
    safe: 'ደህና',
    notReported: 'አልተዘገበም',
    timeLeft: 'የቀረው ጊዜ',
    instructions: 'የአደጋ መመሪያዎች',
    premium: 'ፕሪሚየም',
    installApp: 'ጫን',
    flashlight: 'ፍላሽ',
    flashlightOff: 'ፍላሽ አጥፋ',
    settings: 'ቅንብሮች',
    save: 'አስቀምጥ',
    logout: 'ውጣ',
    startAlert: 'አደጋ ጀምር',
    stopAlert: 'አደጋ አቁም',
    shareLink: 'ማጋራት ሊንክ',
    locationSaved: 'ቦታ ተቀምጧል',
    help: 'እርዳታ ያስፈልገኛል',
  },
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [families, setFamilies] = useState<any[]>([]);
  const [activeFamily, setActiveFamily] = useState<any>(null);
  const [members, setMembers] = useState<any[]>([]);
  const [checks, setChecks] = useState<any[]>([]);
  const [eventActive, setEventActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);
  const [lang, setLang] = useState<'he' | 'en' | 'ar' | 'am'>('he');
  const [joinCode, setJoinCode] = useState('');
  const [nickname, setNickname] = useState('');
  const [city, setCity] = useState('');
  const [street, setStreet] = useState('');
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [flashOn, setFlashOn] = useState(false);
  const [showInstructions, setShowInstructions] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [alertSound, setAlertSound] = useState<HTMLAudioElement | null>(null);
  const [shelters, setShelters] = useState<any[]>([]);
  
  // מצבי הרשאות
  const [permissions, setPermissions] = useState({
    location: false,
    notifications: false,
    contacts: false,
    flashlight: false
  });

  const t = translations[lang] || translations.he;
  const isRTL = lang === 'ar' || lang === 'he';

  // 1. פונקציית חישוב מקלטים קרובים (מבוסס רדיוס מהמיקום שלך)
  const findNearbyShelters = useCallback((coords: { lat: number; lng: number }) => {
    // בייצור: כאן תבוא קריאת API למאגר מקלטים עירוני
    const mockShelters = Array.from({ length: 10 }).map((_, i) => ({
      id: i,
      name: `מקלט ציבורי #${i + 1}`,
      address: `רחוב המגינים ${10 + i}, ${city || 'מיקום נוכחי'}`,
      distance: `${(0.15 + i * 0.12).toFixed(2)} ק"מ`,
      lat: coords.lat + (Math.random() - 0.5) * 0.005,
      lng: coords.lng + (Math.random() - 0.5) * 0.005,
    }));
    setShelters(mockShelters);
  }, [city]);

  // 2. מיקום והרשאות
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setLocation(coords);
          setPermissions(p => ({ ...p, location: true }));
          findNearbyShelters(coords);
        },
        (err) => console.log('Location denied', err),
        { enableHighAccuracy: true }
      );
    }
  }, [findNearbyShelters]);

  // 3. טעינת אודיו
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const audio = new Audio('/alert.mp3');
        audio.preload = 'auto';
        setAlertSound(audio);
      } catch (err) {
        console.log('Audio load failed', err);
      }
    }
  }, []);

  // 4. פנס (Flashlight API)
  const toggleFlash = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      const track = stream.getVideoTracks()[0];
      // @ts-ignore
      await track.applyConstraints({ advanced: [{ torch: !flashOn }] });
      setFlashOn(!flashOn);
      setPermissions(p => ({ ...p, flashlight: true }));
    } catch (err) {
      alert(t.flashlight + ' - נתמך במובייל בלבד');
    }
  };

  // 5. שיתוף למשפחה בוואטסאפ
  const shareToFamily = () => {
    if (!activeFamily) return alert('צור משפחה קודם');
    const text = encodeURIComponent(`הצטרפו למשפחה שלי ב"אלף המגן"! קוד הצטרפות: ${activeFamily.family_code}. יחד נהיה בטוחים: ${window.location.origin}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  };

  // 6. לוגיקת Supabase מלאה
  useEffect(() => {
    const loadData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return router.replace('/auth');
      setUser(session.user);

      const { data: famsAsOwner } = await supabase.from('families').select('*').eq('owner_id', session.user.id);
      const { data: famsAsMember } = await supabase.from('family_members').select('family_id, families(*)').eq('user_id', session.user.id);

      const allFamilies = [...(famsAsOwner || []), ...(famsAsMember?.map(m => m.families) || [])];
      setFamilies(allFamilies);
      if (allFamilies.length > 0) setActiveFamily(allFamilies[0]);

      setLoading(false);
    };
    loadData();
  }, [router]);

  useEffect(() => {
    if (!activeFamily) return;
    const loadFamilyData = async () => {
      const { data: mems } = await supabase.from('family_members').select('*').eq('family_id', activeFamily.id);
      setMembers(mems || []);
      const { data: chks } = await supabase.from('safety_checks').select('*').eq('family_id', activeFamily.id).order('checked_at', { ascending: false }).limit(50);
      setChecks(chks || []);
    };
    loadFamilyData();
  }, [activeFamily]);

  const createFamily = async () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    const { data, error } = await supabase.from('families').insert({ 
      owner_id: user.id, 
      family_code: code, 
      max_members: 5, 
      name: 'משפחה חדשה' 
    }).select().single();
    
    if (error) alert('שגיאה: ' + error.message);
    else {
      setFamilies(prev => [...prev, data]);
      setActiveFamily(data);
    }
  };

  const joinFamily = async () => {
    if (!joinCode || !nickname || !city || !street) return alert('מלא את כל השדות');
    const { data: fam, error: famErr } = await supabase.from('families').select('id, max_members').eq('family_code', joinCode.toUpperCase()).single();
    if (famErr || !fam) return alert('קוד לא תקין');

    const { count } = await supabase.from('family_members').select('*', { count: 'exact', head: true }).eq('family_id', fam.id);
    if (count && count >= fam.max_members) return alert('המשפחה מלאה');

    const { error } = await supabase.from('family_members').insert({ 
      family_id: fam.id, 
      nickname, 
      city, 
      street, 
      user_id: user?.id 
    });
    
    if (!error) {
      alert('ברוך הבא למשפחה!');
      setFamilies(prev => [...prev, fam]);
      setActiveFamily(fam);
    } else alert('שגיאה: ' + error.message);
  };

  const markSafe = async () => {
    if (!activeFamily) return;
    const { error } = await supabase.from('safety_checks').insert({
      family_id: activeFamily.id,
      member_nickname: nickname || user.email.split('@')[0] || 'חבר משפחה'
    });
    if (error) alert(error.message);
    else alert('עודכן: אתה בטוח!');
  };

  const toggleAlert = () => {
    if (eventActive) {
      setEventActive(false);
      setTimeLeft(0);
      if (alertSound) { alertSound.pause(); alertSound.currentTime = 0; }
    } else {
      const selectedCity = citiesWithTime.find(c => c.name === city);
      const alertTime = selectedCity ? selectedCity.time : 90;
      setTimeLeft(alertTime);
      setEventActive(true);
      if (alertSound) alertSound.play().catch(() => {});
    }
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (eventActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [eventActive, timeLeft]);

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Shield className="w-20 h-20 text-cyan-500 animate-pulse" />
        <h2 className="text-2xl font-black text-white italic tracking-tighter">טוען הגנה משפחתית...</h2>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white pb-28 font-sans" dir={isRTL ? 'rtl' : 'ltr'}>
      
      {/* Header מודרני */}
      <header className="p-6 sticky top-0 z-[100] bg-black/80 backdrop-blur-xl border-b border-white/5 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-cyan-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(8,145,178,0.4)]">
            <Shield className="text-black" size={28} />
          </div>
          <div>
            <h1 className="text-xl font-black italic tracking-tighter leading-none">{t.title}</h1>
            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">Live Security</span>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-white/5 rounded-full p-1 border border-white/10">
            {languages.map(l => (
              <button 
                key={l.code} 
                onClick={() => setLang(l.code as any)}
                className={`w-8 h-8 flex items-center justify-center rounded-full transition ${lang === l.code ? 'bg-cyan-600 scale-110 shadow-lg' : 'opacity-40 hover:opacity-100'}`}
              >
                <span className="text-lg">{l.flag}</span>
              </button>
            ))}
          </div>
          <button onClick={() => setShowSettings(true)} className="p-2 bg-white/10 rounded-full border border-white/20 hover:bg-white/20 transition">
            <Settings size={22} />
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto p-6 space-y-8">

        {/* טיימר חירום בולט */}
        {eventActive && (
          <div className="bg-red-600 rounded-[2.5rem] p-8 text-center shadow-[0_0_50px_rgba(220,38,38,0.6)] animate-pulse">
            <div className="flex justify-center mb-2"><Siren size={40} className="text-white" /></div>
            <h2 className="text-2xl font-black mb-1">זמן כניסה למרחב מוגן</h2>
            <div className="text-8xl font-black tracking-tighter">{timeLeft}</div>
            <p className="text-red-100 font-bold mt-2">שניות שנותרו - רוץ למקלט!</p>
          </div>
        )}

        {/* מפה ומקלטים קרובים */}
        <section className="space-y-4">
          <div className="h-72 rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl relative">
            <MapComponent location={location} />
            <div className="absolute top-4 right-4 z-[1000]">
              <button onClick={() => location && findNearbyShelters(location)} className="bg-black/60 backdrop-blur-md p-3 rounded-2xl border border-white/20">
                <Navigation size={22} className="text-cyan-400" />
              </button>
            </div>
          </div>

          <div className="bg-white/5 rounded-[2rem] border border-white/10 p-6">
            <h3 className="text-lg font-black mb-4 flex items-center gap-2 text-cyan-400">
              <MapPin size={20} /> 10 המקלטים הקרובים ביותר
            </h3>
            <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar pr-2">
              {shelters.length > 0 ? shelters.map((s) => (
                <div key={s.id} className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition">
                  <div>
                    <p className="font-bold text-sm">{s.name}</p>
                    <p className="text-[10px] text-gray-400 italic">{s.address}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-cyan-400 font-black text-sm">{s.distance}</span>
                    <button className="block text-[10px] bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-lg mt-1 font-bold">ניווט</button>
                  </div>
                </div>
              )) : (
                <p className="text-gray-500 text-center text-sm italic">מחפש מקלטים בסביבתך...</p>
              )}
            </div>
          </div>
        </section>

        {/* כפתורי פעולה גדולים */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            onClick={toggleAlert}
            className={`py-8 rounded-[2rem] font-black text-xl shadow-xl transition flex flex-col items-center gap-2 ${eventActive ? 'bg-gray-800 text-gray-400' : 'bg-red-600 text-white hover:bg-red-500'}`}
          >
            {eventActive ? <X size={32} /> : <Siren size={32} />}
            {eventActive ? t.stopAlert : t.startAlert}
          </button>
          
          <button 
            onClick={shareToFamily}
            className="bg-green-600 hover:bg-green-500 py-8 rounded-[2rem] font-black text-xl shadow-xl transition flex flex-col items-center gap-2"
          >
            <MessageCircle size={32} />
            {t.shareLink}
          </button>
        </div>

        {/* ניהול משפחה וסטטוס */}
        <section className="bg-white/5 rounded-[2.5rem] border border-white/10 p-8 space-y-6">
          {!activeFamily ? (
            <div className="space-y-4">
              <h3 className="text-2xl font-black text-center mb-6">{t.joinFamily}</h3>
              <div className="space-y-3">
                <input placeholder={t.codePlaceholder} value={joinCode} onChange={e => setJoinCode(e.target.value)} className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl focus:border-cyan-500 transition outline-none"/>
                <input placeholder={t.nicknamePlaceholder} value={nickname} onChange={e => setNickname(e.target.value)} className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl focus:border-cyan-500 transition outline-none"/>
                <select value={city} onChange={e => setCity(e.target.value)} className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl focus:border-cyan-500 outline-none">
                  <option value="">{t.cityPlaceholder}</option>
                  {citiesWithTime.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
                <input placeholder={t.streetPlaceholder} value={street} onChange={e => setStreet(e.target.value)} className="w-full bg-black/50 border border-white/10 p-5 rounded-2xl focus:border-cyan-500 outline-none"/>
              </div>
              <button onClick={joinFamily} className="w-full bg-cyan-600 py-5 rounded-2xl font-black text-xl shadow-lg hover:bg-cyan-500 transition">{t.joinButton}</button>
              <div className="relative py-4"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div><div className="relative flex justify-center text-xs uppercase"><span className="bg-black px-2 text-gray-500">או</span></div></div>
              <button onClick={createFamily} className="w-full bg-white/5 border border-white/10 py-4 rounded-2xl font-bold hover:bg-white/10 transition">{t.createFamily}</button>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-black flex items-center gap-2"><Users className="text-cyan-400" /> חברי משפחה</h3>
                <span className="bg-cyan-900/50 text-cyan-400 px-3 py-1 rounded-full text-xs font-bold border border-cyan-500/30">קוד: {activeFamily.family_code}</span>
              </div>
              
              <div className="space-y-3">
                {members.map((m) => (
                  <div key={m.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-800 rounded-full flex items-center justify-center font-bold">{m.nickname[0]}</div>
                      <div>
                        <p className="font-bold">{m.nickname}</p>
                        <p className="text-[10px] text-gray-500 uppercase">{m.city}</p>
                      </div>
                    </div>
                    <CheckCircle size={20} className="text-green-500" />
                  </div>
                ))}
              </div>

              <button 
                onClick={markSafe}
                className="w-full bg-white text-black py-8 rounded-[2rem] font-black text-4xl shadow-[0_0_30px_rgba(255,255,255,0.2)] active:scale-95 transition"
              >
                {t.imSafe}
              </button>
            </>
          )}
        </section>
      </main>

      {/* תפריט תחתון (Floating UI) */}
      <nav className="fixed bottom-8 left-6 right-6 bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[3rem] p-4 flex justify-around items-center z-50 shadow-2xl">
        <button onClick={() => setShowInstructions(true)} className="flex flex-col items-center gap-1 text-gray-400 hover:text-white transition">
          <Info size={28} />
          <span className="text-[10px] font-bold">הנחיות</span>
        </button>
        
        <button 
          onClick={toggleFlash}
          className={`p-6 rounded-[2.5rem] transition-all transform ${flashOn ? 'bg-yellow-400 text-black -translate-y-4 shadow-[0_15px_30px_rgba(250,204,21,0.4)]' : 'bg-white/10 text-white'}`}
        >
          <Flashlight size={36} />
        </button>

        <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})} className="flex flex-col items-center gap-1 text-cyan-400">
          <Home size={28} />
          <span className="text-[10px] font-bold">בית</span>
        </button>
      </nav>

      {/* מודאל הגדרות והרשאות מלא */}
      <Transition show={showSettings} as={Fragment}>
        <Dialog onClose={() => setShowSettings(false)} className="relative z-[200]">
          <div className="fixed inset-0 bg-black/95 backdrop-blur-md" />
          <div className="fixed inset-0 flex items-center justify-center p-6">
            <Dialog.Panel className="w-full max-w-sm bg-gray-900 border border-white/10 p-10 rounded-[3.5rem] shadow-3xl">
              <h2 className="text-3xl font-black mb-8 flex items-center gap-3 italic tracking-tighter">
                <Lock className="text-cyan-400" /> {t.settings}
              </h2>
              
              <div className="space-y-4">
                <PermissionRow icon={<MapPin size={20}/>} label="גישה למיקום" active={permissions.location} />
                <PermissionRow icon={<Bell size={20}/>} label="התראות דחיפה" active={permissions.notifications} onToggle={() => setPermissions(p => ({...p, notifications: true}))} />
                <PermissionRow icon={<Users size={20}/>} label="אנשי קשר" active={permissions.contacts} onToggle={() => setPermissions(p => ({...p, contacts: true}))} />
                <PermissionRow icon={<Flashlight size={20}/>} label="בקרת פנס" active={permissions.flashlight} />
              </div>

              <div className="mt-10 space-y-3">
                <button onClick={() => supabase.auth.signOut()} className="w-full bg-red-600/10 text-red-500 py-5 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-red-600/20 transition italic">
                  <LogOut size={20} /> {t.logout}
                </button>
                <button onClick={() => setShowSettings(false)} className="w-full bg-white/5 py-4 rounded-2xl font-bold border border-white/5 hover:bg-white/10">סגור</button>
              </div>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>

      {/* מודאל הנחיות חירום */}
      <Transition show={showInstructions} as={Fragment}>
        <Dialog onClose={() => setShowInstructions(false)} className="relative z-[200]">
          <div className="fixed inset-0 bg-blue-950/95 backdrop-blur-xl" />
          <div className="fixed inset-0 overflow-y-auto p-6 flex items-center justify-center">
            <Dialog.Panel className="w-full max-w-sm text-right">
              <div className="flex justify-center mb-6"><AlertTriangle size={64} className="text-yellow-400 animate-bounce" /></div>
              <h2 className="text-5xl font-black mb-10 text-cyan-400 tracking-tighter">הנחיות מצילות חיים</h2>
              
              <div className="space-y-8 text-xl leading-relaxed">
                <div className="bg-white/5 p-6 rounded-3xl border-r-8 border-cyan-500">
                  <p className="font-black text-2xl text-cyan-200 mb-2">בזמן אזעקה:</p>
                  <ul className="space-y-2 text-gray-300">
                    <li>• היכנס למרחב מוגן (ממ"ד/מקלט)</li>
                    <li>• שכב על הרצפה, כסה ראש בידיים</li>
                    <li>• הישאר 10 דקות לאחר שצפירה נפסקה</li>
                  </ul>
                </div>

                <div className="bg-white/5 p-6 rounded-3xl border-r-8 border-yellow-500">
                  <p className="font-black text-2xl text-yellow-200 mb-2">ציוד חירום הכרחי:</p>
                  <p className="text-gray-300 text-sm">מים (3 ליטר לאדם), פנס, רדיו, מטען נייד, תיק עזרה ראשונה ואוכל יבש.</p>
                </div>
              </div>

              <button 
                onClick={() => setShowInstructions(false)} 
                className="w-full mt-12 bg-cyan-600 py-6 rounded-3xl text-2xl font-black shadow-[0_10px_30px_rgba(8,145,178,0.5)] active:scale-95 transition"
              >
                הבנתי, תודה
              </button>
            </Dialog.Panel>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}

// קומפוננטת עזר לשורת הרשאה
function PermissionRow({ icon, label, active, onToggle }: any) {
  return (
    <div className="flex items-center justify-between p-5 bg-white/5 rounded-3xl border border-white/5">
      <div className="flex items-center gap-4">
        <div className={active ? 'text-cyan-400' : 'text-gray-500'}>{icon}</div>
        <span className="font-bold text-sm">{label}</span>
      </div>
      <button 
        onClick={onToggle}
        className={`w-12 h-6 rounded-full p-1 transition-colors ${active ? 'bg-cyan-500' : 'bg-gray-700'}`}
      >
        <div className={`w-4 h-4 bg-white rounded-full transition-transform ${active ? 'translate-x-6' : 'translate-x-0'}`} />
      </button>
    </div>
  );
}