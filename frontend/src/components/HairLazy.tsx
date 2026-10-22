"use client";
import dynamic from "next/dynamic";

// Three.js is only downloaded in the browser, after the page is shown (keeps first load fast).
const HairCanvas = dynamic(() => import("./HairCanvas"), { ssr: false });
export default function HairLazy() { return <HairCanvas />; }
