import {cn} from '../../utils/cn'

interface ButtonProps {
    onClick?: () => void;
    className: string;
    testId?: string;
    type?: "submit" | "button" | "reset";
    children: React.ReactNode;
}
export const Button: React.FC<ButtonProps> = ({
    children,
    onClick,
    testId,
    className,
    type = "submit",
}) => {
    return (
        <button
            type={type}
            data-testid={testId}
            onClick={onClick}
            className={cn('mt-3 rounded-lg bg-indigo-500/80 px-24 p-2 text-white hover:bg-violet-300', className)}
        >
            {children}
        </button>
    );
};
