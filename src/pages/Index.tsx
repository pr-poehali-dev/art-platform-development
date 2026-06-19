import { useState, useRef } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const ART_1 = 'https://cdn.poehali.dev/projects/0ee4ca3d-f475-41a9-8f16-dbceb309b837/files/b18cd49a-af07-4a44-aee0-93074b6859fe.jpg';
const ART_2 = 'https://cdn.poehali.dev/projects/0ee4ca3d-f475-41a9-8f16-dbceb309b837/files/8f84b05c-0bb9-4e3f-ab42-ed436d611680.jpg';
const ART_3 = 'https://cdn.poehali.dev/projects/0ee4ca3d-f475-41a9-8f16-dbceb309b837/files/83fa27df-0906-45bd-84d9-867aa59412af.jpg';

const NAV = [
  { id: 'gallery',    label: 'Галерея',   icon: 'Images'      },
  { id: 'moderation', label: 'Модерация', icon: 'ShieldCheck' },
  { id: 'rules',      label: 'Правила',   icon: 'BookOpen'    },
  { id: 'profile',    label: 'Профиль',   icon: 'User'        },
  { id: 'settings',   label: 'Настройки', icon: 'Settings'    },
];

const TAGS = ['Абстракция', 'Портрет', 'Киберпанк', 'Природа', 'Фэнтези'];

type BanStatus = 'active' | 'restricted' | 'temp' | 'banned';

interface GalleryItem {
  id: number;
  img: string;
  title: string;
  author: string;
  likes: number;
  tag: string;
}

interface UserProfile {
  name: string;
  initials: string;
  role: string;
  works: number;
  likes: number;
  bio: string;
  ban: BanStatus;
  banUntil?: string;
}

type Mod = { name: string; role: 'Модератор' | 'Главный модератор'; initials: string };

const INIT_GALLERY: GalleryItem[] = [
  { id: 1, img: ART_1, title: 'Неоновый район',   author: 'Кай',   likes: 248, tag: 'Киберпанк' },
  { id: 2, img: ART_2, title: 'Космическая душа', author: 'Лина',  likes: 512, tag: 'Портрет'   },
  { id: 3, img: ART_3, title: 'Жидкий сон',       author: 'Артём', likes: 389, tag: 'Абстракция' },
  { id: 4, img: ART_1, title: 'Полночный город',  author: 'Vega',  likes: 176, tag: 'Киберпанк' },
  { id: 5, img: ART_3, title: 'Голо-волна',       author: 'Соня',  likes: 421, tag: 'Абстракция' },
  { id: 6, img: ART_2, title: 'Звёздные глаза',   author: 'Майя',  likes: 333, tag: 'Портрет'   },
];

const MOD_QUEUE_INIT = [
  { id: 1, img: ART_2, title: 'Галактическая муза', author: 'newbie_99', reason: 'Авто-проверка' },
  { id: 2, img: ART_1, title: 'Тёмный переулок',   author: 'pixel_man', reason: 'Жалоба ×2'    },
  { id: 3, img: ART_3, title: 'Поток #12',          author: 'art_lover', reason: 'Авто-проверка' },
];

const INIT_MODS: Mod[] = [
  { name: 'Лина', role: 'Главный модератор', initials: 'ЛН' },
  { name: 'Кай',  role: 'Модератор',         initials: 'КА' },
  { name: 'Vega', role: 'Модератор',         initials: 'VG' },
];

const INIT_USERS: UserProfile[] = [
  { name: 'Кай',   initials: 'КА', role: 'Художник',    works: 34, likes: 2100, bio: 'Цифровое искусство и киберпанк', ban: 'active' },
  { name: 'Лина',  initials: 'ЛН', role: 'Модератор',   works: 12, likes: 870,  bio: 'Иллюстратор, главред галереи',  ban: 'active' },
  { name: 'Артём', initials: 'АР', role: 'Художник',    works: 21, likes: 1340, bio: 'Абстрактная живопись',           ban: 'active' },
  { name: 'Vega',  initials: 'VG', role: 'Модератор',   works: 8,  likes: 560,  bio: 'Фотограф и видеограф',          ban: 'active' },
  { name: 'Соня',  initials: 'СН', role: 'Художник',    works: 17, likes: 980,  bio: 'Акварель + digital',            ban: 'active' },
  { name: 'Майя',  initials: 'МА', role: 'Пользователь', works: 5, likes: 230,  bio: 'Начинающий художник',           ban: 'active' },
];

const INIT_ROLES = ['Художник', 'Модератор', 'Пользователь'];

