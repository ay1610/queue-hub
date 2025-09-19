import Image from "next/image";
import React from "react";

interface CarouselMediaCardProps {
    imageUrl: string;
    title: string;
    alt?: string;
    onClick?: () => void;
}

export function CarouselMediaCard({ imageUrl, title, alt = title, onClick }: CarouselMediaCardProps) {
    return (
        <div className="flex flex-col items-center justify-center p-2 cursor-pointer" onClick={onClick}>
            <div className="w-full aspect-[2/3] relative rounded-lg overflow-hidden shadow">
                <Image
                    src={imageUrl}
                    alt={alt}
                    fill
                    sizes="(max-width: 768px) 50vw, 20vw"
                    className="object-cover"
                    loading="lazy"
                />
            </div>
            <div className="mt-2 text-sm font-medium text-center line-clamp-2">
                {title}
            </div>
        </div>
    );
}
