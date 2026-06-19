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
  { id: 'gallery', label: 'Галерея', icon: 'Images' },
  { id: 'moderation', label: 'Модерация', icon: 'ShieldCheck' },
  { id: 'rules', label: 'Правила', icon: 'BookOpen' },
  { id: 'profile', label: 'Профиль', icon: 'User' },
  { id: 'settings', label: 'Настройки', icon: 'Settings' },
];

const INIT_ROLES = ['Художник', 'Модератор', 'Пользователь'];

type BanStatus = 'active' | 'temp' | 'banned';

interface UserProfile {
  name: string;
  initials: string;
  role: string;
  works: number;
  likes: number;
  bio: string;
  img?: string;
  ban?: BanStatus;
  banUntil?: string;
}

interface GalleryItem {
  id: number;
  img: string;
  title: string;
  author: string;
  likes: number;
  tag: string;
  preview?: string;
}

const INIT_GALLERY: GalleryItem[] = [
  { id: 1, img: ART_1, title: 'Neon District', author: 'Кай', likes: 248, tag: 'Cyberpunk' },
  { id: 2, img: ART_2, title: 'Cosmic Soul', author: 'Лина', likes: 512, tag: 'Portrait' },
  { id: 3, img: ART_3, title: 'Liquid Dream', author: 'Артём', likes: 389, tag: 'Abstract' },
  { id: 4, img: ART_1, title: 'Midnight City', author: 'Vega', likes: 176, tag: 'Cyberpunk' },
  { id: 5, img: ART_3, title: 'Holo Wave', author: 'Соня', likes: 421, tag: 'Abstract' },
  { id: 6, img: ART_2, title: 'Star Eyes', author: 'Майя', likes: 333, tag: 'Portrait' },
];

const MOD_QUEUE_INIT = [
  { id: 1, img: ART_2, title: 'Galaxy Muse', author: 'newbie_99', reason: 'Авто-проверка' },
  { id: 2, img: ART_1, title: 'Dark Alley', author: 'pixel_man', reason: 'Жалоба ×2' },
  { id: 3, img: ART_3, title: 'Flow #12', author: 'art_lover', reason: 'Авто-проверка' },
];

const INIT_MODS = [
  { name: 'Лина', role: 'Главный модератор', initials: 'ЛН' },
  { name: 'Кай', role: 'Модератор', initials: 'КА' },
  { name: 'Vega', role: 'Модератор', initials: 'VG' },
];

const INIT_USERS: UserProfile[] = [
  { name: 'Кай', initials: 'КА', role: 'Художник', works: 34, likes: 2100, bio: 'Цифровое искусство и киберпанк', img: ART_1, ban: 'active' },
  { name: 'Лина', initials: 'ЛН', role: 'Модератор', works: 12, likes: 870, bio: 'Иллюстратор, главред галереи', img: ART_2, ban: 'active' },
  { name: 'Артём', initials: 'АР', role: 'Художник', works: 21, likes: 1340, bio: 'Абстрактная живопись', img: ART_3, ban: 'active' },
  { name: 'Vega', initials: 'VG', role: 'Модератор', works: 8, likes: 560, bio: 'Фотограф и видеограф', img: ART_1, ban: 'active' },
  { name: 'Соня', initials: 'СН', role: 'Художник', works: 17, likes: 980, bio: 'Акварель + digital', img: ART_3, ban: 'active' },
  { name: 'Майя', initials: 'МА', role: 'Пользователь', works: 5, likes: 230, bio: 'Начинающий художник', img: ART_2, ban: 'active' },
];

const RULES = [
  { icon: 'Ban', title: 'Только своё творчество', text: 'Запрещено выкладывать чужие работы без указания автора.' },
  { icon: 'EyeOff', title: 'Без NSFW и насилия', text: 'Откровенный и шокирующий контент удаляется модераторами.' },
  { icon: 'Copyright', title: 'Уважайте авторские права', text: 'Не используйте защищённые материалы без разрешения.' },
  { icon: 'MessageSquareWarning', title: 'Будьте вежливы', text: 'Токсичность в комментариях ведёт к ограничениям.' },
];

