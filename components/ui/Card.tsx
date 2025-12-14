import { cn } from '@/lib/utils';

type CardProps = {
    className?: string;
    children: React.ReactNode;
    hoverable?: boolean;
};

export function Card({ className, children, hoverable = false }: CardProps) {
    return (
        <div
            className={cn(
                'relative bg-white rounded-xl border border-neutral-200 overflow-hidden',
                hoverable && 'card-gradient-hover cursor-pointer hover:border-transparent',
                className
            )}
        >
            {hoverable && (
                <div className="card-gradient-border" aria-hidden="true" />
            )}
            <div className="relative z-10 h-full">
                {children}
            </div>
        </div>
    );
}

export function CardHeader({ className, children }: { className?: string; children: React.ReactNode }) {
    return (
        <div className={cn('px-6 py-4 border-b border-neutral-200', className)}>
            {children}
        </div>
    );
}

export function CardBody({ className, children }: { className?: string; children: React.ReactNode }) {
    return <div className={cn('px-6 py-4', className)}>{children}</div>;
}

export function CardFooter({ className, children }: { className?: string; children: React.ReactNode }) {
    return (
        <div className={cn('px-6 py-4 border-t border-neutral-200 bg-neutral-50', className)}>
            {children}
        </div>
    );
}
