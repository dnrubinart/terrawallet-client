"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CardBody, CardContainer, CardItem } from "../components/ui/3d-card";

interface CardInput {
  number: string;
  card_holder: string;
  exp_date: string;
  cvv: string;
  design: string;
}

export default function CardPage() {
  const [cardInput, setCardInput] = useState<CardInput>({
    number: "",
    card_holder: "",
    exp_date: "",
    cvv: "",
    design: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isFieldOpen, setIsFieldOpen] = useState(false);

  function getSession() {
    const session = localStorage.getItem("session");
    return session ? JSON.parse(session) : null;
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCardInput(prevState => ({ ...prevState, [name]: value }));
  };

  const createCard = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    const session = getSession();
    if (session && cardInput.number && cardInput.card_holder && cardInput.exp_date && cardInput.cvv) {
      try {
        const response = await fetch("http://localhost:8000/api/v1/cards", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${session.id}`,
          },
          body: JSON.stringify(cardInput),
          credentials: "include",
        });
        if (!response.ok) {
          throw new Error(`Failed to create card: ${response.status}`);
        }
        const newCard = await response.json();
      } catch (error) {
        console.error("An error occurred while creating the card:", error);
        setError("Failed to create card.");
      }
    } else {
      setError("Session not found or required card information is missing.");
    }
  };

  const handleAddCardClick = () => {
    setError(null);
    setIsFieldOpen(!isFieldOpen);
  };

  return (
    <>
      <CardContainer className="inter-var">
        <CardBody className="bg-gray-50 relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border">
          <CardItem translateZ="100" className="w-full">
            <Image
              src="https://t4.ftcdn.net/jpg/00/54/94/01/360_F_54940108_iLuekZcanZt4y6ak5vIpfsROxxfk7cFg.jpg"
              height="1000"
              width="1000"
              className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
              alt="thumbnail"
            />
          </CardItem>
          <div className="flex justify-between items-center mt-20">
            <CardItem
              translateZ={20}
              as={Link}
              href="/cards"
              target="__blank"
              className="px-4 py-2 rounded-xl text-xs font-normal dark:text-white"
            >
              Try now →
            </CardItem>
            <CardItem
              translateZ={20}
              as="button"
              onClick={handleAddCardClick}
              className="px-4 py-2 rounded-xl bg-black dark:bg-white dark:text-black text-white text-xs font-bold"
            >
              Add card
            </CardItem>
          </div>
          {error && <p className="text-red-500 mt-2">{error}</p>}
        </CardBody>
      </CardContainer>
      {isFieldOpen && (
        <div className="mt-4 flex flex-col items-center">
          <form onSubmit={createCard} className="flex flex-col items-center">
            <input
              type="text"
              name="number"
              value={cardInput.number}
              onChange={handleInputChange}
              placeholder="Card Number"
              className="rounded px-4 py-2 text-black dark:text-white bg-gray-200 dark:bg-gray-700"
            />
            <input
              type="text"
              name="card_holder"
              value={cardInput.card_holder}
              onChange={handleInputChange}
              placeholder="Card Holder"
              className="rounded px-4 py-2 text-black dark:text-white bg-gray-200 dark:bg-gray-700"
            />
            <input
              type="text"
              name="exp_date"
              value={cardInput.exp_date}
              onChange={handleInputChange}
              placeholder="Expiration Date"
              className="rounded px-4 py-2 text-black dark:text-white bg-gray-200 dark:bg-gray-700"
            />
            <input
              type="text"
              name="cvv"
              value={cardInput.cvv}
              onChange={handleInputChange}
              placeholder="CVV"
              className="rounded px-4 py-2 text-black dark:text-white bg-gray-200 dark:bg-gray-700"
            />
            <button
              type="submit"
              className="rounded-full px-4 py-2 text-white bg-black mt-4 text-xs font-bold dark:bg-zinc-800"
            >
              Create Card
            </button>
          </form>
        </div>
      )}
    </>
  );
}