import clientPromise from "../lib/mongodb";
//,board_thickness,board_grade,plain_board_stock,papers_list,paper_roll_stock

export default function PurchasePaper({ paper_list }) {
  return (
    <form>
      <h1>Add purchase of Paper Roll</h1>

      <h3> Enter Purchase Date:</h3>
      <input type="date" />

      <h3> Enter Bill Number:</h3>
      <input type="number" />

      <h3> Select Paper:</h3>
      <select>
        {paper_list.map((paper) => (
          <option key={paper._id} value={paper.Paper}>
            {paper.Paper}
          </option>
        ))}
      </select>

      <h3> Enter Purchase Quantity(in KG):</h3>
      <input type="number" />
      <br />
      <br />
      <br />
      <button type="submit">Submit</button>
    </form>
  );
}

export async function getServerSideProps() {
  try {
    const client = await clientPromise;
    const db = client.db("cpl_stock");

    const paper_list = await db.collection("paper_list").find({}).toArray();

    return {
      props: {
        paper_list: JSON.parse(JSON.stringify(paper_list)),
      },
    };
  } catch (e) {
    console.error(e);
  }
}
