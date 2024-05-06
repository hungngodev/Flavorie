import { motion } from 'framer-motion';
import { Calendar, ChevronFirst, Flag, Home, Layers, LayoutDashboard, StickyNote } from 'lucide-react';
import { FC, ReactNode, createContext, useContext } from 'react';

type SidebarItemProps = {
  icon: ReactNode;
  text: string;
  active?: boolean;
  alert?: boolean;
  onClickF?: () => void;
  index?: number;
  link?: string;
};

type SidebarProps = {
  category?: string[];
  expanded: boolean;
  setExpanded: () => void;
};

type SidebarContextProps = {
  expanded: boolean;
};

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export function SidebarItem({ icon, text, active, alert, onClickF, index = 0 }: SidebarItemProps): JSX.Element {
  const { expanded } = useContext(SidebarContext) as SidebarContextProps;
  return (
    <motion.li
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 20,
        delay: 0.002 + index / 40,
      }}
      key={index}
      className={`group relative my-1 flex w-min cursor-pointer  items-center rounded-md px-3 py-2 font-medium  transition-colors ${active ? 'bg-accent text-accent-foreground' : 'bg-background text-secondary-foreground  hover:bg-secondary'}`}
      onClick={onClickF}
    >
      {icon}
      <span className={`h-6 overflow-hidden transition-all ${expanded ? 'ml-3 w-52' : 'w-0'}`}>{text}</span>
      {alert && (
        <div
          className={`bg-accent-foreground absolute right-2 h-2 w-2 rounded hover:animate-pulse ${expanded ? 'top-0' : 'left-1 top-0'}`}
        ></div>
      )}

      {!expanded && (
        <motion.div
          className={`text-md border-1 bg-popover text-secondary-foreground invisible absolute left-full ml-1 w-min -translate-x-3 text-nowrap rounded-md opacity-20 transition-all group-hover:visible group-hover:translate-x-0 group-hover:opacity-100`}
        >
          {text}
        </motion.div>
      )}
    </motion.li>
  );
}
const Sidebar: FC<SidebarProps> = ({ expanded, setExpanded }: SidebarProps) => {
  const mainNav = [
    {
      index: 1,
      icon: <Home size={20} />,
      text: 'Meats',
      alert: true,
      link: '',
    },
    {
      index: 2,
      icon: <LayoutDashboard size={20} />,
      text: 'Vegetables',
      active: true,
      link: '',
    },
    {
      index: 3,
      icon: <StickyNote size={20} />,
      text: 'Fruits',
      alert: true,
      link: '',
    },
    {
      index: 4,
      icon: <Calendar size={20} />,
      text: 'Nuts',
      link: '',
    },
    {
      index: 5,
      icon: <Layers size={20} />,
      text: 'Spices',
      link: '',
    },
    {
      index: 6,
      icon: <Flag size={20} />,
      text: 'Dairy',
      link: '',
    },
    {
      index: 7,
      icon: <Flag size={20} />,
      text: 'Bakery',
      link: '',
    },
    {
      index: 8,
      icon: <Flag size={20} />,
      text: 'Beverages',
      link: '',
    },
    {
      index: 9,
      icon: <Flag size={20} />,
      text: 'Frozen',
      link: '',
    },
    {
      index: 10,
      icon: <Flag size={20} />,
      text: 'Others',
      link: '',
    },
  ];

  return (
    <SidebarContext.Provider value={{ expanded }}>
      <div className={`border-black-400  relative z-10 flex h-full w-min  flex-col  border-r shadow-sm`}>
        <button onClick={setExpanded} className="hover:bg-secondary cursor-pointer  rounded-lg p-1.5 ">
          <ChevronFirst className={`${expanded ? '' : 'rotate-180'} ml-4 transition-all duration-500 `} />
        </button>
        <ul className="flex-1 px-3">
          {mainNav.map((item, index) => (
            <SidebarItem key={index} {...item} />
          ))}
        </ul>
      </div>
    </SidebarContext.Provider>
  );
};

export default Sidebar;