const RULES_LIST = [
  { icon: 'Ban',                   title: 'Только своё творчество', text: 'Запрещено публиковать чужие работы без указания автора.' },
  { icon: 'EyeOff',               title: 'Без жестокости и NSFW',  text: 'Шокирующий и откровенный контент удаляется модераторами.' },
  { icon: 'Copyright',            title: 'Авторские права',        text: 'Не используйте защищённые материалы без разрешения.' },
  { icon: 'MessageSquareWarning', title: 'Уважение в общении',     text: 'Токсичность в комментариях ведёт к ограничениям.' },
];

// ─────────────────────────────────────────────────
// Root
// ─────────────────────────────────────────────────
export default function Index() {
  const [tab, setTab]           = useState('gallery');
  const [gallery, setGallery]   = useState(INIT_GALLERY);
  const [users, setUsers]       = useState(INIT_USERS);
  const [uploadOpen, setUpload] = useState(false);
  const [viewUser, setViewUser] = useState<UserProfile | null>(null);
  const [quotaCount, setQCount] = useState([10]);
  const [quotaSize,  setQSize]  = useState([25]);
  const [theme, setTheme]       = useState<'light' | 'dark'>('light');
  const [myName, setMyName]     = useState(INIT_USERS[0].name);

  // Применяем тёмную тему к body тоже
  if (typeof document !== 'undefined') {
    document.documentElement.style.colorScheme = theme;
  }

  const openProfile = (name: string) => {
    const u = users.find(x => x.name === name);
    if (u) setViewUser(u);
  };

  return (
    <div className={`min-h-screen text-foreground ${theme === 'dark' ? 'dark' : ''}`} style={{ background: theme === 'dark' ? '#111' : '#f9f9f9' }}>

      {/* Шапка */}
      <header className="sticky top-0 z-50 border-b border-border bg-card">
        <div className="container flex items-center justify-between py-3">
          <span className="font-display text-lg font-black tracking-tight">
            Wolf<span className="opacity-30">ART</span>
          </span>
          <nav className="hidden gap-0.5 md:flex">
            {NAV.map(n => (
              <button key={n.id} onClick={() => setTab(n.id)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  tab === n.id
                    ? 'bg-foreground text-background'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}>
                <Icon name={n.icon} size={14} />{n.label}
              </button>
            ))}
          </nav>
          <Button size="sm" className="rounded-lg" onClick={() => setUpload(true)}>
            <Icon name="Upload" size={14} className="mr-1" />Загрузить
          </Button>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-4 pb-2.5 md:hidden">
          {NAV.map(n => (
            <button key={n.id} onClick={() => setTab(n.id)}
              className={`flex items-center gap-1 whitespace-nowrap rounded-lg px-2.5 py-1.5 text-xs font-medium ${
                tab === n.id ? 'bg-foreground text-background' : 'text-muted-foreground bg-muted'
              }`}>
              <Icon name={n.icon} size={12} />{n.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="container py-10">
        {tab === 'gallery'    && <GallerySection gallery={gallery} setGallery={setGallery} onUpload={() => setUpload(true)} onUserClick={openProfile} />}
        {tab === 'moderation' && <ModerationSection onUserClick={openProfile} />}
        {tab === 'rules'      && <RulesSection />}
        {tab === 'profile'    && <ProfileSection users={users} setUsers={setUsers} gallery={gallery} myName={myName} onUserClick={u => setViewUser(u)} />}
        {tab === 'settings'   && <SettingsSection quotaCount={quotaCount} setQuotaCount={setQCount} quotaSize={quotaSize} setQuotaSize={setQSize} theme={theme} setTheme={setTheme} myName={myName} setMyName={name => { setMyName(name); setUsers(u => u.map((x, i) => i === 0 ? { ...x, name } : x)); }} />}
      </main>

      <footer className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        WolfART — арт-площадка сообщества · 2026
      </footer>

      <UploadModal open={uploadOpen} onClose={() => setUpload(false)}
        onSubmit={item => {
          setGallery(g => [{ ...item, id: Date.now(), likes: 0 }, ...g]);
          setUpload(false);
          toast.success('Работа отправлена на проверку!');
        }} />

      <UserProfileModal user={viewUser} gallery={gallery} onClose={() => setViewUser(null)} />
    </div>
  );
}

// ─────────────────────────────────────────────────
// Загрузка работы
// ─────────────────────────────────────────────────
function UploadModal({ open, onClose, onSubmit }: {
  open: boolean;
  onClose: () => void;
  onSubmit: (item: Omit<GalleryItem, 'id' | 'likes'>) => void;
}) {
  const [title, setTitle]  = useState('');
  const [tag, setTag]      = useState(TAGS[0]);
  const [preview, setPrev] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) setPrev(URL.createObjectURL(f));
  };

  const submit = () => {
    if (!title.trim()) { toast.error('Введите название'); return; }
    if (!preview)      { toast.error('Выберите изображение'); return; }
    onSubmit({ img: preview, title: title.trim(), author: 'Кай', tag });
    setTitle(''); setPrev(''); setTag(TAGS[0]);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle className="font-display text-lg">Загрузить работу</DialogTitle></DialogHeader>
        <div className="space-y-4 pt-1">
          <div
            className="flex h-44 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-border transition-colors hover:border-foreground/40"
            onClick={() => fileRef.current?.click()}>
            {preview
              ? <img src={preview} className="h-full w-full object-cover" alt="" />
              : <>
                  <Icon name="ImagePlus" size={32} className="mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Нажмите, чтобы выбрать файл</p>
                  <p className="text-xs text-muted-foreground/60">PNG, JPG, WEBP</p>
                </>}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </div>
          <div className="space-y-1.5">
            <Label>Название</Label>
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="Название работы" className="rounded-lg" />
          </div>
          <div className="space-y-1.5">
            <Label>Категория</Label>
            <div className="flex flex-wrap gap-2">
              {TAGS.map(t => (
                <button key={t} onClick={() => setTag(t)}
                  className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                    tag === t
                      ? 'border-foreground bg-foreground text-background'
                      : 'border-border text-muted-foreground hover:border-foreground/40'
                  }`}>{t}</button>
              ))}
            </div>
          </div>
          <div className="flex gap-2 pt-1">
            <Button variant="outline" className="flex-1 rounded-lg" onClick={onClose}>Отмена</Button>
            <Button className="flex-1 rounded-lg" onClick={submit}>
              <Icon name="Send" size={14} className="mr-1" />Отправить на проверку
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────
// Модалка профиля пользователя
// ─────────────────────────────────────────────────
function UserProfileModal({ user, gallery, onClose }: {
  user: UserProfile | null;
  gallery: GalleryItem[];
  onClose: () => void;
}) {
  if (!user) return null;
  const userWorks = gallery.filter(g => g.author === user.name);

  const banBadge: Record<BanStatus, { label: string; cls: string }> = {
    active:     { label: 'Активен',             cls: 'border-green-200 bg-green-50 text-green-700' },
    restricted: { label: 'Загрузки ограничены', cls: 'border-yellow-200 bg-yellow-50 text-yellow-700' },
    temp:       { label: 'Временный бан',        cls: 'border-orange-200 bg-orange-50 text-orange-700' },
    banned:     { label: 'Забанен навсегда',     cls: 'border-red-200 bg-red-50 text-red-700' },
  };
  const { label, cls } = banBadge[user.ban];

  return (
    <Dialog open={!!user} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-sm p-0 overflow-hidden">
        <div className="h-20 bg-muted" />
        <div className="px-5 pb-5">
          <Avatar className="-mt-10 h-20 w-20 border-4 border-white">
            <AvatarFallback className="bg-foreground text-background text-xl font-bold">{user.initials}</AvatarFallback>
          </Avatar>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <h3 className="text-xl font-bold">{user.name}</h3>
            <span className="rounded-full border border-border px-2 py-0.5 text-xs text-muted-foreground">{user.role}</span>
            <span className={`rounded-full border px-2 py-0.5 text-xs font-medium ${cls}`}>{label}</span>
          </div>
          {user.ban === 'temp' && user.banUntil && (
            <p className="mt-0.5 text-xs text-orange-600">Бан до: {user.banUntil}</p>
          )}
          <p className="mt-1.5 text-sm text-muted-foreground">{user.bio}</p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-border p-3 text-center">
              <p className="text-2xl font-bold">{user.works}</p>
              <p className="text-xs text-muted-foreground">Работ</p>
            </div>
            <div className="rounded-xl border border-border p-3 text-center">
              <p className="text-2xl font-bold">{user.likes >= 1000 ? (user.likes / 1000).toFixed(1) + 'K' : user.likes}</p>
              <p className="text-xs text-muted-foreground">Лайков</p>
            </div>
          </div>

          {userWorks.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Работы</p>
              <div className="grid grid-cols-3 gap-1.5">
                {userWorks.map(w => (
                  <img key={w.id} src={w.img} alt={w.title} title={w.title}
                    className="aspect-square w-full rounded-lg object-cover" />
                ))}
              </div>
            </div>
          )}
          {userWorks.length === 0 && (
            <p className="mt-4 text-center text-xs text-muted-foreground">Работ пока нет</p>
          )}

          <Button variant="outline" className="mt-4 w-full rounded-lg" onClick={onClose}>Закрыть</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─────────────────────────────────────────────────
// Галерея
// ─────────────────────────────────────────────────
function GallerySection({ gallery, setGallery, onUpload, onUserClick }: {
  gallery: GalleryItem[];
  setGallery: React.Dispatch<React.SetStateAction<GalleryItem[]>>;
  onUpload: () => void;
  onUserClick: (name: string) => void;
}) {
  const remove = (id: number) => {
    setGallery(g => g.filter(x => x.id !== id));
    toast.error('Работа удалена');
  };

  return (
    <section>
      <div className="mb-8 animate-float-up">
        <h1 className="font-display text-3xl font-black md:text-5xl">Галерея</h1>
        <p className="mt-2 text-muted-foreground">Работы участников сообщества WolfART</p>
        <Button className="mt-4 rounded-lg" size="sm" onClick={onUpload}>
          <Icon name="Upload" size={14} className="mr-1" />Загрузить работу
        </Button>
      </div>

      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
        {gallery.map((art, i) => (
          <article key={art.id} className="group relative overflow-hidden rounded-xl border border-border bg-card animate-float-up"
            style={{ animationDelay: `${i * 60}ms` }}>
            <img src={art.img} alt={art.title} className="w-full transition-transform duration-500 group-hover:scale-[1.03]" />

            {/* Кнопка удалить для модератора */}
            <button onClick={() => remove(art.id)}
              className="absolute right-2 top-2 rounded-lg bg-white/90 p-1.5 opacity-0 shadow-sm transition-opacity group-hover:opacity-100 hover:bg-red-50"
              title="Удалить работу">
              <Icon name="Trash2" size={14} className="text-red-500" />
            </button>

            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="absolute bottom-0 left-0 right-0 translate-y-1 p-3 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs text-white">{art.tag}</span>
              <p className="mt-1 font-semibold text-white">{art.title}</p>
              <div className="mt-0.5 flex items-center justify-between text-xs text-white/80">
                <button className="hover:text-white transition-colors" onClick={() => onUserClick(art.author)}>
                  @{art.author}
                </button>
                <span className="flex items-center gap-1"><Icon name="Heart" size={12} />{art.likes}</span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────
// Модерация
// ─────────────────────────────────────────────────
function ModerationSection({ onUserClick }: { onUserClick: (name: string) => void }) {
  const [queue, setQueue]   = useState(MOD_QUEUE_INIT);
  const [mods, setMods]     = useState<Mod[]>(INIT_MODS);
  const [addOpen, setAddOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<Mod['role']>('Модератор');

  const approve = (item: typeof MOD_QUEUE_INIT[number]) => {
    setQueue(q => q.filter(x => x.id !== item.id));
    toast.success(`«${item.title}» одобрена`);
  };
  const reject = (item: typeof MOD_QUEUE_INIT[number]) => {
    setQueue(q => q.filter(x => x.id !== item.id));
    toast.error(`«${item.title}» отклонена`);
  };
  const setModRole = (name: string, role: Mod['role']) => {
    setMods(m => m.map(x => x.name === name ? { ...x, role } : x));
    toast.success(`${name} — роль изменена`);
  };
  const removeMod = (name: string) => {
    setMods(m => m.filter(x => x.name !== name));
    toast(`${name} снят с модерации`);
  };
  const addMod = () => {
    if (!newName.trim()) { toast.error('Введите имя'); return; }
    setMods(m => [...m, { name: newName.trim(), role: newRole, initials: newName.trim().slice(0, 2).toUpperCase() }]);
    toast.success(`${newName} назначен модератором`);
    setNewName(''); setNewRole('Модератор'); setAddOpen(false);
  };

  return (
    <section className="animate-float-up">
      <h2 className="font-display text-3xl font-black mb-1">Модерация</h2>
      <p className="text-muted-foreground mb-8">Очередь на проверку и команда модераторов</p>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Очередь */}
        <div className="lg:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="font-semibold">Очередь на проверку</h3>
            <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium">{queue.length}</span>
          </div>
          <div className="space-y-2">
            {queue.map(item => (
              <div key={item.id} className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
                <img src={item.img} alt="" className="h-14 w-14 shrink-0 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-medium">{item.title}</p>
                  <p className="text-sm text-muted-foreground">@{item.author}</p>
                  <span className="mt-1 inline-block rounded-full border border-red-200 bg-red-50 px-2 py-0.5 text-xs text-red-600">{item.reason}</span>
                </div>
                <div className="flex shrink-0 gap-1.5">
                  <Button size="icon" variant="outline" className="h-8 w-8 rounded-lg hover:border-green-400 hover:text-green-600" onClick={() => approve(item)}>
                    <Icon name="Check" size={15} />
                  </Button>
                  <Button size="icon" variant="outline" className="h-8 w-8 rounded-lg hover:border-red-400 hover:text-red-600" onClick={() => reject(item)}>
                    <Icon name="Trash2" size={15} />
                  </Button>
                </div>
              </div>
            ))}
            {queue.length === 0 && (
              <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
                <Icon name="CheckCircle2" size={28} className="mx-auto mb-2 text-muted-foreground/40" />
                Очередь пуста — все работы проверены
              </div>
            )}
          </div>
        </div>

        {/* Модераторы */}
        <div>
          <h3 className="font-semibold mb-4">Команда модераторов</h3>
          <div className="divide-y divide-border rounded-xl border border-border bg-card">
            {mods.map(m => (
              <div key={m.name} className="flex items-center gap-3 p-3">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarFallback className="bg-muted text-xs font-bold">{m.initials}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.role}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                      <Icon name="EllipsisVertical" size={16} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onUserClick(m.name)}>
                      <Icon name="User" size={14} className="mr-2" />Открыть профиль
                    </DropdownMenuItem>
                    {m.role === 'Модератор' ? (
                      <DropdownMenuItem onClick={() => setModRole(m.name, 'Главный модератор')}>
                        <Icon name="Crown" size={14} className="mr-2" />Сделать главным
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem onClick={() => setModRole(m.name, 'Модератор')}>
                        <Icon name="ArrowDown" size={14} className="mr-2" />Сделать обычным
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => removeMod(m.name)}>
                      <Icon name="UserMinus" size={14} className="mr-2" />Снять с модерации
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
            <div className="p-3">
              <Button variant="outline" size="sm" className="w-full rounded-lg border-dashed text-xs" onClick={() => setAddOpen(true)}>
                <Icon name="UserPlus" size={13} className="mr-1" />Назначить модератора
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent className="sm:max-w-xs">
          <DialogHeader><DialogTitle className="font-display text-lg">Назначить модератора</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <Label>Имя пользователя</Label>
              <Input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Например: Алекс" className="rounded-lg" />
            </div>
            <div className="space-y-1.5">
              <Label>Роль</Label>
              <div className="flex gap-2">
                {(['Модератор', 'Главный модератор'] as Mod['role'][]).map(r => (
                  <button key={r} onClick={() => setNewRole(r)}
                    className={`flex-1 rounded-lg border py-1.5 text-xs font-medium transition-colors ${
                      newRole === r
                        ? 'border-foreground bg-foreground text-background'
                        : 'border-border text-muted-foreground hover:border-foreground/30'
                    }`}>{r}</button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 rounded-lg" onClick={() => setAddOpen(false)}>Отмена</Button>
              <Button className="flex-1 rounded-lg" onClick={addMod}>
                <Icon name="UserPlus" size={14} className="mr-1" />Назначить
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

// ─────────────────────────────────────────────────
// Правила
// ─────────────────────────────────────────────────
function RulesSection() {
  return (
    <section className="animate-float-up">
      <h2 className="font-display text-3xl font-black mb-1">Правила</h2>
      <p className="text-muted-foreground mb-8">Соблюдение правил делает сообщество лучше</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {RULES_LIST.map((r, i) => (
          <div key={r.title} className="rounded-xl border border-border bg-card p-5 animate-float-up"
            style={{ animationDelay: `${i * 60}ms` }}>
            <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
              <Icon name={r.icon} size={18} />
            </div>
            <h3 className="font-semibold">{r.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{r.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────
// Профиль
// ─────────────────────────────────────────────────
function ProfileSection({ users, setUsers, gallery, myName, onUserClick }: {
  users: UserProfile[];
  setUsers: React.Dispatch<React.SetStateAction<UserProfile[]>>;
  gallery: GalleryItem[];
  myName: string;
  onUserClick: (u: UserProfile) => void;
}) {
  const [roles, setRoles]           = useState(INIT_ROLES);
  const [newRole, setNewRole]       = useState('');
  const [selUser, setSelUser]       = useState<UserProfile | null>(null);
  const [changeRoleOpen, setCROpen] = useState(false);
  const [addRoleOpen, setAROpen]    = useState(false);
  const [banOpen, setBanOpen]       = useState(false);
  const [banTarget, setBanTarget]   = useState<UserProfile | null>(null);
  const [banDays, setBanDays]       = useState('7');

  const me = users.find(x => x.name === myName) ?? users[0];

  const openChangeRole = (u: UserProfile) => { setSelUser(u); setCROpen(true); };
  const applyRole = (role: string) => {
    if (!selUser) return;
    setUsers(u => u.map(x => x.name === selUser.name ? { ...x, role } : x));
    toast.success(`${selUser.name} → «${role}»`);
    setCROpen(false);
  };
  const addRole = () => {
    if (!newRole.trim()) { toast.error('Введите название'); return; }
    if (roles.includes(newRole.trim())) { toast.error('Такая роль уже есть'); return; }
    setRoles(r => [...r, newRole.trim()]);
    toast.success(`Роль «${newRole.trim()}» создана`);
    setNewRole(''); setAROpen(false);
  };

  const openTempBan = (u: UserProfile) => { setBanTarget(u); setBanOpen(true); };
  const applyTempBan = () => {
    if (!banTarget) return;
    const until = new Date(Date.now() + Number(banDays) * 86400000).toLocaleDateString('ru-RU');
    setUsers(u => u.map(x => x.name === banTarget.name ? { ...x, ban: 'temp', banUntil: until } : x));
    toast.error(`${banTarget.name} забанен на ${banDays} дн.`);
    setBanOpen(false);
  };
  const applyPermaBan = (name: string) => {
    setUsers(u => u.map(x => x.name === name ? { ...x, ban: 'banned', banUntil: undefined } : x));
    toast.error(`${name} забанен навсегда`);
  };
  const restrict = (name: string) => {
    setUsers(u => u.map(x => x.name === name ? { ...x, ban: 'restricted' } : x));
    toast(`${name} — загрузки ограничены`);
  };
  const removeRestrict = (name: string) => {
    setUsers(u => u.map(x => x.name === name ? { ...x, ban: 'active', banUntil: undefined } : x));
    toast.success(`Ограничения с ${name} сняты`);
  };
  const unban = (name: string) => {
    setUsers(u => u.map(x => x.name === name ? { ...x, ban: 'active', banUntil: undefined } : x));
    toast.success(`${name} разбанен`);
  };

  const rowBg: Record<BanStatus, string> = {
    active:     'bg-card border-border',
    restricted: 'border-yellow-200 bg-yellow-50',
    temp:       'border-orange-200 bg-orange-50',
    banned:     'border-red-200 bg-red-50',
  };

  return (
    <section className="animate-float-up">
      {/* Моя карточка */}
      <div className="mb-8 rounded-xl border border-border bg-card p-5">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-border">
            <AvatarFallback className="bg-foreground text-background text-xl font-bold">{me.initials}</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">{me.name}</h2>
            <p className="text-sm text-muted-foreground">{me.bio}</p>
            <span className="mt-1 inline-block rounded-full border border-border px-2 py-0.5 text-xs">{me.role}</span>
          </div>
        </div>
        <div className="mt-5 grid grid-cols-3 gap-3">
          {[{ label: 'Работы', value: String(me.works) }, { label: 'Лайки', value: '2.1K' }, { label: 'Подписчики', value: '480' }].map(s => (
            <div key={s.label} className="rounded-lg bg-muted p-3 text-center">
              <p className="text-xl font-bold">{s.value}</p>
              <p className="text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Участники */}
        <div className="lg:col-span-2">
          <h3 className="font-semibold mb-3">Участники сообщества</h3>
          <div className="space-y-2">
            {users.map(u => (
              <div key={u.name} className={`flex items-center gap-3 rounded-xl border p-3 ${rowBg[u.ban]}`}>
                <button onClick={() => onUserClick(u)}>
                  <Avatar className="h-9 w-9 cursor-pointer border border-border transition-all hover:ring-2 hover:ring-foreground/20">
                    <AvatarFallback className="bg-muted text-xs font-bold">{u.initials}</AvatarFallback>
                  </Avatar>
                </button>
                <button className="min-w-0 flex-1 text-left" onClick={() => onUserClick(u)}>
                  <p className="font-medium hover:underline">{u.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{u.bio}</p>
                </button>
                <div className="hidden shrink-0 flex-col items-end gap-1 sm:flex">
                  <span className="rounded-full border border-border px-2 py-0.5 text-xs">{u.role}</span>
                  {u.ban === 'restricted' && <span className="rounded-full border border-yellow-300 bg-yellow-50 px-2 py-0.5 text-xs text-yellow-700">Загрузки ограничены</span>}
                  {u.ban === 'temp'       && <span className="rounded-full border border-orange-300 bg-orange-50 px-2 py-0.5 text-xs text-orange-700">Бан до {u.banUntil}</span>}
                  {u.ban === 'banned'     && <span className="rounded-full border border-red-300 bg-red-50 px-2 py-0.5 text-xs text-red-700">Забанен</span>}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="shrink-0 rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
                      <Icon name="EllipsisVertical" size={15} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onUserClick(u)}>
                      <Icon name="User" size={14} className="mr-2" />Открыть профиль
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openChangeRole(u)}>
                      <Icon name="Tag" size={14} className="mr-2" />Изменить роль
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />

                    {/* Ограничить загрузки — только если статус active */}
                    {u.ban === 'active' && (
                      <DropdownMenuItem onClick={() => restrict(u.name)}>
                        <Icon name="MinusCircle" size={14} className="mr-2 text-yellow-600" />Ограничить загрузки
                      </DropdownMenuItem>
                    )}

                    {/* Снять ограничения — только если restricted */}
                    {u.ban === 'restricted' && (
                      <DropdownMenuItem onClick={() => removeRestrict(u.name)}>
                        <Icon name="ShieldOff" size={14} className="mr-2 text-muted-foreground" />Снять ограничения
                      </DropdownMenuItem>
                    )}

                    {/* Баны — если не забанен */}
                    {(u.ban === 'active' || u.ban === 'restricted') && (
                      <>
                        <DropdownMenuItem onClick={() => openTempBan(u)}>
                          <Icon name="Clock" size={14} className="mr-2 text-orange-500" />Временный бан
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => applyPermaBan(u.name)}>
                          <Icon name="Ban" size={14} className="mr-2" />Бан навсегда
                        </DropdownMenuItem>
                      </>
                    )}

                    {/* Разбанить — если забанен */}
                    {(u.ban === 'temp' || u.ban === 'banned') && (
                      <DropdownMenuItem onClick={() => unban(u.name)}>
                        <Icon name="ShieldCheck" size={14} className="mr-2 text-green-600" />Разбанить
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </div>

        {/* Роли */}
        <div>
          <h3 className="font-semibold mb-3">Роли</h3>
          <div className="divide-y divide-border rounded-xl border border-border bg-card">
            {roles.map(r => (
              <div key={r} className="flex items-center gap-2 px-4 py-2.5">
                <Icon name="Tag" size={13} className="shrink-0 text-muted-foreground" />
                <span className="text-sm">{r}</span>
              </div>
            ))}
            <div className="p-3">
              <Button variant="outline" size="sm" className="w-full rounded-lg border-dashed text-xs" onClick={() => setAROpen(true)}>
                <Icon name="Plus" size={13} className="mr-1" />Добавить роль
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Диалог: смена роли */}
      <Dialog open={changeRoleOpen} onOpenChange={setCROpen}>
        <DialogContent className="sm:max-w-xs">
          <DialogHeader><DialogTitle className="font-display text-lg">Роль для {selUser?.name}</DialogTitle></DialogHeader>
          <div className="space-y-1.5 pt-1">
            {roles.map(r => (
              <button key={r} onClick={() => applyRole(r)}
                className={`flex w-full items-center justify-between rounded-lg border px-4 py-2.5 text-sm transition-colors ${
                  selUser?.role === r
                    ? 'border-foreground bg-foreground text-background'
                    : 'border-border hover:border-foreground/30'
                }`}>
                {r}
                {selUser?.role === r && <Icon name="Check" size={14} />}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Диалог: новая роль */}
      <Dialog open={addRoleOpen} onOpenChange={setAROpen}>
        <DialogContent className="sm:max-w-xs">
          <DialogHeader><DialogTitle className="font-display text-lg">Новая роль</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-1">
            <Input value={newRole} onChange={e => setNewRole(e.target.value)} placeholder="Например: VIP-художник"
              className="rounded-lg" onKeyDown={e => e.key === 'Enter' && addRole()} />
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 rounded-lg" onClick={() => setAROpen(false)}>Отмена</Button>
              <Button className="flex-1 rounded-lg" onClick={addRole}>
                <Icon name="Plus" size={14} className="mr-1" />Создать
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Диалог: временный бан */}
      <Dialog open={banOpen} onOpenChange={setBanOpen}>
        <DialogContent className="sm:max-w-xs">
          <DialogHeader><DialogTitle className="font-display text-lg">Временный бан — {banTarget?.name}</DialogTitle></DialogHeader>
          <div className="space-y-4 pt-1">
            <div className="space-y-1.5">
              <Label>Количество дней</Label>
              <Input value={banDays} onChange={e => setBanDays(e.target.value)} type="number" min="1" className="rounded-lg" />
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 rounded-lg" onClick={() => setBanOpen(false)}>Отмена</Button>
              <Button className="flex-1 rounded-lg bg-orange-500 hover:bg-orange-600 text-white border-0" onClick={applyTempBan}>
                <Icon name="Clock" size={14} className="mr-1" />Забанить
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

// ─────────────────────────────────────────────────
// Настройки
// ─────────────────────────────────────────────────
interface SettingsProps {
  quotaCount: number[]; setQuotaCount: (v: number[]) => void;
  quotaSize:  number[]; setQuotaSize:  (v: number[]) => void;
  theme: 'light' | 'dark'; setTheme: (t: 'light' | 'dark') => void;
  myName: string; setMyName: (n: string) => void;
}

const THEMES: { id: 'light' | 'dark'; label: string; icon: string; bg: string }[] = [
  { id: 'light', label: 'Светлая',  icon: 'Sun',  bg: 'bg-white border-border' },
  { id: 'dark',  label: 'Тёмная',   icon: 'Moon', bg: 'bg-zinc-900 border-zinc-700' },
];

function SettingsSection({ quotaCount, setQuotaCount, quotaSize, setQuotaSize, theme, setTheme, myName, setMyName }: SettingsProps) {
  const [nameInput, setNameInput] = useState(myName);

  const saveName = () => {
    if (!nameInput.trim()) { toast.error('Имя не может быть пустым'); return; }
    setMyName(nameInput.trim());
    toast.success('Имя обновлено');
  };

  return (
    <section className="mx-auto max-w-xl animate-float-up">
      <h2 className="font-display text-3xl font-black mb-1">Настройки</h2>
      <p className="text-muted-foreground mb-8">Управление площадкой</p>
      <div className="space-y-4">

        {/* Профиль */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold mb-1">Мой профиль</h3>
          <p className="text-sm text-muted-foreground mb-4">Смените отображаемое имя</p>
          <div className="flex gap-2">
            <Input
              value={nameInput}
              onChange={e => setNameInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && saveName()}
              placeholder="Ваше имя"
              className="rounded-lg flex-1"
            />
            <Button className="rounded-lg shrink-0" onClick={saveName}>
              <Icon name="Check" size={14} className="mr-1" />Сохранить
            </Button>
          </div>
        </div>

        {/* Тема */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold mb-1">Тема оформления</h3>
          <p className="text-sm text-muted-foreground mb-4">Выберите внешний вид площадки</p>
          <div className="grid grid-cols-2 gap-3">
            {THEMES.map(t => (
              <button key={t.id} onClick={() => setTheme(t.id)}
                className={`relative flex flex-col items-start gap-2 rounded-xl border-2 p-4 text-left transition-all ${
                  theme === t.id ? 'border-foreground' : 'border-border hover:border-foreground/30'
                }`}>
                {/* Превью темы */}
                <div className={`w-full h-14 rounded-lg border ${t.bg} flex flex-col justify-between p-2`}>
                  <div className={`h-2 w-2/3 rounded ${t.id === 'dark' ? 'bg-zinc-600' : 'bg-zinc-200'}`} />
                  <div className="flex gap-1">
                    <div className={`h-1.5 w-1/3 rounded ${t.id === 'dark' ? 'bg-zinc-700' : 'bg-zinc-100'}`} />
                    <div className={`h-1.5 w-1/4 rounded ${t.id === 'dark' ? 'bg-zinc-700' : 'bg-zinc-100'}`} />
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <Icon name={t.icon} size={14} />
                  <span className="text-sm font-medium">{t.label}</span>
                </div>
                {theme === t.id && (
                  <div className="absolute right-2 top-2 rounded-full bg-foreground p-0.5">
                    <Icon name="Check" size={10} className="text-background" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Квоты */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold mb-1">Квоты на медиа</h3>
          <p className="text-sm text-muted-foreground mb-6">Ограничения на загрузку для участников</p>
          <div className="space-y-6">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span>Загрузок в день</span>
                <span className="font-medium">{quotaCount[0]} файлов</span>
              </div>
              <Slider value={quotaCount} onValueChange={setQuotaCount} max={50} min={1} step={1} />
            </div>
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <span>Макс. размер файла</span>
                <span className="font-medium">{quotaSize[0]} МБ</span>
              </div>
              <Slider value={quotaSize} onValueChange={setQuotaSize} max={100} min={1} step={1} />
            </div>
          </div>
        </div>

        {/* Параметры */}
        <div className="rounded-xl border border-border bg-card p-5">
          <h3 className="font-semibold mb-4">Параметры площадки</h3>
          <div className="space-y-4">
            {[
              { label: 'Премодерация всех работ',  desc: 'Публикация только после проверки', on: true  },
              { label: 'Гостевые загрузки',        desc: 'Без регистрации',                 on: false },
              { label: 'Уведомлять модераторов',   desc: 'При новых жалобах',               on: true  },
            ].map(opt => (
              <div key={opt.label} className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium">{opt.label}</p>
                  <p className="text-xs text-muted-foreground">{opt.desc}</p>
                </div>
                <Switch defaultChecked={opt.on} />
              </div>
            ))}
          </div>
        </div>

        <Button className="w-full rounded-lg" onClick={() => toast.success('Настройки сохранены')}>
          <Icon name="Save" size={14} className="mr-1" />Сохранить настройки
        </Button>
      </div>
    </section>
  );
}