function Index() {
  const [tab, setTab] = useState('gallery');
  const [quotaCount, setQuotaCount] = useState([10]);
  const [quotaSize, setQuotaSize] = useState([25]);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [gallery, setGallery] = useState(INIT_GALLERY);
  const [viewUser, setViewUser] = useState<UserProfile | null>(null);
  const [users, setUsers] = useState(INIT_USERS);

  const openProfile = (name: string) => {
    const u = users.find((u) => u.name === name);
    if (u) setViewUser(u);
  };

  return (
    <div className="min-h-screen text-foreground">
      <header className="sticky top-0 z-50 glass">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary neon-glow">
              <Icon name="Palette" size={20} className="text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-extrabold tracking-tight">
              Wolf<span className="text-gradient">ART</span>
            </span>
          </div>
          <nav className="hidden gap-1 md:flex">
            {NAV.map((n) => (
              <button
                key={n.id}
                onClick={() => setTab(n.id)}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                  tab === n.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary'
                }`}
              >
                <Icon name={n.icon} size={16} />
                {n.label}
              </button>
            ))}
          </nav>
          <Button className="rounded-xl font-semibold neon-glow" onClick={() => setUploadOpen(true)}>
            <Icon name="Upload" size={16} className="mr-1" /> Загрузить
          </Button>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-4 pb-3 md:hidden">
          {NAV.map((n) => (
            <button
              key={n.id}
              onClick={() => setTab(n.id)}
              className={`flex items-center gap-1.5 whitespace-nowrap rounded-xl px-3 py-1.5 text-xs font-medium ${
                tab === n.id ? 'bg-primary text-primary-foreground' : 'text-muted-foreground bg-secondary/50'
              }`}
            >
              <Icon name={n.icon} size={14} /> {n.label}
            </button>
          ))}
        </nav>
      </header>

      <main className="container py-10">
        {tab === 'gallery' && (
          <GallerySection
            gallery={gallery}
            setGallery={setGallery}
            onUpload={() => setUploadOpen(true)}
            onUserClick={openProfile}
          />
        )}
        {tab === 'moderation' && (
          <ModerationSection onUserClick={openProfile} />
        )}
        {tab === 'rules' && <RulesSection />}
        {tab === 'profile' && (
          <ProfileSection
            users={users}
            setUsers={setUsers}
            onUserClick={(u) => setViewUser(u)}
          />
        )}
        {tab === 'settings' && (
          <SettingsSection
            quotaCount={quotaCount}
            setQuotaCount={setQuotaCount}
            quotaSize={quotaSize}
            setQuotaSize={setQuotaSize}
          />
        )}
      </main>

      <footer className="border-t border-border/50 py-8 text-center text-sm text-muted-foreground">
        WolfART — арт-площадка сообщества · 2026
      </footer>

      <UploadModal
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onSubmit={(item) => {
          setGallery((g) => [{ ...item, id: Date.now(), likes: 0 }, ...g]);
          setUploadOpen(false);
          toast.success('Работа отправлена на проверку модератору!');
        }}
      />

      <UserProfileModal user={viewUser} onClose={() => setViewUser(null)} />
    </div>
  );
}

function UploadModal({ open, onClose, onSubmit }: {
  open: boolean;
  onClose: () => void;
  onSubmit: (item: Omit<GalleryItem, 'id' | 'likes'>) => void;
}) {
  const [title, setTitle] = useState('');
  const [tag, setTag] = useState('Abstract');
  const [preview, setPreview] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setPreview(URL.createObjectURL(f));
  };

  const handleSubmit = () => {
    if (!title.trim()) { toast.error('Введите название работы'); return; }
    if (!preview) { toast.error('Выберите изображение'); return; }
    onSubmit({ img: preview, title: title.trim(), author: 'Кай', tag, preview });
    setTitle(''); setTag('Abstract'); setPreview('');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="glass border-border/50 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl font-extrabold">
            Загрузить <span className="text-gradient">работу</span>
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-5 pt-2">
          <div
            className="group relative flex h-44 cursor-pointer flex-col items-center justify-center overflow-hidden rounded-2xl border-2 border-dashed border-border/60 transition-colors hover:border-primary/60"
            onClick={() => fileRef.current?.click()}
          >
            {preview ? (
              <img src={preview} alt="preview" className="h-full w-full object-cover" />
            ) : (
              <>
                <Icon name="ImagePlus" size={36} className="mb-2 text-muted-foreground group-hover:text-primary transition-colors" />
                <p className="text-sm text-muted-foreground">Нажмите, чтобы выбрать файл</p>
                <p className="text-xs text-muted-foreground/60">PNG, JPG, WEBP</p>
              </>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
          </div>
          <div className="space-y-1.5">
            <Label>Название работы</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Например: Neon Dream" className="rounded-xl bg-secondary/50 border-border/50" />
          </div>
          <div className="space-y-1.5">
            <Label>Тег / категория</Label>
            <div className="flex gap-2 flex-wrap">
              {['Abstract', 'Portrait', 'Cyberpunk', 'Nature', 'Fantasy'].map((t) => (
                <button key={t} onClick={() => setTag(t)} className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${tag === t ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground hover:bg-secondary/80'}`}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-3 pt-1">
            <Button variant="secondary" className="flex-1 rounded-xl" onClick={onClose}>Отмена</Button>
            <Button className="flex-1 rounded-xl neon-glow" onClick={handleSubmit}>
              <Icon name="Send" size={16} className="mr-1" /> Отправить на проверку
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function UserProfileModal({ user, onClose }: { user: UserProfile | null; onClose: () => void }) {
  if (!user) return null;
  const banLabel: Record<BanStatus, string> = { active: 'Активен', temp: 'Временный бан', banned: 'Забанен навсегда' };
  const banColor: Record<BanStatus, string> = { active: 'bg-accent/20 text-accent', temp: 'bg-yellow-500/20 text-yellow-400', banned: 'bg-destructive/20 text-destructive' };
  const status = user.ban ?? 'active';
  return (
    <Dialog open={!!user} onOpenChange={onClose}>
      <DialogContent className="glass border-border/50 sm:max-w-sm p-0 overflow-hidden">
        <div className="h-28 bg-gradient-to-r from-primary/40 via-accent/30 to-primary/40" />
        <div className="px-6 pb-6">
          <Avatar className="-mt-12 h-20 w-20 border-4 border-background neon-glow">
            <AvatarFallback className="bg-primary text-xl font-bold text-primary-foreground">{user.initials}</AvatarFallback>
          </Avatar>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <h3 className="font-display text-2xl font-extrabold">{user.name}</h3>
            <Badge className="rounded-full bg-accent/20 text-accent text-xs">{user.role}</Badge>
            <Badge className={`rounded-full text-xs ${banColor[status]}`}>{banLabel[status]}</Badge>
          </div>
          {user.ban === 'temp' && user.banUntil && (
            <p className="mt-1 text-xs text-yellow-400">Бан до: {user.banUntil}</p>
          )}
          <p className="mt-2 text-sm text-muted-foreground">{user.bio}</p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-secondary/50 p-3 text-center">
              <p className="font-display text-xl font-extrabold text-gradient">{user.works}</p>
              <p className="text-xs text-muted-foreground">Работ</p>
            </div>
            <div className="rounded-xl bg-secondary/50 p-3 text-center">
              <p className="font-display text-xl font-extrabold text-gradient">{user.likes >= 1000 ? (user.likes / 1000).toFixed(1) + 'K' : user.likes}</p>
              <p className="text-xs text-muted-foreground">Лайков</p>
            </div>
          </div>
          <Button variant="secondary" className="mt-4 w-full rounded-xl" onClick={onClose}>Закрыть</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function GallerySection({ gallery, setGallery, onUpload, onUserClick }: {
  gallery: GalleryItem[];
  setGallery: React.Dispatch<React.SetStateAction<GalleryItem[]>>;
  onUpload: () => void;
  onUserClick: (name: string) => void;
}) {
  const removeArt = (id: number) => {
    setGallery((g) => g.filter((x) => x.id !== id));
    toast.error('Работа удалена');
  };

  return (
    <section>
      <div className="mb-8 max-w-2xl animate-float-up">
        <Badge className="mb-3 rounded-full bg-accent/20 text-accent">Сообщество художников</Badge>
        <h1 className="font-display text-4xl font-extrabold leading-tight md:text-6xl">
          Покажи свой <span className="text-gradient">арт</span> миру
        </h1>
        <p className="mt-4 text-muted-foreground">Выкладывай работы, собирай лайки и вдохновляй других.</p>
        <Button className="mt-5 rounded-xl neon-glow" onClick={onUpload}>
          <Icon name="Upload" size={16} className="mr-1" /> Загрузить работу
        </Button>
      </div>

      <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
        {gallery.map((art, i) => (
          <article key={art.id} className="group relative overflow-hidden rounded-2xl glass animate-float-up" style={{ animationDelay: `${i * 80}ms` }}>
            <img src={art.img} alt={art.title} className="w-full transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            {/* Кнопка удалить — всегда видна модератору */}
            <button
              onClick={() => removeArt(art.id)}
              className="absolute right-3 top-3 rounded-xl bg-destructive/80 p-2 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-destructive"
              title="Удалить работу"
            >
              <Icon name="Trash2" size={15} className="text-white" />
            </button>
            <div className="absolute bottom-0 left-0 right-0 translate-y-2 p-4 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
              <Badge className="mb-2 rounded-full bg-primary/30 text-xs text-foreground">{art.tag}</Badge>
              <h3 className="font-display text-lg font-bold">{art.title}</h3>
              <div className="mt-1 flex items-center justify-between text-sm text-muted-foreground">
                <button className="hover:text-accent transition-colors" onClick={() => onUserClick(art.author)}>
                  @{art.author}
                </button>
                <span className="flex items-center gap-1">
                  <Icon name="Heart" size={14} className="text-destructive" /> {art.likes}
                </span>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function ModerationSection({ onUserClick }: { onUserClick: (name: string) => void }) {
  const [queue, setQueue] = useState(MOD_QUEUE_INIT);
  const [mods, setMods] = useState(INIT_MODS);
  const [addModOpen, setAddModOpen] = useState(false);
  const [newModName, setNewModName] = useState('');
  const [newModRole, setNewModRole] = useState('Модератор');

  const approve = (item: (typeof MOD_QUEUE_INIT)[number]) => {
    setQueue((q) => q.filter((x) => x.id !== item.id));
    toast.success(`«${item.title}» одобрена и опубликована`);
  };
  const reject = (item: (typeof MOD_QUEUE_INIT)[number]) => {
    setQueue((q) => q.filter((x) => x.id !== item.id));
    toast.error(`«${item.title}» удалена из очереди`);
  };
  const removeMod = (name: string) => {
    setMods((m) => m.filter((x) => x.name !== name));
    toast(`${name} снят с модерации`);
  };
  const promoteToChief = (name: string) => {
    setMods((m) => m.map((x) => x.name === name ? { ...x, role: 'Главный модератор' } : x));
    toast.success(`${name} назначен главным модератором`);
  };
  const handleAddMod = () => {
    if (!newModName.trim()) { toast.error('Введите имя'); return; }
    const initials = newModName.trim().slice(0, 2).toUpperCase();
    setMods((m) => [...m, { name: newModName.trim(), role: newModRole, initials }]);
    toast.success(`${newModName} добавлен как «${newModRole}»`);
    setNewModName(''); setNewModRole('Модератор'); setAddModOpen(false);
  };

  return (
    <section className="animate-float-up">
      <div className="mb-8 flex items-center gap-3">
        <Icon name="ShieldCheck" size={28} className="text-accent" />
        <div>
          <h2 className="font-display text-3xl font-extrabold">Модерация</h2>
          <p className="text-sm text-muted-foreground">Очередь на проверку и управление модераторами</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h3 className="mb-4 font-display text-lg font-bold">
            Очередь на проверку
            <Badge className="ml-2 rounded-full bg-primary/30 text-foreground">{queue.length}</Badge>
          </h3>
          <div className="space-y-3">
            {queue.map((item) => (
              <div key={item.id} className="flex items-center gap-4 rounded-2xl glass p-3 animate-float-up">
                <img src={item.img} alt={item.title} className="h-16 w-16 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{item.title}</p>
                  <p className="text-sm text-muted-foreground">@{item.author}</p>
                  <Badge className="mt-1 rounded-full bg-destructive/20 text-xs text-destructive">{item.reason}</Badge>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="secondary" className="rounded-xl" onClick={() => approve(item)}>
                    <Icon name="Check" size={18} className="text-accent" />
                  </Button>
                  <Button size="icon" variant="secondary" className="rounded-xl" onClick={() => reject(item)}>
                    <Icon name="Trash2" size={18} className="text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
            {queue.length === 0 && (
              <div className="rounded-2xl glass p-8 text-center text-muted-foreground">
                <Icon name="PartyPopper" size={28} className="mx-auto mb-2 text-accent" />
                Очередь пуста — все работы проверены!
              </div>
            )}
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-display text-lg font-bold">Команда модераторов</h3>
          <div className="space-y-3 rounded-2xl glass p-4">
            {mods.map((m) => (
              <div key={m.name} className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-primary/30 text-foreground">{m.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold">{m.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{m.role}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground shrink-0">
                      <Icon name="EllipsisVertical" size={18} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onUserClick(m.name)}>
                      <Icon name="User" size={16} className="mr-2" /> Открыть профиль
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => promoteToChief(m.name)}>
                      <Icon name="Crown" size={16} className="mr-2" /> Сделать главным
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => removeMod(m.name)}>
                      <Icon name="UserMinus" size={16} className="mr-2" /> Снять с модерации
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
            <Button variant="outline" className="mt-2 w-full rounded-xl border-dashed" onClick={() => setAddModOpen(true)}>
              <Icon name="UserPlus" size={16} className="mr-1" /> Назначить модератора
            </Button>
          </div>
        </div>
      </div>

      <Dialog open={addModOpen} onOpenChange={setAddModOpen}>
        <DialogContent className="glass border-border/50 sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-extrabold">Назначить модератора</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label>Имя пользователя</Label>
              <Input value={newModName} onChange={(e) => setNewModName(e.target.value)} placeholder="Например: Алекс" className="rounded-xl bg-secondary/50 border-border/50" />
            </div>
            <div className="space-y-1.5">
              <Label>Роль</Label>
              <div className="flex flex-wrap gap-2">
                {['Модератор', 'Главный модератор'].map((r) => (
                  <button key={r} onClick={() => setNewModRole(r)} className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${newModRole === r ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`}>
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3 pt-1">
              <Button variant="secondary" className="flex-1 rounded-xl" onClick={() => setAddModOpen(false)}>Отмена</Button>
              <Button className="flex-1 rounded-xl neon-glow" onClick={handleAddMod}>
                <Icon name="UserPlus" size={16} className="mr-1" /> Назначить
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

function RulesSection() {
  return (
    <section className="animate-float-up">
      <div className="mb-8 flex items-center gap-3">
        <Icon name="BookOpen" size={28} className="text-accent" />
        <h2 className="font-display text-3xl font-extrabold">Правила площадки</h2>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        {RULES.map((r, i) => (
          <div key={r.title} className="rounded-2xl glass p-6 animate-float-up" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-primary/20">
              <Icon name={r.icon} size={22} className="text-primary" />
            </div>
            <h3 className="font-display text-lg font-bold">{r.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{r.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function ProfileSection({ users, setUsers, onUserClick }: {
  users: UserProfile[];
  setUsers: React.Dispatch<React.SetStateAction<UserProfile[]>>;
  onUserClick: (u: UserProfile) => void;
}) {
  const [roles, setRoles] = useState(INIT_ROLES);
  const [newRole, setNewRole] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [changeRoleOpen, setChangeRoleOpen] = useState(false);
  const [addRoleOpen, setAddRoleOpen] = useState(false);
  const [banOpen, setBanOpen] = useState(false);
  const [banTarget, setBanTarget] = useState<UserProfile | null>(null);
  const [banDays, setBanDays] = useState('7');

  const me = users[0];

  const openChangeRole = (u: UserProfile) => { setSelectedUser(u); setChangeRoleOpen(true); };
  const applyRole = (role: string) => {
    if (!selectedUser) return;
    setUsers((u) => u.map((x) => x.name === selectedUser.name ? { ...x, role } : x));
    toast.success(`${selectedUser.name} → роль «${role}»`);
    setChangeRoleOpen(false);
  };
  const handleAddRole = () => {
    if (!newRole.trim()) { toast.error('Введите название роли'); return; }
    if (roles.includes(newRole.trim())) { toast.error('Такая роль уже есть'); return; }
    setRoles((r) => [...r, newRole.trim()]);
    toast.success(`Роль «${newRole.trim()}» создана`);
    setNewRole(''); setAddRoleOpen(false);
  };

  const openBan = (u: UserProfile) => { setBanTarget(u); setBanOpen(true); };
  const applyBan = (type: 'temp' | 'banned') => {
    if (!banTarget) return;
    const until = type === 'temp'
      ? new Date(Date.now() + Number(banDays) * 86400000).toLocaleDateString('ru-RU')
      : undefined;
    setUsers((u) => u.map((x) => x.name === banTarget.name ? { ...x, ban: type, banUntil: until } : x));
    toast.error(type === 'banned' ? `${banTarget.name} забанен навсегда` : `${banTarget.name} забанен на ${banDays} дней`);
    setBanOpen(false);
  };
  const unban = (name: string) => {
    setUsers((u) => u.map((x) => x.name === name ? { ...x, ban: 'active', banUntil: undefined } : x));
    toast.success(`${name} разбанен`);
  };
  const removeRestrict = (name: string) => {
    setUsers((u) => u.map((x) => x.name === name ? { ...x, ban: 'active', banUntil: undefined } : x));
    toast(`Ограничения с ${name} сняты`);
  };

  const banColor: Record<BanStatus, string> = {
    active: '',
    temp: 'bg-yellow-500/10 border-yellow-500/20',
    banned: 'bg-destructive/10 border-destructive/20',
  };

  return (
    <section className="animate-float-up">
      <div className="overflow-hidden rounded-3xl glass mb-8">
        <div className="h-40 bg-gradient-to-r from-primary/40 via-accent/30 to-primary/40" />
        <div className="px-6 pb-6">
          <Avatar className="-mt-12 h-24 w-24 border-4 border-background neon-glow">
            <AvatarFallback className="bg-primary text-2xl font-bold text-primary-foreground">{me.initials}</AvatarFallback>
          </Avatar>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <h2 className="font-display text-3xl font-extrabold">{me.name}</h2>
            <Badge className="rounded-full bg-accent/20 text-accent">{me.role}</Badge>
          </div>
          <p className="mt-1 text-muted-foreground">{me.bio}</p>
          <div className="mt-6 grid grid-cols-3 gap-4">
            {[{ label: 'Работы', value: String(me.works) }, { label: 'Лайки', value: '2.1K' }, { label: 'Подписчики', value: '480' }].map((s) => (
              <div key={s.label} className="rounded-2xl bg-secondary/50 p-4 text-center">
                <p className="font-display text-2xl font-extrabold text-gradient">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <h3 className="mb-4 font-display text-xl font-bold">Участники сообщества</h3>
          <div className="space-y-2">
            {users.map((u) => (
              <div key={u.name} className={`flex items-center gap-3 rounded-2xl glass p-3 border ${banColor[u.ban ?? 'active']}`}>
                <button onClick={() => onUserClick(u)}>
                  <Avatar className="cursor-pointer hover:ring-2 hover:ring-primary transition-all">
                    <AvatarFallback className="bg-primary/30 text-foreground font-semibold">{u.initials}</AvatarFallback>
                  </Avatar>
                </button>
                <button className="min-w-0 flex-1 text-left hover:text-accent transition-colors" onClick={() => onUserClick(u)}>
                  <p className="font-semibold">{u.name}</p>
                  <p className="text-xs text-muted-foreground truncate">{u.bio}</p>
                </button>
                <div className="hidden sm:flex flex-col items-end gap-1 shrink-0">
                  <Badge className="rounded-full bg-secondary text-muted-foreground text-xs">{u.role}</Badge>
                  {u.ban === 'temp' && <Badge className="rounded-full bg-yellow-500/20 text-yellow-400 text-xs">Бан до {u.banUntil}</Badge>}
                  {u.ban === 'banned' && <Badge className="rounded-full bg-destructive/20 text-destructive text-xs">Забанен</Badge>}
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="rounded-lg p-1.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground shrink-0">
                      <Icon name="EllipsisVertical" size={16} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onUserClick(u)}>
                      <Icon name="User" size={16} className="mr-2" /> Открыть профиль
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openChangeRole(u)}>
                      <Icon name="Tag" size={16} className="mr-2" /> Изменить роль
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {u.ban !== 'active' ? (
                      <>
                        <DropdownMenuItem onClick={() => unban(u.name)}>
                          <Icon name="ShieldCheck" size={16} className="mr-2 text-accent" /> Разбанить
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => removeRestrict(u.name)}>
                          <Icon name="ShieldOff" size={16} className="mr-2 text-muted-foreground" /> Снять ограничения
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <>
                        <DropdownMenuItem onClick={() => openBan(u)}>
                          <Icon name="Clock" size={16} className="mr-2 text-yellow-400" /> Временный бан
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive focus:text-destructive" onClick={() => applyBan.bind(null)('banned') || setBanTarget(u) || applyBan('banned')}>
                          <Icon name="Ban" size={16} className="mr-2" /> Бан навсегда
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-display text-xl font-bold">Роли</h3>
          <div className="rounded-2xl glass p-4 space-y-2">
            {roles.map((r) => (
              <div key={r} className="flex items-center gap-2 rounded-xl bg-secondary/40 px-3 py-2">
                <Icon name="Tag" size={14} className="text-accent shrink-0" />
                <span className="text-sm font-medium flex-1">{r}</span>
              </div>
            ))}
            <Button variant="outline" className="mt-2 w-full rounded-xl border-dashed" onClick={() => setAddRoleOpen(true)}>
              <Icon name="Plus" size={16} className="mr-1" /> Добавить роль
            </Button>
          </div>
        </div>
      </div>

      {/* Диалог смена роли */}
      <Dialog open={changeRoleOpen} onOpenChange={setChangeRoleOpen}>
        <DialogContent className="glass border-border/50 sm:max-w-xs">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-extrabold">
              Роль для <span className="text-gradient">{selectedUser?.name}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2 pt-2">
            {roles.map((r) => (
              <button key={r} onClick={() => applyRole(r)} className={`w-full rounded-xl px-4 py-2.5 text-left text-sm font-medium transition-all ${selectedUser?.role === r ? 'bg-primary text-primary-foreground' : 'bg-secondary/50 hover:bg-secondary'}`}>
                {r}
                {selectedUser?.role === r && <Icon name="Check" size={14} className="float-right mt-0.5" />}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Диалог добавить роль */}
      <Dialog open={addRoleOpen} onOpenChange={setAddRoleOpen}>
        <DialogContent className="glass border-border/50 sm:max-w-xs">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-extrabold">Новая роль</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <Input value={newRole} onChange={(e) => setNewRole(e.target.value)} placeholder="Например: VIP-художник" className="rounded-xl bg-secondary/50 border-border/50" onKeyDown={(e) => e.key === 'Enter' && handleAddRole()} />
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1 rounded-xl" onClick={() => setAddRoleOpen(false)}>Отмена</Button>
              <Button className="flex-1 rounded-xl neon-glow" onClick={handleAddRole}>
                <Icon name="Plus" size={16} className="mr-1" /> Создать
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Диалог временный бан */}
      <Dialog open={banOpen} onOpenChange={setBanOpen}>
        <DialogContent className="glass border-border/50 sm:max-w-xs">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-extrabold">
              Временный бан — <span className="text-gradient">{banTarget?.name}</span>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label>Количество дней</Label>
              <Input value={banDays} onChange={(e) => setBanDays(e.target.value)} type="number" min="1" className="rounded-xl bg-secondary/50 border-border/50" />
            </div>
            <div className="flex gap-3">
              <Button variant="secondary" className="flex-1 rounded-xl" onClick={() => setBanOpen(false)}>Отмена</Button>
              <Button className="flex-1 rounded-xl bg-yellow-600 hover:bg-yellow-500 text-white" onClick={() => applyBan('temp')}>
                <Icon name="Clock" size={16} className="mr-1" /> Забанить
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}

interface SettingsProps {
  quotaCount: number[];
  setQuotaCount: (v: number[]) => void;
  quotaSize: number[];
  setQuotaSize: (v: number[]) => void;
}

function SettingsSection({ quotaCount, setQuotaCount, quotaSize, setQuotaSize }: SettingsProps) {
  return (
    <section className="mx-auto max-w-2xl animate-float-up">
      <div className="mb-8 flex items-center gap-3">
        <Icon name="Settings" size={28} className="text-accent" />
        <h2 className="font-display text-3xl font-extrabold">Настройки</h2>
      </div>
      <div className="space-y-6">
        <div className="rounded-2xl glass p-6">
          <h3 className="mb-1 font-display text-lg font-bold">Квоты на медиа</h3>
          <p className="mb-6 text-sm text-muted-foreground">Ограничения на загрузку для пользователей</p>
          <div className="space-y-7">
            <div>
              <div className="mb-3 flex items-center justify-between">
                <label className="font-medium">Загрузок в день</label>
                <Badge className="rounded-full bg-primary/30 text-foreground">{quotaCount[0]} файлов</Badge>
              </div>
              <Slider value={quotaCount} onValueChange={setQuotaCount} max={50} min={1} step={1} />
            </div>
            <div>
              <div className="mb-3 flex items-center justify-between">
                <label className="font-medium">Макс. размер файла</label>
                <Badge className="rounded-full bg-accent/20 text-accent">{quotaSize[0]} МБ</Badge>
              </div>
              <Slider value={quotaSize} onValueChange={setQuotaSize} max={100} min={1} step={1} />
            </div>
          </div>
        </div>
        <div className="rounded-2xl glass p-6">
          <h3 className="mb-4 font-display text-lg font-bold">Параметры площадки</h3>
          <div className="space-y-4">
            {[
              { label: 'Премодерация всех работ', desc: 'Картинки публикуются после проверки', on: true },
              { label: 'Разрешить гостевые загрузки', desc: 'Без регистрации', on: false },
              { label: 'Уведомления модераторам', desc: 'Сообщать о жалобах', on: true },
            ].map((opt) => (
              <div key={opt.label} className="flex items-center justify-between gap-4">
                <div>
                  <p className="font-medium">{opt.label}</p>
                  <p className="text-xs text-muted-foreground">{opt.desc}</p>
                </div>
                <Switch defaultChecked={opt.on} />
              </div>
            ))}
          </div>
        </div>
        <Button className="w-full rounded-xl font-semibold neon-glow" onClick={() => toast.success('Настройки сохранены!')}>
          <Icon name="Save" size={16} className="mr-1" /> Сохранить настройки
        </Button>
      </div>
    </section>
  );
}

export default Index;
