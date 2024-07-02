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
            className={cn(
                "bg-rose-400 p-2 rounded-lg hover:bg-rose-600 text-white",
                className
            )}
        >
            {children}
        </button>
    );
};
