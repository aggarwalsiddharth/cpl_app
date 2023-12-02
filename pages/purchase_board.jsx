import clientPromise from "../lib/mongodb";
//,board_thickness,board_grade,plain_board_stock,papers_list,paper_roll_stock

export default function PurchaseBoard({
  board_category,
  board_thickness,
  board_grade,
}) {
  return (
    <form>
      <h1>Add purchase of Plain Board</h1>

      <h3> Enter Purchase Date:</h3>
      <input type="date" />

      <h3> Enter Bill Number:</h3>
      <input type="number" />

      <h3> Select Board Category:</h3>
      <select>
        {board_category.map((category) => (
          <option key={category._id} value={category.Category}>
            {category.Category}
          </option>
        ))}
      </select>

      <h3> Select Board Thickness:</h3>
      <select>
        {board_thickness.map((thickness) => (
          <option key={thickness._id} value={thickness.Thickness}>
            {thickness.Thickness}
          </option>
        ))}
      </select>

      <h3> Select Board Grade:</h3>
      <select>
        {board_grade.map((grade) => (
          <option key={grade._id} value={grade.Grade}>
            {grade.Grade}
          </option>
        ))}
      </select>

      <h3> Enter Purchase Quantity:</h3>
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

    const board_category = await db
      .collection("board_category")
      .find({})
      .toArray();

    const board_thickness = await db
      .collection("board_thickness")
      .find({})
      .sort({ Thickness: 1 })
      .toArray();

    const board_grade = await db.collection("board_grade").find({}).toArray();

    return {
      props: {
        board_category: JSON.parse(JSON.stringify(board_category)),
        board_thickness: JSON.parse(JSON.stringify(board_thickness)),
        board_grade: JSON.parse(JSON.stringify(board_grade)),
      },
    };
  } catch (e) {
    console.error(e);
  }
}
