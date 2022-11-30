import React from 'react';

interface ISticky {
    className?: string,
    stickyClassName?: string,
    children: React.ReactElement,
};

const Sticky: React.FC<ISticky> = ({ className, stickyClassName, children }) => {
    const root = React.useRef();
    const node = React.useRef();
    const [sticky, setSticky] = React.useState(false);

    const onSticky = React.useCallback((e) => {
        if(e.find((entry) => entry.isIntersecting == false)) setSticky(true);
        else setSticky(false);
    }, []);

    React.useEffect(() => {
        const observer = new IntersectionObserver(onSticky, { threshold: [0, 1.0] })

        observer.observe(root.current);
        return () => {
            observer.disconnect();
        }
    }, [onSticky]);

    return (
        <>
            <div ref={root} className={className}>
                { children }
            </div>
            {
                sticky && (
                    <div ref={node} className={`component-sticky__fixed fixed top-0 z-50 ${stickyClassName}`}>
                        { children }
                    </div>
                )
            }
        </>
    )
};

export default Sticky;