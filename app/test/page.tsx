/* eslint-disable */
/* copilot-ignore-file */
// copilot:ignore
"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

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
  handleMinus: (cartItem: CartItem) => void;
  handleNewRow: () => void;
  handleDeleteRow: (cartItem: CartItem) => void;
}

const tabData = [
  {
    label: "Overview",
    content: (
      <div>
        <h2>Overview</h2>
        <p>This is the overview of the product. It includes the main features and highlights.</p>
      </div>
    ),
  },
  {
    label: "Specifications",
    content: (
      <div>
        <h2>Specifications</h2>
        <ul>
          <li>CPU: Apple M2</li>
          <li>RAM: 16GB</li>
          <li>Storage: 512GB SSD</li>
        </ul>
      </div>
    ),
  },
  {
    label: "Reviews",
    content: (
      <div>
        <h2>Reviews</h2>
        <p>★★★★☆</p>
        <p>“Excellent performance, great build quality.”</p>
      </div>
    ),
  },
];
const initialMovies = ["Inception", "The Dark Knight", "Interstellar", "The Prestige", "Tenet"];

export default function TestPage() {
  const [list, setList] = useState(cartList);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");
  const [index, setIndex] = useState(0);
  const [movies, setMovies] = useState(initialMovies);
  const [newMovie, setNewMovie] = useState("");

  const handlePlus = (cartItem: CartItem) => {
    // call SetList with cartItem with updated value
    console.log(cartItem);
    setList((prevList) =>
      prevList.map((item) => (item.id === cartItem.id ? { ...item, items: item.items + 1 } : item))
    );
  };
  const handleMinus = (cartItem: CartItem) => {
    setList((prevList) =>
      prevList.map((item) =>
        item.id === cartItem.id ? { ...item, items: Math.max(0, item.items - 1) } : item
      )
    );
  };
  const handleNewRow = () => {
    setList((prevList) => [
      ...prevList,
      {
        id: prevList.length > 0 ? Math.max(...prevList.map((i) => i.id)) + 1 : 1,
        items: 0,
      },
    ]);
  };
  const handleDeleteRow = (cartItem: CartItem) => {
    setList((prevList) => prevList.filter((item) => item.id !== cartItem.id));
  };
  useEffect(() => {
    if (query.length < 2) {
      setMessage("");
      return;
    }
    const timeout = setTimeout(() => {
      console.log("Call API");
      setMessage(`API Results for query ======== ${query}`);
    }, 500);
    return () => {
      clearTimeout(timeout);
    };
  }, [query]);

  const handleRemoveMovie = (movie: string) => {
    setMovies((prev) => prev.filter((item) => item !== movie));
  };

  const handleAddNewMovie = () => {
    const newMovieTrim = newMovie.trim();
    if (!newMovieTrim) return;
    if (movies.includes(newMovieTrim)) return;
    setMovies((previousMovies) => [...previousMovies, newMovieTrim]);
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden">
      <Card className={cn("w-full max-w-2xl")}>
        )
        <CardHeader>
          <h1 className="text-2xl font-semibold">Test Page</h1>
        </CardHeader>
        <CardContent>
          <div className="relative z-10 flex flex-col items-center justify-center">
            <div className="rounded-lg bg-white/30 p-8 text-black shadow-lg backdrop-blur-sm dark:bg-black/30 dark:text-white">
              <div>
                <input
                  className="rounded border border-gray-300 bg-white p-2 text-black dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
              {message && <div className="mt-4">{message} </div>}
              {<Tabs tabs={tabData} defaultIndex={index} />}
              <input
                className="rounded border border-gray-300 bg-white p-2 text-black dark:border-gray-600 dark:bg-gray-800 dark:text-white"
                value={newMovie}
                onChange={(e) => setNewMovie(e.target.value)}
              />

              <Button onClick={handleAddNewMovie}>Add Movie</Button>
              <ul>
                {movies.map((movie: string, index: number) => (
                  <li key={movie + index}>
                    {movie} <Button onClick={() => handleRemoveMovie(movie)}> Remove</Button>
                  </li>
                ))}
              </ul>
              {/* <div className="mt-4 space-y-2">
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
              </div> */}
            </div>
          </div>
          <SignUpForm />
        </CardContent>
      </Card>
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
    <div className="flex items-center gap-4">
      <span>
        <button
          onClick={() => handlePlus(cartItem)}
          className="rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600"
        >
          {" "}
          +
        </button>{" "}
        <span className="w-8 text-center">{cartItem.items}</span>
        <button
          onClick={() => handleMinus(cartItem)}
          className="rounded bg-red-500 px-2 py-1 text-white hover:bg-red-600"
        >
          -
        </button>
        <button
          onClick={handleNewRow}
          className="ml-4 rounded bg-green-500 px-2 py-1 text-white hover:bg-green-600"
        >
          {" "}
          Add
        </button>
        <button
          onClick={() => handleDeleteRow(cartItem)}
          className="ml-2 rounded bg-gray-500 px-2 py-1 text-white hover:bg-gray-600"
        >
          {" "}
          Delete
        </button>
      </span>
    </div>
  );
}

