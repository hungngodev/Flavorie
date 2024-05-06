import { motion } from 'framer-motion';
import { ChevronFirst } from 'lucide-react';
import { FC, ReactNode, createContext, useContext } from 'react';
import { Link } from 'react-router-dom';

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
  categories?: SidebarItemProps[];
  expanded: boolean;
  setExpanded: () => void;
};

type SidebarContextProps = {
  expanded: boolean;
};

const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export function SidebarItem({ icon, text, active, alert, onClickF, index = 0, link }: SidebarItemProps): JSX.Element {
  const { expanded } = useContext(SidebarContext) as SidebarContextProps;
  return (
    <Link to={onClickF ? '' : link}>
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
        <motion.span
          className={`text-md ml-3 h-6 overflow-hidden  font-medium`}
          variants={{
            expanded: {
              width: '6rem',
              marginLeft: '1rem',
              opacity: 1,
              scale: 1,
            },
            collapsed: {
              width: 0,
              marginLeft: 0,
              opacity: 0,
              scale: 0,
            },
          }}
          transition={{
            width: { duration: 0.2 },
            opacity: { duration: 0.1, delay: 0.052 + index / 30 },
            scale: { duration: 0.15, delay: 0.002 + index / 30 },
          }}
          animate={expanded ? 'expanded' : 'collapsed'}
        >
          {text}
        </motion.span>
        {alert && (
          <div
            className={`absolute right-2 h-2 w-2 rounded bg-accent-foreground transition-all hover:animate-pulse ${expanded ? 'top-0' : 'left-1 top-0'}`}
          ></div>
        )}

        {!expanded && (
          <motion.div
            className={`text-md border-1 invisible absolute left-full ml-1 w-min -translate-x-3 text-nowrap rounded-md  text-secondary-foreground opacity-20 transition-all group-hover:visible group-hover:translate-x-0 group-hover:opacity-100`}
          >
            {text}
          </motion.div>
        )}
      </motion.li>
    </Link>
  );
}
const Sidebar: FC<SidebarProps> = ({ categories, expanded, setExpanded }: SidebarProps) => {
  const mainNav = categories || [];
  return (
    <SidebarContext.Provider value={{ expanded }}>
      <div className={`space-between bg relative z-10 flex h-full w-min flex-col border-r shadow-sm`}>
        <button onClick={setExpanded} className="cursor-pointer rounded-lg  p-1.5 hover:bg-secondary ">
          <ChevronFirst className={`${expanded ? '' : 'rotate-180'} ml-4 transition-all duration-500 `} />
        </button>
        <ul className="flex h-full w-full  flex-col justify-around px-3">
          {mainNav.map((item, index) => (
            <SidebarItem key={index} {...item} />
          ))}
        </ul>
      </div>
    </SidebarContext.Provider>
  );
};

export default Sidebar;
