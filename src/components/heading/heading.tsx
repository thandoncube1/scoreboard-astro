import classNames from 'classnames';
export type HeadingProps = {
    level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
    size: 'small' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
    align: 'left' | 'center' | 'right';
    children: React.ReactNode
}

export const Heading = ({
    level,
    size = 'base',
    align = 'left',
    children
}: HeadingProps) => {
    const HeadingTag = level;
    const headingClassNames = classNames(
        'font-bold',
        { 'text-4xl': size === '4xl',
            'text-3xl': size === '3xl',
            'text-2xl': size === '2xl',
            'text-xl': size === 'xl',
            'text-lg': size === 'lg',
            'text-base': size === 'base',
            'text-sm': size === 'small'
        },
        {
            'text-left': align === 'left',
            'text-center': align === 'center',
            'text-right': align === 'right'
        }
    );

    return <HeadingTag className="text-purple-500">{children}</HeadingTag>
}
