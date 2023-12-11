import clientPromise from "../lib/mongodb";
import Nav from "../components/Nav";
import Link from "next/link";

const boardInventory = ({ board_inventory }) => {
  return (
    <>
      <Nav />
      <h2>
        <Link href="/sale">Add new Sale</Link>
      </h2>
      <ul>
        {board_inventory.map((inventory) => (
          <li key={inventory._id}>
            {inventory.date},{inventory.bill} , {inventory.category} ,{" "}
            {inventory.thickness} , {inventory.grade} , {inventory.quantity} ,{" "}
            {inventory.paper} ,{inventory.remark} ,{inventory.type}{" "}
          </li>
        ))}
      </ul>
    </>
  );
};

export default boardInventory;

export async function getServerSideProps() {
  try {
    const client = await clientPromise;
    const db = client.db("cpl_stock");

    const board_inventory = await db
      .collection("board_inventories")
      .find({ remark: "SALE" })
      .toArray();
    return {
      props: {
        board_inventory: JSON.parse(JSON.stringify(board_inventory)),
      },
    };
  } catch (e) {
    console.error(e);
  }
}
