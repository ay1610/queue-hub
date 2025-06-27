//eslint-ignore
// copilot:ignore
"use client";

import Image from "next/image";
import { useState } from "react";

const cartList = [
  {
    id: 1,
    items: 0,
  },
  {
    id: 2,
    items: 1,
  },
  {
    id: 3,
    items: 1,
  },
];

interface CartItem {
  id: number;
  items: number;
}

interface RowProps {
  cartItem: CartItem;
  handlePlus: (cartItem: CartItem) => void;
  handleMinus: () => void;
  handleNewRow: () => void;
  handleDeleteRow: () => void;
}

export default function TestPage() {
  const [list, setList] = useState(cartList);

  const handlePlus = (cartItem: CartItem) => {
    // call SetList with cartItem with updated value
    console.log(cartItem);
    setList((prevList) =>
      prevList.map((item) => (item.id === cartItem.id ? { ...item, items: item.items + 1 } : item))
    );
  };
  const handleMinus = () => {
    // cartItem.items--;
    // setList(cartItem);
  };
  const handleNewRow = () => {
    //
  };
  const handleDeleteRow = () => {};

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Blurred Backdrop */}
      <div className="absolute inset-0 w-full h-full z-0">
        <Image
          src="/sample-backdrop.jpg" // Place your image in public/
          alt="Backdrop"
          fill
          className="object-cover blur-md brightness-75"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
      </div>
      {/* Main Content */}
      <div className="relative z-10">
        {list.map((cartItem) => (
          <Row
            key={cartItem.id}
            cartItem={cartItem}
            handlePlus={handlePlus}
            handleMinus={handleMinus}
            handleNewRow={handleNewRow}
            handleDeleteRow={handleDeleteRow}
          />
        ))}
      </div>
    </div>
  );
}

export function Row({
  cartItem,
  handlePlus,
  handleMinus,
  handleNewRow,
  handleDeleteRow,
}: RowProps) {
  return (
    <>
      <span>
        <button onClick={() => handlePlus(cartItem)}> +</button> {cartItem.items}{" "}
        <button onClick={handleMinus}>-</button>
        <button onClick={handleNewRow}> Add</button>
        <button onClick={handleDeleteRow}> Delete</button>
      </span>
    </>
  );
}
