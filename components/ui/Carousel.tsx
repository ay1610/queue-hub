"use client";
import React from "react";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

interface CarouselProps<T> {
    items: T[];
    renderItem: (item: T, idx: number) => React.ReactNode;
    slidesPerView?: number;
    autoplay?: boolean;
    pauseOnHover?: boolean;
    className?: string;
}

export function Carousel<T>({
    items,
    renderItem,
    slidesPerView = 5,
    autoplay = true,
    pauseOnHover = true,
    className = "",
}: CarouselProps<T>) {

    const [sliderRef, instanceRef] = useKeenSlider(
        {
            slides: { perView: slidesPerView, spacing: 16 },
            loop: true,
            drag: true,
        },
        [
            // Optional: Add plugin function here
        ]
    );

    React.useEffect(() => {
        // Only run this effect if autoplay is enabled and slider is initialized
        if (!autoplay || !instanceRef.current) return;

        let timeout: NodeJS.Timeout;
        let mouseOver = false;
        const slider = instanceRef.current;

        // Clear any scheduled timeout
        function clearNextTimeout() {
            clearTimeout(timeout);
        }

        // Schedule the next slide transition
        function nextTimeout() {
            clearNextTimeout();
            if (mouseOver && pauseOnHover) return;

            timeout = setTimeout(() => {
                console.log("Advancing to next slide");
                slider.next();
            }, 2500);
        }

        // Handlers for slider events
        function handleMouseEnter() {
            console.log("Mouse entered - pausing");
            mouseOver = true;
            clearNextTimeout();
        }

        function handleMouseLeave() {
            console.log("Mouse left - resuming");
            mouseOver = false;
            nextTimeout();
        }

        // Initialize autoplay
        console.log("Setting up autoplay");
        slider.on("created", nextTimeout);
        slider.on("dragStarted", clearNextTimeout);
        slider.on("animationEnded", nextTimeout);
        slider.on("updated", nextTimeout);

        // Attach mouse event listeners to the slider container
        const sliderElement = instanceRef.current.container;
        if (sliderElement) {
            sliderElement.addEventListener("mouseenter", handleMouseEnter);
            sliderElement.addEventListener("mouseleave", handleMouseLeave);
        }

        // Call nextTimeout to start autoplay immediately
        nextTimeout();

        // Cleanup function
        return () => {
            console.log("Cleaning up autoplay");
            clearNextTimeout();
            if (sliderElement) {
                sliderElement.removeEventListener("mouseenter", handleMouseEnter);
                sliderElement.removeEventListener("mouseleave", handleMouseLeave);
            }
        };
    }, [autoplay, pauseOnHover, sliderRef, instanceRef]);

    return (
        <div ref={sliderRef} className={`keen-slider ${className}`}>
            {items.map((item, idx) => (
                <div className="keen-slider__slide" key={idx}>
                    {renderItem(item, idx)}
                </div>
            ))}
        </div>
    );
}
