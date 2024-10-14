import React, { useEffect, useState } from 'react';
import { cn } from '../../utils/cn';

const InfiniteMovingCards = ({
    items,
    direction = 'left',
    speed = 'fast',
    pauseOnHover = true,
    className,
}: {
    items: {
        quote: string;
        name: string;
        title: string;
        avatar: string;
    }[];
    direction?: 'left' | 'right';
    speed?: 'fast' | 'normal' | 'slow';
    pauseOnHover?: boolean;
    className?: string;
}) => {
    const containerRef = React.useRef<HTMLDivElement>(null);
    const scrollerRef = React.useRef<HTMLUListElement>(null);

    useEffect(() => {
        addAnimation();
    }, []);
    const [start, setStart] = useState(false);
    function addAnimation() {
        if (containerRef.current && scrollerRef.current) {
            const scrollerContent = Array.from(scrollerRef.current.children);

            scrollerContent.forEach((item) => {
                const duplicatedItem = item.cloneNode(true);
                if (scrollerRef.current) {
                    scrollerRef.current.appendChild(duplicatedItem);
                }
            });

            getDirection();
            getSpeed();
            setStart(true);
        }
    }
    const getDirection = () => {
        if (containerRef.current) {
            if (direction === 'left') {
                containerRef.current.style.setProperty('--animation-direction', 'forwards');
            } else {
                containerRef.current.style.setProperty('--animation-direction', 'reverse');
            }
        }
    };
    const getSpeed = () => {
        if (containerRef.current) {
            if (speed === 'fast') {
                containerRef.current.style.setProperty('--animation-duration', '20s');
            } else if (speed === 'normal') {
                containerRef.current.style.setProperty('--animation-duration', '40s');
            } else {
                containerRef.current.style.setProperty('--animation-duration', '80s');
            }
        }
    };
    return (
        <div
            ref={containerRef}
            className={cn(
                'scroller relative z-20  max-w-[80vw] overflow-hidden  [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]',
                className,
            )}
        >
            <ul
                ref={scrollerRef}
                className={cn(
                    ' flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-4',
                    start && 'animate-scroll ',
                    pauseOnHover && 'hover:[animation-play-state:paused]',
                )}
            >
                {items.map((item, idx) => (
                    <li
                        className="relative w-[20vw] max-w-full flex-shrink-0 rounded-2xl border border-b-0 border-slate-700 px-8 py-6"
                        style={{
                            background: 'linear-gradient(180deg, var(--slate-800), var(--slate-900)',
                        }}
                        key={item.name}
                    >
                        <blockquote className="flex h-full w-full flex-col justify-around">
                            <div
                                aria-hidden="true"
                                className="user-select-none -z-1 pointer-events-none absolute -left-0.5 -top-0.5 h-[calc(100%_+_4px)] w-[calc(100%_+_4px)]"
                            ></div>

                            <span className=" relative z-20 text-xl font-normal leading-[1.6] text-gray-100">
                                {item.quote}
                            </span>
                            <div className="relative z-20 mt-6 flex flex-row items-center">
                                <span className="flex flex-col gap-1">
                                    <span className=" text-2xl font-normal leading-[1.6] text-gray-400">
                                        {item.name}
                                    </span>
                                    <span className=" text-2xl font-normal leading-[1.6] text-gray-400">
                                        {item.title}
                                    </span>
                                </span>
                                <img src={item.avatar} alt={item.name} className="ml-4 h-12 w-12 rounded-full" />
                            </div>
                        </blockquote>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default InfiniteMovingCards;
