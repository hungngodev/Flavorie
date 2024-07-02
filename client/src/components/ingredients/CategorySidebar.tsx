import { useTheme } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { ChevronFirst } from 'lucide-react';
import { FC, ReactNode, createContext, useContext } from 'react';
import {
  FaAppleAlt,
  FaBreadSlice,
  FaCandyCane,
  FaCarrot,
  FaCheese,
  FaDrumstickBite,
  FaEgg,
  FaFish,
  FaHome,
  FaMortarPestle,
  FaPepperHot,
  FaSeedling,
  FaUtensilSpoon,
} from 'react-icons/fa';
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
  currentCategory: string;
  expanded: boolean;
  setExpanded: () => void;
};

type SidebarContextProps = {
  expanded: boolean;
};
const categoriesArr = [
  'meat',
  'vegetable',
  'dairy',
  'sauce',
  'grain',
  'fruit',
  'nut',
  'egg',
  'seafood',
  'spice',
  'sweet',
  'powder',
];
const SidebarContext = createContext<SidebarContextProps | undefined>(undefined);

export function SidebarItem({ icon, text, active, alert, onClickF, index = 0, link }: SidebarItemProps): JSX.Element {
  const { expanded } = useContext(SidebarContext) as SidebarContextProps;
  return (
    <Link to={onClickF ? '' : link ?? ''}>
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
            className={` invisible absolute left-full z-50 ml-1  w-min
              -translate-x-3 text-nowrap rounded-md border-1  text-secondary-foreground opacity-20 transition-all 
              group-hover:visible group-hover:translate-x-0 group-hover:opacity-100`}
          >
            {text}
          </motion.div>
        )}
      </motion.li>
    </Link>
  );
}
const Sidebar: FC<SidebarProps> = ({ currentCategory, expanded, setExpanded }: SidebarProps) => {
  const theme = useTheme();
  const iconsArr = [
    <FaDrumstickBite size={20} color={theme.colors.palette_purple} />,
    <FaCarrot size={20} color={theme.colors.palette_purple} />,
    <FaCheese size={20} color={theme.colors.palette_purple} />,
    <FaUtensilSpoon size={20} color={theme.colors.palette_purple} />,
    <FaBreadSlice size={20} color={theme.colors.palette_purple} />,
    <FaAppleAlt size={20} color={theme.colors.palette_purple} />,
    <FaSeedling size={20} color={theme.colors.palette_purple} />,
    <FaEgg size={20} color={theme.colors.palette_purple} />,
    <FaFish size={20} color={theme.colors.palette_purple} />,
    <FaPepperHot size={20} color={theme.colors.palette_purple} />,
    <FaCandyCane size={20} color={theme.colors.palette_purple} />,
    <FaMortarPestle size={20} color={theme.colors.palette_purple} />,
  ];
  const categories = categoriesArr.map((category, index) => ({
    index,
    icon: iconsArr[index],
    text: category,
    active: category === currentCategory,
    link: `/ingredients/${category}`,
  }));

  categories.unshift({
    index: 0,
    icon: <FaHome size={20} color={theme.colors.palette_purple} />,
    text: 'Index',
    active: currentCategory === '/',
    link: '/ingredients/',
  });
  return (
    <SidebarContext.Provider value={{ expanded }}>
      <div className={`space-between bg relative z-[100] flex h-full w-min flex-col  border-r shadow-sm`}>
        <button onClick={setExpanded} className="cursor-pointer rounded-lg  p-1.5 hover:bg-secondary ">
          <ChevronFirst className={`${expanded ? '' : 'rotate-180'} ml-4 transition-all duration-500 `} />
        </button>
        <ul className="p-r e relative  -z-10 flex h-full w-full  flex-col justify-around px-3">
          {categories.map((item, index) => (
            <SidebarItem key={index} {...item} />
          ))}
        </ul>
      </div>
    </SidebarContext.Provider>
  );
};

export default Sidebar;