type TabItem = {
  label: string;
  content: React.ReactNode;
};

type TabsProps = {
  tabs: TabItem[];
  defaultIndex?: number; // optional, defaults to 0
};

export function Tabs({ tabs, defaultIndex }: TabsProps) {
  const [activeIndex, setActiveIndex] = useState(defaultIndex);
  return (
    <div role="tablist" aria-label="Tabs" className="mt-4">
      Active Tab -- {tabs[activeIndex ?? 0].label}
      {tabs.map((tab, index) => (
        <span key={tab.label} className="mx-2 my-2 mb-4">
          <Button
            role="tab"
            id={`tab-${index}`}
            aria-selected={activeIndex === index ? "true" : "false"}
            aria-controls={`tabpanel-${index}`}
            onClick={() => setActiveIndex(index)}
          >
            {tab.label}
          </Button>
        </span>
      ))}
      <div
        role="tabpanel"
        id={`tabpanel-${activeIndex}`}
        aria-labelledby={`tab-${activeIndex}`}
        className="mx-2 my-2 mb-4"
        style={{ padding: "2rem", borderTop: "1px solid #ccc" }}
      >
        {tabs[activeIndex ?? 0].content}
      </div>
    </div>
  );
}

export function SignUpForm() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  });

  const validateName = (value: string): string => {
    return value.trim() === "" ? "Please Enter Name as it is required" : "";
  };

  const validateEmail = (value: string) => {
    if (value.trim() === "") return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return !emailRegex.test(value) ? "Email is invalid" : "";
  };

  const validatePassword = (value: string) => {
    if (value.trim() === "") return "Password is required";
    return value.length < 6 ? "Password must be at least 6 characters" : "";
  };

  const handleBlurName = () => {
    setErrors((prevObj) => ({
      ...prevObj,
      name: validateName(name),
    }));
  };
  const handleBlurEmail = () => {
    setErrors((prevObj) => ({
      ...prevObj,
      email: validateEmail(email),
    }));
  };
  const handleBlurPassword = () => {
    setErrors((prevObj) => ({
      ...prevObj,
      password: validatePassword(password),
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const nameError = validateName(name);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    setErrors({
      name: nameError,
      email: emailError,
      password: passwordError,
    });

    const error = nameError || emailError || passwordError;
    if (error) {
      return;
    }
    setTimeout(() => {
      resetForm();
    }, 3000);
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPassword("");
    setErrors({ name: "", email: "", password: "" });
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Full Name:</label>
          <br />
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="rounded border border-gray-300 bg-white p-2 text-black dark:border-gray-600 dark:bg-gray-800 dark:text-white mb-2"
            onBlur={handleBlurName}
          />
        </div>
        {errors.name && <p>{errors.name}</p>}
        <div>
          <label htmlFor="email">Email:</label>
          <br />
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="rounded border border-gray-300 bg-white p-2 text-black dark:border-gray-600 dark:bg-gray-800 dark:text-white mb-2"
            onBlur={handleBlurEmail}
          />
          {errors.email && <p>{errors.email}</p>}
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <br />
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="rounded border border-gray-300 bg-white p-2 text-black dark:border-gray-600 dark:bg-gray-800 dark:text-white mb-2"
            onBlur={handleBlurPassword}
          />

          {errors.password && <p>{errors.password}</p>}
        </div>
        <Button type="submit">Submit</Button>
      </form>
    </>
  );
}
