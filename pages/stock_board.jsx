import clientPromise from "../lib/mongodb";
import Nav from "../components/Nav";
import * as dfd from "danfojs";
//,board_thickness,board_grade,plain_board_stock,papers_list,paper_roll_stock

export default function BoardStock({ board_inventory }) {
  // console.log(board_inventory);
  const df = new dfd.DataFrame(board_inventory);
  let df_new = df.asType("quantity", "int32");
  try {
    let df_purchase = df_new.query(df_new["remark"].eq("PURCHASE"));
    df_purchase = df_purchase.groupby(["category", "thickness", "grade"]);
    df_purchase = df_purchase.col(["quantity"]).sum();
  } catch (e) {
    console.log(e);
  }
  try {
    let df_production = df_new.query(df_new["remark"].eq("PRODUCTION"));
    df_production = df_production.groupby(["category", "thickness", "grade"]);
    df_production = df_production.col(["quantity"]).sum();
  } catch (e) {
    console.log(e);
  }
  try {
    let df_sale = df_new.query(df_new["remark"].eq("SALE"));
    df_sale = df_sale.groupby(["category", "thickness", "grade"]);
    df_sale = df_sale.col(["quantity"]).sum();
  } catch (e) {
    console.log(e);
  }
  // let gr_df = df_new.groupby(["remark", "category", "thickness", "grade"]);
  // gr_df.col(["quantity"]).sum().print()
  // df.head().print();
  return (
    <>
      <Nav />
      <h2>Board Stock</h2>
      <ul>
        {board_inventory.map((inventory) => (
          <li>
            <p>
              {inventory.category} {inventory.paper}
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

    const board_inventory = await db
      .collection("board_inventories")
      .find({})
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
