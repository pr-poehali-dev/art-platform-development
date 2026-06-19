import { useState } from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

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

const GALLERY = [
  { id: 1, img: ART_1, title: 'Neon District', author: 'Кай', likes: 248, tag: 'Cyberpunk' },
  { id: 2, img: ART_2, title: 'Cosmic Soul', author: 'Лина', likes: 512, tag: 'Portrait' },
  { id: 3, img: ART_3, title: 'Liquid Dream', author: 'Артём', likes: 389, tag: 'Abstract' },
  { id: 4, img: ART_1, title: 'Midnight City', author: 'Vega', likes: 176, tag: 'Cyberpunk' },
  { id: 5, img: ART_3, title: 'Holo Wave', author: 'Соня', likes: 421, tag: 'Abstract' },
  { id: 6, img: ART_2, title: 'Star Eyes', author: 'Майя', likes: 333, tag: 'Portrait' },
];

const MOD_QUEUE = [
  { id: 1, img: ART_2, title: 'Galaxy Muse', author: 'newbie_99', reason: 'Авто-проверка' },
  { id: 2, img: ART_1, title: 'Dark Alley', author: 'pixel_man', reason: 'Жалоба ×2' },
  { id: 3, img: ART_3, title: 'Flow #12', author: 'art_lover', reason: 'Авто-проверка' },
];

const MODERATORS = [
  { name: 'Лина', role: 'Главный модератор', initials: 'ЛН' },
  { name: 'Кай', role: 'Модератор', initials: 'КА' },
  { name: 'Vega', role: 'Модератор', initials: 'VG' },
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

  return (
    <div className="min-h-screen text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-50 glass">
        <div className="container flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary neon-glow">
              <Icon name="Palette" size={20} className="text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-extrabold tracking-tight">
              NEON<span className="text-gradient">ART</span>
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
          <Button className="rounded-xl font-semibold neon-glow">
            <Icon name="Upload" size={16} className="mr-1" /> Загрузить
          </Button>
        </div>
        {/* mobile nav */}
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
        {tab === 'gallery' && <GallerySection />}
        {tab === 'moderation' && <ModerationSection />}
        {tab === 'rules' && <RulesSection />}
        {tab === 'profile' && <ProfileSection />}
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
        NEONART — арт-площадка сообщества · 2026
      </footer>
    </div>
  );
}

function GallerySection() {
  return (
    <section>
      <div className="mb-8 max-w-2xl animate-float-up">
        <Badge className="mb-3 rounded-full bg-accent/20 text-accent">Сообщество художников</Badge>
        <h1 className="font-display text-4xl font-extrabold leading-tight md:text-6xl">
          Покажи свой <span className="text-gradient">арт</span> миру
        </h1>
        <p className="mt-4 text-muted-foreground">
          Выкладывай работы, собирай лайки и вдохновляй других. Площадка моей команды для творчества.
        </p>
      </div>

      <div className="columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
        {GALLERY.map((art, i) => (
          <article
            key={art.id}
            className="group relative overflow-hidden rounded-2xl glass animate-float-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <img src={art.img} alt={art.title} className="w-full transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
            <div className="absolute bottom-0 left-0 right-0 translate-y-2 p-4 opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
              <Badge className="mb-2 rounded-full bg-primary/30 text-xs text-foreground">{art.tag}</Badge>
              <h3 className="font-display text-lg font-bold">{art.title}</h3>
              <div className="mt-1 flex items-center justify-between text-sm text-muted-foreground">
                <span>@{art.author}</span>
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

function ModerationSection() {
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
          <h3 className="mb-4 font-display text-lg font-bold">Очередь на проверку</h3>
          <div className="space-y-3">
            {MOD_QUEUE.map((item) => (
              <div key={item.id} className="flex items-center gap-4 rounded-2xl glass p-3">
                <img src={item.img} alt={item.title} className="h-16 w-16 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">{item.title}</p>
                  <p className="text-sm text-muted-foreground">@{item.author}</p>
                  <Badge className="mt-1 rounded-full bg-destructive/20 text-xs text-destructive">{item.reason}</Badge>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="secondary" className="rounded-xl">
                    <Icon name="Check" size={18} className="text-accent" />
                  </Button>
                  <Button size="icon" variant="secondary" className="rounded-xl">
                    <Icon name="Trash2" size={18} className="text-destructive" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-display text-lg font-bold">Команда модераторов</h3>
          <div className="space-y-3 rounded-2xl glass p-4">
            {MODERATORS.map((m) => (
              <div key={m.name} className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback className="bg-primary/30 text-foreground">{m.initials}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold">{m.name}</p>
                  <p className="text-xs text-muted-foreground">{m.role}</p>
                </div>
                <Icon name="EllipsisVertical" size={18} className="text-muted-foreground" />
              </div>
            ))}
            <Button variant="outline" className="mt-2 w-full rounded-xl border-dashed">
              <Icon name="UserPlus" size={16} className="mr-1" /> Назначить модератора
            </Button>
          </div>
        </div>
      </div>
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
          <div
            key={r.title}
            className="rounded-2xl glass p-6 animate-float-up"
            style={{ animationDelay: `${i * 80}ms` }}
          >
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

function ProfileSection() {
  return (
    <section className="animate-float-up">
      <div className="overflow-hidden rounded-3xl glass">
        <div className="h-40 bg-gradient-to-r from-primary/40 via-accent/30 to-primary/40" />
        <div className="px-6 pb-6">
          <Avatar className="-mt-12 h-24 w-24 border-4 border-background neon-glow">
            <AvatarFallback className="bg-primary text-2xl font-bold text-primary-foreground">КА</AvatarFallback>
          </Avatar>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <h2 className="font-display text-3xl font-extrabold">Кай</h2>
            <Badge className="rounded-full bg-accent/20 text-accent">Художник</Badge>
          </div>
          <p className="mt-1 text-muted-foreground">@kai · Цифровое искусство и киберпанк</p>

          <div className="mt-6 grid grid-cols-3 gap-4">
            {[
              { label: 'Работы', value: '34' },
              { label: 'Лайки', value: '2.1K' },
              { label: 'Подписчики', value: '480' },
            ].map((s) => (
              <div key={s.label} className="rounded-2xl bg-secondary/50 p-4 text-center">
                <p className="font-display text-2xl font-extrabold text-gradient">{s.value}</p>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl bg-secondary/40 p-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Загрузок сегодня</span>
              <span className="font-semibold">3 / 10</span>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-background">
              <div className="h-full w-[30%] rounded-full bg-gradient-to-r from-primary to-accent" />
            </div>
          </div>
        </div>
      </div>
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

        <Button className="w-full rounded-xl font-semibold neon-glow">
          <Icon name="Save" size={16} className="mr-1" /> Сохранить настройки
        </Button>
      </div>
    </section>
  );
}

export default Index;