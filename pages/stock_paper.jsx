import { useState } from "react";
import clientPromise from "../lib/mongodb";
import Nav from "../components/Nav";
//,board_thickness,board_grade,plain_board_stock,papers_list,paper_roll_stock

export default function PaperStock({ paper_inventory }) {
  console.log(paper_inventory);
  return (
    <>
      <Nav />
      <h2>Paper Stock</h2>
      <ul>
        {paper_inventory.map((inventory) => (
          <li>
            <p>
              {inventory.paper} {inventory.quantity}
            </p>
          </li>
        ))}
      </ul>
    </>
  );
}

export async function getServerSideProps() {
  try {
    const client = await clientPromise;
    const db = client.db("cpl_stock");

    const paper_inventory = await db
      .collection("paper_inventories")
      .find({})
      .toArray();
    return {
      props: {
        paper_inventory: JSON.parse(JSON.stringify(paper_inventory)),
      },
    };
  } catch (e) {
    console.error(e);
  }
}
